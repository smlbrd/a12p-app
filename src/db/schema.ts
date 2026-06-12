import { boolean, integer, pgTable, primaryKey, text, uuid, varchar } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

export const coins = pgTable("coins", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  isCompleted: boolean("is_completed").default(false).notNull()
})

export const duties = pgTable("duties", {
  id: uuid("id").primaryKey().defaultRandom(),
  number: integer("number").notNull().unique(),
  description: text("description").notNull()
})

export const coinsToDuties = pgTable(
  "coins_to_duties",
  {
    coinId: uuid("coin_id")
      .notNull()
      .references(() => coins.id, { onDelete: "cascade" }),
    dutyId: uuid("duty_id")
      .notNull()
      .references(() => duties.id, { onDelete: "cascade" })
  },
  (t) => [primaryKey({ columns: [t.coinId, t.dutyId] })]
)

export const coinsRelations = relations(coins, ({ many }) => ({
  coinsToDuties: many(coinsToDuties)
}))

export const dutiesRelations = relations(duties, ({ many }) => ({
  coinsToDuties: many(coinsToDuties)
}))

export const coinsToDutiesRelations = relations(coinsToDuties, ({ one }) => ({
  coin: one(coins, { fields: [coinsToDuties.coinId], references: [coins.id] }),
  duty: one(duties, { fields: [coinsToDuties.dutyId], references: [duties.id] })
}))

export const selectCoinSchema = createSelectSchema(coins)
export const insertCoinSchema = createInsertSchema(coins, {
  name: z
    .string()
    .trim()
    .min(1, { message: "Name cannot be empty" })
    .max(255, { message: "Name cannot exceed 255 characters" })
    .regex(/^[a-zA-Z0-9 ,.!]+$/, {
      message: "Please use valid characters only: a-z A-Z 0-9 , . !"
    })
})

export const selectDutySchema = createSelectSchema(duties)

export const coinWithDutiesSchema = selectCoinSchema.extend({
  duties: z.array(selectDutySchema)
})

export type Coin = z.infer<typeof selectCoinSchema>
export type NewCoin = z.infer<typeof insertCoinSchema>
export type Duty = z.infer<typeof selectDutySchema>
export type CoinWithDuties = z.infer<typeof coinWithDutiesSchema>
