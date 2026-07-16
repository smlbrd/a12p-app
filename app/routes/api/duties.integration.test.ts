import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import app from "../../server.ts"
import { db } from "../../db/db.ts"
import { type Coin, duties } from "../../db/schema.ts"
import { deleteCoinsAndDuties, dutiesData, seedCoinsAndDuties } from "../../db/seeds/seedData.ts"

beforeEach(async () => {
  await deleteCoinsAndDuties()
  await seedCoinsAndDuties()
})

afterEach(() => {
  vi.restoreAllMocks()
})

const matchCoinsArray = (insertedCoins: Coin[]) =>
  expect.arrayContaining(
    insertedCoins.map((coin: Coin) =>
      expect.objectContaining({
        id: coin.id,
        name: coin.name,
        isCompleted: coin.isCompleted
      })
    )
  )

describe("GET /duties", () => {
  test("should return an empty list if no duties exist", async () => {
    await db.delete(duties)

    const res = await app.request("/api/duties")
    expect(res.status).toBe(200)

    const body = await res.json()
    expect(body).toEqual([])
  })

  test("should return a list of all duties", async () => {
    const res = await app.request("/api/duties")
    expect(res.status).toBe(200)

    const body = await res.json()
    expect(body).toHaveLength(dutiesData.length)
    expect(body).toMatchObject(dutiesData)
  })
})
