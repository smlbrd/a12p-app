import { sql } from "drizzle-orm"
import { db } from "./db.ts"
import { coins, coinsToDuties, duties, users } from "./schema/index.ts"
import { coinsData, linksData } from "./fixtures/coins.ts"
import { dutiesData } from "./fixtures/duties.ts"
import { usersData } from "./fixtures/users.ts"

export async function seedData() {
    await db.transaction(async (tx) => {
        await tx.insert(users).values(usersData).onConflictDoNothing({target: users.id})
        await tx.insert(coins).values(coinsData).onConflictDoNothing({target: coins.id})
        await tx.insert(duties).values(dutiesData).onConflictDoNothing({target: duties.id})
        await tx.insert(coinsToDuties).values(linksData).onConflictDoNothing()
    })
}

export async function deleteData() {
    await db.execute(
        sql`TRUNCATE TABLE ${users}, ${coins}, ${duties}, ${coinsToDuties} CASCADE;`
    )
}

