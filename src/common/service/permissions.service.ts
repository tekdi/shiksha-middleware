import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRolesMapping } from '../entities/UserRoleMapping.entity';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { MiddlewareLogger } from '../loggers/logger.service';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(UserRolesMapping)
    private readonly userRolesMapping: Repository<UserRolesMapping>,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private configService: ConfigService,
    private readonly middlewareLogger: MiddlewareLogger,
  ) {}

  async getUserPrivilegesAndRoles(userId: string, tenantId: string) {
    const query = `SELECT "UserRolesMapping"."userId", "UserRolesMapping"."roleId", "UserRolesMapping"."tenantId" AS tenant_id,
                  "RolePrivilegesMapping"."privilegeId", "Privileges"."name" AS privilege_name, "Privileges"."code" AS privilege_code,
                  "Roles"."code" AS Role_code, "Roles"."name" AS Role_name
                  FROM "UserRolesMapping"
                  LEFT JOIN "RolePrivilegesMapping" ON "RolePrivilegesMapping"."roleId"="UserRolesMapping"."roleId"
                  LEFT JOIN "Privileges" ON "Privileges"."privilegeId" = "RolePrivilegesMapping"."privilegeId"
                  LEFT JOIN "Roles" ON "Roles"."roleId" = "UserRolesMapping"."roleId"
                  WHERE "UserRolesMapping"."userId" = $1 AND "RolePrivilegesMapping"."tenantId" = $2`;
    const result = await this.userRolesMapping.query(query, [userId, tenantId]);

    if (!result.length) {
      return [];
    }
    let privilegesPerTenant = [];
    privilegesPerTenant = result.reduce(
      (acc, { privilege_code, role_code, tenant_id }) => {
        if (acc[tenant_id]) {
          if (privilege_code !== null) {
            acc[tenant_id].push(privilege_code);
          }
        } else {
          acc[tenant_id] = privilege_code !== null ? [privilege_code] : [];
        }
        return acc;
      },
      {},
    );
    let rolesPerTenant = [];
    rolesPerTenant = result.reduce((acc, { role_code, tenant_id }) => {
      if (acc[tenant_id]) {
        if (!acc[tenant_id].includes(role_code)) acc[tenant_id].push(role_code);
      } else {
        acc[tenant_id] = [role_code];
      }
      return acc;
    }, {});
    return {
      privileges: privilegesPerTenant,
      roles: rolesPerTenant,
    };
  }

  /**
   * Whether the privilege/role cache is used at all. `RBAC_CACHE_ENABLED=false`
   * turns it off; anything else (including unset) leaves it on, so the default
   * behaviour is unchanged.
   *
   * With it off, a privilege or role change in the database takes effect on the
   * very next request instead of waiting out `TTL` — useful while debugging a
   * 403, and for environments that would rather pay for correctness than speed.
   * The cost is real though: a request performs three lookups (the JWT guard,
   * then ROLE_CHECK and PRIVILEGE_CHECK in parallel), so this turns 1 database
   * query + 2 cache hits into 3 database queries.
   */
  private get isCacheEnabled(): boolean {
    const raw = this.configService.get('RBAC_CACHE_ENABLED');
    return String(raw ?? 'true').toLowerCase() !== 'false';
  }

  /**
   * Cache key for a user's effective privileges/roles.
   *
   * Tenant-scoped: `getUserPrivilegesAndRoles` filters by tenantId, so the key
   * must include it too, or one tenant's cached result would be served for
   * every other tenant the same user belongs to.
   */
  cacheKey(userId: string, tenantId: string): string {
    return `rbac:privileges:${userId}:${tenantId}`;
  }

  /**
   * Index of the tenants we hold a cache entry for, per user.
   *
   * Needed to invalidate a user across all tenants without enumerating keys.
   * `store.keys()` is not part of the cache-manager v5 Store contract, and on Redis
   * a `KEYS` scan is an O(N) blocking command that should not run in request or
   * webhook paths. An explicit index costs one extra small key per user and behaves
   * identically on both the memory and Redis stores.
   */
  private tenantIndexKey(userId: string): string {
    return `rbac:tenants:${userId}`;
  }

  /**
   * Cache reads must never fail a request: an unreachable Redis should degrade to a
   * database query, not a 403. Any error is logged and treated as a miss.
   */
  private async cacheGet<T>(key: string): Promise<T | undefined> {
    try {
      return await this.cacheService.get<T>(key);
    } catch (error) {
      this.middlewareLogger.error(
        `[cache] read failed for ${key}, falling back to database`,
        error?.message ?? String(error),
      );
      return undefined;
    }
  }

  /** A failed write is a lost cache entry, not a failed request. */
  private async cacheSet(key: string, value: unknown, ttl?: number) {
    try {
      await this.cacheService.set(key, value, ttl);
    } catch (error) {
      this.middlewareLogger.error(
        `[cache] write failed for ${key}`,
        error?.message ?? String(error),
      );
    }
  }

  private async cacheDel(key: string) {
    try {
      await this.cacheService.del(key);
    } catch (error) {
      this.middlewareLogger.error(
        `[cache] delete failed for ${key}`,
        error?.message ?? String(error),
      );
    }
  }

  /** Record that `tenantId` is cached for `userId`, so invalidation can find it. */
  private async rememberTenant(userId: string, tenantId: string) {
    const key = this.tenantIndexKey(userId);
    const known = (await this.cacheGet<string[]>(key)) ?? [];
    if (known.includes(tenantId)) {
      return;
    }
    // No TTL: the index must outlive the entries it points at, otherwise an
    // invalidation arriving late would miss keys that are still live.
    await this.cacheSet(key, [...known, tenantId]);
  }

  /**
   * Cache-first read of `{privileges, roles}` for a user within a tenant.
   * Single loader shared by JwtStrategy and both accessors below, so key format
   * and TTL cannot drift between call sites. v2 only.
   *
   * Returns an UnauthorizedException *instance* rather than throwing when the user
   * has no mapping in the tenant: callers run inside the promise executors in
   * `MiddlewareServices.urlChecks`, where a throw would leave the promise
   * unsettled. They detect it via `.name == 'UnauthorizedException'`.
   */
  async getCachedPrivilegesAndRoles(userId: string, tenantId: string) {
    const key = this.cacheKey(userId, tenantId);
    let cachedData: any = this.isCacheEnabled ? await this.cacheGet(key) : null;
    if (!cachedData) {
      const userPrivilegesAndRoles: any = await this.getUserPrivilegesAndRoles(
        userId,
        tenantId,
      );
      if (userPrivilegesAndRoles.length == 0) {
        return new UnauthorizedException(
          'User does not have any privileges in the Tenant',
        );
      }
      if (this.isCacheEnabled) {
        await this.cacheSet(
          key,
          userPrivilegesAndRoles,
          this.configService.get('TTL'),
        );
        await this.rememberTenant(userId, tenantId);
      }
      cachedData = userPrivilegesAndRoles;
    }
    return cachedData;
  }

  /**
   * Drop a user's cached authorization data for one tenant, or for all tenants.
   *
   * Called after the user service changes a role assignment or a role's privileges,
   * so the change takes effect immediately rather than after the TTL expires.
   *
   * Returns the privilege cache keys it removed, for the caller to log. The tenant
   * index is an implementation detail and is not counted — otherwise clearing a user
   * with nothing cached would report one key removed.
   */
  async invalidateUser(userId: string, tenantId?: string): Promise<string[]> {
    if (tenantId) {
      const key = this.cacheKey(userId, tenantId);
      await this.cacheDel(key);
      return [key];
    }

    const indexKey = this.tenantIndexKey(userId);
    const tenants = (await this.cacheGet<string[]>(indexKey)) ?? [];
    const keys = tenants.map((t) => `rbac:privileges:${userId}:${t}`);
    await Promise.all(keys.map((k) => this.cacheDel(k)));
    await this.cacheDel(indexKey);
    return keys;
  }

  /**
   * Drop and immediately rewarm a user's cached privileges/roles from the database.
   *
   * Called on the RBAC-token request, which the frontend issues after login and on
   * tenant switch. That makes it the de-facto invalidation hook: a privilege change
   * takes effect as soon as the user's client refetches its token, instead of waiting
   * out the TTL. Deliberately tolerant of a missing userId/tenantId — on a request
   * where the guard did not run there is nothing to refresh, and failing here must
   * never fail the request.
   */
  async refreshPrivilegesAndRoles(userId?: string, tenantId?: string) {
    if (!userId?.trim() || !tenantId?.trim() || !this.isCacheEnabled) {
      // Nothing cached to refresh when the cache is off — every read already
      // goes to the database, so this would just add a wasted round trip.
      return;
    }
    await this.cacheDel(this.cacheKey(userId, tenantId));
    return this.getCachedPrivilegesAndRoles(userId, tenantId);
  }

  async getUserPrivilegesForTenant(userId: string, tenantId: string) {
    const data: any = await this.getCachedPrivilegesAndRoles(userId, tenantId);
    if (data instanceof UnauthorizedException) {
      return data;
    }
    return data.privileges?.[tenantId];
  }

  async getUserRolesForTenant(userId: string, tenantId: string) {
    const data: any = await this.getCachedPrivilegesAndRoles(userId, tenantId);
    if (data instanceof UnauthorizedException) {
      return data;
    }
    return data.roles?.[tenantId];
  }
}
