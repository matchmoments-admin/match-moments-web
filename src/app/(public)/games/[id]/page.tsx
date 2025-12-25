import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { PeriodBreakdown } from '@/components/games/period-breakdown';
import { getFixtureData } from '@/lib/salesforce/queries/fixtures';
import { getCached } from '@/lib/cache/redis';
import { CacheKeys, CacheStrategy } from '@/lib/cache/strategies';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

async function fetchFixture(id: string) {
  return getCached(CacheKeys.FIXTURE_DETAIL(id), () => getFixtureData(id), CacheStrategy.fixtureDetail);
}

export default async function GameDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const fixture = await fetchFixture(id);

  if (!fixture) {
    notFound();
  }

  // Type assertion for Salesforce custom fields
  const fixtureData = fixture as any;

  const isLive = fixtureData.Status__c?.includes('Live') ?? false;

  const matchTitle = `${fixtureData.Home_Team__r?.Name || 'TBD'} vs ${fixtureData.Away_Team__r?.Name || 'TBD'}`;
  const matchDate = fixtureData.Fixture_DateTime__c 
    ? format(new Date(fixtureData.Fixture_DateTime__c), 'MM.dd.yy')
    : '';

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-[1140px] px-2 py-8">
        {/* Category Link */}
        <Link 
          href="/games" 
          className="text-2xl font-bold text-black hover:underline mb-4 inline-block"
        >
          Read more in {fixtureData.Competition__r?.Name || 'Games'}
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
                  src={fixtureData.Home_Team__r?.Logo_URL__c || '/placeholder-team.png'}
                  alt={fixtureData.Home_Team__r?.Name || 'Home Team'}
                  fill
                  className="object-contain"
                />
              </div>
              <h2 className="text-2xl font-bold mb-2">{fixtureData.Home_Team__r?.Name || 'TBD'}</h2>
              <div className="text-5xl font-bold">{fixtureData.Home_Score_Final__c ?? 0}</div>
            </div>

            {/* VS Divider */}
            <div className="text-center">
              <div className="text-2xl font-bold">VS</div>
              {fixtureData.Current_Period__r && (
                <div className="mt-2 text-base font-light">
                  {fixtureData.Current_Period__r?.Period_Type__c}{' '}
                  {fixtureData.Current_Period__r?.Period_Number__c}
                </div>
              )}
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
                  src={fixtureData.Away_Team__r?.Logo_URL__c || '/placeholder-team.png'}
                  alt={fixtureData.Away_Team__r?.Name || 'Away Team'}
                  fill
                  className="object-contain"
                />
              </div>
              <h2 className="text-2xl font-bold mb-2">{fixtureData.Away_Team__r?.Name || 'TBD'}</h2>
              <div className="text-5xl font-bold">{fixtureData.Away_Score_Final__c ?? 0}</div>
            </div>
          </div>

          {/* Match Info */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-base font-light text-black border-t border-black/10 pt-6">
            {fixtureData.Fixture_DateTime__c && (
              <div>
                {new Date(fixtureData.Fixture_DateTime__c).toLocaleString()}
              </div>
            )}
            {fixtureData.Venue__c && (
              <div>
                {fixtureData.Venue__c}
              </div>
            )}
            {fixtureData.Attendance__c && (
              <div>
                {fixtureData.Attendance__c.toLocaleString()} attendance
              </div>
            )}
          </div>
        </div>

        {/* Period Breakdown */}
        {fixture.periods && fixture.periods.length > 0 && (
          <div className="mb-12">
            <PeriodBreakdown
              homeTeam={fixtureData.Home_Team__r?.Name || 'Home'}
              awayTeam={fixtureData.Away_Team__r?.Name || 'Away'}
              periods={fixture.periods.map((p: any) => ({
                number: p.Period_Number__c,
                type: p.Period_Type__c,
                homeScore: p.Home_Score_Period__c || 0,
                awayScore: p.Away_Score_Period__c || 0,
              }))}
              finalHome={fixtureData.Home_Score_Final__c ?? 0}
              finalAway={fixtureData.Away_Score_Final__c ?? 0}
            />
          </div>
        )}

        {/* Key Moments */}
        {fixture.commentary && fixture.commentary.length > 0 && (
          <div className="mb-12">
            <h3 className="text-3xl font-bold mb-6">Key Moments</h3>
            <div className="space-y-6">
              {fixture.commentary.slice(0, 10).map((event: any) => (
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
                    <div className="text-base font-bold mb-1">{event.Primary_Player__r?.Name}</div>
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


