import { ConfigService } from '@nestjs/config';

/**
 * Feature flag for the RBAC correctness rework.
 *
 * Default is `false` — every code path behaves exactly as it did before, including
 * its known defects, so this can be merged and deployed without behaviour change.
 *
 * Setting `RBAC_V2_ENABLED=true` switches on:
 *   - tenant-scoped cache keys (`rbac:privileges:{userId}:{tenantId}`) instead of
 *     the bare `userId` key, which currently serves one tenant's roles for all tenants
 *   - a single shared loader for JwtStrategy and both accessors, fixing the
 *     cold-cache `undefined` return in `getUserPrivilegesForTenant`
 *   - a consistent TTL on the roles cache, which is currently written without one
 *   - the corrected (but non-fatal) empty-privilege check in JwtStrategy
 *
 * Roll out per environment. Remove the flag and the legacy branches once v2 has
 * been enforcing in production long enough to trust.
 */
export const RBAC_V2_FLAG = 'RBAC_V2_ENABLED';

export function isRbacV2Enabled(configService: ConfigService): boolean {
  const raw = configService.get(RBAC_V2_FLAG);
  return String(raw).toLowerCase() === 'true';
}
