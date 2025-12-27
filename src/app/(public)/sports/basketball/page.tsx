import { SectionHeader } from '@/components/shared/sections/section-header';
import { BreadcrumbNav } from '@/components/sports/breadcrumb-nav';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { SPORT_METADATA } from '@/types/sports';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Basketball | Match Moments",
  description: "Complete coverage of basketball competitions worldwide - NBA, WNBA & more",
};

async function getPageData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    
    const [competitionsRes, matchesRes, momentsRes] = await Promise.all([
      fetch(`${baseUrl}/api/sports/competitions?sport=Basketball&limit=12`, {
        cache: 'no-store',
      }),
      fetch(`${baseUrl}/api/sports/matches?sport=Basketball&limit=12`, {
        cache: 'no-store',
      }),
      fetch(`${baseUrl}/api/sports/moments/trending?sport=Basketball&limit=12`, {
        cache: 'no-store',
      }),
    ]);

    const [competitions, matches, moments] = await Promise.all([
      competitionsRes.json(),
      matchesRes.json(),
      momentsRes.json(),
    ]);

    return {
      competitions: competitions.success ? competitions.data : [],
      matches: matches.success ? matches.data : [],
      moments: moments.success ? moments.data : [],
    };
  } catch (error) {
    console.error('Error fetching page data:', error);
    return {
      competitions: [],
      matches: [],
      moments: [],
    };
  }
}

export default async function BasketballPage() {
  const { competitions, matches, moments } = await getPageData();
  const sport = SPORT_METADATA.basketball;

  return (
    <main className="bg-background">
      <div className="container-main py-8">
        <BreadcrumbNav
          items={[
            { label: 'Home', href: '/' },
            { label: 'Sports', href: '/sports' },
            { label: sport.name, href: '/sports/basketball', current: true },
          ]}
        />

        <section className="mb-12">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-600 to-orange-800 p-12 text-white">
            <div className="relative z-10">
              <h1 className="text-5xl font-bold mb-4 flex items-center gap-4">
                <span className="text-6xl">🏀</span>
                {sport.name}
              </h1>
              <p className="text-xl opacity-90 mb-6">
                Fast-paced action from NBA, WNBA, and basketball leagues worldwide
              </p>
              <div className="flex gap-8">
                <div>
                  <div className="text-3xl font-bold">{sport.globalFans}</div>
                  <div className="text-sm opacity-75">Global Fans</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">{competitions.length}+</div>
                  <div className="text-sm opacity-75">Competitions</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">{matches.length}+</div>
                  <div className="text-sm opacity-75">Recent Matches</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/womens/basketball" className="group">
              <div className="relative overflow-hidden rounded-3xl bg-black p-8 text-white transition-transform hover:scale-[1.02]">
                <h3 className="text-3xl font-bold mb-2">Women's Basketball</h3>
                <p className="text-lg opacity-90">WNBA, NCAA & international leagues</p>
              </div>
            </Link>
            <Link href="/mens/basketball" className="group">
              <div className="relative overflow-hidden rounded-3xl bg-gray-100 p-8 text-black transition-transform hover:scale-[1.02]">
                <h3 className="text-3xl font-bold mb-2">Men's Basketball</h3>
                <p className="text-lg opacity-75">NBA, NCAA & international leagues</p>
              </div>
            </Link>
          </div>
        </section>

        {competitions.length > 0 && (
          <section className="mb-12">
            <SectionHeader
              title="Basketball Competitions"
              description="Top basketball leagues and tournaments worldwide"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {competitions.slice(0, 8).map((competition: any) => (
                <Link
                  key={competition.Id}
                  href={`/sports/basketball/competitions/${competition.Id}`}
                  className="rounded-3xl bg-white border border-gray-200 p-6 hover:border-black transition-colors"
                >
                  {competition.Logo_URL__c && (
                    <Image
                      src={competition.Logo_URL__c}
                      alt={competition.Name || ''}
                      width={60}
                      height={60}
                      className="mb-4"
                    />
                  )}
                  <h3 className="text-xl font-bold mb-2">{competition.Name}</h3>
                  {competition.Country__c && (
                    <p className="text-sm text-gray-600">{competition.Country__c}</p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {matches.length > 0 && (
          <section className="mb-12">
            <SectionHeader
              title="Recent & Upcoming Games"
              description="Latest basketball games and upcoming matchups"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.slice(0, 9).map((match: any) => (
                <Link
                  key={match.Id}
                  href={`/games/${match.Id}`}
                  className="rounded-3xl bg-white border border-gray-200 p-6 hover:border-black transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      {match.Home_Team__r?.Logo_Url__c && (
                        <Image
                          src={match.Home_Team__r.Logo_Url__c}
                          alt={match.Home_Team__r.Name || ''}
                          width={32}
                          height={32}
                        />
                      )}
                      <span className="font-medium truncate">{match.Home_Team__r?.Abbreviation__c || match.Home_Team__r?.Name}</span>
                    </div>
                    <span className="text-xl font-bold">{match.Home_Score_Final__c ?? '-'}</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      {match.Away_Team__r?.Logo_Url__c && (
                        <Image
                          src={match.Away_Team__r.Logo_Url__c}
                          alt={match.Away_Team__r.Name || ''}
                          width={32}
                          height={32}
                        />
                      )}
                      <span className="font-medium truncate">{match.Away_Team__r?.Abbreviation__c || match.Away_Team__r?.Name}</span>
                    </div>
                    <span className="text-xl font-bold">{match.Away_Score_Final__c ?? '-'}</span>
                  </div>
                  <div className="text-sm text-gray-600 border-t border-gray-100 pt-4">
                    <div className="truncate">{match.Competition__r?.Name}</div>
                    {match.Match_Date_Time__c && (
                      <div>{format(new Date(match.Match_Date_Time__c), 'MMM d, yyyy')}</div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {moments.length > 0 && (
          <section className="mb-12">
            <SectionHeader
              title="Trending Basketball Moments"
              description="The best dunks, blocks, and plays from basketball"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {moments.slice(0, 6).map((moment: any) => (
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
                  {moment.Primary_Player__r && (
                    <p className="text-sm text-gray-600 mb-2">{moment.Primary_Player__r.Name}</p>
                  )}
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

        {competitions.length === 0 && matches.length === 0 && moments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No basketball data available at the moment.</p>
            <p className="text-gray-400 mt-2">Check back soon for the latest competitions and matches!</p>
          </div>
        )}
      </div>
    </main>
  );
}

