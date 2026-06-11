import { pgTable, uuid, varchar, boolean } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const coins = pgTable("coins", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    isCompleted: boolean("is_completed").default(false).notNull(),
});

export const selectCoinSchema = createSelectSchema(coins);

export type Coin = z.infer<typeof selectCoinSchema>;