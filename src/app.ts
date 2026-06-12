import { Hono } from "hono"
import { HTTPException } from "hono/http-exception"
import { ZodError } from "zod"
import coinRoutes from "./routes/coinRoutes.ts"

const app = new Hono()

const isHttpException = (err: unknown): err is HTTPException =>
  err instanceof HTTPException || (err instanceof Error && "status" in err)

app.get("/health", (c) => c.body(null, 200))

app.route("/coins", coinRoutes)

app.onError((err, c) => {
  if (err instanceof HTTPException && err.message === "Malformed JSON in request body") {
    return c.json(
      {
        success: false,
        error: "MALFORMED_JSON",
        details: "The request body could not be parsed as valid JSON."
      },
      400
    )
  }

  if (err instanceof ZodError) {
    return c.json(
      {
        success: false,
        error: { issues: err.issues.map(({ path, message }) => ({ path, message })) }
      },
      400
    )
  }

  if (isHttpException(err)) {
    const toErrorKey = (msg: string) => msg.toUpperCase().replaceAll(/\s+/g, "_")
    return c.json({ success: false, error: toErrorKey(err.message) }, err.status)
  }

  console.error("[Server Error]", err)
  return c.json({ success: false, error: "INTERNAL_SERVER_ERROR" }, 500)
})

export default app
