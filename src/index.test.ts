import { describe, test, expect, beforeEach } from 'vitest';
import app from "./index.ts";
import { db } from "./db/db.ts";
import { coins } from "./db/schema.ts";
import { seedCoins, coinsData } from "./seeds/coins.ts"

describe("/health", () => {
    test("should return a 200 status", async () => {
        const res = await app.request("/health")

        expect(res.status).toBe(200)
    })
})

describe("/coins", () => {
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