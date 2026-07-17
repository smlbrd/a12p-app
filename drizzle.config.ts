import { defineConfig } from "drizzle-kit"

export default defineConfig({
    dialect: "postgresql",
    schema: "./app/db/schema/index.ts",
    out: "./drizzle",
    schemaFilter: ["coins"],
    dbCredentials: {
        url: process.env.DATABASE_URL!,
        ssl: {
            rejectUnauthorized: false
        }
    }
})
