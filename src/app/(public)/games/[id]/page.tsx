import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { PeriodBreakdown } from '@/components/games/period-breakdown';
import { getMatchById, getMatchPeriods, getMatchEvents } from '@/lib/salesforce/queries/matches';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

async function fetchMatch(id: string) {
  const match = await getMatchById(id);
  if (!match) return null;
  
  // Fetch periods and events
  const [periods, events] = await Promise.all([
    getMatchPeriods(id),
    getMatchEvents(id)
  ]);
  
  return {
    ...match,
    periods,
    commentary: events
  };
}

export default async function GameDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const match = await fetchMatch(id);

  if (!match) {
    notFound();
  }

  const isLive = match.isLive;

  const matchTitle = `${match.homeTeam?.name || 'TBD'} vs ${match.awayTeam?.name || 'TBD'}`;
  const matchDate = match.matchDate 
    ? format(new Date(match.matchDate), 'MM.dd.yy')
    : '';

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-[1140px] px-2 py-8">
        {/* Category Link */}
        <Link 
          href="/games" 
          className="text-2xl font-bold text-black hover:underline mb-4 inline-block"
        >
          Read more in {match.competition?.name || 'Games'}
        </Link>

        {/* Article Title */}
        <h1 className="text-[60px] font-bold leading-[72px] mb-8">
          {matchTitle}
        </h1>

        {/* Featured Image */}
        <div className="relative w-full aspect-[16/9] mb-8">
          <Image
            src="/placeholder.jpg"
            alt={matchTitle}
            fill
            className="object-cover"
          />
        </div>

        {/* Meta Information */}
        <div className="mb-8 text-xl font-normal text-black">
          {matchDate && `${matchDate} | `}By Match Moments Team
        </div>

        {/* Match Score Section */}
        <div className="mb-12 border-t border-black/10 pt-8">
          <div className="grid md:grid-cols-3 gap-8 items-center mb-8">
            {/* Home Team */}
            <div className="text-center">
              <div className="relative h-24 w-24 mx-auto mb-4">
                <Image
                  src={match.homeTeam?.logoUrl || '/placeholder-team.png'}
                  alt={match.homeTeam?.name || 'Home Team'}
                  fill
                  className="object-contain"
                />
              </div>
              <h2 className="text-2xl font-bold mb-2">{match.homeTeam?.name || 'TBD'}</h2>
              <div className="text-5xl font-bold">{match.homeScore ?? 0}</div>
            </div>

            {/* VS Divider */}
            <div className="text-center">
              <div className="text-2xl font-bold">VS</div>
              {isLive && (
                <div className="mt-2 flex items-center justify-center gap-2">
                  <div className="h-2 w-2 bg-red-500 animate-pulse-live" />
                  <span className="text-base font-light">Live</span>
                </div>
              )}
            </div>

            {/* Away Team */}
            <div className="text-center">
              <div className="relative h-24 w-24 mx-auto mb-4">
                <Image
                  src={match.awayTeam?.logoUrl || '/placeholder-team.png'}
                  alt={match.awayTeam?.name || 'Away Team'}
                  fill
                  className="object-contain"
                />
              </div>
              <h2 className="text-2xl font-bold mb-2">{match.awayTeam?.name || 'TBD'}</h2>
              <div className="text-5xl font-bold">{match.awayScore ?? 0}</div>
            </div>
          </div>

          {/* Match Info */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-base font-light text-black border-t border-black/10 pt-6">
            {match.matchDate && (
              <div>
                {new Date(match.matchDate).toLocaleString()}
              </div>
            )}
            {match.venue && (
              <div>
                {match.venue}
              </div>
            )}
            {match.attendance && (
              <div>
                {match.attendance.toLocaleString()} attendance
              </div>
            )}
          </div>
        </div>

        {/* Period Breakdown */}
        {match.periods && match.periods.length > 0 && (
          <div className="mb-12">
            <PeriodBreakdown
              homeTeam={match.homeTeam?.name || 'Home'}
              awayTeam={match.awayTeam?.name || 'Away'}
              periods={match.periods.map((p: any) => ({
                number: p.Period_Number__c,
                type: p.Period_Type__c,
                homeScore: p.Home_Score__c || 0,
                awayScore: p.Away_Score__c || 0,
              }))}
              finalHome={match.homeScore ?? 0}
              finalAway={match.awayScore ?? 0}
            />
          </div>
        )}

        {/* Key Moments */}
        {match.commentary && match.commentary.length > 0 && (
          <div className="mb-12">
            <h3 className="text-3xl font-bold mb-6">Key Moments</h3>
            <div className="space-y-6">
              {match.commentary.slice(0, 10).map((event: any) => (
                <div
                  key={event.Id}
                  className="flex items-start gap-6 pb-6 border-b border-black/10 last:border-0"
                >
                  <div className="flex-shrink-0 text-center">
                    <div className="text-base font-bold">
                      {event.Event_Minute__c}&apos;
                    </div>
                    <div className="text-sm font-light mt-1">
                      {event.Event_Type__c}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-base font-bold mb-1">{event.Name}</div>
                    <div className="text-base font-light">
                      {event.Description__c}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}


