import { Suspense } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LiveScore } from '@/components/games/live-score';
import { DataTable, Column } from '@/components/shared/data-table';
import { getTodayFixtures, getLiveFixtures, getUpcomingFixtures } from '@/lib/salesforce/queries/fixtures';
import { getCached } from '@/lib/cache/redis';
import { CacheKeys, CacheStrategy } from '@/lib/cache/strategies';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

async function fetchLiveGames() {
  return getCached(CacheKeys.FIXTURES_LIVE, () => getLiveFixtures(), CacheStrategy.fixturesLive);
}

async function fetchTodayGames() {
  return getCached(CacheKeys.FIXTURES_TODAY, () => getTodayFixtures(), CacheStrategy.fixturesToday);
}

async function fetchUpcomingGames() {
  return getCached(CacheKeys.FIXTURES_UPCOMING, () => getUpcomingFixtures(), CacheStrategy.fixturesUpcoming);
}

export default async function GamesPage() {
  const [liveGames, todayGames, upcomingGames] = await Promise.all([
    fetchLiveGames(),
    fetchTodayGames(),
    fetchUpcomingGames(),
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Games</h1>
        <p className="text-muted-foreground">
          Live scores, schedules, and results across all competitions
        </p>
      </div>

      {/* Live Games Highlight */}
      {liveGames.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse-live" />
            <h2 className="text-2xl font-bold">Live Now</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveGames.map((game: any) => (
              <LiveScore
                key={game.Id}
                fixture={{
                  id: game.Id,
                  homeTeam: {
                    name: game.Home_Team__r?.Name || 'TBD',
                    logo: game.Home_Team__r?.Logo_URL__c || '/placeholder-team.png',
                    score: game.Home_Score_Final__c || 0,
                  },
                  awayTeam: {
                    name: game.Away_Team__r?.Name || 'TBD',
                    logo: game.Away_Team__r?.Logo_URL__c || '/placeholder-team.png',
                    score: game.Away_Score_Final__c || 0,
                  },
                  status: game.Status__c,
                  currentPeriod: game.Current_Period__r?.Period_Type__c,
                  venue: game.Venue__c,
                }}
                onClick={() => (window.location.href = `/games/${game.Id}`)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Tabbed Content */}
      <Tabs defaultValue="today" className="w-full">
        <TabsList className="w-full md:w-auto mb-6">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <GamesTable games={todayGames} />
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <GamesTable games={upcomingGames} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function GamesTable({ games }: { games: any[] }) {
  const columns: Column[] = [
    {
      key: 'time',
      label: 'Time',
      render: (_: any, row: any) => {
        if (!row.Fixture_DateTime__c) return '-';
        return (
          <div className="text-sm">
            {format(new Date(row.Fixture_DateTime__c), 'HH:mm')}
          </div>
        );
      },
    },
    {
      key: 'homeTeam',
      label: 'Home',
      render: (_: any, row: any) => (
        <div className="flex items-center gap-2">
          <img
            src={row.Home_Team__r?.Logo_URL__c || '/placeholder-team.png'}
            alt={row.Home_Team__r?.Name}
            className="h-6 w-6 rounded-full object-cover"
          />
          <span className="font-semibold">{row.Home_Team__r?.Name || 'TBD'}</span>
        </div>
      ),
    },
    {
      key: 'score',
      label: 'Score',
      align: 'center',
      render: (_: any, row: any) => (
        <div className="font-mono font-bold">
          {row.Home_Score_Final__c || 0} - {row.Away_Score_Final__c || 0}
        </div>
      ),
    },
    {
      key: 'awayTeam',
      label: 'Away',
      render: (_: any, row: any) => (
        <div className="flex items-center gap-2">
          <img
            src={row.Away_Team__r?.Logo_URL__c || '/placeholder-team.png'}
            alt={row.Away_Team__r?.Name}
            className="h-6 w-6 rounded-full object-cover"
          />
          <span className="font-semibold">{row.Away_Team__r?.Name || 'TBD'}</span>
        </div>
      ),
    },
    {
      key: 'competition',
      label: 'Competition',
      render: (_: any, row: any) => (
        <div className="text-sm text-muted-foreground">
          {row.Competition__r?.Name || '-'}
        </div>
      ),
    },
    {
      key: 'venue',
      label: 'Venue',
      render: (value: string) => (
        <div className="text-sm text-muted-foreground">{value || '-'}</div>
      ),
    },
  ];

  return <DataTable columns={columns} data={games} onRowClick={(row) => (window.location.href = `/games/${row.Id}`)} />;
}

