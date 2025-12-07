'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Period {
  number: number;
  type: string;
  homeScore: number;
  awayScore: number;
}

interface PeriodBreakdownProps {
  homeTeam: string;
  awayTeam: string;
  periods: Period[];
  finalHome: number;
  finalAway: number;
}

export function PeriodBreakdown({
  homeTeam,
  awayTeam,
  periods,
  finalHome,
  finalAway,
}: PeriodBreakdownProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-200">
        <h3 className="font-bold text-lg">Period Breakdown</h3>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-50">
              <TableHead className="w-[200px]">Team</TableHead>
              {periods.map((period) => (
                <TableHead key={period.number} className="text-center">
                  {period.type === 'Half' ? `${period.number}H` : `Q${period.number}`}
                </TableHead>
              ))}
              <TableHead className="text-center font-bold">Final</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Home Team */}
            <TableRow className="hover:bg-neutral-50">
              <TableCell className="font-semibold">{homeTeam}</TableCell>
              {periods.map((period) => (
                <TableCell key={period.number} className="text-center font-mono">
                  {period.homeScore}
                </TableCell>
              ))}
              <TableCell className="text-center font-bold text-lg">{finalHome}</TableCell>
            </TableRow>

            {/* Away Team */}
            <TableRow className="hover:bg-neutral-50">
              <TableCell className="font-semibold">{awayTeam}</TableCell>
              {periods.map((period) => (
                <TableCell key={period.number} className="text-center font-mono">
                  {period.awayScore}
                </TableCell>
              ))}
              <TableCell className="text-center font-bold text-lg">{finalAway}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

