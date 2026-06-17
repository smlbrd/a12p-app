import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { HTTPException } from "hono/http-exception"
import { z } from "zod"
import { insertCoinWithDutiesSchema, patchCoinWithDutiesSchema } from "../db/schema.ts"
import { createCoin, getAllCoins, getCoinWithDuties, updateCoin } from "../services/coinService.ts"
import { db } from "../db/db.ts"

const coinRoutes = new Hono()

const validateJson = <T extends z.ZodTypeAny>(schema: T) =>
  zValidator("json", schema, (res) => {
    if (!res.success) throw res.error
  })

coinRoutes.get("/", async (c) => c.json(await getAllCoins()))

coinRoutes.get("/:id", async (c) => {
  const id = c.req.param("id")
  const coinWithDuties = await getCoinWithDuties(db, id)

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

coinRoutes.patch("/:id", validateJson(patchCoinWithDutiesSchema), async (c) => {
  const id = c.req.param("id")
  const validatedBody = c.req.valid("json")

  const updatedCoinWithDuties = await updateCoin(id, validatedBody)

  if (!updatedCoinWithDuties) {
    return c.json({ success: false, error: "COIN_NOT_FOUND" }, 404)
  }

  return c.json(updatedCoinWithDuties, 200)
})

export default coinRoutes
