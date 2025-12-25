import { notFound } from 'next/navigation';
import { BreadcrumbNav } from '@/components/sports/breadcrumb-nav';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface Season {
  Id: string;
  Name: string;
  Start_Date__c: string;
  End_Date__c: string;
  Sport__c: string;
  Season_Type__c: string;
}

interface PlayerSeasonStats {
  Id: string;
  Name: string;
  Player__c: string;
  Player__r: { Name: string };
  Team__c: string;
  Team__r: { Name: string };
  Goals__c: number;
  Assists__c: number;
  Appearances__c: number;
  Minutes_Played__c: number;
  Competition__c: string;
  Competition__r: { Name: string };
}

interface TeamSeasonStats {
  Id: string;
  Name: string;
  Team__c: string;
  Team__r: { Name: string };
  Competition__c: string;
  Competition__r: { Name: string };
  Matches_Played__c: number;
  Wins__c: number;
  Draws__c: number;
  Losses__c: number;
  Goals_For__c: number;
  Goals_Against__c: number;
  Goal_Difference__c: number;
  Points__c: number;
}

interface SeasonStats {
  competitions: Array<{ id: string; name: string }>;
  topScorers: PlayerSeasonStats[];
  topAssists: PlayerSeasonStats[];
  teamStandings: TeamSeasonStats[];
  totalMatches: number;
  totalGoals: number;
}

async function getSeasonData(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  
  const [seasonRes, statsRes] = await Promise.all([
    fetch(`${baseUrl}/api/sports/seasons/${id}`, {
      next: { revalidate: 300 },
    }),
    fetch(`${baseUrl}/api/sports/seasons/${id}/stats`, {
      next: { revalidate: 300 },
    }),
  ]);

  if (!seasonRes.ok) return null;

  const seasonData = await seasonRes.json();
  const statsData = statsRes.ok ? await statsRes.json() : { success: false };

  return {
    season: seasonData.data as Season,
    stats: statsData.success ? (statsData.data as SeasonStats) : null,
  };
}

