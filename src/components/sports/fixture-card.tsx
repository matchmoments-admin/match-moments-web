import Link from 'next/link';
import Image from 'next/image';
import { type Match } from '@/types/domain';
import { format } from 'date-fns';

interface FixtureCardProps {
  fixture: Match;
}

export function FixtureCard({ fixture }: FixtureCardProps) {
  const href = `/${fixture.gender}/${fixture.sport}/fixtures/${fixture.id}`;
  const isLive = fixture.status === 'live' || fixture.status === 'halftime';

  return (
    <Link href={href} className="group">
      <div className="rounded-3xl bg-white border border-gray-200 p-6 transition-all hover:border-black hover:shadow-lg">
        {/* Status and Competition */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {fixture.competition.logoUrl && (
              <div className="relative h-5 w-5">
                <Image
                  src={fixture.competition.logoUrl}
                  alt={fixture.competition.name}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <span className="text-sm font-medium text-gray-600">
              {fixture.competition.name}
            </span>
          </div>
          {isLive && (
            <div className="flex items-center gap-2 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
              <div className="h-2 w-2 rounded-full bg-white animate-pulse"></div>
              LIVE
            </div>
          )}
        </div>

        {/* Teams */}
        <div className="space-y-4">
          {/* Home Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              {fixture.homeTeam.logoUrl && (
                <div className="relative h-10 w-10 flex-shrink-0">
                  <Image
                    src={fixture.homeTeam.logoUrl}
                    alt={fixture.homeTeam.name}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              <span className="text-lg font-bold">{fixture.homeTeam.name}</span>
            </div>
            <div className="text-3xl font-bold">{fixture.homeScore}</div>
          </div>

          {/* Away Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              {fixture.awayTeam.logoUrl && (
                <div className="relative h-10 w-10 flex-shrink-0">
                  <Image
                    src={fixture.awayTeam.logoUrl}
                    alt={fixture.awayTeam.name}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              <span className="text-lg font-bold">{fixture.awayTeam.name}</span>
            </div>
            <div className="text-3xl font-bold">{fixture.awayScore}</div>
          </div>
        </div>

        {/* Match Info */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 text-sm text-gray-600">
          <div>
            {fixture.status === 'finished' ? (
              <span className="font-medium">Full Time</span>
            ) : fixture.status === 'scheduled' ? (
              <span>{format(new Date(fixture.matchDate), 'MMM d, h:mm a')}</span>
            ) : (
              <span className="font-medium">LIVE</span>
            )}
          </div>
          {fixture.venue && <div className="text-xs">{fixture.venue}</div>}
        </div>

        {/* Gender Badge */}
        <div className="mt-3">
          <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
            fixture.gender === 'womens'
              ? 'bg-purple-100 text-purple-800'
              : 'bg-blue-100 text-blue-800'
          }`}>
            {fixture.gender === 'womens' ? "Women's" : "Men's"} {fixture.sport}
          </span>
        </div>
      </div>
    </Link>
  );
}

