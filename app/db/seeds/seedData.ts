import { db } from "../db.ts"
import { coins, coinsToDuties, duties } from "../schema.ts"

export const COIN_IDS = {
  ASSEMBLE: "e3a1b2c3-4d5e-6f7a-8b9c-0d1e2f3a4b5c",
  AUTOMATE: "fa1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d",
  CALL_SECURITY: "b2c3d4e5-6f7a-8b9c-0d1e-2f3a4b5c6d7e",
  GOING_DEEPER: "c3d4e5f6-7a8b-9c0d-1e2f-3a4b5c6d7e8f",
  HOUSTON: "d4e5f6a7-8b9c-0d1e-2f3a-4b5c6d7e8f9a"
} as const

export const DUTY_IDS = {
  D5: "55555555-5555-5555-5555-555555555555",
  D7: "77777777-7777-7777-7777-777777777777",
  D8: "88888888-8888-8888-8888-888888888888",
  D9: "99999999-9999-9999-9999-999999999999",
  D10: "10101010-1010-1010-1010-101010101010",
  D11: "11111111-1111-1111-1111-111111111111"
} as const

export const coinsData = [
  { id: COIN_IDS.ASSEMBLE, name: "Assemble", isCompleted: false },
  { id: COIN_IDS.AUTOMATE, name: "Automate", isCompleted: false },
  { id: COIN_IDS.CALL_SECURITY, name: "Call Security", isCompleted: false },
  { id: COIN_IDS.GOING_DEEPER, name: "Going Deeper", isCompleted: false },
  { id: COIN_IDS.HOUSTON, name: "Houston, Prepare to Launch", isCompleted: false }
]

export const dutiesData = [
  {
    id: DUTY_IDS.D5,
    number: 5,
    description:
      "Build and operate a Continuous Integration (CI) capability, employing version control of source code and related artefacts"
  },
  {
    id: DUTY_IDS.D7,
    number: 7,
    description:
      "Provision cloud infrastructure using APIs, continually improve infrastructure-as-code, considering use of industry leading technologies as they become available (e.g. Serverless, Containers)"
  },
  {
    id: DUTY_IDS.D8,
    number: 8,
    description:
      "Evolve and define architecture, utilising the knowledge and experience of the team to design in an optimal user experience, scalability, security, high availability and optimal performance"
  },
  {
    id: DUTY_IDS.D9,
    number: 9,
    description: "Apply leading security practices throughout the Software Development Lifecycle (SDLC)"
  },
  {
    id: DUTY_IDS.D10,
    number: 10,
    description:
      "Implement a good coverage of monitoring (metrics, logs), ensuring that alerts are visible, tuneable and actionable"
  },
  {
    id: DUTY_IDS.D11,
    number: 11,
    description:
      "Keep up with cutting edge by committing to continual training and development - utilise web resources for self-learning; horizon scanning; active membership of professional bodies such as Meetup Groups; subscribe to relevant publications"
  }
]

export const linksData = [
  { coinId: COIN_IDS.ASSEMBLE, dutyId: DUTY_IDS.D8 },
  { coinId: COIN_IDS.AUTOMATE, dutyId: DUTY_IDS.D5 },
  { coinId: COIN_IDS.AUTOMATE, dutyId: DUTY_IDS.D7 },
  { coinId: COIN_IDS.AUTOMATE, dutyId: DUTY_IDS.D10 },
  { coinId: COIN_IDS.CALL_SECURITY, dutyId: DUTY_IDS.D9 },
  { coinId: COIN_IDS.GOING_DEEPER, dutyId: DUTY_IDS.D11 },
  { coinId: COIN_IDS.HOUSTON, dutyId: DUTY_IDS.D5 },
  { coinId: COIN_IDS.HOUSTON, dutyId: DUTY_IDS.D7 },
  { coinId: COIN_IDS.HOUSTON, dutyId: DUTY_IDS.D10 }
]

export async function seedCoinsAndDuties() {
  await db.insert(coins).values(coinsData).onConflictDoNothing({ target: coins.id })
  await db.insert(duties).values(dutiesData).onConflictDoNothing({ target: duties.id })
  await db.insert(coinsToDuties).values(linksData).onConflictDoNothing()
}

export async function deleteCoinsAndDuties() {
  await db.delete(coinsToDuties)
  await db.delete(duties)
  await db.delete(coins)
}
