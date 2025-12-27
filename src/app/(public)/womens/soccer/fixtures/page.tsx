import { FixtureCard } from '@/components/sports/fixture-card';
import { BreadcrumbNav } from '@/components/sports/breadcrumb-nav';
import { getMatches } from '@/lib/data/matches';

export const metadata = {
  title: "Women's Soccer Fixtures | Match Moments",
  description: "All women's soccer matches and results",
};

export const revalidate = 300; // ISR: 5 minutes

export default async function WomensSoccerFixturesPage() {
  const soccerFixtures = await getMatches({
    sport: 'soccer',
    gender: "Women's Team",
    limit: 50
  }).catch(() => []);

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
        {soccerFixtures.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No women's soccer fixtures available at the moment.
          </div>
        )}
      </div>
    </main>
  );
}

