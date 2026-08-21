import { deleteData } from "../app/db/seed.ts"

try {
    console.log("Clearing database...")
    await deleteData()
    console.log("Database reset complete.")
    process.exit(0)
} catch (err) {
    console.error("Reset failed:", err)
    process.exit(1)
}