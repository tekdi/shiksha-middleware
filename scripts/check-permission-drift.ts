/**
 * Permission drift check — `npm run rbac:drift`.
 *
 * Static half (no database, safe for CI without secrets):
 *   - a route requires a permission the registry does not declare  -> FAIL
 *   - the registry declares a permission no route requires          -> report only
 *
 * Database half (opt-in with `--db`, needs POSTGRES_* env):
 *   - a route requires a permission absent from `Privileges`        -> FAIL
 *     (no role can ever hold it, so that route denies every user)
 *   - the registry declares one no route uses and the DB lacks      -> report only
 *     (the registry generates the full entity x action matrix; only some
 *      combinations were ever seeded, which is harmless)
 *   - `Privileges` holds a code the registry does not know          -> report only
 *     (the user service owns that table and may legitimately carry extras)
 *
 * Exit code is 1 on any FAIL, so CI can gate on it.
 */
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { apiList } from '../src/common/middleware/apiConfig';
import { ALL_PERMISSION_CODES } from '../src/common/rbac/permission-registry';
import {
  checkDatabaseDrift,
  checkStaticDrift,
} from '../src/common/rbac/permission-drift';

const withDb = process.argv.includes('--db');

async function fetchDbPermissionCodes(): Promise<string[]> {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT ?? 5432),
    database: process.env.POSTGRES_DATABASE,
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
  });
  await dataSource.initialize();
  try {
    const rows: Array<{ code: string }> = await dataSource.query(
      'SELECT DISTINCT "code" FROM "Privileges" WHERE "code" IS NOT NULL',
    );
    return rows.map((r) => r.code);
  } finally {
    await dataSource.destroy();
  }
}

async function main() {
  let failed = false;

  const staticReport = checkStaticDrift(apiList as Record<string, any>);

  console.log('Permission drift check');
  console.log(`  registry declares : ${ALL_PERMISSION_CODES.length}`);
  console.log(`  routes reference  : ${staticReport.referenced.length}`);

  if (staticReport.unregistered.length > 0) {
    failed = true;
    console.error('\nFAIL — routes require permissions not in the registry:');
    for (const { code, routes } of staticReport.unregistered) {
      console.error(`  ${code}`);
      for (const route of routes) console.error(`      ${route}`);
    }
    console.error('\n  Add them to permission-registry.ts, or fix the typo.');
  }

  if (staticReport.unused.length > 0) {
    console.log(
      `\nRegistered but required by no route (${staticReport.unused.length}):`,
    );
    console.log(`  ${staticReport.unused.join(', ')}`);
    console.log(
      '  Expected while ROLE_CHECK routes are still being migrated to PRIVILEGE_CHECK.',
    );
  }

  if (withDb) {
    const dbCodes = await fetchDbPermissionCodes();
    const dbReport = checkDatabaseDrift(dbCodes, apiList as Record<string, any>);
    console.log(`  Privileges table  : ${dbCodes.length}`);

    if (dbReport.requiredButMissingFromDb.length > 0) {
      failed = true;
      console.error(
        `\nFAIL — routes require permissions absent from the Privileges table (${dbReport.requiredButMissingFromDb.length}):`,
      );
      for (const { code, routes } of dbReport.requiredButMissingFromDb) {
        console.error(`  ${code}`);
        for (const route of routes) console.error(`      ${route}`);
      }
      console.error(
        '\n  No role can hold these, so these routes deny every user.',
      );
    }

    if (dbReport.declaredButMissingFromDb.length > 0) {
      console.log(
        `\nDeclared in the registry, unused by routes, absent from the DB (${dbReport.declaredButMissingFromDb.length}):`,
      );
      console.log(`  ${dbReport.declaredButMissingFromDb.join(', ')}`);
      console.log(
        '  Harmless — the registry generates the full entity x action matrix.',
      );
    }

    if (dbReport.unknownInDb.length > 0) {
      console.log(
        `\nIn the Privileges table but unknown to the registry (${dbReport.unknownInDb.length}):`,
      );
      console.log(`  ${dbReport.unknownInDb.join(', ')}`);
      console.log('  The user service owns that table; extras may be legitimate.');
    }
  } else {
    console.log('\n  (Skipping database comparison. Re-run with --db to include it.)');
  }

  console.log(failed ? '\nDrift check FAILED.' : '\nDrift check passed.');
  process.exit(failed ? 1 : 0);
}

main().catch((err) => {
  console.error('Drift check errored:', err);
  process.exit(1);
});
