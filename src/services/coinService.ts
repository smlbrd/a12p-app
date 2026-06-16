import { eq } from "drizzle-orm"
import { db } from "../db/db.ts"
import { type Coin, coins, coinsToDuties, type CoinWithDuties, type NewCoinWithDuties } from "../db/schema.ts"

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

export async function createCoin(data: NewCoinWithDuties): Promise<CoinWithDuties | null> {
  return await db.transaction(async (tx) => {
    const { dutyIds, ...coinData } = data

    const [newCoin] = await tx.insert(coins).values(coinData).onConflictDoNothing({ target: coins.name }).returning()

    if (!newCoin) return null

    if (dutyIds && dutyIds.length > 0) {
      const junctionRows = dutyIds.map((dutyId) => ({
        coinId: newCoin.id,
        dutyId
      }))
      await tx.insert(coinsToDuties).values(junctionRows)
    }

    const result = await tx.query.coins.findFirst({
      where: eq(coins.id, newCoin.id),
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
  })
}
