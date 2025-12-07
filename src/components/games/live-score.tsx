'use client';

import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import Image from 'next/image';

interface LiveScoreProps {
  fixture: {
    id: string;
    homeTeam: {
      name: string;
      logo: string;
      score: number;
    };
    awayTeam: {
      name: string;
      logo: string;
      score: number;
    };
    status: string;
    currentPeriod?: string;
    venue?: string;
  };
  onClick?: () => void;
}

export function LiveScore({ fixture, onClick }: LiveScoreProps) {
  const isLive = fixture.status.includes('Live');

  return (
    <article
      className={`
        group cursor-pointer overflow-hidden rounded-2xl border bg-white transition-all hover:shadow-lg
        ${isLive ? 'border-red-500 ring-2 ring-red-100' : 'border-neutral-200'}
      `}
      onClick={onClick}
    >
      <div className="p-6">
        {/* Status Bar */}
        <div className="flex items-center justify-between mb-4">
          <Badge
            variant={isLive ? 'destructive' : 'secondary'}
            className={`rounded-full ${isLive ? 'bg-red-500 animate-pulse-live' : 'bg-neutral-100 text-neutral-900'}`}
          >
            {isLive && <span className="mr-1">●</span>}
            {fixture.status}
          </Badge>
          {fixture.currentPeriod && (
            <div className="flex items-center text-sm text-neutral-600">
              <Clock className="h-4 w-4 mr-1" />
              {fixture.currentPeriod}
            </div>
          )}
        </div>

        {/* Teams & Scores */}
        <div className="space-y-3">
          {/* Home Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative h-8 w-8">
                <Image
                  src={fixture.homeTeam.logo || '/placeholder-team.png'}
                  alt={fixture.homeTeam.name}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <span className="font-semibold truncate">{fixture.homeTeam.name}</span>
            </div>
            <span className="text-3xl font-bold">{fixture.homeTeam.score}</span>
          </div>

          {/* Away Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative h-8 w-8">
                <Image
                  src={fixture.awayTeam.logo || '/placeholder-team.png'}
                  alt={fixture.awayTeam.name}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <span className="font-semibold truncate">{fixture.awayTeam.name}</span>
            </div>
            <span className="text-3xl font-bold">{fixture.awayTeam.score}</span>
          </div>
        </div>

        {/* Venue */}
        {fixture.venue && (
          <div className="mt-3 pt-3 border-t border-neutral-200 text-sm text-neutral-600">
            {fixture.venue}
          </div>
        )}
      </div>
    </article>
  );
}

