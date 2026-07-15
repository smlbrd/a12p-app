import { Hono } from "hono"

const app = new Hono()

app.get("/health", (c) => c.body(null, 200))

export default app
