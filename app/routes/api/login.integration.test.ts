import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import app from "../../server.ts"
import { deleteCoinsAndDuties, seedCoinsAndDuties } from "../../db/seeds/seedData.ts"

beforeEach(async () => {
    await deleteCoinsAndDuties()
    await seedCoinsAndDuties()
})

afterEach(() => {
    vi.restoreAllMocks()
})

describe("POST /login", () => {
    test("should authenticate standard user, set HttpOnly cookie, and redirect to /coins", async () => {
        const formData = new FormData()
        formData.append("username", "user")
        formData.append("password", "user123")

        const res = await app.request("/api/login", {
            method: "POST",
            body: formData
        })

        expect(res.status).toBe(302)
        expect(res.headers.get("Location")).toBe("/coins")

        const setCookieHeader = res.headers.get("Set-Cookie")
        expect(setCookieHeader).toContain("auth_token=")
        expect(setCookieHeader).toContain("HttpOnly")
    })
})