import { verify } from "@node-rs/argon2"
import { and, eq, gt } from "drizzle-orm"
import { Hono } from "hono"
import { env } from "hono/adapter"
import { deleteCookie, setCookie } from "hono/cookie"
import { sign } from "hono/jwt"
import { z } from "zod"
import { db } from "../../db/db.ts"
import { validate } from "../../middleware/validate.ts"
import { loginAttempts, users } from "../../db/schema/index.ts"

const auth = new Hono()

const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required")
})

// How long an issued session token remains valid, in seconds.
export const SESSION_DURATION_SECONDS = 60 * 60 * 2 // 2 hours

auth.post("/login", validate("json", loginSchema), async (c) => {
    const {username, password} = c.req.valid("json")
    const {JWT_SECRET, NODE_ENV} = env<{ JWT_SECRET: string; NODE_ENV: string }>(c)

    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET environment variable is missing.")
    }

    const oneMinuteAgo = new Date(Date.now() - 60 * 1000)
    const recentAttempts = await db
        .select()
        .from(loginAttempts)
        .where(
            and(
                eq(loginAttempts.username, username),
                gt(loginAttempts.createdAt, oneMinuteAgo)
            )
        )

    if (recentAttempts.length >= 5) {
        return c.text("Too many attempts - please try again later", 429)
    }

    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.username, username))
        .limit(1)

    if (user && (await verify(user.passwordHash, password))) {
        const token = await sign(
            {
                sub: user.id,
                role: user.role,
                username: user.username,
                exp: Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS
            },
            JWT_SECRET
        )

        setCookie(c, "auth_token", token, {
            httpOnly: true,
            secure: NODE_ENV === "production",
            sameSite: "Lax",
            path: "/",
            maxAge: SESSION_DURATION_SECONDS
        })

        await db.delete(loginAttempts).where(eq(loginAttempts.username, username))

        return c.json({success: true, username: user.username})
    }

    if (user) {
        await db.insert(loginAttempts).values({
            username: username
        })
    }

    return c.text("Unauthorised: Invalid credentials", 401)
})

auth.post("/logout", (c) => {
    deleteCookie(c, "auth_token")
    return c.redirect("/coins", 303)
})

export default auth
