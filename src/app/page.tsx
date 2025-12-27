import { GenderNavCards } from '@/components/sports/gender-nav';
import { SportGrid } from '@/components/sports/sport-grid';
import { TrendingTabs } from '@/components/sports/trending-tabs';
import { FixtureCard } from '@/components/sports/fixture-card';
import { SectionHeader } from '@/components/shared/sections/section-header';
import { CompetitionCard } from '@/components/sports/competition-card';
import { getLiveMatchesForDisplay, getUpcomingMatchesForDisplay } from '@/lib/data/matches';
import { getTrendingMoments } from '@/lib/data/moments';
import { getFeaturedCompetitions } from '@/lib/data/competitions';

export const revalidate = 300; // ISR: 5 minutes

export default async function HomePage() {
  // Fetch real data from Salesforce
  const [liveMatches, upcomingMatches, moments, competitions] = await Promise.all([
    getLiveMatchesForDisplay().catch(() => []),
    getUpcomingMatchesForDisplay().catch(() => []),
    getTrendingMoments({ limit: 12 }).catch(() => []),
    getFeaturedCompetitions({ gender: 'womens', limit: 3 }).catch(() => []),
  ]);
  
  // Split moments by gender for tabs
  const womensMoments = moments.filter(m => m.gender === 'womens');
  const mensMoments = moments.filter(m => m.gender === 'mens');
  
  // Combine live and upcoming for "today" section
  const allFixtures = [...liveMatches, ...upcomingMatches];

  return (
    <main className="bg-background">
      {/* Hero Section - Gender-First Navigation */}
      <section className="bg-white py-16">
        <div className="container-main">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">Match Moments</h1>
            <p className="text-xl text-gray-600">
              Your 24/7 sports companion focusing on women's sports
            </p>
          </div>

          {/* Gender Navigation Cards */}
          <GenderNavCards />
        </div>
      </section>

      {/* Sports Grid Section */}
      <section className="py-16 bg-secondary">
        <div className="container-main">
          <SectionHeader
            title="Browse by Sport"
            description="Explore content from the world's most popular sports"
          />
          <SportGrid showGenderLinks />
        </div>
      </section>

      {/* Trending Moments Section */}
      <section className="py-16 bg-white">
        <div className="container-main">
          <SectionHeader
            title="Trending Moments"
            description="The most viral sports moments right now"
          />
          <TrendingTabs
            womensMoments={womensMoments}
            mensMoments={mensMoments}
            allMoments={moments}
            defaultTab="womens"
          />
        </div>
      </section>

      {/* Live & Upcoming Fixtures */}
      <section className="py-16 bg-secondary">
        <div className="container-main">
          <SectionHeader
            title={liveMatches.length > 0 ? "Live Now & Upcoming" : "Today's Fixtures"}
            viewAllHref="/games"
            viewAllText="View All"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allFixtures.slice(0, 6).map((fixture) => (
              <FixtureCard key={fixture.id} fixture={fixture} />
            ))}
          </div>
          {allFixtures.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No matches scheduled at the moment. Check back soon!
            </div>
          )}
        </div>
      </section>

      {/* Featured Women's Competitions */}
      <section className="py-16 bg-white">
        <div className="container-main">
          <SectionHeader
            title="Featured Women's Competitions"
            viewAllHref="/womens"
            viewAllText="View All"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {competitions.slice(0, 3).map((competition) => (
              <CompetitionCard
                key={competition.id}
                competition={competition}
                variant="featured"
              />
            ))}
          </div>
          {competitions.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No featured competitions available at the moment.
            </div>
          )}
        </div>
      </section>

      {/* Special Project Callout */}
      <section className="py-16 bg-secondary">
        <div className="container-main">
          <div className="relative overflow-hidden rounded-3xl bg-primary p-12 text-primary-foreground">
            <div className="relative z-10">
              <span className="inline-block rounded bg-primary-foreground/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary-foreground">
                Special Project
              </span>
              <h2 className="mt-4 text-4xl font-bold text-primary-foreground">
                The Best Moments in Sports History
              </h2>
              <p className="mt-4 text-lg opacity-90 text-primary-foreground">
                Explore our complete archive of sports coverage, analysis, and memorable moments
                from across all major leagues and events.
              </p>
              <a
                href="/womens"
                className="mt-6 inline-block rounded-full bg-primary-foreground px-6 py-3 text-base font-medium text-primary transition-opacity hover:opacity-90"
              >
                Explore Now
              </a>
            </div>
            {/* Decorative background pattern */}
            <div className="absolute right-0 top-0 h-full w-1/2 opacity-10">
              <div className="h-full w-full bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:24px_24px]"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-white">
        <div className="container-main">
          <div className="rounded-3xl bg-secondary p-8 md:p-12">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="section-heading-large">Match Moments Newsletter</h2>
              <p className="text-metadata mt-4 text-lg">
                Get the latest sports news and analysis delivered to your inbox
              </p>
              <form className="mt-8 flex flex-col gap-4 sm:flex-row">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 rounded-full border border-border px-6 py-3 focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-metadata mt-4 text-sm">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
