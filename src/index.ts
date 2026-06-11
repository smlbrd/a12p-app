import { serve } from '@hono/node-server'
import { Hono } from "hono";
import { db } from "./db/db.ts";
import { coins } from "./db/schema.ts";

const app = new Hono();

app.get("/health", () => {
    return new Response
})

app.get("/coins", async (c) => {
    const allCoins = await db.select().from(coins);
    return c.json(allCoins, 200);
})

serve({
    fetch: app.fetch,
    port: 8000
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
})

export default app;