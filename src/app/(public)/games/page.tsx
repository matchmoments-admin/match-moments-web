import Link from 'next/link';
import { ArticleCard } from '@/components/shared/article-card';
import { getLiveMatchesForDisplay, getTodayMatchesForDisplay, getUpcomingMatchesForDisplay } from '@/lib/data/matches';

export const dynamic = 'force-dynamic';

export default async function GamesPage() {
  // Fetch matches with error handling
  const [liveGames, todayGames, upcomingGames] = await Promise.all([
    getLiveMatchesForDisplay().catch(() => []),
    getTodayMatchesForDisplay().catch(() => []),
    getUpcomingMatchesForDisplay().catch(() => []),
  ]);

  // Convert games to article cards format
  const gameArticles = [...todayGames, ...upcomingGames].slice(0, 12).map((game: any) => ({
    title: `${game.homeTeam?.name || 'TBD'} vs ${game.awayTeam?.name || 'TBD'}`,
    description: `${game.competition?.name || 'Game'} - ${game.venue || 'Venue TBD'}`,
    category: game.competition?.name || 'Games',
    categoryHref: '/games',
    imageUrl: '/placeholder.jpg',
    imageAlt: `${game.homeTeam?.name} vs ${game.awayTeam?.name}`,
    href: `/games/${game.id}`,
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
              title={`${liveGames[0].homeTeam?.name || 'Team'} vs ${liveGames[0].awayTeam?.name || 'Team'}`}
              description={`Live: ${liveGames[0].homeScore || 0} - ${liveGames[0].awayScore || 0}`}
              category="Live Now"
              categoryHref="/games"
              imageUrl="/placeholder.jpg"
              imageAlt="Live game"
              href={`/games/${liveGames[0].id}`}
              variant="featured"
            />
          </section>
        )}

        {/* Games Grid */}
        <section>
          {gameArticles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gameArticles.map((article, index) => (
                <ArticleCard
                  key={index}
                  {...article}
                  variant="standard"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-3xl">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold mb-2">No Games Available</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                There are no scheduled games at the moment. Check back soon for upcoming matches!
              </p>
            </div>
          )}
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


