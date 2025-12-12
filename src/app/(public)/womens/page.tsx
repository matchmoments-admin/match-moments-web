import { GenderNav } from '@/components/sports/gender-nav';
import { SportCard } from '@/components/sports/sport-card';
import { FixtureCard } from '@/components/sports/fixture-card';
import { TrendingTabs } from '@/components/sports/trending-tabs';
import { CompetitionCard } from '@/components/sports/competition-card';
import { SectionHeader } from '@/components/shared/sections/section-header';
import {
  mockWomensCompetitions,
  mockWomensFixtures,
  mockTrendingWomensMoments,
  mockTrendingMensMoments,
  mockAllTrendingMoments,
} from '@/lib/mock-data';
import type { SportType } from '@/types/sports';

export const metadata = {
  title: "Women's Sports | Match Moments",
  description: "60% of our coverage focuses on women's athletes and competitions",
};

export default function WomensHubPage() {
  const womensSports: SportType[] = ['soccer', 'basketball', 'cricket', 'tennis', 'rugby'];

  return (
    <main className="bg-background">
      {/* Hero Section */}
      <section className="bg-black text-white py-16">
        <div className="container-main">
          <div className="text-center mb-8">
            <span className="inline-block rounded bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wide mb-4">
              60% of our coverage
            </span>
            <h1 className="text-5xl font-bold mb-4">Women's Sports</h1>
            <p className="text-xl opacity-90 mb-8">
              Comprehensive coverage of women's athletes and competitions worldwide
            </p>
            
            {/* Stats */}
            <div className="flex justify-center gap-12 mt-12">
              <div>
                <div className="text-4xl font-bold">25+</div>
                <div className="text-sm opacity-75">Competitions</div>
              </div>
              <div>
                <div className="text-4xl font-bold">300+</div>
                <div className="text-sm opacity-75">Teams</div>
              </div>
              <div>
                <div className="text-4xl font-bold">10K+</div>
                <div className="text-sm opacity-75">Moments</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gender Navigation */}
      <section className="py-8 bg-white">
        <div className="container-main">
          <GenderNav currentGender="womens" />
        </div>
      </section>

      {/* Browse Women's Sports */}
      <section className="py-16 bg-secondary">
        <div className="container-main">
          <SectionHeader
            title="Browse Women's Sports"
            description="Explore content from women's competitions worldwide"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {womensSports.map((sport) => (
              <SportCard
                key={sport}
                sport={sport}
                href={`/womens/${sport}`}
                variant="regular"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Women's Fixtures */}
      <section className="py-16 bg-white">
        <div className="container-main">
          <SectionHeader
            title="Women's Fixtures"
            viewAllHref="/womens/soccer/fixtures"
            viewAllText="View All"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockWomensFixtures.map((fixture) => (
              <FixtureCard key={fixture.id} fixture={fixture} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Women's Moments */}
      <section className="py-16 bg-secondary">
        <div className="container-main">
          <SectionHeader
            title="Trending Women's Moments"
            description="The most viral moments from women's sports"
          />
          <TrendingTabs
            womensMoments={mockTrendingWomensMoments}
            mensMoments={mockTrendingMensMoments}
            allMoments={mockAllTrendingMoments}
            defaultTab="womens"
          />
        </div>
      </section>

      {/* Featured Women's Competitions */}
      <section className="py-16 bg-white">
        <div className="container-main">
          <SectionHeader
            title="Featured Women's Competitions"
            viewAllHref="/womens/soccer/competitions"
            viewAllText="View All"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockWomensCompetitions.slice(0, 6).map((competition) => (
              <CompetitionCard
                key={competition.id}
                competition={competition}
                variant="featured"
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

