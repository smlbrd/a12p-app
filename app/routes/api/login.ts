import { Hono } from "hono"
import { env } from "hono/adapter"
import { setCookie } from "hono/cookie"
import { sign } from "hono/jwt"

const login = new Hono()

login.post("/", async (c) => {
    const {JWT_SECRET = "fallback-test-secret"} = env<{ JWT_SECRET: string }>(c)

    const body = await c.req.parseBody()

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

    return c.text("Unauthorized", 401)
})

export default login