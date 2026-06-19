import { drizzle } from "drizzle-orm/node-postgres"
import * as schema from "./schema.ts"
import { Pool } from "pg"

const DEFAULT_DATABASE_URL = "postgresql://test_user:test_password@localhost:5433/test_db"
const dbUrl = process.env.DATABASE_URL || DEFAULT_DATABASE_URL

const isLocalDatabase = dbUrl.includes("localhost") || dbUrl.includes("127.0.0.1")

const pool = new Pool({
  connectionString: dbUrl,
  max: 1,
  idleTimeoutMillis: 15000,
  connectionTimeoutMillis: 5000,
  ssl: isLocalDatabase ? undefined : { rejectUnauthorized: false }
})

export const db = drizzle(pool, { schema })
export { pool }
