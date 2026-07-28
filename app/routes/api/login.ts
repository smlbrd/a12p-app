import { Hono } from "hono"
import { env } from "hono/adapter"
import { setCookie } from "hono/cookie"
import { sign } from "hono/jwt"
import { z } from "zod"

import { validate } from "../../middleware/validate.ts"

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

    if (username === "user" && password === "user123") {
        const token = await sign(
            {sub: "user-1", role: "user", username: "user"},
            JWT_SECRET
        )

        setCookie(c, "auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
            path: "/",
        })

        return c.redirect("/coins")
    }

    return c.text("Unauthorised: Invalid credentials", 401)
})

export default login