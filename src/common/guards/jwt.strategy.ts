import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  Inject,
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PermissionsService } from '../service/permissions.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { MiddlewareLogger } from '../loggers/logger.service';
import { UserPrivilegeRoleDto } from '../service/dto/user-privileges';
import { isRbacV2Enabled } from '../config/rbac.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  jwt_expires_In: any;
  jwt_secret: any;
  constructor(
    private configService: ConfigService,
    private permissionService: PermissionsService,
    private readonly middlewareLogger: MiddlewareLogger,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(request: any, payload: any) {
    const tenantId = request.headers['tenantid'];
    if (!tenantId?.trim()) {
      throw new BadRequestException('Tenant id not found');
    }
    request.userId = payload.sub;

    if (isRbacV2Enabled(this.configService)) {
      return await this.validateV2(payload, tenantId);
    }
    return await this.validateLegacy(payload, tenantId);
  }

  /**
   * Uses the shared tenant-scoped loader, so this call warms exactly the cache
   * entry that PRIVILEGE_CHECK / ROLE_CHECK will read later in the same request.
   */
  private async validateV2(payload: any, tenantId: string) {
    const cachedData = await this.permissionService.getCachedPrivilegesAndRoles(
      payload.sub,
      tenantId,
    );
    if (cachedData instanceof UnauthorizedException) {
      throw cachedData;
    }

    const userPrivileges: string[] =
      (cachedData as UserPrivilegeRoleDto).privileges?.[tenantId] ?? [];

    // Legacy wrote `if (!userPrivileges && userPrivileges.length == 0)` — the `&&`
    // meant it never fired. Corrected here to a real emptiness test but kept
    // non-fatal: most routes are still ROLE_CHECK-only, so a user holding roles
    // and no privilege rows is legitimate today. Promote to a throw in the same
    // change that flips PRIVILEGE_CHECK to enforcing.
    if (userPrivileges.length === 0) {
      this.middlewareLogger.warn(
        `user ${payload.sub} has roles but no privileges in tenant ${tenantId}`,
      );
    }

    this.middlewareLogger.log(
      `user: ${payload.sub} username: ${payload.username} userPrivileges: ${userPrivileges}`,
    );
    return true;
  }

  /** Pre-v2 behaviour, preserved verbatim so the flag default changes nothing. */
  private async validateLegacy(payload: any, tenantId: string) {
    let userPrivileges;
    const ttl = this.configService.get('TTL');

    const cachedData: UserPrivilegeRoleDto = await this.cacheService.get(
      payload.sub,
    );
    if (!cachedData) {
      const userPrivilegesAndRoles: any =
        await this.permissionService.getUserPrivilegesAndRoles(
          payload.sub,
          tenantId,
        );
      if (userPrivilegesAndRoles.length == 0) {
        throw new UnauthorizedException(
          'User does not have any privileges in the Tenant',
        );
      }
      userPrivileges = userPrivilegesAndRoles['privileges'][tenantId]
        ? userPrivilegesAndRoles['privileges'][tenantId]
        : [];
      this.cacheService.set(payload.sub, userPrivilegesAndRoles, ttl);
    } else {
      userPrivileges = cachedData.privileges[tenantId]
        ? cachedData.privileges[tenantId]
        : [];
    }
    if (!userPrivileges && userPrivileges.length == 0) {
      throw new UnauthorizedException(
        'User does not have any privileges in the Tenant',
      );
    }
    this.middlewareLogger.log(
      `user : ${payload.sub - payload.username} userPrivileges: ${userPrivileges}`,
    );
    return true;
  }
}
