import { asc } from "drizzle-orm"
import { db } from "../db/db.ts"
import { duties, type Duty, type DutyWithCoins } from "../db/schema.ts"

type TransactionClient = Parameters<Parameters<typeof db.transaction>[0]>[0]

export const getAllDuties = (): Promise<Duty[]> => db.select().from(duties).orderBy(asc(duties.number))

export async function getAllDutiesWithCoins(client: typeof db | TransactionClient): Promise<DutyWithCoins[]> {
  const rawDuties = await client.query.duties.findMany({
    orderBy: (duties, { asc }) => [asc(duties.number)],
    with: {
      coinsToDuties: {
        with: {
          coin: true
        }
      }
    }
  })

  return rawDuties.map(
    (duty): DutyWithCoins => ({
      id: duty.id,
      number: duty.number,
      description: duty.description,
      coins: duty.coinsToDuties.map((cd) => cd.coin)
    })
  )
}
