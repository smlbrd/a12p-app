import { Hono } from "hono"
import { db } from "../../db/db.ts"
import { getAllDutiesWithCoins } from "../../services/dutyService.ts"

const duties = new Hono()

duties.get("/", async (c) => {
  return c.json(await getAllDutiesWithCoins(db))
})

export default duties
