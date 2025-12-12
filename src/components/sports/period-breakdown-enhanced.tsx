import { FixturePeriod } from '@/types/sports';

interface PeriodBreakdownEnhancedProps {
  homeTeam: string;
  awayTeam: string;
  periods: FixturePeriod[];
  finalHome: number;
  finalAway: number;
}

export function PeriodBreakdownEnhanced({
  homeTeam,
  awayTeam,
  periods,
  finalHome,
  finalAway,
}: PeriodBreakdownEnhancedProps) {
  if (!periods || periods.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-black">
            <th className="text-left py-3 px-4 font-bold">Team</th>
            {periods.map((period) => (
              <th
                key={`${period.periodType}-${period.periodNumber}`}
                className="text-center py-3 px-4 font-bold min-w-[80px]"
              >
                {period.periodType} {period.periodNumber}
              </th>
            ))}
            <th className="text-center py-3 px-4 font-bold bg-gray-100 min-w-[80px]">
              Final
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Home Team Row */}
          <tr className="border-b border-gray-200">
            <td className="py-3 px-4 font-bold">{homeTeam}</td>
            {periods.map((period) => (
              <td
                key={`home-${period.periodNumber}`}
                className="text-center py-3 px-4"
              >
                <div className="flex flex-col items-center">
                  <div className="text-xl font-bold">{period.homeScore}</div>
                  <div className="text-xs text-gray-500">
                    ({period.cumulativeHomeScore})
                  </div>
                </div>
              </td>
            ))}
            <td className="text-center py-3 px-4 bg-gray-100">
              <div className="text-2xl font-bold">{finalHome}</div>
            </td>
          </tr>

          {/* Away Team Row */}
          <tr>
            <td className="py-3 px-4 font-bold">{awayTeam}</td>
            {periods.map((period) => (
              <td
                key={`away-${period.periodNumber}`}
                className="text-center py-3 px-4"
              >
                <div className="flex flex-col items-center">
                  <div className="text-xl font-bold">{period.awayScore}</div>
                  <div className="text-xs text-gray-500">
                    ({period.cumulativeAwayScore})
                  </div>
                </div>
              </td>
            ))}
            <td className="text-center py-3 px-4 bg-gray-100">
              <div className="text-2xl font-bold">{finalAway}</div>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="mt-2 text-xs text-gray-500 text-center">
        Numbers in parentheses show cumulative score
      </div>
    </div>
  );
}

