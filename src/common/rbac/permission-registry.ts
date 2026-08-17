/**
 * Canonical permission registry.
 *
 * This is the single source of truth for permission codes in the middleware.
 * `apiConfig.ts` imports `privilegeGroup` from here rather than defining it, so a
 * route cannot reference a permission that is not declared in this file.
 *
 * Convention is `{entity}.{action}` — kept exactly as it already existed in
 * `apiConfig.ts`, because these codes are already stored in the `Privileges`
 * table. Renaming them (e.g. `users.read` -> `users.view`) would require a
 * coordinated data migration in the user service for no functional gain.
 *
 * The `Privileges` table is owned and written by the user service; this registry
 * is the middleware's read-side contract against it. `npm run rbac:drift`
 * reconciles the two — see `scripts/check-permission-drift.ts`.
 */

/** Actions defined for every entity. Not every combination is used by a route. */
export const PERMISSION_ACTIONS = [
  'create',
  'read',
  'update',
  'delete',
  'review',
  'approve',
  'publish',
] as const;

export type PermissionAction = (typeof PERMISSION_ACTIONS)[number];

/** Entities that carry a permission set. */
export const PERMISSION_ENTITIES = [
  'tracking',
  'content',
  'users',
  'cohort',
  'cohortmembers',
  'attendance',
  'event',
  'opportunity',
  'lms',
] as const;

export type PermissionEntity = (typeof PERMISSION_ENTITIES)[number];

/**
 * Each value is an array because `PRIVILEGE_CHECK` treats its config as a set of
 * acceptable permissions and passes if the user holds *any* of them.
 */
export const createPrivilegeGroup = (entity: string) => {
  return PERMISSION_ACTIONS.reduce(
    (acc, action) => {
      acc[action] = [`${entity}.${action}`];
      return acc;
    },
    {} as Record<PermissionAction, string[]>,
  );
};

export const privilegeGroup = PERMISSION_ENTITIES.reduce(
  (acc, entity) => {
    acc[entity] = createPrivilegeGroup(entity);
    return acc;
  },
  {} as Record<PermissionEntity, Record<PermissionAction, string[]>>,
);

/** Every permission code this middleware knows about, sorted. */
export const ALL_PERMISSION_CODES: readonly string[] = Object.freeze(
  PERMISSION_ENTITIES.flatMap((entity) =>
    PERMISSION_ACTIONS.map((action) => `${entity}.${action}`),
  ).sort(),
);

const PERMISSION_CODE_SET = new Set(ALL_PERMISSION_CODES);

export function isKnownPermission(code: string): boolean {
  return PERMISSION_CODE_SET.has(code);
}
