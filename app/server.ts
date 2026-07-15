import { createApp } from "honox/server"
import { errorHandler } from "./middleware/errorHandler.ts"
import { secureHeaders } from "hono/secure-headers"
import { handle } from "hono/aws-lambda"

const app = createApp()

app.use("*", secureHeaders())
app.onError(errorHandler)

export const handler = handle(app)

export default app
