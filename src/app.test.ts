import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import app from "./app.ts"
import { db } from "./db/db.ts"
import { coins } from "./db/schema.ts"
import { coinsData, seedCoins } from "./seeds/coins.ts"
import { eq } from "drizzle-orm"

const jsonPost = (path: string, body: unknown) =>
  app.request(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  })

afterEach(() => {
  vi.restoreAllMocks()
})

describe("/health", () => {
  test("should return a 200 status", async () => {
    const res = await app.request("/health")
    expect(res.status).toBe(200)
  })
})

describe("Global 404 Handler", () => {
  test("should return a 404 status for non-existent routes", async () => {
    const res = await app.request("/this-route-does-not-exist")
    expect(res.status).toBe(404)
  })
})

describe("GET /coins", () => {
  beforeEach(async () => {
    await db.delete(coins)
    await seedCoins()
  })

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

describe("POST /coins", () => {
  beforeEach(async () => {
    await db.delete(coins)
  })

  test("should add a new coin", async () => {
    const newCoin = { name: "Testing.. Testing.. 1, 2, 3", isCompleted: false }
    const res = await jsonPost("/coins", newCoin)

    expect(res.status).toBe(201)

    const data = await res.json()
    expect(data).toMatchObject({
      id: expect.any(String),
      ...newCoin
    })

    const [dbCoin] = await db.select().from(coins).where(eq(coins.id, data.id)).limit(1)

    expect(dbCoin).toMatchObject({
      id: expect.any(String),
      ...newCoin
    })
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

  test.each([
    {
      reason: "name contains only whitespace",
      payload: { name: "   ", isCompleted: false },
      expectedPath: "name",
      expectedMessage: "Name cannot be empty"
    },
    {
      reason: "the request body is empty",
      payload: {},
      expectedPath: "name",
      expectedMessage: "Invalid input: expected string, received undefined"
    },
    {
      reason: "name is not a string",
      payload: { name: 12345 },
      expectedPath: "name",
      expectedMessage: "Invalid input: expected string, received number"
    },
    {
      reason: "isCompleted is not a boolean",
      payload: { name: "Testing.. Testing.. 1, 2, 3", isCompleted: "true" },
      expectedPath: "isCompleted"
    }
  ])("should return a 400 error if $reason", async ({ payload, expectedPath, expectedMessage }) => {
    const res = await jsonPost("/coins", payload)
    expect(res.status).toBe(400)

    const data = await res.json()

    expect(data.success).toBe(false)
    expect(data.error.issues[0].path[0]).toBe(expectedPath)

    if (expectedMessage) {
      expect(data.error.issues[0].message).toBe(expectedMessage)
    }
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
