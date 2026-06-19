import { drizzle } from "drizzle-orm/node-postgres"
import * as schema from "./schema.ts"
import { Pool } from "pg"

const isProduction = process.env.NODE_ENV === "production"
const port = process.env.PG_PORT ? Number.parseInt(process.env.PG_PORT, 10) : 5433

const pool = new Pool({
  user: process.env.PG_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.PG_HOST,
  port: port,
  database: process.env.DB_NAME,
  max: isProduction ? 1 : 10,
  idleTimeoutMillis: 15000,
  connectionTimeoutMillis: 5000,
  ssl: isProduction ? { rejectUnauthorized: false } : undefined
})

export const db = drizzle(pool, { schema })
export { pool }
