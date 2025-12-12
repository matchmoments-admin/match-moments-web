import { GenderNav } from '@/components/sports/gender-nav';
import { SportCard } from '@/components/sports/sport-card';
import { FixtureCard } from '@/components/sports/fixture-card';
import { TrendingTabs } from '@/components/sports/trending-tabs';
import { CompetitionCard } from '@/components/sports/competition-card';
import { SectionHeader } from '@/components/shared/sections/section-header';
import {
  mockMensCompetitions,
  mockMensFixtures,
  mockTrendingWomensMoments,
  mockTrendingMensMoments,
  mockAllTrendingMoments,
} from '@/lib/mock-data';
import type { SportType } from '@/types/sports';

export const metadata = {
  title: "Men's Sports | Match Moments",
  description: "Comprehensive coverage of men's sports competitions worldwide",
};

export default function MensHubPage() {
  const mensSports: SportType[] = ['soccer', 'basketball', 'cricket', 'nfl', 'rugby', 'tennis'];

  return (
    <main className="bg-background">
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container-main">
          <div className="text-center mb-8">
            <span className="inline-block rounded bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wide mb-4">
              Comprehensive coverage
            </span>
            <h1 className="text-5xl font-bold mb-4">Men's Sports</h1>
            <p className="text-xl opacity-90 mb-8">
              Complete coverage of men's sports competitions worldwide
            </p>
            
            {/* Stats */}
            <div className="flex justify-center gap-12 mt-12">
              <div>
                <div className="text-4xl font-bold">30+</div>
                <div className="text-sm opacity-75">Competitions</div>
              </div>
              <div>
                <div className="text-4xl font-bold">500+</div>
                <div className="text-sm opacity-75">Teams</div>
              </div>
              <div>
                <div className="text-4xl font-bold">15K+</div>
                <div className="text-sm opacity-75">Moments</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gender Navigation */}
      <section className="py-8 bg-white">
        <div className="container-main">
          <GenderNav currentGender="mens" />
        </div>
      </section>

      {/* Browse Men's Sports */}
      <section className="py-16 bg-secondary">
        <div className="container-main">
          <SectionHeader
            title="Browse Men's Sports"
            description="Explore content from men's competitions worldwide"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {mensSports.map((sport) => (
              <SportCard
                key={sport}
                sport={sport}
                href={`/mens/${sport}`}
                variant="regular"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Men's Fixtures */}
      <section className="py-16 bg-white">
        <div className="container-main">
          <SectionHeader
            title="Men's Fixtures"
            viewAllHref="/mens/soccer/fixtures"
            viewAllText="View All"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockMensFixtures.map((fixture) => (
              <FixtureCard key={fixture.id} fixture={fixture} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Men's Moments */}
      <section className="py-16 bg-secondary">
        <div className="container-main">
          <SectionHeader
            title="Trending Men's Moments"
            description="The most viral moments from men's sports"
          />
          <TrendingTabs
            womensMoments={mockTrendingWomensMoments}
            mensMoments={mockTrendingMensMoments}
            allMoments={mockAllTrendingMoments}
            defaultTab="mens"
          />
        </div>
      </section>

      {/* Featured Men's Competitions */}
      <section className="py-16 bg-white">
        <div className="container-main">
          <SectionHeader
            title="Featured Men's Competitions"
            viewAllHref="/mens/soccer/competitions"
            viewAllText="View All"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockMensCompetitions.slice(0, 3).map((competition) => (
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

