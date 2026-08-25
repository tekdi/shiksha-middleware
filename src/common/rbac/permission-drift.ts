/**
 * Reconciliation between the three places a permission code can exist:
 *
 *   1. the canonical registry  (`permission-registry.ts`)
 *   2. route policy            (`apiConfig.ts` PRIVILEGE_CHECK entries)
 *   3. the `Privileges` table  (owned and written by the user service)
 *
 * Drift between them is silent today: a route can require a permission no role
 * can ever hold, and nothing surfaces it until a user is wrongly denied.
 *
 * The route-vs-registry half is pure and needs no database, so it can run in CI
 * without secrets. The DB half is opt-in — see `scripts/check-permission-drift.ts`.
 */
import { ALL_PERMISSION_CODES } from './permission-registry';

export interface PermissionReference {
  code: string;
  /** Where it is required, e.g. `POST /lms-service/v1/courses`. */
  routes: string[];
}

export interface StaticDriftReport {
  /** Required by a route but absent from the registry. Always an error. */
  unregistered: PermissionReference[];
  /** Declared in the registry but required by no route. Informational. */
  unused: string[];
  /** Every code actually referenced by a route, sorted. */
  referenced: string[];
}

/** Collect every permission code referenced by a `PRIVILEGE_CHECK`, with its routes. */
export function collectRoutePermissions(
  apiList: Record<string, any>,
): Map<string, string[]> {
  const found = new Map<string, string[]>();

  for (const [route, config] of Object.entries(apiList ?? {})) {
    const methods: string[] = config?.method ?? [];
    for (const method of methods) {
      const codes: unknown = config?.[method]?.PRIVILEGE_CHECK;
      if (!Array.isArray(codes)) continue;
      for (const code of codes) {
        if (typeof code !== 'string') continue;
        const where = `${method.toUpperCase()} ${route}`;
        const existing = found.get(code);
        if (existing) {
          existing.push(where);
        } else {
          found.set(code, [where]);
        }
      }
    }
  }
  return found;
}

export function checkStaticDrift(
  apiList: Record<string, any>,
  registry: readonly string[] = ALL_PERMISSION_CODES,
): StaticDriftReport {
  const referenced = collectRoutePermissions(apiList);
  const registrySet = new Set(registry);

  const unregistered: PermissionReference[] = [];
  for (const [code, routes] of referenced) {
    if (!registrySet.has(code)) {
      unregistered.push({ code, routes });
    }
  }
  unregistered.sort((a, b) => a.code.localeCompare(b.code));

  const unused = registry.filter((code) => !referenced.has(code)).sort((a, b) => a.localeCompare(b));

  return {
    unregistered,
    unused,
    referenced: [...referenced.keys()].sort((a, b) => a.localeCompare(b)),
  };
}

export interface DatabaseDriftReport {
  /**
   * Required by a route but absent from `Privileges`. No role can hold it, so the
   * route denies every user. This is the only condition worth failing a build on.
   */
  requiredButMissingFromDb: PermissionReference[];
  /**
   * Declared in the registry, absent from `Privileges`, and required by no route.
   * Harmless — the registry generates the full entity x action matrix while only
   * some combinations were ever seeded.
   */
  declaredButMissingFromDb: string[];
  /** In `Privileges` but not in the registry — the user service owns that table. */
  unknownInDb: string[];
}

export function checkDatabaseDrift(
  dbCodes: readonly string[],
  apiList: Record<string, any>,
  registry: readonly string[] = ALL_PERMISSION_CODES,
): DatabaseDriftReport {
  const dbSet = new Set(dbCodes);
  const registrySet = new Set(registry);
  const referenced = collectRoutePermissions(apiList);

  const requiredButMissingFromDb: PermissionReference[] = [];
  for (const [code, routes] of referenced) {
    if (!dbSet.has(code)) {
      requiredButMissingFromDb.push({ code, routes });
    }
  }
  requiredButMissingFromDb.sort((a, b) => a.code.localeCompare(b.code));

  return {
    requiredButMissingFromDb,
    declaredButMissingFromDb: registry
      .filter((code) => !dbSet.has(code) && !referenced.has(code))
      .sort((a, b) => a.localeCompare(b)),
    unknownInDb: [...dbSet]
      .filter((code) => !registrySet.has(code))
      .sort((a, b) => a.localeCompare(b)),
  };
}
