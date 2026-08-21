import type { MiddlewareHandler } from "hono"
import { db } from "../db/db.ts"
import { requestLogs } from "../db/schema/tables.ts"

export const requestLogger: MiddlewareHandler = async (c, next) => {
    await next()

    const user = c.get("user")
    const userId = user?.sub ?? null

    try {
        await db.insert(requestLogs).values({
            method: c.req.method,
            path: c.req.path,
            statusCode: c.res.status,
            userId: userId,
        })
    } catch (error) {
        console.error("Failed to persist request log:", error)
    }
}