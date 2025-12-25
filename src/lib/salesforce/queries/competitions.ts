import { getSalesforceClient } from '../client';
import type { Competition, TeamSeasonStats, CompetitionFilters } from '../types';
import { getCached } from '../../cache/redis';
import { CacheKeys, CacheStrategy } from '../../cache/strategies';

/**
 * Get competitions with flexible filtering
 */
export async function getCompetitions(filters: CompetitionFilters = {}) {
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
      if (filters.gender) {
        conditions.push(`Gender_Class__c = '${filters.gender}'`);
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

      const competitions = await client.query<Competition>(`
        SELECT 
          Id, Name, Competition_Name__c, ESPN_League_ID__c,
          Sport__c, Gender_Class__c, Tier__c, Country__c,
          Competition_Type__c, Logo_URL__c,
          Season__r.Id, Season__r.Name, Season__r.Start_Date__c, Season__r.End_Date__c
        FROM Competition__c
        ${whereClause}
        ORDER BY Tier__c ASC NULLS LAST, Name ASC
        LIMIT ${limit}
      `);

      return competitions;
    },
    { ttl: 3600, staleWhileRevalidate: true }
  );
}

/**
 * Get competition by ID
 */
export async function getCompetitionById(competitionId: string) {
  return getCached(
    `competition:${competitionId}`,
    async () => {
      const client = getSalesforceClient();

      const competitions = await client.query<Competition>(`
        SELECT 
          Id, Name, Competition_Name__c, ESPN_League_ID__c,
          Sport__c, Gender_Class__c, Tier__c, Country__c,
          Competition_Type__c, Logo_URL__c,
          Season__r.Id, Season__r.Name, Season__r.Start_Date__c, Season__r.End_Date__c
        FROM Competition__c
        WHERE Id = '${competitionId}'
        LIMIT 1
      `);

      if (!competitions || competitions.length === 0) {
        return null;
      }

      return competitions[0];
    },
    { ttl: 3600, staleWhileRevalidate: true }
  );
}

/**
 * Get competition standings (league table)
 */
export async function getStandings(competitionId: string, seasonId?: string) {
  return getCached(
    CacheKeys.STANDINGS(`competition:${competitionId}`),
    async () => {
      const client = getSalesforceClient();
      
      const seasonFilter = seasonId ? `AND Season__c = '${seasonId}'` : '';

      const standings = await client.query<TeamSeasonStats>(`
        SELECT 
          Id, Name, League_Position__c,
          Matches_Played__c, Wins__c, Draws__c, Losses__c,
          Goals_For__c, Goals_Against__c, Goal_Difference__c,
          Points__c, Form_Last_5__c,
          Team__r.Id, Team__r.Name, Team__r.Logo_Url__c, Team__r.Abbreviation__c
        FROM Team_Season_Stats__c
        WHERE Competition__c = '${competitionId}' ${seasonFilter}
        ORDER BY League_Position__c ASC, Points__c DESC, Goal_Difference__c DESC
      `);

      return standings;
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

      const competitions = await client.query<Competition>(`
        SELECT 
          Id, Name, Competition_Name__c, ESPN_League_ID__c,
          Sport__c, Gender_Class__c, Tier__c, Country__c,
          Competition_Type__c, Logo_URL__c,
          Season__r.Id, Season__r.Name
        FROM Competition__c
        WHERE ESPN_League_ID__c = '${espnLeagueId}'
        LIMIT 1
      `);

      if (!competitions || competitions.length === 0) {
        return null;
      }

      return competitions[0];
    },
    { ttl: 3600, staleWhileRevalidate: true }
  );
}

/**
 * Get competitions by sport and gender
 */
export async function getCompetitionsBySportAndGender(sport: string, gender: string) {
  return getCompetitions({
    sport,
    gender,
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
 */
export async function getFeaturedCompetitions(sport?: string, gender?: string) {
  return getCompetitions({
    sport,
    gender,
    tier: 'Level 1',
    limit: 20
  });
}

