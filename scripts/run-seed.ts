import { seedCoinsAndDuties } from "../src/db/seeds/seedData.ts"
import { db, pool } from "../src/db/db.ts"
import { coins, coinsToDuties, duties } from "../src/db/schema.ts"

try {
  console.log("🔥 Clearing database...")
  await db.delete(coinsToDuties)
  await db.delete(duties)
  await db.delete(coins)
  console.log("🌱 Seeding coins...")
  await seedCoinsAndDuties()
  console.log("✅ Database seeded successfully!")
  await pool.end()
} catch (err) {
  console.error("❌ Seeding failed:", err)
  process.exit(1)
}
