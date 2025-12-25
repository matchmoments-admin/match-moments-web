import Image from 'next/image';
import Link from 'next/link';
import { BreadcrumbNav } from '@/components/sports/breadcrumb-nav';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';

function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

async function getPlayerData(playerId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    
    const [playerRes, statsRes, awardsRes, careerRes, momentsRes] = await Promise.all([
      fetch(`${baseUrl}/api/sports/players/${playerId}`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/sports/players/${playerId}/stats`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/sports/players/${playerId}/awards`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/sports/players/${playerId}/career`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/sports/moments?player=${playerId}&limit=10`, { cache: 'no-store' }),
    ]);

    const [player, stats, awards, career, moments] = await Promise.all([
      playerRes.json(),
      statsRes.json(),
      awardsRes.json(),
      careerRes.json(),
      momentsRes.json(),
    ]);

    return {
      player: player.success ? player.data : null,
      stats: stats.success ? stats.data : [],
      awards: awards.success ? awards.data : [],
      career: career.success ? career.data : [],
      moments: moments.success ? moments.data : [],
    };
  } catch (error) {
    console.error('Error fetching player data:', error);
    return null;
  }
}

export default async function WomensPlayerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getPlayerData(id);
  
  if (!data || !data.player) {
    notFound();
  }

  const { player, stats, awards, career, moments } = data;
  
  // Group awards by category
  const groupedAwards = awards.reduce((acc: any, award: any) => {
    const category = award.Award_Category__c || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(award);
    return acc;
  }, {});

  // Get current team from career
  const currentTeam = career.find((c: any) => c.Status__c === 'Active');

  return (
    <main className="bg-background">
      <div className="container-main py-8">
        <BreadcrumbNav
          items={[
            { label: 'Home', href: '/' },
            { label: "Women's Sports", href: '/womens' },
            { label: 'Soccer', href: '/womens/soccer' },
            { label: 'Players', href: '/womens/soccer/players' },
            { label: player.Name || '', href: `/womens/soccer/players/${id}`, current: true },
          ]}
        />

        {/* Player Header */}
        <section className="mb-8 rounded-3xl bg-white border border-gray-200 p-8">
          <div className="flex items-center gap-8">
            {player.Profile_Image_URL__c && (
              <div className="relative h-32 w-32 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={player.Profile_Image_URL__c}
                  alt={player.Name || ''}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{player.Name}</h1>
              <p className="text-xl text-gray-600 mb-4">{player.Position__c}</p>
              
              {currentTeam && (
                <Link
                  href={`/womens/soccer/teams/${currentTeam.Team__r?.Id}`}
                  className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 hover:bg-gray-200 transition-colors mb-4"
                >
                  <span className="text-sm font-medium">{currentTeam.Team__r?.Name}</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}

              <div className="grid grid-cols-3 gap-4 mt-4">
                {player.Jersey_Number__c && (
                  <div>
                    <div className="text-sm text-gray-600">Number</div>
                    <div className="text-2xl font-bold">#{player.Jersey_Number__c}</div>
                  </div>
                )}
                {player.Nationality__c && (
                  <div>
                    <div className="text-sm text-gray-600">Nationality</div>
                    <div className="text-lg font-medium">{player.Nationality__c}</div>
                  </div>
                )}
                {player.Date_of_Birth__c && (
                  <div>
                    <div className="text-sm text-gray-600">Age</div>
                    <div className="text-lg font-medium">{calculateAge(player.Date_of_Birth__c)}</div>
                  </div>
                )}
              </div>
            </div>
            <div className="rounded-full bg-purple-100 text-purple-800 px-4 py-2 text-sm font-medium">
              Women's Soccer
            </div>
          </div>
        </section>

        {/* Stats Section */}
        {stats.length > 0 && (
          <section className="mb-8 rounded-3xl bg-white border border-gray-200 p-8">
            <h3 className="text-2xl font-bold mb-6">Season Statistics</h3>
            <div className="space-y-4">
              {stats.map((stat: any) => (
                <div key={stat.Id} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold">{stat.Competition__r?.Name}</h4>
                    <span className="text-sm text-gray-600">{stat.Season__r?.Name}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Appearances</div>
                      <div className="text-xl font-bold">{stat.Appearances__c || 0}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Goals</div>
                      <div className="text-xl font-bold">{stat.Goals__c || 0}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Assists</div>
                      <div className="text-xl font-bold">{stat.Assists__c || 0}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Minutes</div>
                      <div className="text-xl font-bold">{stat.Minutes_Played__c || 0}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Awards Section - Transfermarkt Style */}
        {awards.length > 0 && (
          <section className="mb-8 rounded-3xl bg-white border border-gray-200 p-8">
            <h3 className="text-2xl font-bold mb-6">Awards & Honors</h3>
            {Object.entries(groupedAwards).map(([category, categoryAwards]: [string, any]) => (
              <div key={category} className="mb-6 last:mb-0">
                <h4 className="text-lg font-bold mb-3 text-gray-700">{category}</h4>
                <div className="space-y-2">
                  {categoryAwards.map((award: any) => (
                    <div key={award.Id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-3">
                        {award.Icon_URL__c && (
                          <Image
                            src={award.Icon_URL__c}
                            alt={award.Award_Type__c || ''}
                            width={24}
                            height={24}
                          />
                        )}
                        <div>
                          <div className="font-medium">
                            {award.Count__c && award.Count__c > 1 && `${award.Count__c}x `}
                            {award.Award_Type__c}
                          </div>
                          {award.Details__c && (
                            <div className="text-sm text-gray-600">{award.Details__c}</div>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        {award.Season_Name__c || award.Year__c}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Career History Section */}
        {career.length > 0 && (
          <section className="mb-8 rounded-3xl bg-white border border-gray-200 p-8">
            <h3 className="text-2xl font-bold mb-6">Career History</h3>
            <div className="space-y-4">
              {career.map((club: any) => (
                <div key={club.Id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-4">
                    {club.Team__r?.Logo_Url__c && (
                      <Image
                        src={club.Team__r.Logo_Url__c}
                        alt={club.Team__r.Name || ''}
                        width={40}
                        height={40}
                      />
                    )}
                    <div>
                      <div className="font-bold">{club.Team__r?.Name}</div>
                      <div className="text-sm text-gray-600">
                        {club.Position__c}
                        {club.Jersey_Number__c && ` • #${club.Jersey_Number__c}`}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {club.Start_Date__c && format(new Date(club.Start_Date__c), 'MMM yyyy')} - 
                      {club.End_Date__c ? format(new Date(club.End_Date__c), 'MMM yyyy') : 'Present'}
                    </div>
                    <div className="text-sm text-gray-600">{club.Status__c}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Player Moments */}
        {moments.length > 0 && (
          <section className="mb-8">
            <h3 className="text-2xl font-bold mb-6">Player Highlights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {moments.map((moment: any) => (
                <div key={moment.Id} className="rounded-3xl bg-white border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-gray-100 text-sm font-medium">
                      {moment.Event_Type__c}
                    </span>
                    {moment.Viral_Score__c && (
                      <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm font-medium">
                        🔥 {moment.Viral_Score__c}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold mb-2">{moment.Social_Share_Title__c || moment.Description__c}</h4>
                  {moment.Match__r && (
                    <p className="text-xs text-gray-500">
                      {moment.Match__r.Home_Team__r?.Name} vs {moment.Match__r.Away_Team__r?.Name}
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

