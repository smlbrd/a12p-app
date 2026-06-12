import { eq } from "drizzle-orm"
import { db } from "../db/db.ts"
import { type Coin, coins, type CoinWithDuties, type NewCoin } from "../db/schema.ts"

export const getAllCoins = (): Promise<Coin[]> => db.select().from(coins)

export async function getCoinWithDuties(coinId: string): Promise<CoinWithDuties | null> {
  const result = await db.query.coins.findFirst({
    where: eq(coins.id, coinId),
    with: {
      coinsToDuties: {
        with: {
          duty: true
        }
      }
    }
  })

  if (!result) return null

  return {
    id: result.id,
    name: result.name,
    isCompleted: result.isCompleted,
    duties: result.coinsToDuties.map((cd) => cd.duty)
  }
}

export async function createCoin(data: NewCoin): Promise<Coin | null> {
  const [newCoin] = await db.insert(coins).values(data).onConflictDoNothing({ target: coins.name }).returning()

  return newCoin ?? null
}
