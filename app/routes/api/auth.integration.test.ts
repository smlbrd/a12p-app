import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { decode } from "hono/jwt"
import app from "../../server.ts"
import { deleteData, seedData } from "../../db/seed.ts"
import { SESSION_DURATION_SECONDS } from "./auth.ts"

const jsonReq = (path: string, body: Record<string, unknown>) => {
    return app.request(`/api${path}`, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    })
}

beforeEach(async () => {
    await deleteData()
    await seedData()
})

afterEach(() => {
    vi.restoreAllMocks()
})

describe("POST /api/auth/login", () => {
    test("should authenticate standard user, set HttpOnly cookie, and return success JSON", async () => {
        const res = await jsonReq("/auth/login", {username: "testuser", password: "Doubloon1!"})

        expect(res.status).toBe(200)
        const body = await res.json()
        expect(body).toEqual({success: true, username: "testuser"})

        const setCookieHeader = res.headers.get("Set-Cookie")
        expect(setCookieHeader).toContain("auth_token=")
        expect(setCookieHeader).toContain("HttpOnly")
        expect(setCookieHeader).toContain(`Max-Age=${SESSION_DURATION_SECONDS}`)
    })

    test("should issue a JWT with an expiry claim set to SESSION_DURATION_SECONDS from now", async () => {
        const beforeLogin = Math.floor(Date.now() / 1000)
        const res = await jsonReq("/auth/login", {username: "testuser", password: "Doubloon1!"})
        const afterLogin = Math.floor(Date.now() / 1000)

        const setCookieHeader = res.headers.get("Set-Cookie")
        const token = setCookieHeader?.match(/auth_token=([^;]+)/)?.[1]
        expect(token).toBeDefined()

        const {payload} = decode(token!)
        expect(payload.exp).toBeTypeOf("number")
        expect(payload.exp as number).toBeGreaterThanOrEqual(beforeLogin + SESSION_DURATION_SECONDS)
        expect(payload.exp as number).toBeLessThanOrEqual(afterLogin + SESSION_DURATION_SECONDS)
    })

    test.each([
        {fields: {username: "testuser"}, missingField: "password"},
        {fields: {password: "Doubloon1!"}, missingField: "username"}
    ])("should return a 400 error when missing $missingField", async ({fields, missingField}) => {
        const res = await jsonReq("/auth/login", fields)
        expect(res.status).toBe(400)

        const body = await res.json()
        expect(body).toEqual({
            success: false,
            error: {
                issues: [
                    expect.objectContaining({
                        path: [missingField]
                    })
                ]
            }
        })
    })

    test.each([
        {fields: {username: "testuser", password: "wrong-password"}, scenario: "password is incorrect"},
        {fields: {username: "unknown-user", password: "Doubloon1!"}, scenario: "user does not exist"}
    ])("should return a 401 error when $scenario", async ({fields}) => {
        const res = await jsonReq("/auth/login", fields)
        expect(res.status).toBe(401)
        expect(await res.text()).toBe("Unauthorised: Invalid credentials")
    })
})
