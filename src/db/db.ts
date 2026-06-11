import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema.ts"

const pool = new Pool({
  user: process.env.PG_USER || "test_user",
  password: process.env.DB_PASSWORD || "test_password",
  host: process.env.PG_HOST || "localhost",
  port: process.env.PG_PORT ? Number.parseInt(process.env.PG_PORT) : 5433,
  database: process.env.DB_NAME || "test_db",
  ssl: undefined
})

export const db = drizzle(pool, { schema })

export { pool }
