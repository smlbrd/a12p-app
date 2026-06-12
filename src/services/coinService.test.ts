import { beforeEach, describe, expect, test } from "vitest"
import { db } from "../db/db.ts"
import { coins, coinsToDuties, duties } from "../db/schema.ts"
import { COIN_IDS, DUTY_IDS, seedCoinsAndDuties } from "../db/seeds/seedData.ts"
import { createCoin, getAllCoins, getCoinWithDuties } from "./coinService.ts"

beforeEach(async () => {
  await db.delete(coinsToDuties)
  await db.delete(duties)
  await db.delete(coins)
  await seedCoinsAndDuties()
})

describe("coinService Integration Tests", () => {
  test("getAllCoins should fetch all seeded records", async () => {
    const list = await getAllCoins()
    expect(list.length).toBeGreaterThan(0)
  })

  test("getCoinWithDuties should retrieve valid relational layouts", async () => {
    const result = await getCoinWithDuties(COIN_IDS.AUTOMATE)

    expect(result).not.toBeNull()
    expect(result?.duties).toHaveLength(3)
    expect(result?.duties).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: DUTY_IDS.D5, number: 5 }),
        expect.objectContaining({ id: DUTY_IDS.D7, number: 7 }),
        expect.objectContaining({ id: DUTY_IDS.D10, number: 10 })
      ])
    )
  })

  test("createCoin should safeguard unique constraints using onConflictDoNothing", async () => {
    const payload = { name: "Unique Coin Test", isCompleted: false }

    const initial = await createCoin(payload)
    expect(initial).not.toBeNull()

    const duplicate = await createCoin(payload)
    expect(duplicate).toBeNull()
  })
})
