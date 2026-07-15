import { createApp } from "honox/server"
import { errorHandler } from "./middleware/errorHandler.ts"
import { secureHeaders } from "hono/secure-headers"

const app = createApp()

app.use("*", secureHeaders())
app.onError(errorHandler)

export default app
