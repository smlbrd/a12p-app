import { seedData } from "../app/db/seed.ts"

try {
    console.log("Seeding database...")
    await seedData()
    console.log("Seeding complete.")
    process.exit(0)
} catch (err) {
    console.error("Seeding failed:", err)
    process.exit(1)
}