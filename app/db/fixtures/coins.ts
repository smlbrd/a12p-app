import { DUTY_IDS } from "./duties.ts"

export const COIN_IDS = {
    ASSEMBLE: "e3a1b2c3-4d5e-4f7a-8b9c-0d1e2f3a4b5c",
    AUTOMATE: "fa1b2c3d-4e5f-4a7b-8c9d-0e1f2a3b4c5d",
    CALL_SECURITY: "b2c3d4e5-6f7a-4b9c-8d1e-2f3a4b5c6d7e",
    GOING_DEEPER: "c3d4e5f6-7a8b-4c0d-8e2f-3a4b5c6d7e8f",
    HOUSTON: "d4e5f6a7-8b9c-4d1e-8f3a-4b5c6d7e8f9a",
} as const

export const coinsData = [
    {id: COIN_IDS.ASSEMBLE, name: "Assemble", isCompleted: false},
    {id: COIN_IDS.AUTOMATE, name: "Automate", isCompleted: false},
    {id: COIN_IDS.CALL_SECURITY, name: "Call Security", isCompleted: false},
    {id: COIN_IDS.GOING_DEEPER, name: "Going Deeper", isCompleted: false},
    {id: COIN_IDS.HOUSTON, name: "Houston, Prepare to Launch", isCompleted: false}
]

export const linksData = [
    {coinId: COIN_IDS.ASSEMBLE, dutyId: DUTY_IDS.D8},
    {coinId: COIN_IDS.AUTOMATE, dutyId: DUTY_IDS.D5},
    {coinId: COIN_IDS.AUTOMATE, dutyId: DUTY_IDS.D7},
    {coinId: COIN_IDS.AUTOMATE, dutyId: DUTY_IDS.D10},
    {coinId: COIN_IDS.CALL_SECURITY, dutyId: DUTY_IDS.D9},
    {coinId: COIN_IDS.GOING_DEEPER, dutyId: DUTY_IDS.D11},
    {coinId: COIN_IDS.HOUSTON, dutyId: DUTY_IDS.D5},
    {coinId: COIN_IDS.HOUSTON, dutyId: DUTY_IDS.D7},
    {coinId: COIN_IDS.HOUSTON, dutyId: DUTY_IDS.D10}
]