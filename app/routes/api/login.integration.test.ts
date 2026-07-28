import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import app from "../../server.ts"
import { deleteCoinsAndDuties, seedCoinsAndDuties } from "../../db/seeds/seedData.ts"

const postLogin = (fields: Record<string, string>) => {
    const formData = new FormData()
    Object.entries(fields).forEach(([key, value]) => formData.append(key, value))

    return app.request("/api/login", {
        method: "POST",
        body: formData,
    })
}

beforeEach(async () => {
    await deleteCoinsAndDuties()
    await seedCoinsAndDuties()
})

afterEach(() => {
    vi.restoreAllMocks()
})

describe("POST /login", () => {
    test("should authenticate standard user, set HttpOnly cookie, and redirect to /coins", async () => {
        const res = await postLogin({username: "user", password: "user123"})

        expect(res.status).toBe(302)
        expect(res.headers.get("Location")).toBe("/coins")

        const setCookieHeader = res.headers.get("Set-Cookie")
        expect(setCookieHeader).toContain("auth_token=")
        expect(setCookieHeader).toContain("HttpOnly")
    })

    test.each([
        {fields: {username: "user"}, missingField: "password"},
        {fields: {password: "user123"}, missingField: "username"},
    ])("should return 400 when missing $missingField", async ({fields}) => {
        const res = await postLogin(fields)

        expect(res.status).toBe(400)
        expect(await res.text()).toBe("Bad Request: Missing username or password")
    })

    test.each([
        {fields: {username: "user", password: "wrong-password"}, scenario: "password is incorrect"},
        {fields: {username: "unknown-user", password: "user123"}, scenario: "user does not exist"},
    ])("should return 401 when $scenario", async ({fields}) => {
        const res = await postLogin(fields)

        expect(res.status).toBe(401)
        expect(await res.text()).toBe("Unauthorised: Invalid credentials")
    })
})