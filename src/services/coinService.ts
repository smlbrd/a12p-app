import { db } from "../db/db.ts"
import { type Coin, coins, type NewCoin } from "../db/schema.ts"

export async function getAllCoins(): Promise<Coin[]> {
  return db.select().from(coins)
}

export async function createCoin(data: NewCoin): Promise<Coin | null> {
  const [newCoin] = await db.insert(coins).values(data).onConflictDoNothing({ target: coins.name }).returning()

  return newCoin || null
}
