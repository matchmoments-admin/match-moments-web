import Image from 'next/image';
import Link from 'next/link';
import { BreadcrumbNav } from '@/components/sports/breadcrumb-nav';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';

async function getCompetitionData(competitionId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    
    const [competitionRes, standingsRes, matchesRes, topScorersRes] = await Promise.all([
      fetch(`${baseUrl}/api/sports/competitions/${competitionId}`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/sports/competitions/${competitionId}/standings`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/sports/matches?competition=${competitionId}&limit=20`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/sports/competitions/${competitionId}/top-scorers?limit=10`, { cache: 'no-store' }),
    ]);

    const [competition, standings, matches, topScorers] = await Promise.all([
      competitionRes.json(),
      standingsRes.json(),
      matchesRes.json(),
      topScorersRes.json(),
    ]);

    return {
      competition: competition.success ? competition.data : null,
      standings: standings.success ? standings.data : [],
      matches: matches.success ? matches.data : [],
      topScorers: topScorers.success ? topScorers.data : [],
    };
  } catch (error) {
    console.error('Error fetching competition data:', error);
    return null;
  }
}

export default async function WomensCompetitionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getCompetitionData(id);
  
  if (!data || !data.competition) {
    notFound();
  }

  const { competition, standings, matches, topScorers } = data;

  return (
    <main className="bg-background">
      <div className="container-main py-8">
        <BreadcrumbNav
          items={[
            { label: 'Home', href: '/' },
            { label: "Women's Sports", href: '/womens' },
            { label: 'Soccer', href: '/womens/soccer' },
            { label: 'Competitions', href: '/womens/soccer/competitions' },
            { label: competition.Name || '', href: `/womens/soccer/competitions/${id}`, current: true },
          ]}
        />

        {/* Competition Header */}
        <section className="mb-8 rounded-3xl bg-white border border-gray-200 p-8">
          <div className="flex items-center gap-6">
            {competition.Logo_URL__c && (
              <div className="relative h-24 w-24">
                <Image
                  src={competition.Logo_URL__c}
                  alt={competition.Name || ''}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{competition.Name}</h1>
              <p className="text-lg text-gray-600">
                {competition.Country__c && `${competition.Country__c} • `}
                {competition.Season__r?.Name}
              </p>
              {competition.Tier__c && (
                <p className="text-sm text-gray-500 mt-2">
                  {competition.Tier__c}
                </p>
              )}
            </div>
            <div className="rounded-full bg-purple-100 text-purple-800 px-4 py-2 text-sm font-medium">
              Women's Soccer
            </div>
          </div>
        </section>

        {/* League Standings */}
        {standings.length > 0 && (
          <section className="mb-8">
            <h3 className="text-2xl font-bold mb-6">Standings</h3>
            <div className="rounded-3xl bg-white border border-gray-200 p-6 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 w-12">#</th>
                    <th className="text-left py-3 px-4">Team</th>
                    <th className="text-center py-3 px-2 w-16">P</th>
                    <th className="text-center py-3 px-2 w-16">W</th>
                    <th className="text-center py-3 px-2 w-16">D</th>
                    <th className="text-center py-3 px-2 w-16">L</th>
                    <th className="text-center py-3 px-2 w-20">GD</th>
                    <th className="text-center py-3 px-2 w-20 font-bold">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((standing: any, index: number) => (
                    <tr key={standing.Id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2 font-medium">{standing.League_Position__c || index + 1}</td>
                      <td className="py-3 px-4">
                        <Link href={`/womens/soccer/teams/${standing.Team__r?.Id}`} className="flex items-center gap-3 hover:underline">
                          {standing.Team__r?.Logo_Url__c && (
                            <Image
                              src={standing.Team__r.Logo_Url__c}
                              alt={standing.Team__r.Name || ''}
                              width={24}
                              height={24}
                            />
                          )}
                          <span className="font-medium">{standing.Team__r?.Name}</span>
                        </Link>
                      </td>
                      <td className="text-center py-3 px-2">{standing.Matches_Played__c || 0}</td>
                      <td className="text-center py-3 px-2">{standing.Wins__c || 0}</td>
                      <td className="text-center py-3 px-2">{standing.Draws__c || 0}</td>
                      <td className="text-center py-3 px-2">{standing.Losses__c || 0}</td>
                      <td className="text-center py-3 px-2">{standing.Goal_Difference__c || 0}</td>
                      <td className="text-center py-3 px-2 font-bold">{standing.Points__c || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Top Scorers */}
        {topScorers.length > 0 && (
          <section className="mb-8">
            <h3 className="text-2xl font-bold mb-6">Top Scorers</h3>
            <div className="rounded-3xl bg-white border border-gray-200 p-6">
              <div className="space-y-3">
                {topScorers.map((scorer: any, index: number) => (
                  <Link
                    key={scorer.Id}
                    href={`/womens/soccer/players/${scorer.Player__r?.Id}`}
                    className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold text-gray-400 w-8">{index + 1}</span>
                      {scorer.Player__r?.Profile_Image_URL__c && (
                        <Image
                          src={scorer.Player__r.Profile_Image_URL__c}
                          alt={scorer.Player__r.Name || ''}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      )}
                      <div>
                        <div className="font-bold">{scorer.Player__r?.Name}</div>
                        <div className="text-sm text-gray-600">{scorer.Team__r?.Name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{scorer.Goals__c || 0}</div>
                      <div className="text-xs text-gray-600">goals</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Fixtures */}
        {matches.length > 0 && (
          <section className="mb-8">
            <h3 className="text-2xl font-bold mb-6">Fixtures & Results</h3>
            <div className="space-y-4">
              {matches.map((match: any) => (
                <Link
                  key={match.Id}
                  href={`/womens/soccer/fixtures/${match.Id}`}
                  className="block rounded-3xl bg-white border border-gray-200 p-6 hover:border-black transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3 flex-1">
                      {match.Home_Team__r?.Logo_Url__c && (
                        <Image
                          src={match.Home_Team__r.Logo_Url__c}
                          alt={match.Home_Team__r.Name || ''}
                          width={32}
                          height={32}
                        />
                      )}
                      <span className="font-medium">{match.Home_Team__r?.Abbreviation__c || match.Home_Team__r?.Name}</span>
                    </div>
                    <span className="text-xl font-bold mx-4">{match.Home_Score_Final__c ?? '-'}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3 flex-1">
                      {match.Away_Team__r?.Logo_Url__c && (
                        <Image
                          src={match.Away_Team__r.Logo_Url__c}
                          alt={match.Away_Team__r.Name || ''}
                          width={32}
                          height={32}
                        />
                      )}
                      <span className="font-medium">{match.Away_Team__r?.Abbreviation__c || match.Away_Team__r?.Name}</span>
                    </div>
                    <span className="text-xl font-bold mx-4">{match.Away_Score_Final__c ?? '-'}</span>
                  </div>
                  <div className="text-sm text-gray-600 border-t border-gray-100 pt-4">
                    {match.Match_Date_Time__c && format(new Date(match.Match_Date_Time__c), 'MMM d, yyyy • h:mm a')}
                    {match.Status__c && ` • ${match.Status__c}`}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
