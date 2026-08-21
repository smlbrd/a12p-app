import { createApp } from "honox/server"
import { handle } from "hono/aws-lambda"
import { secureHeaders } from "hono/secure-headers"
import { serveStatic } from "@hono/node-server/serve-static"
import { optionalAuth } from "./middleware/auth.ts"
import { errorHandler } from "./middleware/errorHandler.ts"
import { requestLogger } from "./middleware/requestLogger.ts"

const app = createApp()

app.use("/static/*", serveStatic({root: "./"}))

app.use("*", secureHeaders(), optionalAuth)
app.use("*", requestLogger)
app.onError(errorHandler)

export const handler = handle(app)

export default app