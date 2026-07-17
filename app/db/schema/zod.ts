import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"
import { coins, coinsToDuties, duties } from "./index.ts";

export const selectCoinSchema = createSelectSchema(coins)
export const selectDutySchema = createSelectSchema(duties)
export const selectCoinsToDutiesSchema = createSelectSchema(coinsToDuties)

export const insertCoinSchema = createInsertSchema(coins, {
    name: z
        .string()
        .trim()
        .min(1, {error: "Name cannot be empty"})
        .max(255, {error: "Name cannot exceed 255 characters"})
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