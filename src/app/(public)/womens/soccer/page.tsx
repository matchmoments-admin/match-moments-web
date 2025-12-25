import { CompetitionCard } from '@/components/sports/competition-card';
import { SectionHeader } from '@/components/shared/sections/section-header';
import { BreadcrumbNav } from '@/components/sports/breadcrumb-nav';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Women's Soccer | Match Moments",
  description: "Complete coverage of women's soccer competitions worldwide",
};

async function getPageData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
    
    // Fetch competitions, matches, and moments in parallel
    const [competitionsRes, matchesRes, momentsRes] = await Promise.all([
      fetch(`${baseUrl}/api/sports/competitions?sport=Soccer&gender=Women%27s%20Team&limit=10`, {
        cache: 'no-store',
      }),
      fetch(`${baseUrl}/api/sports/matches?sport=Soccer&gender=Women%27s%20Team&limit=10`, {
        cache: 'no-store',
      }),
      fetch(`${baseUrl}/api/sports/moments/trending?sport=Soccer&gender=Women%27s%20Team&limit=10`, {
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

export default async function WomensSoccerPage() {
  const { competitions, matches, moments } = await getPageData();

  return (
    <main className="bg-background">
      <div className="container-main py-8">
        {/* Breadcrumbs */}
        <BreadcrumbNav
          items={[
            { label: 'Home', href: '/' },
            { label: "Women's Sports", href: '/womens' },
            { label: 'Soccer', href: '/womens/soccer', current: true },
          ]}
        />

        {/* Hero */}
        <section className="mb-12">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-600 to-green-800 p-12 text-white">
            <div className="relative z-10">
              <h1 className="text-5xl font-bold mb-4 flex items-center gap-4">
                <svg className="h-14 w-14" fill="currentColor" viewBox="0 0 24 24" strokeWidth={0}>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <path d="M12 2a10 10 0 0 0 0 20M12 2a10 10 0 0 1 0 20M2 12h20" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <circle cx="12" cy="12" r="3" fill="currentColor"/>
                </svg>
                Women's Soccer
              </h1>
              <p className="text-xl opacity-90 mb-6">
                The world's most popular sport - women's edition
              </p>
              <div className="flex gap-8">
                <div>
                  <div className="text-3xl font-bold">{competitions.length}</div>
                  <div className="text-sm opacity-75">Competitions</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">100+</div>
                  <div className="text-sm opacity-75">Teams</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">3.5B</div>
                  <div className="text-sm opacity-75">Global Fans</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Competitions */}
        {competitions.length > 0 && (
          <section className="mb-12">
            <SectionHeader
              title="Elite Women's Soccer Competitions"
              viewAllHref="/womens/soccer/competitions"
              viewAllText="View All"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {competitions.slice(0, 3).map((competition: any) => (
                <Link
                  key={competition.Id}
                  href={`/womens/soccer/competitions/${competition.Id}`}
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
                  <h3 className="text-xl font-bold mb-2">{competition.Competition_Name__c || competition.Name}</h3>
                  {competition.Country__c && (
                    <p className="text-sm text-gray-600">{competition.Country__c}</p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Live & Upcoming */}
        {matches.length > 0 && (
          <section className="mb-12">
            <SectionHeader
              title="Recent & Upcoming Fixtures"
              viewAllHref="/womens/soccer/fixtures"
              viewAllText="View All"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((match: any) => (
                <Link
                  key={match.Id}
                  href={`/womens/soccer/fixtures/${match.Id}`}
                  className="rounded-3xl bg-white border border-gray-200 p-6 hover:border-black transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
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
                    <span className="text-xl font-bold">{match.Home_Score__c || 0}</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
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
                    <span className="text-xl font-bold">{match.Away_Score__c || 0}</span>
                  </div>
                  <div className="text-sm text-gray-600 border-t border-gray-100 pt-4">
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

        {/* Trending Soccer Moments */}
        {moments.length > 0 && (
          <section className="mb-12">
            <SectionHeader
              title="Trending Women's Soccer Moments"
              description="The best goals, saves, and plays from women's soccer"
            />
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
      </div>
    </main>
  );
}

