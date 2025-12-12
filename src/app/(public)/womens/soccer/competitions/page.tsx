import { CompetitionCard } from '@/components/sports/competition-card';
import { BreadcrumbNav } from '@/components/sports/breadcrumb-nav';
import { mockWomensCompetitions } from '@/lib/mock-data';

export const metadata = {
  title: "Women's Soccer Competitions | Match Moments",
  description: "All women's soccer leagues and competitions worldwide",
};

export default function WomensSoccerCompetitionsPage() {
  const soccerCompetitions = mockWomensCompetitions.filter((c) => c.sport === 'soccer');

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
      </div>
    </main>
  );
}

