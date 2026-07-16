import { boolean, integer, pgSchema, primaryKey, text, uuid, varchar } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

export const coinsSchema = pgSchema("coins")

export const coins = coinsSchema.table("coins", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  isCompleted: boolean("is_completed").default(false).notNull()
})

export const duties = coinsSchema.table("duties", {
  id: uuid("id").primaryKey().defaultRandom(),
  number: integer("number").notNull().unique(),
  description: text("description").notNull()
})

export const coinsToDuties = coinsSchema.table(
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
export const selectDutySchema = createSelectSchema(duties)
export const selectCoinsToDutiesSchema = createSelectSchema(coinsToDuties)

export const insertCoinSchema = createInsertSchema(coins, {
  name: z
    .string()
    .trim()
    .min(1, { error: "Name cannot be empty" })
    .max(255, { error: "Name cannot exceed 255 characters" })
    .regex(/^[a-zA-Z0-9 ,.!]+$/, {
      error: "Please use valid characters only: a-z A-Z 0-9 , . !"
    })
})

export const insertCoinWithDutiesSchema = insertCoinSchema.extend({
  dutyIds: z.array(z.uuid()).optional()
})

export const CoinWithDutiesSchema = selectCoinSchema.extend({
  duties: z.array(selectDutySchema)
})

export const patchCoinWithDutiesSchema = insertCoinWithDutiesSchema.partial()

export const DutyWithCoinsSchema = selectDutySchema.extend({
  coins: z.array(selectCoinSchema)
})

export type Coin = z.infer<typeof selectCoinSchema>
export type NewCoin = z.infer<typeof insertCoinSchema>
export type NewCoinWithDuties = z.infer<typeof insertCoinWithDutiesSchema>
export type Duty = z.infer<typeof selectDutySchema>
export type CoinWithDuties = z.infer<typeof CoinWithDutiesSchema>
export type PatchCoinWithDuties = z.infer<typeof patchCoinWithDutiesSchema>
export type DutyWithCoins = z.infer<typeof DutyWithCoinsSchema>
