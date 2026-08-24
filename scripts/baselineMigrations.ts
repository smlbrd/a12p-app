/**
 * One-time (and safe-to-re-run) bridge from `drizzle-kit push`-managed
 * databases to `drizzle-kit migrate`-managed ones.
 *
 * Historically this project applied schema changes with `drizzle-kit push`,
 * which mutates the live database directly and keeps no migration history.
 * Any database that was only ever set up via `push` (e.g. the current
 * production database) therefore has no `drizzle.__drizzle_migrations`
 * tracking table, and Drizzle's migrator only ever looks at the *most
 * recent* tracked migration's timestamp to decide what still needs to run
 * (see `drizzle-orm/pg-core/dialect.js`'s `migrate()`).
 *
 * Running `drizzle-kit migrate` against such a database for the first time
 * would try to re-run every migration from scratch, including `CREATE
 * TABLE` statements for tables that already exist from `push`, and fail.
 *
 * This script closes that gap: if the tracking table doesn't exist yet (or
 * exists but is empty), it records the *last* migration currently committed
 * to `drizzle/` as already applied - using the exact hash/timestamp format
 * Drizzle itself uses - without executing any SQL, since that schema is
 * already live. `drizzle-kit migrate` can then safely run afterwards and
 * will only apply genuinely new migrations going forward.
 *
 * If the tracking table already has rows (i.e. this database has already
 * been baselined, or has only ever been managed via `migrate`), this script
 * does nothing. It is intended to run as a guarded pre-step ahead of
 * `drizzle-kit migrate` in CI/CD, not as a one-off manual command.
 */
import { createHash } from "node:crypto"
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { sql } from "drizzle-orm"
import { db } from "../app/db/db.ts"

const MIGRATIONS_DIR = fileURLToPath(new URL("../drizzle", import.meta.url))
const MIGRATIONS_SCHEMA = "drizzle"
const MIGRATIONS_TABLE = "__drizzle_migrations"

type JournalEntry = {
    tag: string
    when: number
}

async function baselineMigrations() {
    // Safety guard: only baseline if the application schema already exists
    // (i.e. this is the known "managed via push until now" production
    // database). A genuinely fresh/new database has nothing to baseline -
    // `drizzle-kit migrate` should be left to create everything from
    // migration 0000 onwards as normal.
    const [{exists}] = await db.execute<{exists: boolean}>(
        sql`SELECT to_regclass('coins.users') IS NOT NULL as exists`
    ).then((res) => res.rows)

    if (!exists) {
        console.log("Application schema does not exist yet - nothing to baseline, letting 'drizzle-kit migrate' run from scratch.")
        return
    }

    const journal = JSON.parse(
        readFileSync(`${MIGRATIONS_DIR}/meta/_journal.json`, "utf-8")
    ) as { entries: JournalEntry[] }

    const lastEntry = journal.entries.at(-1)

    if (!lastEntry) {
        console.log("No migrations found in drizzle/meta/_journal.json - nothing to baseline.")
        return
    }

    await db.execute(sql`CREATE SCHEMA IF NOT EXISTS ${sql.identifier(MIGRATIONS_SCHEMA)}`)
    await db.execute(sql`
        CREATE TABLE IF NOT EXISTS ${sql.identifier(MIGRATIONS_SCHEMA)}.${sql.identifier(MIGRATIONS_TABLE)} (
            id SERIAL PRIMARY KEY,
            hash text NOT NULL,
            created_at bigint
        )
    `)

    const [{count}] = await db.execute<{count: string}>(
        sql`SELECT COUNT(*)::text as count FROM ${sql.identifier(MIGRATIONS_SCHEMA)}.${sql.identifier(MIGRATIONS_TABLE)}`
    ).then((res) => res.rows)

    if (Number(count) > 0) {
        console.log("Migrations table already has history - skipping baseline (nothing to do).")
        return
    }

    const migrationSql = readFileSync(`${MIGRATIONS_DIR}/${lastEntry.tag}.sql`, "utf-8")
    const hash = createHash("sha256").update(migrationSql).digest("hex")

    await db.execute(
        sql`INSERT INTO ${sql.identifier(MIGRATIONS_SCHEMA)}.${sql.identifier(MIGRATIONS_TABLE)} ("hash", "created_at") VALUES (${hash}, ${lastEntry.when})`
    )

    console.log(
        `Baselined migration history at "${lastEntry.tag}" (schema already matches via prior 'drizzle-kit push' usage). ` +
        `Future 'drizzle-kit migrate' runs will only apply migrations newer than this.`
    )
}

try {
    await baselineMigrations()
    process.exit(0)
} catch (err) {
    console.error("Baselining migration history failed:", err)
    process.exit(1)
}
