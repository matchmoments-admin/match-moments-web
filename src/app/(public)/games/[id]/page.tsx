import { notFound } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { PeriodBreakdown } from '@/components/games/period-breakdown';
import { getFixtureData } from '@/lib/salesforce/queries/fixtures';
import { getCached } from '@/lib/cache/redis';
import { CacheKeys, CacheStrategy } from '@/lib/cache/strategies';
import { Clock, MapPin, Users } from 'lucide-react';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

async function fetchFixture(id: string) {
  return getCached(CacheKeys.FIXTURE_DETAIL(id), () => getFixtureData(id), CacheStrategy.fixtureDetail);
}

export default async function GameDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const fixture = await fetchFixture(params.id);

  if (!fixture) {
    notFound();
  }

  // Type assertion for Salesforce custom fields
  const fixtureData = fixture as any;

  const isLive = fixtureData.Status__c?.includes('Live') ?? false;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <Card className="p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-muted-foreground">
            {fixtureData.Competition__r?.Name || 'Unknown Competition'}
          </div>
          <Badge
            variant={isLive ? 'destructive' : 'secondary'}
            className={isLive ? 'bg-red-500 animate-pulse-live' : ''}
          >
            {isLive && <span className="mr-1">●</span>}
            {fixtureData.Status__c || 'Unknown'}
          </Badge>
        </div>

        {/* Match Score */}
        <div className="grid md:grid-cols-3 gap-8 items-center">
          {/* Home Team */}
          <div className="text-center">
            <div className="relative h-20 w-20 mx-auto mb-4">
              <Image
                src={fixtureData.Home_Team__r?.Logo_URL__c || '/placeholder-team.png'}
                alt={fixtureData.Home_Team__r?.Name || 'Home Team'}
                fill
                className="object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold mb-1">{fixtureData.Home_Team__r?.Name || 'TBD'}</h2>
            <div className="text-5xl font-black">{fixtureData.Home_Score_Final__c ?? 0}</div>
          </div>

          {/* VS Divider */}
          <div className="text-center">
            <div className="text-2xl font-bold text-muted-foreground">VS</div>
            {fixtureData.Current_Period__r && (
              <div className="mt-2 text-sm text-muted-foreground">
                {fixtureData.Current_Period__r?.Period_Type__c}{' '}
                {fixtureData.Current_Period__r?.Period_Number__c}
              </div>
            )}
          </div>

          {/* Away Team */}
          <div className="text-center">
            <div className="relative h-20 w-20 mx-auto mb-4">
              <Image
                src={fixtureData.Away_Team__r?.Logo_URL__c || '/placeholder-team.png'}
                alt={fixtureData.Away_Team__r?.Name || 'Away Team'}
                fill
                className="object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold mb-1">{fixtureData.Away_Team__r?.Name || 'TBD'}</h2>
            <div className="text-5xl font-black">{fixtureData.Away_Score_Final__c ?? 0}</div>
          </div>
        </div>

        {/* Match Info */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-6 pt-6 border-t border-border text-sm text-muted-foreground">
          {fixtureData.Fixture_DateTime__c && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {new Date(fixtureData.Fixture_DateTime__c).toLocaleString()}
            </div>
          )}
          {fixtureData.Venue__c && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {fixtureData.Venue__c}
            </div>
          )}
          {fixtureData.Attendance__c && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {fixtureData.Attendance__c.toLocaleString()} attendance
            </div>
          )}
        </div>
      </Card>

      {/* Tabbed Content */}
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="w-full md:w-auto mb-6">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="commentary">Commentary</TabsTrigger>
        </TabsList>

        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-6">
          {/* Period Breakdown */}
          {fixture.periods && fixture.periods.length > 0 && (
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
          )}

          {/* Key Moments */}
          {fixture.commentary && fixture.commentary.length > 0 && (
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4">Key Moments</h3>
              <div className="space-y-4">
                {fixture.commentary.slice(0, 5).map((event: any) => (
                  <div
                    key={event.Id}
                    className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
                  >
                    <div className="flex-shrink-0 text-center">
                      <div className="text-sm font-mono font-bold">
                        {event.Event_Minute__c}&apos;
                      </div>
                      <Badge variant="outline" className="text-xs mt-1">
                        {event.Event_Type__c}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium mb-1">{event.Primary_Player__r?.Name}</div>
                      <div className="text-sm text-muted-foreground">
                        {event.Description__c}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Commentary Tab */}
        <TabsContent value="commentary" className="space-y-6">
          <CommentaryTimeline events={fixture.commentary || []} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CommentaryTimeline({ events }: { events: any[] }) {
  if (events.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">No commentary available</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="font-bold text-lg mb-4">Full Commentary</h3>
      <div className="space-y-3">
        {events.map((event: any) => (
          <div key={event.Id} className="flex gap-4 pb-3 border-b border-border last:border-0">
            <div className="text-sm font-mono font-bold text-muted-foreground w-12">
              {event.Event_Minute__c}&apos;
            </div>
            <div className="flex-1 text-sm">{event.Description__c}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

