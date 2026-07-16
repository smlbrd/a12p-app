import { createRoute } from "honox/factory"
import { db } from "../db/db.ts"
import { getAllCoinsWithDuties } from "../services/coinService.ts"

export default createRoute(async (c) => {
  const coins = await getAllCoinsWithDuties(db)

  return c.render(
    <main className="space-y-8 max-w-4xl mx-auto px-4 py-6">
      <header className="flex items-center justify-between border-b border-gray-600 pb-5">
        <div>
          <h1 className="text-xl font-bold text-[#003366] font-sans">Coins Dashboard</h1>
          <p className="text-gray-500 text-xs mt-1">View coins and their linked duties.</p>
        </div>
        <a
          href="/duties"
          className="text-xs font-mono font-bold text-blue-700 hover:text-blue-900 border border-blue-300 px-3 py-1.5 rounded bg-blue-50 hover:bg-blue-100 transition"
        >
          Duties &rarr;
        </a>
      </header>

      {coins.length === 0 ? (
        <p className="text-gray-700 text-xs py-4 font-mono">No coins available.</p>
      ) : (
        <ul className="bg-white border border-gray-400 divide-y divide-gray-400 overflow-hidden list-none p-0 m-0">
          {coins.map((coin) => (
            <li key={coin.id} id={`coin-${coin.id}`} className="p-4 bg-white">
              <article className="flex flex-col gap-4">
                <h2 role="heading" className="text-sm font-bold text-black font-sans">
                  {coin.name}
                </h2>

                {coin.duties.length > 0 && (
                  <nav aria-label={`Duties associated with ${coin.name}`}>
                    <ul className="flex flex-wrap gap-2 text-xs font-mono font-bold list-none p-0 m-0">
                      {coin.duties.map((duty) => (
                        <li key={duty.id}>
                          <a
                            href={`/duties#duty-${duty.number}`}
                            className="block bg-blue-100 text-blue-900 px-2.5 py-1 border border-blue-200 transition-colors hover:bg-blue-200 cursor-pointer"
                          >
                            Duty {duty.number}
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
