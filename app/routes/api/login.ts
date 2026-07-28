import { verify } from "@node-rs/argon2"
import { eq } from "drizzle-orm"
import { Hono } from "hono"
import { env } from "hono/adapter"
import { setCookie } from "hono/cookie"
import { sign } from "hono/jwt"
import { z } from "zod"
import { db } from "../../db/db.ts"
import { validate } from "../../middleware/validate.ts"
import { users } from "../../db/schema/index.ts"

const login = new Hono()

const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required")
})

type LoginInput = z.infer<typeof loginSchema>

login.post("/", validate("form", loginSchema), async (c) => {
    const {username, password} = c.req.valid("form")
    const {JWT_SECRET} = env<{ JWT_SECRET: string }>(c)

    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET environment variable is missing.")
    }

    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.username, username))
        .limit(1)

    if (user && (await verify(user.passwordHash, password))) {
        const token = await sign(
            {sub: user.id, role: user.role, username: user.username},
            JWT_SECRET
        )

        setCookie(c, "auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
            path: "/"
        })

        return c.redirect("/coins")
    }

    return c.text("Unauthorised: Invalid credentials", 401)
})

export default login