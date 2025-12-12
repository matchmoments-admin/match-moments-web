import { FixtureCard } from '@/components/sports/fixture-card';
import { BreadcrumbNav } from '@/components/sports/breadcrumb-nav';
import { mockWomensFixtures } from '@/lib/mock-data';

export const metadata = {
  title: "Women's Soccer Fixtures | Match Moments",
  description: "All women's soccer matches and results",
};

export default function WomensSoccerFixturesPage() {
  const soccerFixtures = mockWomensFixtures.filter((f) => f.sport === 'soccer');

  return (
    <main className="bg-background">
      <div className="container-main py-8">
        <BreadcrumbNav
          items={[
            { label: 'Home', href: '/' },
            { label: "Women's Sports", href: '/womens' },
            { label: 'Soccer', href: '/womens/soccer' },
            { label: 'Fixtures', href: '/womens/soccer/fixtures', current: true },
          ]}
        />

        <h1 className="text-5xl font-bold mb-8">Women's Soccer Fixtures</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {soccerFixtures.map((fixture) => (
            <FixtureCard key={fixture.id} fixture={fixture} />
          ))}
        </div>
      </div>
    </main>
  );
}

