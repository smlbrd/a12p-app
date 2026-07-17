import { relations } from "drizzle-orm"
import { coins, coinsToDuties, duties } from "./index.ts";

export const coinsRelations = relations(coins, ({many}) => ({
    coinsToDuties: many(coinsToDuties)
}))

export const dutiesRelations = relations(duties, ({many}) => ({
    coinsToDuties: many(coinsToDuties)
}))

export const coinsToDutiesRelations = relations(coinsToDuties, ({one}) => ({
    coin: one(coins, {fields: [coinsToDuties.coinId], references: [coins.id]}),
    duty: one(duties, {fields: [coinsToDuties.dutyId], references: [duties.id]})
}))