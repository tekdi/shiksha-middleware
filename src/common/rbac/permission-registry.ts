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

/**
 * Catalog codes: `{module}.{submodule}.{view|edit}`.
 *
 * The `Privileges` table holds 67 of these alongside the 28 legacy `{entity}.{action}`
 * codes above. They are the shape the admin UI and the user service use, and they are
 * the only codes carrying `module` / `submodule` / `isVisibleInUI` metadata.
 *
 * They cannot come from the entity x action product above — that only ever joins two
 * segments — so they are listed explicitly. Add a code here before referencing it in
 * `apiConfig.ts`; `npm run rbac:drift` fails on a route requiring an undeclared code.
 *
 * Only the codes routes currently need are listed. The full set is in the database.
 */
export const CATALOG_PRIVILEGE_CODES = [
  'alumni.discordimport.edit',
  'alumni.discordimport.view',
  'alumni.events.edit',
  'alumni.events.view',
  'alumni.feedback.edit',
  'alumni.feedback.view',
  'alumni.importhistory.view',
  'alumni.pathway.edit',
  'alumni.pathway.view',
  'alumni.tags.edit',
  'alumni.tags.view',
  'bulkimport.application.edit',
  'bulkimport.application.view',
  'bulkimport.assessment.edit',
  'bulkimport.assessment.view',
  'bulkimport.certificate.edit',
  'bulkimport.certificate.view',
  'bulkimport.discord.edit',
  'bulkimport.discord.view',
  'bulkimport.eventattendance.edit',
  'bulkimport.eventattendance.view',
  'bulkimport.history.view',
  'cohort.list.edit',
  'cohort.list.view',
  'credential.manage.edit',
  'credential.manage.view',
  'modulemgmt.modules.edit',
  'modulemgmt.modules.view',
  'notification.inapp.edit',
  'notification.inapp.view',
  'notification.templates.edit',
  'notification.templates.view',
  'pagemgmt.pages.edit',
  'payment.coupons.view',
  'payment.transactions.view',
  'rbac.roles.view',
  'report.alumni_assessment.view',
  'report.alumni_content.view',
  'report.alumni_exporthistory.view',
  'report.alumni_interest.view',
  'report.alumni_longitudinal.view',
  'report.alumni_masterclass.view',
  'report.alumni_omfeedback.view',
  'report.alumni_openmasterclass.view',
  'report.alumni_pathway.view',
  'report.participant_application.view',
  'report.participant_assessment.view',
  'report.participant_content.view',
  'report.participant_exporthistory.view',
  'report.participant_masterclass.view',
  'usermgmt.applicants.edit',
  'usermgmt.applicants.view',
  'usermgmt.cohortstudents.edit',
  'usermgmt.cohortstudents.view',
  'usermgmt.regionaladmin.edit',
  'usermgmt.regionaladmin.view',
] as const;

/**
 * Nested accessor for catalog codes:
 * `privilegeCatalog.modulemgmt.modules.view` -> `['modulemgmt.modules.view']`.
 */
export const privilegeCatalog: Record<
  string,
  Record<string, Record<string, string[]>>
> = CATALOG_PRIVILEGE_CODES.reduce(
  (root, code) => {
    const [module, submodule, action] = code.split('.');
    root[module] ??= {};
    root[module][submodule] ??= {};
    root[module][submodule][action] = [code];
    return root;
  },
  {} as Record<string, Record<string, Record<string, string[]>>>,
);

/** Every permission code this middleware knows about, sorted. */
export const ALL_PERMISSION_CODES: readonly string[] = Object.freeze(
  [
    ...PERMISSION_ENTITIES.flatMap((entity) =>
      PERMISSION_ACTIONS.map((action) => `${entity}.${action}`),
    ),
    ...CATALOG_PRIVILEGE_CODES,
  ].sort((a, b) => a.localeCompare(b)),
);

const PERMISSION_CODE_SET = new Set(ALL_PERMISSION_CODES);

export function isKnownPermission(code: string): boolean {
  return PERMISSION_CODE_SET.has(code);
}
