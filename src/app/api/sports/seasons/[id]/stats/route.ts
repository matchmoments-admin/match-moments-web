import { NextRequest, NextResponse } from 'next/server';
import { getSalesforceClient } from '@/lib/salesforce/client';
import { getCached } from '@/lib/cache/redis';
import type { 
  PlayerSeasonStats, 
  TeamSeasonStats, 
  Match 
} from '@/lib/salesforce/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: seasonId } = await params;

    const stats = await getCached(
      `season:stats:${seasonId}`,
      async () => {
        const client = getSalesforceClient();

        // Get all competitions in this season
        const competitions = await client.query(`
          SELECT Id, Name
          FROM Competition__c
          WHERE Season__c = '${seasonId}'
        `);

        if (!competitions || competitions.length === 0) {
          return {
            competitions: [],
            topScorers: [],
            topAssists: [],
            teamStandings: [],
            totalMatches: 0,
            totalGoals: 0,
          };
        }

        const competitionIds = competitions.map((c: any) => c.Id);
        const competitionIdsString = competitionIds.map((id: string) => `'${id}'`).join(',');

        // Get top scorers across all competitions
        const topScorers = await client.query<PlayerSeasonStats>(`
          SELECT 
            Id, Name, Player__c, Player__r.Name, Team__c, Team__r.Name,
            Goals__c, Assists__c, Appearances__c, Minutes_Played__c,
            Competition__c, Competition__r.Name
          FROM Player_Season_Stats__c
          WHERE Competition__c IN (${competitionIdsString})
          ORDER BY Goals__c DESC NULLS LAST
          LIMIT 20
        `);

        // Get top assists across all competitions
        const topAssists = await client.query<PlayerSeasonStats>(`
          SELECT 
            Id, Name, Player__c, Player__r.Name, Team__c, Team__r.Name,
            Goals__c, Assists__c, Appearances__c, Minutes_Played__c,
            Competition__c, Competition__r.Name
          FROM Player_Season_Stats__c
          WHERE Competition__c IN (${competitionIdsString})
          ORDER BY Assists__c DESC NULLS LAST
          LIMIT 20
        `);

        // Get team standings (combined across competitions)
        const teamStandings = await client.query<TeamSeasonStats>(`
          SELECT 
            Id, Name, Team__c, Team__r.Name, Competition__c, Competition__r.Name,
            Matches_Played__c, Wins__c, Draws__c, Losses__c,
            Goals_For__c, Goals_Against__c, Goal_Difference__c, Points__c
          FROM Team_Season_Stats__c
          WHERE Competition__c IN (${competitionIdsString})
          ORDER BY Points__c DESC NULLS LAST, Goal_Difference__c DESC NULLS LAST
        `);

        // Get match statistics
        const matches = await client.query<Match>(`
          SELECT 
            Id, Home_Score_Final__c, Away_Score_Final__c, Status__c
          FROM Match__c
          WHERE Competition__c IN (${competitionIdsString})
        `);

        const totalMatches = matches.length;
        const totalGoals = matches.reduce((sum: number, match: Match) => {
          return sum + (match.Home_Score_Final__c || 0) + (match.Away_Score_Final__c || 0);
        }, 0);

        return {
          competitions: competitions.map((c: any) => ({
            id: c.Id,
            name: c.Name,
          })),
          topScorers,
          topAssists,
          teamStandings,
          totalMatches,
          totalGoals,
        };
      },
      300
    );

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching season stats:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch season stats' 
      },
      { status: 500 }
    );
  }
}

