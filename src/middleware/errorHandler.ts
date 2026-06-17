import { type ErrorHandler } from "hono"
import { HTTPException } from "hono/http-exception"
import { ZodError } from "zod"

const isHttpException = (err: unknown): err is HTTPException =>
  err instanceof HTTPException || (err instanceof Error && "status" in err)

export const errorHandler: ErrorHandler = (err, c) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pgCause = (err as any).cause

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

  if (pgCause?.code === "23503") {
    return c.json({ success: false, error: "RESOURCE_NOT_FOUND" }, 404)
  }

  if (isHttpException(err)) {
    const toErrorKey = (msg: string) => msg.toUpperCase().replaceAll(/\s+/g, "_")
    return c.json({ success: false, error: toErrorKey(err.message) }, err.status)
  }

  console.error("[Server Error]", err)
  return c.json({ success: false, error: "INTERNAL_SERVER_ERROR" }, 500)
}
