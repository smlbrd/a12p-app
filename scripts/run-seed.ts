import { deleteCoinsAndDuties, seedCoinsAndDuties } from "../app/db/seeds/seedData.ts"
import { pool } from "../app/db/db.ts"

try {
    if (process.env.NODE_ENV !== "production") {
        console.log("🔥 Clearing database...")
        await deleteCoinsAndDuties()
    }
    console.log("🌱 Seeding coins...")
    await seedCoinsAndDuties()
    console.log("✅ Database seeded successfully!")
    await pool.end()
} catch (err) {
    console.error("❌ Seeding failed:", err)
    process.exit(1)
}
