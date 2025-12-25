import Image from 'next/image';
import Link from 'next/link';
import { BreadcrumbNav } from '@/components/sports/breadcrumb-nav';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';

async function getTeamData(teamId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    
    const [teamRes, statsRes, squadRes, matchesRes, articlesRes] = await Promise.all([
      fetch(`${baseUrl}/api/sports/teams/${teamId}`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/sports/teams/${teamId}/stats`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/sports/teams/${teamId}/squad`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/sports/matches?team=${teamId}&limit=10`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/sports/articles?team=${teamId}&limit=5`, { cache: 'no-store' }),
    ]);

    const [team, stats, squad, matches, articles] = await Promise.all([
      teamRes.json(),
      statsRes.json(),
      squadRes.json(),
      matchesRes.json(),
      articlesRes.json(),
    ]);

    return {
      team: team.success ? team.data : null,
      stats: stats.success ? stats.data : [],
      squad: squad.success ? squad.data : [],
      matches: matches.success ? matches.data : [],
      articles: articles.success ? articles.data : [],
    };
  } catch (error) {
    console.error('Error fetching team data:', error);
    return null;
  }
}

export default async function WomensTeamDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const data = await getTeamData(params.id);
  
  if (!data || !data.team) {
    notFound();
  }

  const { team, stats, squad, matches, articles } = data;

  return (
    <main className="bg-background">
      <div className="container-main py-8">
        <BreadcrumbNav
          items={[
            { label: 'Home', href: '/' },
            { label: "Women's Sports", href: '/womens' },
            { label: 'Soccer', href: '/womens/soccer' },
            { label: 'Teams', href: '/womens/soccer/teams' },
            { label: team.Name || '', href: `/womens/soccer/teams/${params.id}`, current: true },
          ]}
        />

        {/* Team Header */}
        <section className="mb-8 rounded-3xl bg-white border border-gray-200 p-8">
          <div className="flex items-center gap-8">
            {team.Logo_Url__c && (
              <Image
                src={team.Logo_Url__c}
                alt={team.Name || ''}
                width={120}
                height={120}
                className="flex-shrink-0"
              />
            )}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{team.Name}</h1>
              {team.Abbreviation__c && (
                <p className="text-xl text-gray-600 mb-4">{team.Abbreviation__c}</p>
              )}
              
              <div className="grid grid-cols-4 gap-4 mt-4">
                {team.League__c && (
                  <div>
                    <div className="text-sm text-gray-600">League</div>
                    <div className="text-lg font-medium">{team.League__c}</div>
                  </div>
                )}
                {team.BillingCountry && (
                  <div>
                    <div className="text-sm text-gray-600">Country</div>
                    <div className="text-lg font-medium">{team.BillingCountry}</div>
                  </div>
                )}
                {team.Venue_Name__c && (
                  <div>
                    <div className="text-sm text-gray-600">Stadium</div>
                    <div className="text-lg font-medium">{team.Venue_Name__c}</div>
                  </div>
                )}
                {team.Founded_Year__c && (
                  <div>
                    <div className="text-sm text-gray-600">Founded</div>
                    <div className="text-lg font-medium">{team.Founded_Year__c}</div>
                  </div>
                )}
              </div>
            </div>
            <div className="rounded-full bg-purple-100 text-purple-800 px-4 py-2 text-sm font-medium">
              Women's Soccer
            </div>
          </div>
        </section>

        {/* Team Statistics */}
        {stats.length > 0 && (
          <section className="mb-8 rounded-3xl bg-white border border-gray-200 p-8">
            <h3 className="text-2xl font-bold mb-6">Season Statistics</h3>
            <div className="space-y-4">
              {stats.map((stat: any) => (
                <div key={stat.Id} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold">{stat.Competition__r?.Name}</h4>
                    <span className="text-sm text-gray-600">{stat.Season__r?.Name}</span>
                  </div>
                  <div className="grid grid-cols-5 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Position</div>
                      <div className="text-xl font-bold">{stat.League_Position__c || '-'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Played</div>
                      <div className="text-xl font-bold">{stat.Matches_Played__c || 0}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Won</div>
                      <div className="text-xl font-bold text-green-600">{stat.Wins__c || 0}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Points</div>
                      <div className="text-xl font-bold">{stat.Points__c || 0}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">GD</div>
                      <div className="text-xl font-bold">{stat.Goal_Difference__c || 0}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Squad */}
        {squad.length > 0 && (
          <section className="mb-8 rounded-3xl bg-white border border-gray-200 p-8">
            <h3 className="text-2xl font-bold mb-6">Current Squad</h3>
            <div className="space-y-2">
              {squad.map((member: any) => (
                <Link
                  key={member.Id}
                  href={`/womens/soccer/players/${member.Player__r?.Id}`}
                  className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {member.Player__r?.Profile_Image_URL__c && (
                      <Image
                        src={member.Player__r.Profile_Image_URL__c}
                        alt={member.Player__r.Name || ''}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                    )}
                    <div>
                      <div className="font-bold">{member.Player__r?.Name}</div>
                      <div className="text-sm text-gray-600">{member.Position__c}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    {member.Jersey_Number__c && (
                      <div className="text-2xl font-bold text-gray-400">#{member.Jersey_Number__c}</div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Recent Matches */}
        {matches.length > 0 && (
          <section className="mb-8">
            <h3 className="text-2xl font-bold mb-6">Recent & Upcoming Matches</h3>
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
                      <span className="font-medium">{match.Home_Team__r?.Name}</span>
                    </div>
                    <span className="text-xl font-bold mx-4">{match.Home_Score__c ?? '-'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      {match.Away_Team__r?.Logo_Url__c && (
                        <Image
                          src={match.Away_Team__r.Logo_Url__c}
                          alt={match.Away_Team__r.Name || ''}
                          width={32}
                          height={32}
                        />
                      )}
                      <span className="font-medium">{match.Away_Team__r?.Name}</span>
                    </div>
                    <span className="text-xl font-bold mx-4">{match.Away_Score__c ?? '-'}</span>
                  </div>
                  <div className="text-sm text-gray-600 border-t border-gray-100 pt-4 mt-4">
                    <div>{match.Competition__r?.Name}</div>
                    {match.Match_Date__c && (
                      <div>{format(new Date(match.Match_Date__c), 'MMM d, yyyy')}</div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Team News */}
        {articles.length > 0 && (
          <section className="mb-8">
            <h3 className="text-2xl font-bold mb-6">Latest Team News</h3>
            <div className="space-y-4">
              {articles.map((article: any) => (
                <Link
                  key={article.Id}
                  href={`/articles/${article.Id}`}
                  className="block rounded-3xl bg-white border border-gray-200 p-6 hover:border-black transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {article.Thumbnail_URL__c && (
                      <Image
                        src={article.Thumbnail_URL__c}
                        alt={article.Heading__c || ''}
                        width={120}
                        height={80}
                        className="rounded-lg flex-shrink-0 object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-bold mb-2">{article.Heading__c}</h4>
                      {article.Article_Type__c && (
                        <span className="inline-block px-3 py-1 rounded-full bg-gray-100 text-sm">
                          {article.Article_Type__c}
                        </span>
                      )}
                    </div>
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
