import { boolean, integer, pgSchema, text, uuid, varchar } from "drizzle-orm/pg-core"

export const coinsSchema = pgSchema("coins")

export const coins = coinsSchema.table("coins", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", {length: 255}).notNull().unique(),
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
            .references(() => coins.id, {onDelete: "cascade"}),
        dutyId: uuid("duty_id")
            .notNull()
            .references(() => duties.id, {onDelete: "cascade"})
    }
)