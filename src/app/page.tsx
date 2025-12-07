import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LiveScore } from '@/components/games/live-score';
import { getLiveFixtures, getTodayFixtures } from '@/lib/salesforce/queries/fixtures';
import { getCached } from '@/lib/cache/redis';
import { CacheKeys, CacheStrategy } from '@/lib/cache/strategies';
import { Trophy, BarChart3, Brain, Heart } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative mx-auto max-w-screen-2xl overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
        {/* Category Badge */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex rounded-full bg-black px-8 py-3 text-2xl font-bold text-white">Sports</div>
        </div>

        {/* Hero Article */}
        <article className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-400 to-green-600">
          <div className="relative h-[500px]">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h2 className="mb-4 text-balance text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
                Live Scores, AI-Powered Trivia & Women&apos;s Sports Coverage
              </h2>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                  <span className="text-xs font-bold">MM</span>
                </div>
                <span>By Match Moments Team</span>
                <span>•</span>
                <span>Dec. 7, 2025</span>
              </div>
            </div>
          </div>
        </article>
      </section>

      {/* Live Games Section */}
      {liveGames.length > 0 && (
        <section className="py-12 bg-neutral-50">
          <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse-live" />
                <h2 className="text-3xl font-bold">Live Now</h2>
              </div>
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/games">View All</Link>
              </Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {liveGames.slice(0, 3).map((game: any) => (
                <LiveScore
                  key={game.Id}
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
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Everything Sports in One Place</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Trophy className="h-6 w-6" />,
                title: 'Live Scores',
                description: 'Real-time match updates across multiple sports and competitions',
              },
              {
                icon: <BarChart3 className="h-6 w-6" />,
                title: 'Statistics',
                description: 'Comprehensive stats, standings, and player performance data',
              },
              {
                icon: <Brain className="h-6 w-6" />,
                title: 'AI-Powered Trivia',
                description: 'Test your knowledge with questions generated from real match data',
              },
              {
                icon: <Heart className="h-6 w-6 fill-red-500 text-red-500" />,
                title: "Women's Sports",
                description: "60% of our coverage dedicated to women's sports",
              },
            ].map((feature, index) => (
              <article key={index} className="group cursor-pointer overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-all hover:shadow-lg">
                <div className="p-6 text-center">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-neutral-100 mb-4 transition-transform group-hover:scale-110">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-neutral-600">{feature.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Dive In?</h2>
          <p className="text-xl mb-8 text-balance">
            Explore live games, test your sports knowledge, and discover comprehensive statistics
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="rounded-full font-semibold">
              <Link href="/games">Explore Games</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full border-white bg-transparent text-white hover:bg-white hover:text-green-600">
              <Link href="/questions">Try Trivia</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
