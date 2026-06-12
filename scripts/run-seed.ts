import { seedCoinsAndDuties } from "../src/db/seeds/seedData.ts"
import { pool } from "../src/db/db.ts"

try {
  console.log("🌱 Seeding coins...")
  await seedCoinsAndDuties()
  console.log("✅ Database seeded successfully!")
  await pool.end()
} catch (err) {
  console.error("❌ Seeding failed:", err)
  process.exit(1)
}
