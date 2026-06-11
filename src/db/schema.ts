import { boolean, pgTable, uuid, varchar } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

export const coins = pgTable("coins", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  isCompleted: boolean("is_completed").default(false).notNull()
})

export const selectCoinSchema = createSelectSchema(coins)
export type Coin = z.infer<typeof selectCoinSchema>

export const insertCoinSchema = createInsertSchema(coins, {
  name: z.string().trim().min(1, { message: "Name cannot be empty" })
})
export type NewCoin = z.infer<typeof insertCoinSchema>
