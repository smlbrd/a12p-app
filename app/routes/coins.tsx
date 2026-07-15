import { createRoute } from "honox/factory"
import { getAllCoins } from "../services/coinService.ts"

export default createRoute(async (c) => {
  const coins = await getAllCoins()

  return c.render(
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <h1>Coins Dashboard</h1>
      </div>

      {coins.length === 0 ? (
        <p className="text-slate-500 text-sm py-4">No coins available.</p>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden shadow-sm">
          {coins.map((coin) => (
            <div key={coin.id} data-testid="coin-row" className="p-6">
              <div className="flex flex-col justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div>
                    <h2 className="text-base font-semibold">
                      <a href={`/coins/${coin.id}`}>{coin.name}</a>
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
})
