import { createRoute } from "honox/factory"
import { db } from "../db/db.ts"
import { getAllCoinsWithDuties } from "../services/coinService.ts"

import PageContainer from "../components/PageContainer.tsx"
import PageHeader from "../components/PageHeader.tsx"
import CardList from "../components/CardList.tsx"
import Card from "../components/Card.tsx"
import Badge from "../components/Badge.tsx"

export default createRoute(async (c) => {
    const coins = await getAllCoinsWithDuties(db)

    return c.render(
        <PageContainer>
            <PageHeader
                title="Coins Dashboard"
                description="View coins and their linked duties."
                actionHref="/duties"
                actionLabel="Duties →"
            />

            {coins.length === 0 ? (
                <p className="text-gray-700 text-xs py-4 font-mono">No coins available.</p>
            ) : (
                <CardList className="bg-white border border-gray-400 divide-y divide-gray-400 overflow-hidden">
                    {coins.map((coin) => (
                        <Card
                            key={coin.id}
                            id={`coin-${coin.id}`}
                            className="p-4"
                            articleClassName="gap-4"
                        >
                            <h2 role="heading" className="text-sm font-bold text-black font-sans">
                                {coin.name}
                            </h2>

                            {coin.duties.length > 0 && (
                                <nav aria-label={`Duties associated with ${coin.name}`}>
                                    <CardList className="flex flex-wrap gap-2 text-xs font-mono font-bold">
                                        {coin.duties.map((duty) => (
                                            <li key={duty.id}>
                                                <Badge
                                                    href={`/duties#duty-${duty.number}`}
                                                    label={`Duty ${duty.number}`}
                                                />
                                            </li>
                                        ))}
                                    </CardList>
                                </nav>
                            )}
                        </Card>
                    ))}
                </CardList>
            )}
        </PageContainer>
    )
})