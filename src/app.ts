import { Hono } from "hono";

const app = new Hono();

app.get("/health", (c) => {
    return c.json( 200)
})

export default app;