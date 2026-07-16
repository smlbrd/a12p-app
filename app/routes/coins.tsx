import { createRoute } from "honox/factory"
import { db } from "../db/db.ts"
import { getAllCoinsWithDuties } from "../services/coinService.ts"

export default createRoute(async (c) => {
  const coins = await getAllCoinsWithDuties(db)

  return c.render(
    <div className="space-y-6">
      <div className="border-b border-gray-600 pb-5">
        <h1 className="text-lg font-bold text-[#003366] font-sans">Coins Dashboard</h1>
      </div>

      {coins.length === 0 ? (
        <p className="text-gray-700 text-xs py-4 font-mono">No coins available.</p>
      ) : (
        <div className="bg-white border border-gray-600 divide-y divide-gray-400 overflow-hidden">
          {coins.map((coin) => (
            <section
              key={coin.id}
              role="group"
              aria-label={coin.name}
              className="p-4 bg-white hover:bg-[#FFFFE1] transition-colors"
            >
              <div className="flex flex-col gap-4">
                <h2 className="text-sm font-bold text-black font-sans">
                  <a href={`/coins/${coin.id}`} className="text-blue-800 underline hover:text-red-700 cursor-pointer">
                    {coin.name}
                  </a>
                </h2>

                {coin.duties.length > 0 && (
                  <ul className="flex flex-wrap gap-2 text-xs font-mono font-bold cursor-pointer">
                    {coin.duties.map((duty) => (
                      <li
                        key={duty.id}
                        className="bg-blue-100 text-blue-900 px-2.5 py-1 border border-blue-200 transition-colors hover:bg-blue-200"
                      >
                        Duty {duty.number}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
})
