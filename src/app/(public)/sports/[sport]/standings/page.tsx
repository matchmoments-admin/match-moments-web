import { Card } from '@/components/ui/card';
import { DataTable, Column } from '@/components/shared/data-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getStandings, getTopScorers, getTopAssists } from '@/lib/salesforce/queries/stats';
import { getCached } from '@/lib/cache/redis';
import { CacheKeys, CacheStrategy } from '@/lib/cache/strategies';
import Image from 'next/image';

async function fetchStandings(sport: string) {
  return getCached(CacheKeys.STANDINGS(sport), () => getStandings(sport), CacheStrategy.standings);
}

async function fetchTopScorers(sport: string) {
  return getCached(CacheKeys.TOP_SCORERS(sport), () => getTopScorers(sport), CacheStrategy.topScorers);
}

async function fetchTopAssists(sport: string) {
  return getCached(CacheKeys.TOP_ASSISTS(sport), () => getTopAssists(sport), CacheStrategy.topScorers);
}

export default async function StandingsPage({
  params,
}: {
  params: { sport: string };
}) {
  const [standings, topScorers, topAssists] = await Promise.all([
    fetchStandings(params.sport),
    fetchTopScorers(params.sport),
    fetchTopAssists(params.sport),
  ]);

  const standingsColumns: Column[] = [
    {
      key: 'Position__c',
      label: 'Pos',
      align: 'center',
      sortable: true,
      render: (value: number) => <div className="font-bold">{value || '-'}</div>,
    },
    {
      key: 'team',
      label: 'Team',
      render: (_: any, row: any) => (
        <div className="flex items-center gap-3">
          <div className="relative h-6 w-6">
            <Image
              src={row.Team__r?.Logo_URL__c || '/placeholder-team.png'}
              alt={row.Team__r?.Name}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <span className="font-semibold">{row.Team__r?.Name}</span>
        </div>
      ),
    },
    {
      key: 'Matches_Played__c',
      label: 'P',
      align: 'center',
      sortable: true,
    },
    {
      key: 'Wins__c',
      label: 'W',
      align: 'center',
      sortable: true,
    },
    {
      key: 'Draws__c',
      label: 'D',
      align: 'center',
      sortable: true,
    },
    {
      key: 'Losses__c',
      label: 'L',
      align: 'center',
      sortable: true,
    },
    {
      key: 'Goal_Difference__c',
      label: 'GD',
      align: 'center',
      sortable: true,
      render: (value: number) => (
        <span
          className={
            value > 0
              ? 'text-green-600'
              : value < 0
              ? 'text-red-600'
              : ''
          }
        >
          {value > 0 ? '+' : ''}
          {value || 0}
        </span>
      ),
    },
    {
      key: 'Points__c',
      label: 'Pts',
      align: 'center',
      sortable: true,
      className: 'font-bold text-lg',
    },
    {
      key: 'Form_Last_5__c',
      label: 'Form',
      align: 'center',
      render: (value: string) => {
        if (!value) return '-';
        return (
          <div className="flex gap-1 justify-center">
            {value.split('').map((result, i) => (
              <div
                key={i}
                className={`
                  h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold
                  ${result === 'W' ? 'bg-green-600 text-white' : ''}
                  ${result === 'D' ? 'bg-gray-400 text-white' : ''}
                  ${result === 'L' ? 'bg-red-600 text-white' : ''}
                `}
              >
                {result}
              </div>
            ))}
          </div>
        );
      },
    },
  ];

  const scorersColumns: Column[] = [
    {
      key: 'rank',
      label: 'Rank',
      align: 'center',
      render: (_: any, _row: any, index: number) => (
        <div className="font-bold text-lg">{index !== undefined ? index + 1 : '-'}</div>
      ),
    },
    {
      key: 'player',
      label: 'Player',
      render: (_: any, row: any) => (
        <div className="flex items-center gap-3">
          {row.Player__r?.Photo_URL__c && (
            <div className="relative h-8 w-8">
              <Image
                src={row.Player__r.Photo_URL__c}
                alt={row.Player__r.Name}
                fill
                className="rounded-full object-cover"
              />
            </div>
          )}
          <div>
            <div className="font-semibold">{row.Player__r?.Name}</div>
            <div className="text-sm text-muted-foreground">{row.Team__r?.Name}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'Goals__c',
      label: 'Goals',
      align: 'center',
      sortable: true,
      className: 'font-bold text-lg',
    },
    {
      key: 'Assists__c',
      label: 'Assists',
      align: 'center',
      sortable: true,
    },
    {
      key: 'Appearances__c',
      label: 'Apps',
      align: 'center',
      sortable: true,
    },
    {
      key: 'Goals_Per_90__c',
      label: 'G/90',
      align: 'center',
      sortable: true,
      render: (value: number) => (value ? value.toFixed(2) : '-'),
    },
  ];

  const assistsColumns: Column[] = [
    {
      key: 'rank',
      label: 'Rank',
      align: 'center',
      render: (_: any, _row: any, index: number) => (
        <div className="font-bold text-lg">{index !== undefined ? index + 1 : '-'}</div>
      ),
    },
    {
      key: 'player',
      label: 'Player',
      render: (_: any, row: any) => (
        <div className="flex items-center gap-3">
          {row.Player__r?.Photo_URL__c && (
            <div className="relative h-8 w-8">
              <Image
                src={row.Player__r.Photo_URL__c}
                alt={row.Player__r.Name}
                fill
                className="rounded-full object-cover"
              />
            </div>
          )}
          <div>
            <div className="font-semibold">{row.Player__r?.Name}</div>
            <div className="text-sm text-muted-foreground">{row.Team__r?.Name}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'Assists__c',
      label: 'Assists',
      align: 'center',
      sortable: true,
      className: 'font-bold text-lg',
    },
    {
      key: 'Goals__c',
      label: 'Goals',
      align: 'center',
      sortable: true,
    },
    {
      key: 'Appearances__c',
      label: 'Apps',
      align: 'center',
      sortable: true,
    },
    {
      key: 'Assists_Per_90__c',
      label: 'A/90',
      align: 'center',
      sortable: true,
      render: (value: number) => (value ? value.toFixed(2) : '-'),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 capitalize">{params.sport} Standings</h1>
        <p className="text-muted-foreground">Current season rankings and statistics</p>
      </div>

      <Tabs defaultValue="table" className="w-full">
        <TabsList className="w-full md:w-auto mb-6">
          <TabsTrigger value="table">League Table</TabsTrigger>
          <TabsTrigger value="scorers">Top Scorers</TabsTrigger>
          <TabsTrigger value="assists">Assists</TabsTrigger>
        </TabsList>

        <TabsContent value="table">
          <DataTable columns={standingsColumns} data={standings} />
        </TabsContent>

        <TabsContent value="scorers">
          <DataTable columns={scorersColumns} data={topScorers} />
        </TabsContent>

        <TabsContent value="assists">
          <DataTable columns={assistsColumns} data={topAssists} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