export default async function WomensSeasonDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const data = await getSeasonData(params.id);

  if (!data || !data.season) {
    notFound();
  }

  const { season, stats } = data;

  const breadcrumbItems = [
    { label: "Women's Sports", href: '/womens' },
    { label: 'Soccer', href: '/womens/soccer' },
    { label: 'Seasons', href: '/womens/soccer/seasons' },
    { label: season.Name },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <BreadcrumbNav items={breadcrumbItems} />

      {/* Season Header */}
      <div className="mt-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">{season.Name}</h1>
            <div className="flex items-center gap-3 text-muted-foreground">
              <span>
                {format(new Date(season.Start_Date__c), 'MMM d, yyyy')} - {format(new Date(season.End_Date__c), 'MMM d, yyyy')}
              </span>
              <Badge variant="secondary">{season.Season_Type__c}</Badge>
              <Badge variant="outline">{season.Sport__c}</Badge>
            </div>
          </div>
        </div>

        {/* Season Stats Summary */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-1">Competitions</div>
              <div className="text-3xl font-bold">{stats.competitions.length}</div>
            </Card>
            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-1">Total Matches</div>
              <div className="text-3xl font-bold">{stats.totalMatches}</div>
            </Card>
            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-1">Total Goals</div>
              <div className="text-3xl font-bold">{stats.totalGoals}</div>
            </Card>
            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-1">Goals Per Match</div>
              <div className="text-3xl font-bold">
                {stats.totalMatches > 0 ? (stats.totalGoals / stats.totalMatches).toFixed(2) : '0'}
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Competitions in Season */}
      {stats && stats.competitions.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Competitions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.competitions.map((competition) => (
              <Link
                key={competition.id}
                href={`/womens/soccer/competitions/${competition.id}`}
                className="block"
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <h3 className="font-semibold text-lg">{competition.name}</h3>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Season Leaderboards */}
      {stats && (
        <Tabs defaultValue="scorers" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="scorers">Top Scorers</TabsTrigger>
            <TabsTrigger value="assists">Top Assists</TabsTrigger>
            <TabsTrigger value="teams">Team Standings</TabsTrigger>
          </TabsList>

          <TabsContent value="scorers">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Season Top Scorers</h2>
              <p className="text-muted-foreground mb-6">
                Combined across all competitions in {season.Name}
              </p>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2">Rank</th>
                      <th className="text-left py-3 px-4">Player</th>
                      <th className="text-left py-3 px-4">Team</th>
                      <th className="text-left py-3 px-4">Competition</th>
                      <th className="text-center py-3 px-4">Goals</th>
                      <th className="text-center py-3 px-4">Assists</th>
                      <th className="text-center py-3 px-4">Apps</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.topScorers.map((player, index) => (
                      <tr key={player.Id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-2 font-semibold">{index + 1}</td>
                        <td className="py-3 px-4">
                          <Link
                            href={`/womens/soccer/players/${player.Player__c}`}
                            className="hover:underline font-medium"
                          >
                            {player.Player__r?.Name || 'Unknown'}
                          </Link>
                        </td>
                        <td className="py-3 px-4">
                          <Link
                            href={`/womens/soccer/teams/${player.Team__c}`}
                            className="text-muted-foreground hover:underline"
                          >
                            {player.Team__r?.Name || 'Unknown'}
                          </Link>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {player.Competition__r?.Name || 'Unknown'}
                        </td>
                        <td className="py-3 px-4 text-center font-bold">{player.Goals__c || 0}</td>
                        <td className="py-3 px-4 text-center">{player.Assists__c || 0}</td>
                        <td className="py-3 px-4 text-center">{player.Appearances__c || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="assists">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Season Top Assists</h2>
              <p className="text-muted-foreground mb-6">
                Combined across all competitions in {season.Name}
              </p>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2">Rank</th>
                      <th className="text-left py-3 px-4">Player</th>
                      <th className="text-left py-3 px-4">Team</th>
                      <th className="text-left py-3 px-4">Competition</th>
                      <th className="text-center py-3 px-4">Assists</th>
                      <th className="text-center py-3 px-4">Goals</th>
                      <th className="text-center py-3 px-4">Apps</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.topAssists.map((player, index) => (
                      <tr key={player.Id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-2 font-semibold">{index + 1}</td>
                        <td className="py-3 px-4">
                          <Link
                            href={`/womens/soccer/players/${player.Player__c}`}
                            className="hover:underline font-medium"
                          >
                            {player.Player__r?.Name || 'Unknown'}
                          </Link>
                        </td>
                        <td className="py-3 px-4">
                          <Link
                            href={`/womens/soccer/teams/${player.Team__c}`}
                            className="text-muted-foreground hover:underline"
                          >
                            {player.Team__r?.Name || 'Unknown'}
                          </Link>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {player.Competition__r?.Name || 'Unknown'}
                        </td>
                        <td className="py-3 px-4 text-center font-bold">{player.Assists__c || 0}</td>
                        <td className="py-3 px-4 text-center">{player.Goals__c || 0}</td>
                        <td className="py-3 px-4 text-center">{player.Appearances__c || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="teams">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Team Standings</h2>
              <p className="text-muted-foreground mb-6">
                Combined standings across all competitions in {season.Name}
              </p>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2">Pos</th>
                      <th className="text-left py-3 px-4">Team</th>
                      <th className="text-left py-3 px-4">Competition</th>
                      <th className="text-center py-3 px-2">P</th>
                      <th className="text-center py-3 px-2">W</th>
                      <th className="text-center py-3 px-2">D</th>
                      <th className="text-center py-3 px-2">L</th>
                      <th className="text-center py-3 px-2">GF</th>
                      <th className="text-center py-3 px-2">GA</th>
                      <th className="text-center py-3 px-2">GD</th>
                      <th className="text-center py-3 px-2 font-bold">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.teamStandings.map((team, index) => (
                      <tr key={team.Id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-2 font-semibold">{index + 1}</td>
                        <td className="py-3 px-4">
                          <Link
                            href={`/womens/soccer/teams/${team.Team__c}`}
                            className="hover:underline font-medium"
                          >
                            {team.Team__r?.Name || 'Unknown'}
                          </Link>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {team.Competition__r?.Name || 'Unknown'}
                        </td>
                        <td className="py-3 px-2 text-center">{team.Matches_Played__c || 0}</td>
                        <td className="py-3 px-2 text-center">{team.Wins__c || 0}</td>
                        <td className="py-3 px-2 text-center">{team.Draws__c || 0}</td>
                        <td className="py-3 px-2 text-center">{team.Losses__c || 0}</td>
                        <td className="py-3 px-2 text-center">{team.Goals_For__c || 0}</td>
                        <td className="py-3 px-2 text-center">{team.Goals_Against__c || 0}</td>
                        <td className="py-3 px-2 text-center">
                          {team.Goal_Difference__c || 0}
                        </td>
                        <td className="py-3 px-2 text-center font-bold">{team.Points__c || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

