import { serve } from '@hono/node-server'
import { Hono } from "hono";
import { db } from "./db/db.ts";
import { coins, insertCoinSchema } from "./db/schema.ts";
import { zValidator } from "@hono/zod-validator";

const app = new Hono();

app.get("/health", (c) => {
    return c.body(null, 200);
})

app.get("/coins", async (c) => {
    const allCoins = await db.select().from(coins);
    return c.json(allCoins, 200);
})

app.post("/coins", zValidator("json", insertCoinSchema), async (c) => {
    const validatedData = c.req.valid("json");

    const [newCoin] = await db
        .insert(coins)
        .values({
            name: validatedData.name,
            isCompleted: validatedData.isCompleted,
        })
        .returning();

    return c.json(newCoin, 201)
})

serve({
    fetch: app.fetch,
    port: 8000
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
})

export default app;