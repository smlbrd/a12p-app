import { boolean, integer, pgSchema, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core"

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

export const roleEnum = coinsSchema.enum("role", ["user", "admin"])

export const users = coinsSchema.table("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    username: varchar("username", {length: 255}).notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    role: roleEnum("role").default("user").notNull(),
})

export const requestLogs = coinsSchema.table("request_logs", {
    id: uuid("id").primaryKey().defaultRandom(),
    method: varchar("method", {length: 10}).notNull(),
    path: text("path").notNull(),
    statusCode: integer("status_code").notNull(),
    userId: uuid("user_id").references(() => users.id, {onDelete: "set null"}),
    timestamp: timestamp("timestamp", {withTimezone: true}).defaultNow().notNull(),
})