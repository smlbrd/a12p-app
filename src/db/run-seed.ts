import { seedCoins } from "../seeds/coins.ts"
import { pool } from "./db.ts"

try {
  console.log("🌱 Seeding coins...")
  await seedCoins()
  console.log("✅ Database seeded successfully!")
  await pool.end()
} catch (err) {
  console.error("❌ Seeding failed:", err)
  process.exit(1)
}
