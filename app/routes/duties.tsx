import { createRoute } from "honox/factory"
import { db } from "../db/db.ts"
import { getAllDutiesWithCoins } from "../services/dutyService.ts"
import PageContainer from "../components/PageContainer.tsx"
import PageHeader from "../components/PageHeader.tsx"
import CardList from "../components/CardList.tsx"
import Card from "../components/Card.tsx"
import Badge from "../components/Badge.tsx"

export default createRoute(async (c) => {
    const duties = await getAllDutiesWithCoins(db)

    return c.render(
        <PageContainer>
            <PageHeader
                title="Duties Dashboard"
                description="View duties and their linked coins."
                actionHref="/coins"
                actionLabel="← Coins"
            />

            {duties.length === 0 ? (
                <p className="text-gray-700 text-xs py-4 font-mono">No duties available.</p>
            ) : (
                <CardList className="bg-white border border-gray-400 divide-y divide-gray-400 overflow-hidden">
                    {duties.map((duty) => (
                        <Card
                            key={duty.id}
                            id={`duty-${duty.number}`}
                            className="p-4"
                            articleClassName="gap-4"
                        >
                            <h2 role="heading" className="text-sm font-bold text-black font-sans">
                                Duty {duty.number}
                            </h2>
                            <p className="text-gray-700 text-xs py-4 font-mono">{duty.description}</p>

                            {duty.coins.length > 0 && (
                                <nav aria-label={`Coins associated with Duty ${duty.number}`}>
                                    <CardList className="flex flex-wrap gap-2 text-xs font-mono font-bold">
                                        {duty.coins.map((coin) => (
                                            <li key={coin.id}>
                                                <Badge
                                                    href={`/coins#coin-${coin.id}`}
                                                    label={coin.name}
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