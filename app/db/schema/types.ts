import { z } from "zod"
import {
    CoinWithDutiesSchema,
    DutyWithCoinsSchema,
    insertCoinSchema,
    insertCoinWithDutiesSchema,
    patchCoinWithDutiesSchema,
    selectCoinSchema,
    selectDutySchema
} from "./index.ts";

export type Coin = z.infer<typeof selectCoinSchema>
export type CoinWithDuties = z.infer<typeof CoinWithDutiesSchema>

export type NewCoin = z.infer<typeof insertCoinSchema>
export type NewCoinWithDuties = z.infer<typeof insertCoinWithDutiesSchema>

export type Duty = z.infer<typeof selectDutySchema>
export type DutyWithCoins = z.infer<typeof DutyWithCoinsSchema>

export type PatchCoinWithDuties = z.infer<typeof patchCoinWithDutiesSchema>
