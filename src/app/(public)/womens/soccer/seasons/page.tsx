import { BreadcrumbNav } from '@/components/sports/breadcrumb-nav';
import { format } from 'date-fns';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface Season {
  Id: string;
  Name: string;
  Start_Date__c: string;
  End_Date__c: string;
  Sport__c: string;
  Season_Type__c: string;
}

async function getSeasonsData() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  
  const res = await fetch(`${baseUrl}/api/sports/seasons?sport=Soccer`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) return [];

  const data = await res.json();
  return data.data as Season[];
}

export default async function WomensSeasonsPage() {
  const seasons = await getSeasonsData();

  const breadcrumbItems = [
    { label: "Women's Sports", href: '/womens' },
    { label: 'Soccer', href: '/womens/soccer' },
    { label: 'Seasons' },
  ];

  // Separate current and past seasons
  const today = new Date();
  const currentSeasons = seasons.filter(
    (season) =>
      new Date(season.Start_Date__c) <= today && new Date(season.End_Date__c) >= today
  );
  const pastSeasons = seasons.filter(
    (season) => new Date(season.End_Date__c) < today
  );
  const futureSeasons = seasons.filter(
    (season) => new Date(season.Start_Date__c) > today
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <BreadcrumbNav items={breadcrumbItems} />

      <div className="mt-6 mb-8">
        <h1 className="text-4xl font-bold mb-2">Women's Soccer Seasons</h1>
        <p className="text-muted-foreground">
          Browse current and past seasons with comprehensive statistics and standings
        </p>
      </div>

      {/* Current Seasons */}
      {currentSeasons.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Current Season</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentSeasons.map((season) => (
              <Link key={season.Id} href={`/womens/soccer/seasons/${season.Id}`}>
                <Card className="p-6 hover:shadow-lg transition-shadow h-full">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold">{season.Name}</h3>
                    <Badge variant="default">Current</Badge>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Started:</span>{' '}
                      {format(new Date(season.Start_Date__c), 'MMM d, yyyy')}
                    </div>
                    <div>
                      <span className="font-medium">Ends:</span>{' '}
                      {format(new Date(season.End_Date__c), 'MMM d, yyyy')}
                    </div>
                    <div>
                      <Badge variant="outline" className="mt-2">
                        {season.Season_Type__c}
                      </Badge>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Future Seasons */}
      {futureSeasons.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Upcoming Seasons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {futureSeasons.map((season) => (
              <Link key={season.Id} href={`/womens/soccer/seasons/${season.Id}`}>
                <Card className="p-6 hover:shadow-lg transition-shadow h-full">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold">{season.Name}</h3>
                    <Badge variant="secondary">Upcoming</Badge>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Starts:</span>{' '}
                      {format(new Date(season.Start_Date__c), 'MMM d, yyyy')}
                    </div>
                    <div>
                      <span className="font-medium">Ends:</span>{' '}
                      {format(new Date(season.End_Date__c), 'MMM d, yyyy')}
                    </div>
                    <div>
                      <Badge variant="outline" className="mt-2">
                        {season.Season_Type__c}
                      </Badge>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Past Seasons */}
      {pastSeasons.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Past Seasons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastSeasons.map((season) => (
              <Link key={season.Id} href={`/womens/soccer/seasons/${season.Id}`}>
                <Card className="p-6 hover:shadow-lg transition-shadow h-full opacity-90">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold">{season.Name}</h3>
                    <Badge variant="outline">Completed</Badge>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div>
                      {format(new Date(season.Start_Date__c), 'MMM d, yyyy')} -{' '}
                      {format(new Date(season.End_Date__c), 'MMM d, yyyy')}
                    </div>
                    <div>
                      <Badge variant="outline" className="mt-2">
                        {season.Season_Type__c}
                      </Badge>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {seasons.length === 0 && (
        <Card className="p-12 text-center">
          <h3 className="text-xl font-semibold mb-2">No Seasons Available</h3>
          <p className="text-muted-foreground">
            Check back later for season information
          </p>
        </Card>
      )}
    </div>
  );
}

