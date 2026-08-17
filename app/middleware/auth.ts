import { createMiddleware } from "hono/factory"
import { getCookie } from "hono/cookie"
import { verify } from "hono/jwt"
import { env } from "hono/adapter"

export type UserRole = "user" | "admin"

export type AuthUser = {
    sub: string
    username: string
    role: UserRole
}

export type Env = {
    Variables: {
        user: AuthUser | null
        isLoggedIn: boolean
        isAdmin: boolean
    }
}

export const optionalAuth = createMiddleware<Env>(async (c, next) => {
    const token = getCookie(c, "auth_token")
    const {JWT_SECRET} = env<{ JWT_SECRET: string }>(c)

    if (token && JWT_SECRET) {
        try {
            const payload = (await verify(token, JWT_SECRET, "HS256")) as unknown as AuthUser
            c.set("user", payload)
            c.set("isLoggedIn", true)
            c.set("isAdmin", payload.role === "admin")
            return await next()
        } catch {
            console.error("Invalid or expired token")
        }
    }

    c.set("user", null)
    c.set("isLoggedIn", false)
    c.set("isAdmin", false)
    await next()
})

export const requireAuth = createMiddleware<Env>(async (c, next) => {
    const isLoggedIn = c.get("isLoggedIn")
    if (!isLoggedIn) {
        return c.json({success: false, error: "Unauthorised"}, 401)
    }
    await next()
})

export const requireAdmin = createMiddleware<Env>(async (c, next) => {
    const isLoggedIn = c.get("isLoggedIn")
    const isAdmin = c.get("isAdmin")

    if (!isLoggedIn) {
        return c.json({success: false, error: "Unauthorised"}, 401)
    }

    if (!isAdmin) {
        return c.json({success: false, error: "Forbidden: Admin access required"}, 403)
    }

    await next()
})