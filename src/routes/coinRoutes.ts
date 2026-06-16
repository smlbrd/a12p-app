import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { HTTPException } from "hono/http-exception"
import { z } from "zod"
import { insertCoinWithDutiesSchema } from "../db/schema.ts"
import { createCoin, getAllCoins, getCoinWithDuties } from "../services/coinService.ts"

const coinRoutes = new Hono()

const validateJson = <T extends z.ZodTypeAny>(schema: T) =>
  zValidator("json", schema, (res) => {
    if (!res.success) throw res.error
  })

coinRoutes.get("/", async (c) => c.json(await getAllCoins()))

coinRoutes.get("/:id", async (c) => {
  const id = c.req.param("id")
  const coinWithDuties = await getCoinWithDuties(id)

  if (!coinWithDuties) {
    return c.json({ success: false, error: "COIN_NOT_FOUND" }, 404)
  }

  return c.json(coinWithDuties, 200)
})

coinRoutes.post("/", validateJson(insertCoinWithDutiesSchema), async (c) => {
  const validatedBody = c.req.valid("json")
  const newCoinWithDuties = await createCoin(validatedBody)

  if (!newCoinWithDuties) {
    throw new HTTPException(409, { message: "Coin already exists" })
  }

  return c.json(newCoinWithDuties, 201)
})

export default coinRoutes
