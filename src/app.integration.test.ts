import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import app from "./app.ts"
import { db } from "./db/db.ts"
import { coins, coinsToDuties, duties } from "./db/schema.ts"
import { COIN_IDS, coinsData, DUTY_IDS, seedCoinsAndDuties } from "./db/seeds/seedData.ts"
import { eq } from "drizzle-orm"
import { Hono } from "hono"
import { errorHandler } from "./middleware/errorHandler.ts"
import { z } from "zod"

const jsonPost = (path: string, body: unknown) =>
  app.request(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  })

beforeEach(async () => {
  await db.delete(coinsToDuties)
  await db.delete(duties)
  await db.delete(coins)
  await seedCoinsAndDuties()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe("Global tests", () => {
  test("GET /health should return a 200 status", async () => {
    const res = await app.request("/health")
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
    vi.spyOn(db, "select").mockImplementationOnce(() => {
      throw new Error("Database connection timed out abruptly")
    })

    const res = await app.request("/coins")
    expect(res.status).toBe(500)

    const data = await res.json()
    expect(data).toEqual({
      success: false,
      error: "INTERNAL_SERVER_ERROR"
    })
  })
})

describe("GET /coins", () => {
  test("should return an empty list if no coins exist", async () => {
    await db.delete(coins)

    const res = await app.request("/coins")
    expect(res.status).toBe(200)

    const data = await res.json()
    expect(data).toEqual([])
  })

  test("should return a list of all coins", async () => {
    const res = await app.request("/coins")
    expect(res.status).toBe(200)

    const data = await res.json()
    expect(data).toHaveLength(coinsData.length)
    expect(data).toMatchObject(coinsData)
  })
})

describe("GET /coins/:id", () => {
  test("should return a coin with linked duties", async () => {
    const res = await app.request(`/coins/${COIN_IDS.AUTOMATE}`)
    expect(res.status).toBe(200)

    const data = await res.json()
    expect(data).toMatchObject({
      id: COIN_IDS.AUTOMATE,
      name: "Automate",
      isCompleted: false,
      duties: expect.any(Array)
    })

    expect(data.duties).toHaveLength(3)

    expect(data.duties).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: DUTY_IDS.D5, number: 5 }),
        expect.objectContaining({ id: DUTY_IDS.D7, number: 7 }),
        expect.objectContaining({ id: DUTY_IDS.D10, number: 10 })
      ])
    )
  })

  test("should return a 404 status if the coin ID does not exist", async () => {
    const nonExistentId = "00000000-0000-0000-0000-000000000000"

    const res = await app.request(`/coins/${nonExistentId}`)
    expect(res.status).toBe(404)

    const data = await res.json()
    expect(data).toEqual({ success: false, error: "COIN_NOT_FOUND" })
  })
})

describe("POST /coins", () => {
  beforeEach(async () => {
    await db.delete(coinsToDuties)
    await db.delete(coins)
    await db.delete(duties)
  })

  test("should add a new coin without duties", async () => {
    const newCoin = { name: "Testing.. Testing.. 1, 2, 3", isCompleted: false }

    const res = await jsonPost("/coins", newCoin)
    expect(res.status).toBe(201)

    const data = await res.json()
    expect(data).toMatchObject({
      id: expect.any(String),
      ...newCoin,
      duties: []
    })

    const [dbCoin] = await db.select().from(coins).where(eq(coins.id, data.id)).limit(1)
    expect(dbCoin).toMatchObject({
      id: expect.any(String),
      ...newCoin
    })
  })

  test("should add a new coin with linked duties", async () => {
    const insertedDuties = await db
      .insert(duties)
      .values([
        { number: 1, description: "Heads" },
        { number: 2, description: "Tails" }
      ])
      .returning()

    const duty1 = insertedDuties[0]
    const duty2 = insertedDuties[1]

    if (!duty1 || !duty2) {
      throw new Error("Test setup failed: Seeded duties are missing.")
    }

    const newCoinPayload = {
      name: "Dutiful Coin",
      isCompleted: false,
      dutyIds: [duty1.id, duty2.id]
    }

    const res = await jsonPost("/coins", newCoinPayload)
    expect(res.status).toBe(201)

    const data = await res.json()
    expect(data).toMatchObject({
      id: expect.any(String),
      name: newCoinPayload.name,
      isCompleted: newCoinPayload.isCompleted,
      duties: expect.arrayContaining([
        expect.objectContaining({ id: duty1.id, number: 1, description: "Heads" }),
        expect.objectContaining({ id: duty2.id, number: 2, description: "Tails" })
      ])
    })

    const relations = await db.select().from(coinsToDuties).where(eq(coinsToDuties.coinId, data.id))
    expect(relations).toHaveLength(2)
  })

  test("should return a 409 error if the coin name already exists", async () => {
    await jsonPost("/coins", { name: "Duplicate Coin" })

    const res = await jsonPost("/coins", { name: "Duplicate Coin" })
    expect(res.status).toBe(409)

    const data = await res.json()
    expect(data).toEqual({
      success: false,
      error: "COIN_ALREADY_EXISTS"
    })
  })

  test("should return a 400 error for malformed JSON request body", async () => {
    const res = await app.request("/coins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{ invalid-json: "
    })
    expect(res.status).toBe(400)

    const data = await res.json()
    expect(data).toEqual({
      success: false,
      error: "MALFORMED_JSON",
      details: "The request body could not be parsed as valid JSON."
    })
  })
})
