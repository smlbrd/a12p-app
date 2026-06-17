import { eq } from "drizzle-orm"
import { db } from "../db/db.ts"
import {
  type Coin,
  coins,
  coinsToDuties,
  type CoinWithDuties,
  type NewCoinWithDuties,
  type PatchCoinWithDuties
} from "../db/schema.ts"

type TransactionClient = Parameters<Parameters<typeof db.transaction>[0]>[0]

export const getAllCoins = (): Promise<Coin[]> => db.select().from(coins)

export async function getCoinWithDuties(
  client: typeof db | TransactionClient,
  coinId: string
): Promise<CoinWithDuties | null> {
  const result = await client.query.coins.findFirst({
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
      const junctionRows = dutyIds.map((dutyId) => ({ coinId: newCoin.id, dutyId }))
      await tx.insert(coinsToDuties).values(junctionRows)
    }

    return await getCoinWithDuties(tx, newCoin.id)
  })
}

export async function updateCoin(id: string, data: PatchCoinWithDuties): Promise<NewCoinWithDuties | null> {
  return await db.transaction(async (tx) => {
    const { dutyIds, ...coinData } = data

    if (Object.keys(coinData).length > 0) {
      await tx.update(coins).set(coinData).where(eq(coins.id, id))
    }

    if (dutyIds !== undefined) {
      await tx.delete(coinsToDuties).where(eq(coinsToDuties.coinId, id))

      if (dutyIds.length > 0) {
        const junctionRows = dutyIds.map((dutyId) => ({ coinId: id, dutyId }))
        await tx.insert(coinsToDuties).values(junctionRows)
      }
    }

    return await getCoinWithDuties(tx, id)
  })
}
