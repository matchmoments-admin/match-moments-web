import { SportCard } from '@/components/sports/sport-card';
import { CompetitionCard } from '@/components/sports/competition-card';
import { FixtureCard } from '@/components/sports/fixture-card';
import { TrendingTabs } from '@/components/sports/trending-tabs';
import { SectionHeader } from '@/components/shared/sections/section-header';
import { BreadcrumbNav } from '@/components/sports/breadcrumb-nav';
import {
  mockWomensCompetitions,
  mockWomensFixtures,
  mockTrendingWomensMoments,
  mockTrendingMensMoments,
  mockAllTrendingMoments,
} from '@/lib/mock-data';

export const metadata = {
  title: "Women's Soccer | Match Moments",
  description: "Complete coverage of women's soccer competitions worldwide",
};

export default function WomensSoccerPage() {
  const soccerCompetitions = mockWomensCompetitions.filter((c) => c.sport === 'soccer');
  const soccerFixtures = mockWomensFixtures.filter((f) => f.sport === 'soccer');
  const soccerMoments = mockTrendingWomensMoments.filter((m) => m.sport === 'soccer');

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
              <h1 className="text-5xl font-bold mb-4">⚽ Women's Soccer</h1>
              <p className="text-xl opacity-90 mb-6">
                The world's most popular sport - women's edition
              </p>
              <div className="flex gap-8">
                <div>
                  <div className="text-3xl font-bold">{soccerCompetitions.length}</div>
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
        <section className="mb-12">
          <SectionHeader
            title="Elite Women's Soccer Competitions"
            viewAllHref="/womens/soccer/competitions"
            viewAllText="View All"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {soccerCompetitions.slice(0, 3).map((competition) => (
              <CompetitionCard
                key={competition.id}
                competition={competition}
                variant="featured"
              />
            ))}
          </div>
        </section>

        {/* Live & Upcoming */}
        <section className="mb-12">
          <SectionHeader
            title="Live & Upcoming Fixtures"
            viewAllHref="/womens/soccer/fixtures"
            viewAllText="View All"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {soccerFixtures.map((fixture) => (
              <FixtureCard key={fixture.id} fixture={fixture} />
            ))}
          </div>
        </section>

        {/* Trending Soccer Moments */}
        <section className="mb-12">
          <SectionHeader
            title="Trending Women's Soccer Moments"
            description="The best goals, saves, and plays from women's soccer"
          />
          <TrendingTabs
            womensMoments={soccerMoments}
            mensMoments={mockTrendingMensMoments.filter((m) => m.sport === 'soccer')}
            allMoments={mockAllTrendingMoments.filter((m) => m.sport === 'soccer')}
            defaultTab="womens"
          />
        </section>
      </div>
    </main>
  );
}

