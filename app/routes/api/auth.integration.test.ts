import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import app from "../../server.ts"
import { deleteData, seedData } from "../../db/seeds/seedData.ts"

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
        const res = await jsonReq("/auth/login", {username: "testuser", password: "Password123!"})

        expect(res.status).toBe(200)
        const body = await res.json()
        expect(body).toEqual({success: true, username: "testuser"})

        const setCookieHeader = res.headers.get("Set-Cookie")
        expect(setCookieHeader).toContain("auth_token=")
        expect(setCookieHeader).toContain("HttpOnly")
    })

    test.each([
        {fields: {username: "testuser"}, missingField: "password"},
        {fields: {password: "Password123!"}, missingField: "username"}
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
        {fields: {username: "unknown-user", password: "Password123!"}, scenario: "user does not exist"}
    ])("should return a 401 error when $scenario", async ({fields}) => {
        const res = await jsonReq("/auth/login", fields)
        expect(res.status).toBe(401)
        expect(await res.text()).toBe("Unauthorised: Invalid credentials")
    })
})
