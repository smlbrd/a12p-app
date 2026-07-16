import { createApp } from "honox/server"
import { errorHandler } from "./middleware/errorHandler.ts"
import { secureHeaders } from "hono/secure-headers"
import { handle } from "hono/aws-lambda"
import { serveStatic } from "@hono/node-server/serve-static"

const app = createApp()

app.use("*", secureHeaders())
app.onError(errorHandler)

app.use("/static/*", serveStatic({ root: "./" }))

export const handler = handle(app)

export default app
