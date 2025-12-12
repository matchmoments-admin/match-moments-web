import { SportCard } from './sport-card';
import { SportType } from '@/types/sports';

interface SportGridProps {
  showGenderLinks?: boolean;
  className?: string;
}

export function SportGrid({ showGenderLinks = false, className = '' }: SportGridProps) {
  // Top 3 sports - Hero display
  const heroSports: SportType[] = ['soccer', 'cricket', 'basketball'];
  
  // Next tier sports - Regular display
  const regularSports: SportType[] = ['tennis', 'nfl', 'rugby'];
  
  // Growing sports - Compact display with tags
  const growingSports: { sport: SportType; tag: string }[] = [
    { sport: 'padel', tag: 'Growing Fast' },
    { sport: 'pickleball', tag: 'Fastest Growing' },
    { sport: 'skiing', tag: 'Winter Sports' },
  ];

  return (
    <div className={className}>
      {/* Top 3 Hero Cards */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-6">Most Popular Sports</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {heroSports.map((sport) => (
            <SportCard
              key={sport}
              sport={sport}
              variant="hero"
              showGenderLinks={showGenderLinks}
            />
          ))}
        </div>
      </div>

      {/* Regular Sports */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-6">More Sports</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {regularSports.map((sport) => (
            <SportCard
              key={sport}
              sport={sport}
              variant="regular"
              showGenderLinks={showGenderLinks}
            />
          ))}
        </div>
      </div>

      {/* Growing/Emerging Sports */}
      <div>
        <h2 className="text-3xl font-bold mb-6">Emerging Sports</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {growingSports.map(({ sport, tag }) => (
            <SportCard
              key={sport}
              sport={sport}
              variant="compact"
              tag={tag}
              showGenderLinks={showGenderLinks}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

