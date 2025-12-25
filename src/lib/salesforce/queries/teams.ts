import { getSalesforceClient } from '../client';
import type { Account, TeamSeasonStats, TeamMembership, TeamFilters } from '../types';
import { getCached } from '../../cache/redis';
import { CacheKeys, CacheStrategy } from '../../cache/strategies';

/**
 * Get teams with flexible filtering
 */
export async function getTeams(filters: TeamFilters = {}) {
  const cacheKey = `teams:${JSON.stringify(filters)}`;
  
  return getCached(
    cacheKey,
    async () => {
      const client = getSalesforceClient();
      
      // Build WHERE clause dynamically
      const conditions: string[] = ['RecordType.DeveloperName IN (\'Club_Team\', \'National_Team\')'];
      
      if (filters.sport) {
        conditions.push(`Sport__c = '${filters.sport}'`);
      }
      if (filters.gender) {
        conditions.push(`Gender_Class__c = '${filters.gender}'`);
      }
      if (filters.league) {
        conditions.push(`League__c = '${filters.league}'`);
      }
      if (filters.country) {
        conditions.push(`BillingCountry = '${filters.country}'`);
      }
      
      const whereClause = `WHERE ${conditions.join(' AND ')}`;
      const limit = filters.limit || 50;

      const teams = await client.query<Account>(`
        SELECT 
          Id, Name, Abbreviation__c, ESPN_Team_ID__c,
          Sport__c, League__c, Gender_Class__c,
          Logo_Url__c, Primary_Color__c, Secondary_Color__c,
          Venue_Name__c, Founded_Year__c, BillingCountry,
          Total_Awards__c, Total_Trophies__c
        FROM Account
        ${whereClause}
        ORDER BY Name ASC
        LIMIT ${limit}
      `);

      return teams;
    },
    3600
  );
}

/**
 * Get team by ID
 */
export async function getTeamById(teamId: string) {
  return getCached(
    `team:${teamId}`,
    async () => {
      const client = getSalesforceClient();

      const teams = await client.query<Account>(`
        SELECT 
          Id, Name, Abbreviation__c, ESPN_Team_ID__c,
          Sport__c, League__c, Gender_Class__c,
          Logo_Url__c, Primary_Color__c, Secondary_Color__c,
          Venue_Name__c, Founded_Year__c, BillingCountry,
          Website, Phone,
          Total_Awards__c, Total_Trophies__c
        FROM Account
        WHERE Id = '${teamId}'
        LIMIT 1
      `);

      if (!teams || teams.length === 0) {
        return null;
      }

      return teams[0];
    },
    3600
  );
}

/**
 * Get team season stats
 */
export async function getTeamSeasonStats(teamId: string, seasonId?: string) {
  const cacheKey = seasonId ? `team:${teamId}:stats:${seasonId}` : `team:${teamId}:stats`;
  
  return getCached(
    cacheKey,
    async () => {
      const client = getSalesforceClient();
      
      const seasonFilter = seasonId ? `AND Season__c = '${seasonId}'` : '';

      const stats = await client.query<TeamSeasonStats>(`
        SELECT 
          Id, Name,
          Matches_Played__c, Wins__c, Draws__c, Losses__c,
          Goals_For__c, Goals_Against__c, Goal_Difference__c,
          Points__c, Form_Last_5__c, League_Position__c,
          Home_Wins__c, Away_Wins__c, Clean_Sheets__c,
          Competition__r.Id, Competition__r.Name, Competition__r.Logo_URL__c,
          Season__r.Id, Season__r.Name
        FROM Team_Season_Stats__c
        WHERE Team__c = '${teamId}' ${seasonFilter}
        ORDER BY Season__r.Start_Date__c DESC
      `);

      return stats;
    },
    CacheStrategy.standings
  );
}

/**
 * Get team squad (current roster)
 */
export async function getTeamSquad(teamId: string) {
  return getCached(
    `team:${teamId}:squad`,
    async () => {
      const client = getSalesforceClient();

      const squad = await client.query<TeamMembership>(`
        SELECT 
          Id, Name, Status__c, Jersey_Number__c, Position__c,
          Start_Date__c, End_Date__c,
          Player__r.Id, Player__r.Name, Player__r.Profile_Image_URL__c,
          Player__r.Date_of_Birth__c, Player__r.Nationality__c
        FROM Team_Membership__c
        WHERE Team__c = '${teamId}' AND Status__c = 'Active'
        ORDER BY Jersey_Number__c ASC NULLS LAST, Player__r.Name ASC
      `);

      return squad;
    },
    3600
  );
}

/**
 * Get team by ESPN ID
 */
export async function getTeamByESPNId(espnTeamId: string) {
  return getCached(
    `team:espn:${espnTeamId}`,
    async () => {
      const client = getSalesforceClient();

      const teams = await client.query<Account>(`
        SELECT 
          Id, Name, Abbreviation__c, ESPN_Team_ID__c,
          Sport__c, League__c, Gender_Class__c,
          Logo_Url__c, Primary_Color__c, Secondary_Color__c,
          Venue_Name__c, Founded_Year__c
        FROM Account
        WHERE ESPN_Team_ID__c = '${espnTeamId}'
        LIMIT 1
      `);

      if (!teams || teams.length === 0) {
        return null;
      }

      return teams[0];
    },
    3600
  );
}

/**
 * Get teams by league
 */
export async function getTeamsByLeague(league: string, sport?: string) {
  return getTeams({
    league,
    sport,
    limit: 100
  });
}

/**
 * Get teams by sport and gender
 */
export async function getTeamsBySportAndGender(sport: string, gender: string) {
  return getTeams({
    sport,
    gender,
    limit: 100
  });
}

