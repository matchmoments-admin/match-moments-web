import { CompetitionCard } from '@/components/sports/competition-card';
import { BreadcrumbNav } from '@/components/sports/breadcrumb-nav';
import { getCompetitions } from '@/lib/data/competitions';

export const metadata = {
  title: "Women's Soccer Competitions | Match Moments",
  description: "All women's soccer leagues and competitions worldwide",
};

export const revalidate = 1800; // ISR: 30 minutes

export default async function WomensSoccerCompetitionsPage() {
  const soccerCompetitions = await getCompetitions({
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
            { label: 'Competitions', href: '/womens/soccer/competitions', current: true },
          ]}
        />

        <h1 className="text-5xl font-bold mb-8">Women's Soccer Competitions</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {soccerCompetitions.map((competition) => (
            <CompetitionCard
              key={competition.id}
              competition={competition}
              variant="standard"
            />
          ))}
        </div>
        {soccerCompetitions.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No women's soccer competitions available at the moment.
          </div>
        )}
      </div>
    </main>
  );
}

