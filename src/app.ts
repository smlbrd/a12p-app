import { Hono } from "hono";
import { db } from "./db/db.ts";
import { coins, insertCoinSchema } from "./db/schema.ts";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";

const app = new Hono();

app.get("/health", (c) => {
    return c.body(null, 200);
})

app.get("/coins", async (c) => {
    const allCoins = await db.select().from(coins);
    return c.json(allCoins, 200);
})

app.post("/coins", zValidator("json", insertCoinSchema, (result, c) => {
        if (!result.success) {
            return c.json({
                success: false,
                error: {
                    issues: result.error.issues.map((iss) => ({
                        path: iss.path,
                        message: iss.message
                    }))
                }
            }, 400);
        }
    }),
    async (c) => {
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

app.onError((err, c) => {
    const isRawSyntaxError = err.name === 'SyntaxError' && err.message.includes('JSON');
    const isHonoJsonError = err instanceof HTTPException && err.message === 'Malformed JSON in request body';

    if (isRawSyntaxError || isHonoJsonError) {
        return c.json({
            success: false,
            error: "MALFORMED_JSON",
            details: "The request body could not be parsed as valid JSON."
        }, 400);
    }

    if (err instanceof HTTPException && err.cause instanceof ZodError) {
        return c.json({
            success: false,
            error: "VALIDATION_FAILED",
            details: err.cause.flatten().fieldErrors,
        }, 400);
    }

    console.error(`[Server Error]: ${err.stack || err.message}`);
    return c.json({
        success: false,
        error: "INTERNAL_SERVER_ERROR"
    }, 500);
});

export default app;