import { createRoute } from "honox/factory"
import { db } from "../db/db.ts"
import { getAllCoinsWithDuties } from "../services/coinService.ts"

export default createRoute(async (c) => {
  const coins = await getAllCoinsWithDuties(db)

  const dutiesMap = new Map<
    number | string,
    { id: string; number: number | string; description: string; coins: { id: string; name: string }[] }
  >()

  for (const coin of coins) {
    for (const duty of coin.duties) {
      if (!dutiesMap.has(duty.number)) {
        dutiesMap.set(duty.number, {
          id: duty.id,
          number: duty.number,
          description: duty.description,
          coins: []
        })
      }
      dutiesMap.get(duty.number)!.coins.push({ id: coin.id, name: coin.name })
    }
  }

  const duties = Array.from(dutiesMap.values()).sort((a, b) => Number(a.number) - Number(b.number))

  return c.render(
    <main className="space-y-8 max-w-4xl mx-auto px-4 py-6">
      <header className="flex items-center justify-between border-b border-gray-600 pb-5">
        <div>
          <h1 className="text-xl font-bold text-[#003366] font-sans">Duties Dashboard</h1>
          <p className="text-gray-500 text-xs mt-1">View duties and their linked coins.</p>
        </div>
        <a
          href="/coins"
          className="text-xs font-mono font-bold text-blue-700 hover:text-blue-900 border border-blue-300 px-3 py-1.5 rounded bg-blue-50 hover:bg-blue-100 transition"
        >
          &larr; Coins
        </a>
      </header>

      {duties.length === 0 ? (
        <p className="text-gray-700 text-xs py-4 font-mono">No duties available.</p>
      ) : (
        <ul className="bg-white border border-gray-400 divide-y divide-gray-400 overflow-hidden list-none p-0 m-0">
          {duties.map((duty) => (
            <li key={duty.id} id={`duty-${duty.number}`} className="p-4 bg-white">
              <article className="flex flex-col gap-4">
                <h2 role="heading" className="text-sm font-bold text-black font-sans">
                  Duty {duty.number}
                </h2>
                <p className="text-gray-700 text-xs py-4 font-mono">{duty.description}</p>

                {duty.coins.length > 0 && (
                  <nav aria-label={`Coins associated with Duty ${duty.number}`}>
                    <ul className="flex flex-wrap gap-2 text-xs font-mono font-bold list-none p-0 m-0">
                      {duty.coins.map((coin) => (
                        <li key={coin.id}>
                          <a
                            href={`/coins#coin-${coin.id}`}
                            className="block bg-blue-100 text-blue-900 px-2.5 py-1 border border-blue-200 transition-colors hover:bg-blue-200 cursor-pointer"
                          >
                            {coin.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                )}
              </article>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
})
