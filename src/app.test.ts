import { describe, test, expect, beforeEach } from 'vitest';
import app from "./app.ts";
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

describe("Global 404 Handler", () => {
    test("should return a 404 status for non-existent routes", async () => {
        const res = await app.request("/this-route-does-not-exist");

        expect(res.status).toBe(404);
    })
})

describe("GET /coins", () => {
    beforeEach(async () => {
        await db.delete(coins);
        await seedCoins();
    })

    test("should return an empty list if no coins exist", async () => {
        await db.delete(coins);

        const res = await app.request("/coins");

        expect(res.status).toBe(200);

        const data = await res.json();

        expect(data).toEqual([]);
    });

    test("should return a list of all coins", async () => {
        const res = await app.request("/coins")

        expect(res.status).toBe(200)

        const data = await res.json();

        expect(data).toHaveLength(coinsData.length);
        expect(data).toMatchObject(coinsData);
    })
})

const jsonPost = (path: string, body: unknown) =>
    app.request(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

describe("POST /coins", () => {
    beforeEach(async () => {
        await db.delete(coins)
    })

    test("should add a new coin", async () => {
        const newCoin = { name: "Testing.. Testing.. 1, 2, 3", isCompleted: false }
        const res  = await jsonPost("/coins", newCoin);

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

    test("should return a 409 error if the coin name already exists", async () => {
        await jsonPost("/coins", { name: "Duplicate Coin" })

        const res = await jsonPost("/coins", { name: "Duplicate Coin" })

        expect(res.status).toBe(409)

        const data = await res.json();

        expect(data).toEqual({
            success: false,
            error: "COIN_ALREADY_EXISTS"
        })
    })

    test("should return a 400 error if name is contains to characters", async () => {
        const res = await jsonPost("/coins", { name: "   ", isCompleted: false });

        expect(res.status).toBe(400);

        const data = await res.json();

        expect(data.success).toBe(false);
        expect(data.error.issues[0].path[0]).toBe("name");
        expect(data.error.issues[0].message).toBe("Name cannot be empty");
    });

    test("should return a 400 error if empty request", async () => {
        const invalidCoin = {}
        const res = await jsonPost("/coins", invalidCoin)

        expect(res.status).toBe(400)

        const data = await res.json();

        expect(data.success).toBe(false);
        expect(data.error.issues[0].path[0]).toBe("name");
        expect(data.error.issues[0].message).toBe("Invalid input: expected string, received undefined");
    })

    test("should return a 400 error if name is not a string", async () => {
        const res = await jsonPost("/coins", { name: 12345 });

        expect(res.status).toBe(400);

        const data = await res.json();

        expect(data.success).toBe(false);
        expect(data.error.issues[0].path[0]).toBe("name");
        expect(data.error.issues[0].message).toBe("Invalid input: expected string, received number");
    });

    test("should return a 400 error if isCompleted is not a boolean", async () => {
        const res = await jsonPost("/coins", { name: "Solana", isCompleted: "true" });

        expect(res.status).toBe(400);

        const data = await res.json();
        expect(data.success).toBe(false);
        expect(data.error.issues[0].path[0]).toBe("isCompleted");
    });

    test("should return a 400 error for malformed JSON request body", async () => {
        const res = await app.request("/coins", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: "{ invalid-json: "
        });

        expect(res.status).toBe(400);

        const data = await res.json();

        expect(data).toEqual({
            success: false,
            error: "MALFORMED_JSON",
            details: "The request body could not be parsed as valid JSON."
        });
    });
})