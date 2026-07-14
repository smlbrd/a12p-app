import { Hono } from "hono"
import coinRoutes from "./routes/coinRoutes.ts"
import { errorHandler } from "./middleware/errorHandler.ts"

const app = new Hono()

app.get("/health", (c) => c.body(null, 200))

app.route("/coins", coinRoutes)

app.onError(errorHandler)

export default app
