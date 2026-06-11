import { describe, test, expect, beforeEach } from 'vitest';
import app from "./index.ts";
import { db } from "./db/db.ts";
import { coins } from "./db/schema.ts";
import { seedCoins, coinsData } from "./seeds/coins.ts"
import { eq } from "drizzle-orm";

describe("/health", () => {
    test("should return a 200 status", async () => {
        const res = await app.request("/health")

        expect(res.status).toBe(200)
    })
})

describe("GET /coins", () => {
    beforeEach(async () => {
        await db.delete(coins);

        await seedCoins();
    })

    test("should return a list of all coins", async () => {
        const res = await app.request("/coins")

        expect(res.status).toBe(200)

        const data = await res.json();
        expect(data).toEqual(coinsData);
    })
})

describe("POST /coins", () => {
    beforeEach(async () => {
        await db.delete(coins)
    })

    test("should add a new coin", async () => {
        const newCoin = { name: "Testing.. Testing.. 1, 2, 3", isCompleted: false }

        const res = await app.request("/coins", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newCoin)
        });

        expect(res.status).toBe(201)

        const data = await res.json();
        expect(data).toMatchObject({
            id: expect.any(String),
            ...newCoin
        });

        const [dbCoin] = await db
            .select()
            .from(coins)
            .where(eq(coins.id, data.id))
            .limit(1);

        expect(dbCoin).toMatchObject({
            id: expect.any(String),
            ...newCoin
        });
    })

    // validation - fails if no name in body
})