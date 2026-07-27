import { Hono } from "hono"
import { env } from "hono/adapter"
import { setCookie } from "hono/cookie"
import { sign } from "hono/jwt"
import { z } from "zod"

const login = new Hono()

const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required")
})

login.post("/", async (c) => {
    const {JWT_SECRET = "fallback-test-secret"} = env<{ JWT_SECRET: string }>(c)

    const body = await c.req.parseBody()
    const username = body.username
    const password = body.password

    if (!username || !password) {
        return c.text("Bad Request: Missing username or password", 400)
    }

    if (body.username === "user" && body.password === "user123") {
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
})

export default login