const nbaGames = [
  {
    home: { name: "HOU", record: "15-6", score: 77, live: true, quarter: "4th", time: "11:25" },
    away: { name: "DAL", record: "8-16", score: 98 },
  },
  {
    home: { name: "AUB", record: "7-2", score: 6, live: true, quarter: "1st", time: "15:49" },
    away: { name: "ARIZ", record: "7-0", score: 10 },
  },
]

const ncaamGames = [
  {
    home: { name: "MISS", record: "5-4", score: 58 },
    away: { name: "SJU", record: "5-3", score: 63 },
    date: "Dec 7",
  },
  {
    home: { name: "ILL", record: "7-2", score: 75 },
    away: { name: "TENN", record: "7-3", score: 62 },
    date: "Dec 7",
  },
  {
    home: { name: "FSU", record: "5-4", score: 67 },
    away: { name: "HOU", record: "6-1", score: 82 },
    date: "Dec 7",
  },
  {
    home: { name: "WASH", record: "6-3", score: 84 },
    away: { name: "USC", record: "8-1", score: 76 },
    date: "Dec 7",
  },
]

export function LiveScores() {
  return (
    <section className="py-8">
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
        <div className="grid gap-8 md:grid-cols-2">
          {/* NBA */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-neutral-600">NBA</h3>
            <div className="space-y-4">
              {nbaGames.map((game, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-bold">{game.home.name}</span>
                      <span className="text-sm text-neutral-600">({game.home.record})</span>
                    </div>
                    <span className="text-xl font-bold">{game.home.score}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-bold">{game.away.name}</span>
                      <span className="text-sm text-neutral-600">({game.away.record})</span>
                    </div>
                    <span className="text-xl font-bold">{game.away.score}</span>
                  </div>
                  {game.home.live && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
                        Live
                      </span>
                      <span className="text-neutral-600">
                        {game.home.quarter} | {game.home.time}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* NCAAM */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-neutral-600">NCAAM</h3>
            <div className="grid grid-cols-2 gap-4">
              {ncaamGames.map((game, i) => (
                <div key={i} className="space-y-1 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{game.home.name}</span>
                    <span className="font-bold">{game.home.score}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{game.away.name}</span>
                    <span className="font-bold">{game.away.score}</span>
                  </div>
                  <div className="text-xs text-neutral-600">{game.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
