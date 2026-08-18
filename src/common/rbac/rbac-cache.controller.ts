import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Post,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PermissionsService } from '../service/permissions.service';
import { MiddlewareLogger } from '../loggers/logger.service';

export const RBAC_CACHE_INVALIDATE_PATH = '/internal/rbac/cache/invalidate';

interface InvalidateBody {
  userId?: string;
  /** Omit to clear the user across every tenant they are cached for. */
  tenantId?: string;
}

/**
 * Internal cache invalidation for RBAC data.
 *
 * The user service calls this after writing `UserRolesMapping` or
 * `RolePrivilegesMapping`, so a permission change takes effect immediately instead
 * of after the TTL. Without it, "dynamically configurable access" means "effective
 * within TTL", which does not meet §18 of the RBAC plan.
 *
 * Authenticated by a shared secret in `x-internal-api-key`, not by a user JWT — the
 * caller is a service, and it has no user context. The endpoint fails closed: if
 * `INTERNAL_API_KEY` is not configured it refuses every request, so a missing env
 * var can never leave an unauthenticated cache-flush endpoint exposed.
 *
 * Note this route must also be listed in `publicAPI` (to skip the user-JWT guard)
 * and in the middleware's local-endpoint list (so it is served here rather than
 * proxied upstream).
 */
@Controller()
export class RbacCacheController {
  constructor(
    private readonly permissionsService: PermissionsService,
    private readonly configService: ConfigService,
    private readonly middlewareLogger: MiddlewareLogger,
  ) {}

  @Post(RBAC_CACHE_INVALIDATE_PATH)
  async invalidate(
    @Headers('x-internal-api-key') apiKey: string,
    @Body() body: InvalidateBody,
  ) {
    const expected = this.configService.get<string>('INTERNAL_API_KEY');
    if (!expected?.trim()) {
      this.middlewareLogger.error(
        'RBAC cache invalidation called but INTERNAL_API_KEY is not configured',
        'refusing request',
      );
      throw new ServiceUnavailableException(
        'Cache invalidation is not configured',
      );
    }
    if (apiKey !== expected) {
      throw new UnauthorizedException('Invalid internal API key');
    }

    const userId = body?.userId?.trim();
    if (!userId) {
      throw new BadRequestException('userId is required');
    }
    const tenantId = body?.tenantId?.trim() || undefined;

    const removed = await this.permissionsService.invalidateUser(
      userId,
      tenantId,
    );
    this.middlewareLogger.log(
      `RBAC cache invalidated for user ${userId}` +
        (tenantId ? ` tenant ${tenantId}` : ' (all tenants)') +
        ` — ${removed.length} key(s)`,
    );

    return {
      success: true,
      userId,
      tenantId: tenantId ?? null,
      keysRemoved: removed.length,
    };
  }
}
