import Link from 'next/link';
import { ArticleCard } from '@/components/shared/article-card';
import { LiveScore } from '@/components/games/live-score';
import { getTodayFixtures, getLiveFixtures, getUpcomingFixtures } from '@/lib/salesforce/queries/fixtures';
import { getCached } from '@/lib/cache/redis';
import { CacheKeys, CacheStrategy } from '@/lib/cache/strategies';

export const dynamic = 'force-dynamic';

async function fetchLiveGames() {
  return getCached(CacheKeys.FIXTURES_LIVE, () => getLiveFixtures(), CacheStrategy.fixturesLive);
}

async function fetchTodayGames() {
  return getCached(CacheKeys.FIXTURES_TODAY, () => getTodayFixtures(), CacheStrategy.fixturesToday);
}

async function fetchUpcomingGames() {
  return getCached(CacheKeys.FIXTURES_UPCOMING, () => getUpcomingFixtures(), CacheStrategy.fixturesUpcoming);
}

export default async function GamesPage() {
  const [liveGames, todayGames, upcomingGames] = await Promise.all([
    fetchLiveGames(),
    fetchTodayGames(),
    fetchUpcomingGames(),
  ]);

  // Convert games to article cards format
  const gameArticles = [...todayGames, ...upcomingGames].slice(0, 12).map((game: any) => ({
    title: `${game.Home_Team__r?.Name || 'TBD'} vs ${game.Away_Team__r?.Name || 'TBD'}`,
    description: `${game.Competition__r?.Name || 'Game'} - ${game.Venue__c || 'Venue TBD'}`,
    category: game.Competition__r?.Name || 'Games',
    categoryHref: '/games',
    imageUrl: '/placeholder.jpg',
    imageAlt: `${game.Home_Team__r?.Name} vs ${game.Away_Team__r?.Name}`,
    href: `/games/${game.Id}`,
  }));

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-[1140px] px-2 py-8">
        {/* Page Title */}
        <h1 className="text-[60px] font-bold leading-[72px] mb-8">Games</h1>

        {/* Featured Game - If Live */}
        {liveGames.length > 0 && (
          <section className="mb-12">
            <ArticleCard
              title={`${liveGames[0].Home_Team__r?.Name || 'Team'} vs ${liveGames[0].Away_Team__r?.Name || 'Team'}`}
              description={`Live: ${liveGames[0].Home_Score__c || 0} - ${liveGames[0].Away_Score__c || 0}`}
              category="Live Now"
              categoryHref="/games"
              imageUrl="/placeholder.jpg"
              imageAlt="Live game"
              href={`/games/${liveGames[0].Id}`}
              variant="featured"
            />
          </section>
        )}

        {/* Games Grid */}
        <section>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gameArticles.map((article, index) => (
              <ArticleCard
                key={index}
                {...article}
                variant="standard"
              />
            ))}
          </div>
        </section>

        {/* Load More */}
        <div className="mt-12 text-center">
          <Link href="/games?offset=12" className="text-xl font-light text-black hover:underline">
            More Recent Games
          </Link>
        </div>
      </main>
    </div>
  );
}


