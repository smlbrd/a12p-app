import { createRoute } from "honox/factory"
import { db } from "../db/db.ts"
import { getAllCoinsWithDuties } from "../services/coinService.ts"
import { optionalAuth } from "../middleware/auth.ts"

import PageContainer from "../components/PageContainer.tsx"
import PageHeader from "../components/PageHeader.tsx"
import CardList from "../components/CardList.tsx"
import Card from "../components/Card.tsx"
import Badge from "../components/Badge.tsx"
import CoinItem from "../islands/CoinItem.tsx"

export default createRoute(optionalAuth, async (c) => {
    const coins = await getAllCoinsWithDuties(db)
    const isLoggedIn = c.get("isLoggedIn")
    const isAdmin = c.get("isAdmin")

    return c.render(
        <PageContainer>
            <PageHeader
                title="Coins Dashboard"
                description="View coins and their linked duties."
                actionLabel={isLoggedIn ? "Log Out" : "Log In"}
                isLoggedIn={isLoggedIn}
            />

            {coins.length === 0 ? (
                <p className="text-gray-700 text-xs py-4 font-mono">No coins available.</p>
            ) : (
                <CardList className="bg-white border border-gray-400 divide-y divide-gray-400 overflow-hidden">
                    {coins.map((coin) => (
                        <Card
                            key={coin.id}
                            id={`coin-${coin.id}`}
                            className="p-4 has-[hono-island:empty]:hidden"
                            articleClassName="gap-4"
                        >
                            {isLoggedIn ? (
                                <CoinItem
                                    coinId={coin.id}
                                    initialName={coin.name}
                                    initialCompleted={coin.isCompleted}
                                    isAdmin={isAdmin}
                                    duties={coin.duties}
                                />
                            ) : (
                                <>
                                    <div className="inline-flex items-center gap-3 select-none">
                                        <input
                                            type="checkbox"
                                            checked={coin.isCompleted}
                                            disabled
                                            aria-label={`${coin.name} status: ${coin.isCompleted ? "Completed" : "Incomplete"}`}
                                            className="h-4 w-4 rounded border-gray-300 text-emerald-600 accent-emerald-600 cursor-not-allowed opacity-60"
                                        />
                                        <h2 className={`text-sm font-bold font-sans ${
                                            coin.isCompleted
                                                ? "line-through text-gray-400"
                                                : "text-black"
                                        }`}>
                                            {coin.name}
                                        </h2>
                                    </div>

                                    {coin.duties?.length > 0 && (
                                        <ul
                                            aria-label={`Duties associated with ${coin.name}`}
                                            className="flex flex-wrap gap-2 text-xs font-mono font-bold mt-2"
                                        >
                                            {coin.duties.map((duty) => (
                                                <li key={duty.id}>
                                                    <Badge
                                                        href={`/duties#duty-${duty.number}`}
                                                        label={`Duty ${duty.number}`}
                                                    />
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </>
                            )}
                        </Card>
                    ))}
                </CardList>
            )}
        </PageContainer>,
        {isLoggedIn}
    )
})