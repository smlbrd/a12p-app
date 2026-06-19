import { drizzle } from "drizzle-orm/node-postgres"
import * as schema from "./schema.ts"
import { Pool } from "pg"

const isProduction = process.env.NODE_ENV === "production"

let connectionString = process.env.DATABASE_URL

if (connectionString && isProduction) {
  const url = new URL(connectionString)
  url.searchParams.delete("sslmode")
  connectionString = url.toString()
}

const pool = new Pool({
  connectionString,
  ...(!process.env.DATABASE_URL && {
    user: process.env.PG_USER || "test_user",
    password: process.env.DB_PASSWORD || "test_password",
    host: process.env.PG_HOST || "localhost",
    port: process.env.PG_PORT ? Number.parseInt(process.env.PG_PORT) : 5433,
    database: process.env.DB_NAME || "test_db"
  }),
  max: isProduction ? 1 : 10,
  idleTimeoutMillis: 15000,
  connectionTimeoutMillis: 5000,
  ssl: isProduction ? { rejectUnauthorized: false } : undefined
})

export const db = drizzle(pool, { schema })
export { pool }
