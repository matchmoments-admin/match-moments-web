import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';

interface Team {
  id: string;
  name: string;
  logoUrl: string;
  abbreviation?: string;
}

interface Competition {
  id: string;
  name: string;
  logoUrl?: string;
}

interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  status: 'scheduled' | 'live' | 'finished' | 'halftime' | 'postponed' | 'cancelled';
  competition: Competition;
  venue?: string;
  matchDate: Date | string;
  sport: string;
  isLive: boolean;
}

interface MatchesByGroup {
  [groupName: string]: Match[];
}

type GroupingStrategy = 'competition' | 'date' | 'sport' | 'none';
type DisplayVariant = 'compact' | 'detailed';

interface MatchListProps {
  matches: Match[];
  groupBy?: GroupingStrategy;
  variant?: DisplayVariant;
  showVenue?: boolean;
  emptyMessage?: string;
}

/**
 * Reusable Match List Component
 * 
 * Can be used across the site for displaying matches in different contexts:
 * - Fixtures page (grouped by competition)
 * - Sport-specific pages (grouped by date)
 * - Team pages (ungrouped, chronological)
 * - Homepage (featured matches)
 */
export function MatchList({
  matches,
  groupBy = 'none',
  variant = 'compact',
  showVenue = false,
  emptyMessage = 'No matches available',
}: MatchListProps) {
  if (matches.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg">
        <div className="text-6xl mb-4">📅</div>
        <h3 className="text-2xl font-bold mb-2">No Matches</h3>
        <p className="text-gray-600">{emptyMessage}</p>
      </div>
    );
  }

  // Group matches based on strategy
  const groupedMatches = groupMatches(matches, groupBy);

  if (groupBy === 'none') {
    return (
      <div className="bg-white rounded-lg overflow-hidden shadow-sm divide-y">
        {matches.map((match) => (
          <MatchRow
            key={match.id}
            match={match}
            variant={variant}
            showVenue={showVenue}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {Object.entries(groupedMatches).map(([groupName, groupMatches]) => (
        <div key={groupName} className="bg-white rounded-lg overflow-hidden shadow-sm">
          {/* Group Header */}
          <div className="bg-gray-100 px-6 py-4 border-b">
            <div className="flex items-center gap-3">
              {groupBy === 'competition' && groupMatches[0]?.competition.logoUrl && (
                <div className="relative h-6 w-6">
                  <Image
                    src={groupMatches[0].competition.logoUrl}
                    alt={groupName}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              <h2 className="text-xl font-bold">{groupName}</h2>
              <span className="text-sm text-gray-600">
                ({groupMatches.length} {groupMatches.length === 1 ? 'match' : 'matches'})
              </span>
            </div>
          </div>

          {/* Matches */}
          <div className="divide-y">
            {groupMatches.map((match) => (
              <MatchRow
                key={match.id}
                match={match}
                variant={variant}
                showVenue={showVenue}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

interface MatchRowProps {
  match: Match;
  variant: DisplayVariant;
  showVenue: boolean;
}

function MatchRow({ match, variant, showVenue }: MatchRowProps) {
  const isCompact = variant === 'compact';

  return (
    <Link
      href={`/games/${match.id}`}
      className="block hover:bg-gray-50 transition-colors"
    >
      <div className={`px-6 ${isCompact ? 'py-4' : 'py-6'}`}>
        <div className="flex items-center justify-between gap-4">
          {/* Time/Status */}
          <div className={`${isCompact ? 'w-20' : 'w-24'} text-sm flex-shrink-0`}>
            {match.status === 'live' || match.status === 'halftime' ? (
              <div>
                <span className="flex items-center gap-2 text-red-600 font-bold">
                  <span className="h-2 w-2 bg-red-600 rounded-full animate-pulse"></span>
                  LIVE
                </span>
                {match.status === 'halftime' && (
                  <span className="text-xs text-gray-500 mt-1">HT</span>
                )}
              </div>
            ) : match.status === 'finished' ? (
              <span className="text-gray-500 font-medium">FT</span>
            ) : match.status === 'postponed' ? (
              <span className="text-orange-500 font-medium">POSTP</span>
            ) : match.status === 'cancelled' ? (
              <span className="text-red-500 font-medium">CANC</span>
            ) : (
              <span className="text-gray-600">
                {format(new Date(match.matchDate), 'HH:mm')}
              </span>
            )}
          </div>

          {/* Teams and Scores */}
          <div className="flex-1 max-w-2xl">
            {/* Home Team */}
            <div className={`flex items-center justify-between ${isCompact ? 'mb-2' : 'mb-3'}`}>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {match.homeTeam.logoUrl && (
                  <div className={`relative ${isCompact ? 'h-6 w-6' : 'h-8 w-8'} flex-shrink-0`}>
                    <Image
                      src={match.homeTeam.logoUrl}
                      alt={match.homeTeam.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <span className={`${isCompact ? 'font-medium' : 'text-lg font-semibold'} truncate`}>
                  {match.homeTeam.name}
                </span>
              </div>
              <span className={`${isCompact ? 'text-xl' : 'text-2xl'} font-bold w-12 text-right flex-shrink-0`}>
                {match.homeScore}
              </span>
            </div>

            {/* Away Team */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {match.awayTeam.logoUrl && (
                  <div className={`relative ${isCompact ? 'h-6 w-6' : 'h-8 w-8'} flex-shrink-0`}>
                    <Image
                      src={match.awayTeam.logoUrl}
                      alt={match.awayTeam.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <span className={`${isCompact ? 'font-medium' : 'text-lg font-semibold'} truncate`}>
                  {match.awayTeam.name}
                </span>
              </div>
              <span className={`${isCompact ? 'text-xl' : 'text-2xl'} font-bold w-12 text-right flex-shrink-0`}>
                {match.awayScore}
              </span>
            </div>
          </div>

          {/* Venue (optional, hidden on mobile) */}
          {showVenue && match.venue && (
            <div className="hidden lg:block w-48 text-sm text-gray-500 text-right flex-shrink-0">
              {match.venue}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

/**
 * Group matches by the specified strategy
 */
function groupMatches(matches: Match[], strategy: GroupingStrategy): MatchesByGroup {
  if (strategy === 'none') {
    return { all: matches };
  }

  return matches.reduce((acc, match) => {
    let groupKey: string;

    switch (strategy) {
      case 'competition':
        groupKey = match.competition.name;
        break;
      case 'date':
        groupKey = format(new Date(match.matchDate), 'EEEE, MMMM d, yyyy');
        break;
      case 'sport':
        groupKey = match.sport;
        break;
      default:
        groupKey = 'all';
    }

    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(match);
    return acc;
  }, {} as MatchesByGroup);
}

/**
 * Usage Examples:
 * 
 * // Fixtures page - grouped by competition
 * <MatchList 
 *   matches={matches} 
 *   groupBy="competition" 
 *   variant="compact"
 *   showVenue={true}
 * />
 * 
 * // Sport page - grouped by date
 * <MatchList 
 *   matches={soccerMatches} 
 *   groupBy="date" 
 *   variant="detailed"
 * />
 * 
 * // Team page - chronological list
 * <MatchList 
 *   matches={teamMatches} 
 *   groupBy="none" 
 *   variant="compact"
 * />
 * 
 * // Homepage - featured matches
 * <MatchList 
 *   matches={featuredMatches} 
 *   groupBy="sport" 
 *   variant="detailed"
 *   showVenue={true}
 * />
 */

