import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { BreadcrumbNav } from '@/components/sports/breadcrumb-nav';
import { LiveMatchRefresher } from '@/components/sports/live-match-refresher';
import { LiveIndicator } from '@/components/sports/live-indicator';
import { AutoRefreshIndicator } from '@/components/sports/auto-refresh-indicator';
import { StructuredData, generateSportsEventSchema, generateBreadcrumbSchema } from '@/lib/seo/structured-data';
import { generateMatchMetadata } from '@/lib/seo/metadata';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const matchData = await getMatchData(id);
  if (!matchData) return {};
  return generateMatchMetadata(matchData);
}

async function getMatchData(matchId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/sports/matches/${matchId}`, {
      cache: 'no-store', // Always get fresh data for match pages
    });

    if (!response.ok) {
      return null;
    }

    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error('Error fetching match data:', error);
    return null;
  }
}

export default async function WomensFixtureDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const matchData = await getMatchData(id);
  
  if (!matchData) {
    notFound();
  }

  const { periods = [], moments = [], lineups = [] } = matchData;

  const homeTeam = matchData.Home_Team__r;
  const awayTeam = matchData.Away_Team__r;
  const competition = matchData.Competition__r;
  
  // Determine if match is live for auto-refresh
  const isLive = matchData.Status__c?.toLowerCase() === 'live' || 
                 matchData.Status__c?.toLowerCase() === 'in progress';

  // Generate structured data for SEO
  const sportsEventSchema = generateSportsEventSchema(matchData);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: "Women's Sports", url: '/womens' },
    { name: 'Soccer', url: '/womens/soccer' },
    { name: 'Fixtures', url: '/womens/soccer/fixtures' },
    { name: `${homeTeam?.Name} vs ${awayTeam?.Name}`, url: `/womens/soccer/fixtures/${id}` },
  ]);

  return (
    <main className="bg-background">
      {/* Structured Data for SEO */}
      <StructuredData data={sportsEventSchema} />
      <StructuredData data={breadcrumbSchema} />
      
      {/* Auto-refresh component for live matches */}
      <LiveMatchRefresher interval={30000} isLive={isLive} />
      
      <div className="container-main py-8">
        <BreadcrumbNav
          items={[
            { label: 'Home', href: '/' },
            { label: "Women's Sports", href: '/womens' },
            { label: 'Soccer', href: '/womens/soccer' },
            { label: 'Fixtures', href: '/womens/soccer/fixtures' },
            { label: `${homeTeam?.Name} vs ${awayTeam?.Name}`, href: `/womens/soccer/fixtures/${id}`, current: true },
          ]}
        />
        
        {/* Auto-refresh indicator */}
        {isLive && (
          <div className="mb-4 flex justify-end">
            <AutoRefreshIndicator interval={30000} isActive={isLive} />
          </div>
        )}

        {/* Competition Context */}
        {competition && (
          <Link
            href={`/womens/soccer/competitions/${competition.Id}`}
            className="inline-flex items-center gap-2 mb-6 rounded-full bg-white border border-gray-200 px-4 py-2 hover:border-black transition-colors"
          >
            {competition.Logo_URL__c && (
              <Image
                src={competition.Logo_URL__c}
                alt={competition.Name || ''}
                width={20}
                height={20}
                className="object-contain"
              />
            )}
            <span className="text-sm font-medium">{competition.Name}</span>
          </Link>
        )}

        {/* Match Header */}
        <section className="mb-12 rounded-3xl bg-white border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1 text-center">
              <div className="flex flex-col items-center">
                {homeTeam?.Logo_Url__c && (
                  <Image
                    src={homeTeam.Logo_Url__c}
                    alt={homeTeam.Name || ''}
                    width={80}
                    height={80}
                    className="mb-4"
                  />
                )}
                <h2 className="text-2xl font-bold">{homeTeam?.Name}</h2>
              </div>
            </div>
            
            <div className="px-8 text-center">
              <div className="text-6xl font-bold mb-2">
                {matchData.Home_Score_Final__c || 0} - {matchData.Away_Score_Final__c || 0}
              </div>
              <div className="flex items-center justify-center gap-2 mt-2">
                <LiveIndicator 
                  status={matchData.Status__c || 'Scheduled'} 
                  showPulse={isLive}
                />
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {matchData.Match_Date_Time__c && format(new Date(matchData.Match_Date_Time__c), 'MMM d, yyyy • h:mm a')}
              </div>
            </div>
            
            <div className="flex-1 text-center">
              <div className="flex flex-col items-center">
                {awayTeam?.Logo_Url__c && (
                  <Image
                    src={awayTeam.Logo_Url__c}
                    alt={awayTeam.Name || ''}
                    width={80}
                    height={80}
                    className="mb-4"
                  />
                )}
                <h2 className="text-2xl font-bold">{awayTeam?.Name}</h2>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-gray-600 border-t border-gray-200 pt-4">
            {matchData.Match_Date_Time__c && format(new Date(matchData.Match_Date_Time__c), 'MMMM d, yyyy • h:mm a')}
            {matchData.Venue__c && ` • ${matchData.Venue__c}`}
            {matchData.Attendance__c && ` • Attendance: ${matchData.Attendance__c.toLocaleString()}`}
          </div>
        </section>

        {/* Period Breakdown */}
        {periods.length > 0 && (
          <section className="mb-12">
            <h3 className="text-2xl font-bold mb-6">Score by Period</h3>
            <div className="rounded-3xl bg-white border border-gray-200 p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4">Team</th>
                      {periods.map((period: any) => (
                        <th key={period.Id} className="text-center py-3 px-4">
                          {period.Period_Type__c} {period.Period_Number__c}
                        </th>
                      ))}
                      <th className="text-center py-3 px-4 font-bold">Final</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium">{homeTeam?.Name}</td>
                      {periods.map((period: any) => (
                        <td key={period.Id} className="text-center py-3 px-4">
                          {period.Home_Score__c || 0}
                        </td>
                      ))}
                      <td className="text-center py-3 px-4 font-bold">
                        {matchData.Home_Score_Final__c || 0}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">{awayTeam?.Name}</td>
                      {periods.map((period: any) => (
                        <td key={period.Id} className="text-center py-3 px-4">
                          {period.Away_Score__c || 0}
                        </td>
                      ))}
                      <td className="text-center py-3 px-4 font-bold">
                        {matchData.Away_Score_Final__c || 0}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Match Moments */}
        {moments.length > 0 && (
          <section className="mb-12">
            <h3 className="text-2xl font-bold mb-6">Match Highlights</h3>
            <div className="space-y-4">
              {moments.map((moment: any) => (
                <div key={moment.Id} className="rounded-3xl bg-white border border-gray-200 p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl font-bold text-gray-400">
                      {moment.Event_Minute__c}'
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 rounded-full bg-gray-100 text-sm font-medium">
                          {moment.Event_Type__c}
                        </span>
                        {moment.Primary_Player__r && (
                          <span className="font-medium">{moment.Primary_Player__r.Name}</span>
                        )}
                      </div>
                      {moment.Description__c && (
                        <p className="text-gray-600">{moment.Description__c}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Lineups */}
        {lineups.length > 0 && (
          <section className="mb-12">
            <h3 className="text-2xl font-bold mb-6">Lineups</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {lineups.map((lineup: any) => (
                <div key={lineup.Id} className="rounded-3xl bg-white border border-gray-200 p-6">
                  <h4 className="text-xl font-bold mb-4">{lineup.Team__r?.Name}</h4>
                  {lineup.Formation__c && (
                    <p className="text-sm text-gray-600 mb-4">Formation: {lineup.Formation__c}</p>
                  )}
                  {lineup.Captain__r && (
                    <p className="text-sm text-gray-600 mb-4">
                      Captain: {lineup.Captain__r.Name}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

