import { describe, test, expect } from 'vitest';
import app from "./index.ts";

describe("/health", () => {
    test("should return a 200 status", async () => {
        const res = await app.request("/health")

        expect(res.status).toBe(200)
    })
})