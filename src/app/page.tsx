import Link from 'next/link';
import { ArticleCard } from '@/components/shared/article-card';
import { LiveScore } from '@/components/games/live-score';
import { getLiveFixtures, getTodayFixtures } from '@/lib/salesforce/queries/fixtures';
import { getCached } from '@/lib/cache/redis';
import { CacheKeys, CacheStrategy } from '@/lib/cache/strategies';

async function fetchLiveGames() {
  try {
    return await getCached(CacheKeys.FIXTURES_LIVE, () => getLiveFixtures(), CacheStrategy.fixturesLive);
  } catch {
    return [];
  }
}

async function fetchTodayGames() {
  try {
    return await getCached(CacheKeys.FIXTURES_TODAY, () => getTodayFixtures(), CacheStrategy.fixturesToday);
  } catch {
    return [];
  }
}

export default async function Home() {
  const [liveGames, todayGames] = await Promise.all([fetchLiveGames(), fetchTodayGames()]);

  // Mock articles for layout
  const featuredArticles = [
    {
      title: 'Live Scores, AI-Powered Trivia & Women\'s Sports Coverage',
      description: 'Your ultimate destination for live sports scores, match statistics, trivia, and comprehensive sports coverage.',
      category: 'Sports',
      categoryHref: '/games',
      imageUrl: '/placeholder.jpg',
      imageAlt: 'Sports coverage',
      href: '/games',
    },
  ];

  const articles = [
    {
      title: 'Real-Time Match Updates Across All Major Leagues',
      description: 'Stay up to date with live scores, game statistics, and breaking news from your favorite teams.',
      category: 'Live Scores',
      categoryHref: '/games',
      imageUrl: '/placeholder.jpg',
      imageAlt: 'Live scores',
      href: '/games',
    },
    {
      title: 'Comprehensive Statistics and Player Performance Data',
      description: 'Dive deep into player stats, team standings, and historical performance metrics.',
      category: 'Statistics',
      categoryHref: '/sports/soccer/standings',
      imageUrl: '/placeholder.jpg',
      imageAlt: 'Statistics',
      href: '/sports/soccer/standings',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-[1140px] px-2 py-8">
        {/* Featured Articles Section */}
        <section className="mb-12">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {featuredArticles.map((article, index) => (
              <ArticleCard
                key={index}
                {...article}
                variant="featured"
              />
            ))}
            {articles.slice(0, 1).map((article, index) => (
              <ArticleCard
                key={`standard-${index}`}
                {...article}
                variant="standard"
              />
            ))}
          </div>
        </section>

        {/* Large Featured Article */}
        <section className="mb-12">
          <ArticleCard
            title="Top 10 Sports Moments of 2025"
            description="Explore Match Moments' 10 most captivating sports moments of 2025, from championship victories to record-breaking performances."
            category="Highlights"
            categoryHref="/moments"
            imageUrl="/placeholder.jpg"
            imageAlt="Top sports moments"
            href="/moments"
            variant="featured"
          />
        </section>

        {/* Article Grid */}
        <section className="mb-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <ArticleCard
                key={index}
                {...article}
                variant="standard"
              />
            ))}
            {articles.map((article, index) => (
              <ArticleCard
                key={`repeat-${index}`}
                {...article}
                variant="standard"
              />
            ))}
          </div>
        </section>

        {/* Live Games Section */}
        {liveGames.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-3 w-3 bg-red-500 animate-pulse-live" />
              <h2 className="text-3xl font-bold">Live Now</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {liveGames.slice(0, 3).map((game: any) => (
                <div key={game.Id} className="border border-black/10 p-4">
                  <LiveScore
                    fixture={{
                      id: game.Id,
                      homeTeam: {
                        name: game.Home_Team__r?.Name || 'TBD',
                        logo: game.Home_Team__r?.Logo_URL__c || '/placeholder-team.png',
                        score: game.Home_Score_Final__c || 0,
                      },
                      awayTeam: {
                        name: game.Away_Team__r?.Name || 'TBD',
                        logo: game.Away_Team__r?.Logo_URL__c || '/placeholder-team.png',
                        score: game.Away_Score_Final__c || 0,
                      },
                      status: game.Status__c,
                      currentPeriod: game.Current_Period__r?.Period_Type__c,
                      venue: game.Venue__c,
                    }}
                    onClick={() => (window.location.href = `/games/${game.Id}`)}
                  />
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link href="/games" className="text-xl font-light text-black hover:underline">
                More Recent Games
              </Link>
            </div>
          </section>
        )}

        {/* More Articles Grid */}
        <section>
          <h3 className="text-3xl font-bold mb-6">Popular</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <ArticleCard
                key={`popular-${index}`}
                {...article}
                variant="small"
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
