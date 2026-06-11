import {Hono} from "hono"
import {insertCoinSchema} from "./db/schema.ts"
import {createCoin, getAllCoins} from "./services/coinService.ts"
import {zValidator} from "@hono/zod-validator"
import {HTTPException} from "hono/http-exception"
import {z, ZodError} from "zod"

const app = new Hono()

const isHttpException = (err: unknown): err is HTTPException =>
  err instanceof HTTPException || (err instanceof Error && "status" in err)

const validateJson = <T extends z.ZodTypeAny>(schema: T) =>
  zValidator("json", schema, (res) => {
    if (!res.success) throw res.error
  })

app.get("/health", (c) => c.body(null, 200))

app.get("/coins", async (c) => c.json(await getAllCoins()))

app.post("/coins", validateJson(insertCoinSchema), async (c) => {
  const validatedBody = c.req.valid("json")

  const newCoin = await createCoin(validatedBody)

  if (!newCoin) {
    throw new HTTPException(409, { message: "Coin already exists" })
  }

  return c.json(newCoin, 201)
})

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
