import { getSalesforceClient } from '../client';
import type { SF_Competition__c, SF_Team_Season_Stats__c } from '@/types/salesforce/raw';
import type { CompetitionFilters } from '../types';
import type { Competition, TeamSeasonStats } from '@/types/domain';
import { getCached } from '../../cache/redis';
import { CacheKeys, CacheStrategy } from '../../cache/strategies';
import { mapCompetitions, mapCompetition, mapTeamSeasonStatsList } from '@/lib/mappers';

/**
 * Get competitions with flexible filtering
 */
export async function getCompetitions(filters: CompetitionFilters = {}): Promise<Competition[]> {
  const cacheKey = `competitions:${JSON.stringify(filters)}`;
  
  return getCached(
    cacheKey,
    async () => {
      const client = getSalesforceClient();
      
      // Build WHERE clause dynamically
      const conditions: string[] = [];
      
      if (filters.sport) {
        conditions.push(`Sport__c = '${filters.sport}'`);
      }
      if (filters.season) {
        conditions.push(`Season__c = '${filters.season}'`);
      }
      if (filters.country) {
        conditions.push(`Country__c = '${filters.country}'`);
      }
      if (filters.tier) {
        conditions.push(`Tier__c = '${filters.tier}'`);
      }
      
      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
      const limit = filters.limit || 50;

      const sfCompetitions = await client.query<SF_Competition__c>(`
        SELECT 
          Id, Name, ESPN_League_ID__c,
          Sport__c, Tier__c, Country__c,
          Competition_Type__c, Logo_URL__c, Status__c,
          Season__c, Season__r.Id, Season__r.Name, Season__r.Start_Date__c, Season__r.End_Date__c,
          Season__r.Sport__c, Season__r.Season_Type__c
        FROM Competition__c
        ${whereClause}
        ORDER BY Tier__c ASC NULLS LAST, Name ASC
        LIMIT ${limit}
      `);

      return mapCompetitions(sfCompetitions);
    },
    3600
  );
}

/**
 * Get competition by ID
 */
export async function getCompetitionById(competitionId: string): Promise<Competition | null> {
  return getCached(
    `competition:${competitionId}`,
    async () => {
      const client = getSalesforceClient();

      const sfCompetitions = await client.query<SF_Competition__c>(`
        SELECT 
          Id, Name, ESPN_League_ID__c,
          Sport__c, Tier__c, Country__c,
          Competition_Type__c, Logo_URL__c, Status__c,
          Season__c, Season__r.Id, Season__r.Name, Season__r.Start_Date__c, Season__r.End_Date__c,
          Season__r.Sport__c, Season__r.Season_Type__c
        FROM Competition__c
        WHERE Id = '${competitionId}'
        LIMIT 1
      `);

      if (!sfCompetitions || sfCompetitions.length === 0) {
        return null;
      }

      return mapCompetition(sfCompetitions[0]);
    },
    3600
  );
}

/**
 * Get competition standings (league table)
 */
export async function getStandings(competitionId: string, seasonId?: string): Promise<TeamSeasonStats[]> {
  return getCached(
    CacheKeys.STANDINGS(`competition:${competitionId}`),
    async () => {
      const client = getSalesforceClient();
      
      const seasonFilter = seasonId ? `AND Season__c = '${seasonId}'` : '';

      const sfStandings = await client.query<SF_Team_Season_Stats__c>(`
        SELECT 
          Id, Name, League_Position__c,
          Matches_Played__c, Wins__c, Draws__c, Losses__c,
          Goals_For__c, Goals_Against__c, Goal_Difference__c,
          Points__c, Form_Last_5__c, Clean_Sheets__c,
          Team__c, Team__r.Id, Team__r.Name, Team__r.Logo_Url__c, Team__r.Abbreviation__c,
          Competition__c, Competition__r.Name,
          Season__c
        FROM Team_Season_Stats__c
        WHERE Competition__c = '${competitionId}' ${seasonFilter}
        ORDER BY League_Position__c ASC, Points__c DESC, Goal_Difference__c DESC
      `);

      return mapTeamSeasonStatsList(sfStandings);
    },
    CacheStrategy.standings
  );
}

/**
 * Get competition by ESPN ID
 */
export async function getCompetitionByESPNId(espnLeagueId: string) {
  return getCached(
    `competition:espn:${espnLeagueId}`,
    async () => {
      const client = getSalesforceClient();

      const sfCompetitions = await client.query<SF_Competition__c>(`
        SELECT 
          Id, Name, ESPN_League_ID__c,
          Sport__c, Tier__c, Country__c,
          Competition_Type__c, Logo_URL__c, Status__c,
          Season__c, Season__r.Id, Season__r.Name, Season__r.Start_Date__c, Season__r.End_Date__c,
          Season__r.Sport__c, Season__r.Season_Type__c
        FROM Competition__c
        WHERE ESPN_League_ID__c = '${espnLeagueId}'
        LIMIT 1
      `);

      if (!sfCompetitions || sfCompetitions.length === 0) {
        return null;
      }

      return mapCompetition(sfCompetitions[0]);
    },
    3600
  );
}

/**
 * Get competitions by sport
 * Note: Gender filtering removed as Gender_Class__c doesn't exist on Competition__c
 */
export async function getCompetitionsBySport(sport: string) {
  return getCompetitions({
    sport,
    limit: 100
  });
}

/**
 * Get competitions by season
 */
export async function getCompetitionsBySeason(seasonId: string) {
  return getCompetitions({
    season: seasonId,
    limit: 100
  });
}

/**
 * Get featured competitions (Tier 1)
 * Note: Gender filtering removed as Gender_Class__c doesn't exist on Competition__c
 */
export async function getFeaturedCompetitions(sport?: string): Promise<Competition[]> {
  return getCompetitions({
    sport,
    tier: 'Level 1',
    limit: 20
  });
}

