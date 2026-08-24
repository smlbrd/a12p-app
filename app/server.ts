import { createApp } from "honox/server"
import { handle } from "hono/aws-lambda"
import { serveStatic } from "@hono/node-server/serve-static"
import { optionalAuth } from "./middleware/auth.ts"
import { errorHandler } from "./middleware/errorHandler.ts"
import { requestLogger } from "./middleware/requestLogger.ts"
import { secureHeaders } from "./middleware/secureHeaders.ts"

const app = createApp({
    init(app) {
        app.use("*", requestLogger)
        app.use("/static/*", serveStatic({root: "./"}))
        app.use("*", secureHeaders(), optionalAuth)
    }
})

app.onError(errorHandler)

export const handler = handle(app)

export default app