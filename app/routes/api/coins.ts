import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { HTTPException } from "hono/http-exception"
import { z } from "zod"
import { insertCoinWithDutiesSchema, patchCoinWithDutiesSchema } from "../../db/schema.ts"
import {
  createCoin,
  deleteCoin,
  getAllCoinsWithDuties,
  getCoinWithDuties,
  updateCoin
} from "../../services/coinService.ts"
import { db } from "../../db/db.ts"

const coins = new Hono()

const validateJson = <T extends z.ZodTypeAny>(schema: T) =>
  zValidator("json", schema, (res) => {
    if (!res.success) throw res.error
  })

coins.get("/", async (c) => c.json(await getAllCoinsWithDuties(db)))

coins.get("/:id", async (c) => {
  const id = c.req.param("id")
  const coinWithDuties = await getCoinWithDuties(db, id)

  if (!coinWithDuties) {
    return c.json({ success: false, error: "COIN_NOT_FOUND" }, 404)
  }

  return c.json(coinWithDuties, 200)
})

coins.post("/", validateJson(insertCoinWithDutiesSchema), async (c) => {
  const validatedBody = c.req.valid("json")
  const newCoinWithDuties = await createCoin(validatedBody)

  if (!newCoinWithDuties) {
    throw new HTTPException(409, { message: "Coin already exists" })
  }

  return c.json(newCoinWithDuties, 201)
})

coins.patch("/:id", validateJson(patchCoinWithDutiesSchema), async (c) => {
  const id = c.req.param("id")
  const validatedBody = c.req.valid("json")

  const updatedCoinWithDuties = await updateCoin(id, validatedBody)

  if (!updatedCoinWithDuties) {
    return c.json({ success: false, error: "COIN_NOT_FOUND" }, 404)
  }

  return c.json(updatedCoinWithDuties, 200)
})

coins.delete("/:id", zValidator("param", z.object({ id: z.uuid() })), async (c) => {
  const { id } = c.req.valid("param")

  const isCoinDeleted: boolean = await deleteCoin(id)

  if (!isCoinDeleted) {
    return c.json({ success: false, error: "COIN_NOT_FOUND" }, 404)
  }

  return c.body(null, 204)
})

export default coins
