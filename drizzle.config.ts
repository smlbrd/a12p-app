import { defineConfig } from "drizzle-kit"

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DB_URL || "postgresql://test_user:test_password@localhost:5433/test_db",
    ssl: {
      rejectUnauthorized: false
    }
  }
})
