import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import app from "../../server.ts"
import { db } from "../../db/db.ts"
import { coins, coinsToDuties, duties, type Duty, type NewCoin, type NewCoinWithDuties } from "../../db/schema.ts"
import { COIN_IDS, coinsData, deleteCoinsAndDuties, DUTY_IDS, seedCoinsAndDuties } from "../../db/seeds/seedData.ts"
import { eq } from "drizzle-orm"
import { Hono } from "hono"
import { errorHandler } from "../../middleware/errorHandler.ts"
import { z } from "zod"

const jsonReq = (method: "POST" | "PATCH" | "DELETE", path: string, body?: unknown) =>
  app.request(`/api${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : null
  })

beforeEach(async () => {
  await deleteCoinsAndDuties()
  await seedCoinsAndDuties()
})

afterEach(() => {
  vi.restoreAllMocks()
})

const seedTestDuties = async () => {
  return db
    .insert(duties)
    .values([
      { number: 1, description: "Test Duty 1" },
      { number: 2, description: "Test Duty 2" },
      { number: 3, description: "Test Duty 3" },
      { number: 4, description: "Test Duty 4" }
    ])
    .returning()
}

const matchDutiesArray = (insertedDuties: Duty[]) =>
  expect.arrayContaining(
    insertedDuties.map((duty: Duty) =>
      expect.objectContaining({ id: duty.id, number: duty.number, description: duty.description })
    )
  )

const insertCoin = async (values: NewCoinWithDuties) => {
  const [row] = await db.insert(coins).values(values).returning()
  return row!
}

const getCoinFromDb = async (id: string) => {
  const [row] = await db.select().from(coins).where(eq(coins.id, id)).limit(1)
  return row!
}

describe("Global tests", () => {
  test("GET /health should return a 200 status", async () => {
    const res = await app.request("/api/health")
    expect(res.status).toBe(200)
  })

  test("should return a 404 status for non-existent routes", async () => {
    const res = await app.request("/this-route-does-not-exist")
    expect(res.status).toBe(404)
  })

  test("should catch ZodError and return formatted validation issues with a 400 status", async () => {
    const testApp = new Hono()
    testApp.onError(errorHandler)

    testApp.get("/test-zod-error", (c) => {
      const mockSchema = z.object({
        coinName: z.string()
      })

      mockSchema.parse({
        coinName: 123
      })

      return c.text("this is unreachable due to the error")
    })

    const res = await testApp.request("/test-zod-error")
    expect(res.status).toBe(400)

    const body = await res.json()
    expect(body).toEqual({
      success: false,
      error: {
        issues: [{ path: ["coinName"], message: "Invalid input: expected string, received number" }]
      }
    })
  })

  test("should return a 500 error if the database catastrophically crashes", async () => {
    vi.spyOn(db.query.coins, "findMany").mockRejectedValueOnce(new Error("Database connection timed out abruptly"))

    const res = await app.request("/api/coins")
    expect(res.status).toBe(500)

    const body = await res.json()
    expect(body).toEqual({
      success: false,
      error: "INTERNAL_SERVER_ERROR"
    })
  })
})

describe("GET /coins", () => {
  test("should return an empty list if no coins exist", async () => {
    await db.delete(coins)

    const res = await app.request("/api/coins")
    expect(res.status).toBe(200)

    const body = await res.json()
    expect(body).toEqual([])
  })

  test("should return a list of all coins", async () => {
    const res = await app.request("/api/coins")
    expect(res.status).toBe(200)

    const body = await res.json()
    expect(body).toHaveLength(coinsData.length)
    expect(body).toMatchObject(coinsData)
  })
})

describe("GET /coins/:id", () => {
  test("should return a coin with linked duties", async () => {
    const res = await app.request(`/api/coins/${COIN_IDS.AUTOMATE}`)
    expect(res.status).toBe(200)

    const body = await res.json()
    expect(body).toMatchObject({
      id: COIN_IDS.AUTOMATE,
      name: "Automate",
      isCompleted: false,
      duties: expect.any(Array)
    })

    expect(body.duties).toHaveLength(3)
    expect(body.duties).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: DUTY_IDS.D5, number: 5 }),
        expect.objectContaining({ id: DUTY_IDS.D7, number: 7 }),
        expect.objectContaining({ id: DUTY_IDS.D10, number: 10 })
      ])
    )
  })

  test("should return a 404 status if the coin ID does not exist", async () => {
    const nonExistentId = "00000000-0000-0000-0000-000000000000"

    const res = await app.request(`/api/coins/${nonExistentId}`)
    expect(res.status).toBe(404)

    const body = await res.json()
    expect(body).toEqual({ success: false, error: "COIN_NOT_FOUND" })
  })
})

describe("POST /coins", () => {
  beforeEach(async () => {
    await db.delete(coinsToDuties)
    await db.delete(coins)
    await db.delete(duties)
  })

  test("should add a new coin without duties", async () => {
    const newCoin: NewCoin = { name: "Testing.. Testing.. 1, 2, 3", isCompleted: false }

    const res = await jsonReq("POST", "/coins", newCoin)
    expect(res.status).toBe(201)

    const body = await res.json()
    expect(body).toMatchObject({
      id: expect.any(String),
      ...newCoin,
      duties: []
    })

    const [dbCoin] = await db.select().from(coins).where(eq(coins.id, body.id)).limit(1)
    expect(dbCoin).toMatchObject({
      id: expect.any(String),
      ...newCoin
    })
  })

  test("should add a new coin with linked duties", async () => {
    const duties = await seedTestDuties()
    const duty1 = duties[0]!
    const duty2 = duties[1]!

    const newCoinPayload: NewCoinWithDuties = {
      name: "Dutiful Coin",
      dutyIds: [duty1.id, duty2.id]
    }

    const res = await jsonReq("POST", "/coins", newCoinPayload)
    expect(res.status).toBe(201)

    const body = await res.json()
    expect(body).toMatchObject({
      id: expect.any(String),
      name: newCoinPayload.name,
      duties: matchDutiesArray([duty1, duty2])
    })
  })

  test("should return a 409 error if the coin name already exists", async () => {
    await jsonReq("POST", "/coins", { name: "Duplicate Coin" })

    const res = await jsonReq("POST", "/coins", { name: "Duplicate Coin" })
    expect(res.status).toBe(409)

    const body = await res.json()
    expect(body).toEqual({
      success: false,
      error: "COIN_ALREADY_EXISTS"
    })
  })

  test("should return a 400 error for malformed JSON request body", async () => {
    const res = await app.request("/api/coins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{ invalid-json: "
    })
    expect(res.status).toBe(400)

    const body = await res.json()
    expect(body).toEqual({
      success: false,
      error: "MALFORMED_JSON",
      details: "The request body could not be parsed as valid JSON."
    })
  })
})

describe("PATCH /coins/:id", () => {
  beforeEach(async () => {
    await db.delete(coinsToDuties)
    await db.delete(coins)
    await db.delete(duties)
  })

  test("should change the name of an existing coin", async () => {
    const coin = await insertCoin({ name: "Testing.. Testing.. 1, 2, 3" })
    const updateBody = { name: "Testing.. Testing.. 4, 5, 6", isCompleted: true }

    const res = await jsonReq("PATCH", `/coins/${coin.id}`, updateBody)

    expect(res.status).toBe(200)
    expect(await res.json()).toMatchObject({ id: coin.id, name: updateBody.name })

    const dbCoin = await getCoinFromDb(coin.id)
    expect(dbCoin).toMatchObject({ id: coin.id, ...updateBody })
  })

  test("should gracefully handle a patch request with no new information", async () => {
    const coin = await insertCoin({ name: "Testing.. Testing.. 1, 2, 3", isCompleted: false })
    const updateBody = { name: "Testing.. Testing.. 1, 2, 3", isCompleted: false }

    const res = await jsonReq("PATCH", `/coins/${coin.id}`, updateBody)

    expect(res.status).toBe(200)
    expect(await res.json()).toMatchObject({ id: coin.id, name: updateBody.name })

    const dbCoin = await getCoinFromDb(coin.id)
    expect(dbCoin).toMatchObject({ id: coin.id, ...updateBody })
  })

  test("should update duties linked to an existing coin", async () => {
    const duties = await seedTestDuties()
    const duty1 = duties[0]!
    const duty2 = duties[1]!

    const coin = await insertCoin({ name: "Testing Duties" })

    const updateBody = {
      dutyIds: [duty1.id, duty2.id]
    }

    const res = await jsonReq("PATCH", `/coins/${coin.id}`, updateBody)
    expect(res.status).toBe(200)

    const body = await res.json()
    expect(body).toMatchObject({
      id: coin.id,
      duties: matchDutiesArray([duty1, duty2])
    })
  })

  test("should return a 400 error when violating validation schema (e.g. minimum name length)", async () => {
    const coin = await insertCoin({ name: "Valid Coin" })

    const updateBody = { name: "" }

    const res = await jsonReq("PATCH", `/coins/${coin.id}`, updateBody)
    expect(res.status).toBe(400)

    const body = await res.json()
    expect(body.error.issues).toContainEqual(
      expect.objectContaining({
        path: ["name"],
        message: "Name cannot be empty"
      })
    )
  })

  test("should clear duties linked to an existing coin when receiving [] as duties patch", async () => {
    const duties = await seedTestDuties()
    const duty1 = duties[0]!
    const duty2 = duties[1]!

    const coin = await insertCoin({ name: "Testing Duties", dutyIds: [duty1.id, duty2.id] })

    const res = await jsonReq("PATCH", `/coins/${coin.id}`, { dutyIds: [] })
    expect(res.status).toBe(200)

    const body = await res.json()
    expect(body.duties).toHaveLength(0)
  })

  test("should accommodate duplication between existing duties and patch body", async () => {
    const duties = await seedTestDuties()
    const duty1 = duties[0]!
    const duty2 = duties[1]!
    const duty3 = duties[2]!
    const duty4 = duties[3]!

    const coin = await insertCoin({ name: "Testing Duties", dutyIds: [duty1.id, duty2.id, duty3.id] })

    const res = await jsonReq("PATCH", `/coins/${coin.id}`, { dutyIds: [duty2.id, duty3.id, duty4.id] })
    expect(res.status).toBe(200)

    const body = await res.json()
    expect(body.duties).toHaveLength(3)
    expect(body).toMatchObject({
      id: coin.id,
      name: coin.name,
      duties: matchDutiesArray([duty2, duty3, duty4])
    })
  })

  test("should return a 404 error when updating a non-existent coin", async () => {
    const nonExistentId = "00000000-0000-0000-0000-000000000000"
    const updateBody = { name: "Imaginary Coin" }

    const res = await jsonReq("PATCH", `/coins/${nonExistentId}`, updateBody)
    expect(res.status).toBe(404)

    const body = await res.json()
    expect(body).toEqual({ success: false, error: "COIN_NOT_FOUND" })
  })

  test("should return a 404 error when updating a coin with a non-existent duty", async () => {
    const duties = await seedTestDuties()
    const duty1 = duties[0]!
    const duty2 = duties[1]!

    const coin = await insertCoin({ name: "Testing Duties", dutyIds: [duty1.id, duty2.id] })

    const res = await jsonReq("PATCH", `/coins/${coin.id}`, { dutyIds: ["00000000-0000-0000-0000-000000000000"] })
    expect(res.status).toBe(404)

    const body = await res.json()
    expect(body).toEqual({ success: false, error: "RESOURCE_NOT_FOUND" })
  })
})

describe("DELETE /coins/:id", () => {
  test("should delete a coin", async () => {
    const coin = await insertCoin({ name: "Delete This Coin" })

    const res = await jsonReq("DELETE", `/coins/${coin.id}`)
    expect(res.status).toBe(204)

    const deletedCoin = await db.query.coins.findFirst({
      where: eq(coins.id, coin.id)
    })
    expect(deletedCoin).toBeUndefined()
  })

  test("should return a 404 error when deleting a coin that doesn't exist", async () => {
    const nonExistentId = "00000000-0000-0000-0000-000000000000"

    const res = await jsonReq("DELETE", `/coins/${nonExistentId}`)
    expect(res.status).toBe(404)
  })
})
