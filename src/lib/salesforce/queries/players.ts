import { getSalesforceClient } from '../client';
import type { Contact, PlayerSeasonStats, Award, TeamMembership, PlayerFilters } from '../types';
import { getCached } from '../../cache/redis';
import { CacheKeys, CacheStrategy } from '../../cache/strategies';

/**
 * Get players with flexible filtering
 */
export async function getPlayers(filters: PlayerFilters = {}) {
  const cacheKey = `players:${JSON.stringify(filters)}`;
  
  return getCached(
    cacheKey,
    async () => {
      const client = getSalesforceClient();
      
      // Build WHERE clause dynamically
      const conditions: string[] = ['RecordType.DeveloperName = \'Player\''];
      
      if (filters.position) {
        conditions.push(`Position__c = '${filters.position}'`);
      }
      if (filters.nationality) {
        conditions.push(`Nationality__c = '${filters.nationality}'`);
      }
      
      const whereClause = `WHERE ${conditions.join(' AND ')}`;
      const limit = filters.limit || 50;

      const players = await client.query<Contact>(`
        SELECT 
          Id, Name, FirstName, LastName, ESPN_Player_ID__c,
          Position__c, Jersey_Number__c, Player_Role__c,
          Profile_Image_URL__c, Date_of_Birth__c, Nationality__c,
          Height__c, Weight__c,
          Total_Awards__c, Total_Individual_Awards__c, Total_Team_Trophies__c
        FROM Contact
        ${whereClause}
        ORDER BY Name ASC
        LIMIT ${limit}
      `);

      return players;
    },
    3600
  );
}

/**
 * Get player by ID
 */
export async function getPlayerById(playerId: string) {
  return getCached(
    `player:${playerId}`,
    async () => {
      const client = getSalesforceClient();

      const players = await client.query<Contact>(`
        SELECT 
          Id, Name, FirstName, LastName, ESPN_Player_ID__c,
          Position__c, Jersey_Number__c, Player_Role__c,
          Profile_Image_URL__c, Date_of_Birth__c, Nationality__c,
          Height__c, Weight__c, Email, Phone,
          Total_Awards__c, Total_Individual_Awards__c, Total_Team_Trophies__c
        FROM Contact
        WHERE Id = '${playerId}'
        LIMIT 1
      `);

      if (!players || players.length === 0) {
        return null;
      }

      return players[0];
    },
    3600
  );
}

/**
 * Get player season stats
 */
export async function getPlayerStats(playerId: string, seasonId?: string) {
  return getCached(
    CacheKeys.PLAYER_STATS(playerId),
    async () => {
      const client = getSalesforceClient();
      
      const seasonFilter = seasonId ? `AND Season__c = '${seasonId}'` : '';

      const stats = await client.query<PlayerSeasonStats>(`
        SELECT 
          Id, Name,
          Appearances__c, Starts__c, Minutes_Played__c,
          Goals__c, Assists__c, Goals_Per_90__c, Assists_Per_90__c,
          Shots__c, Shots_On_Target__c, Shot_Accuracy_Percentage__c,
          Pass_Completion_Percentage__c, Yellow_Cards__c, Red_Cards__c,
          Clean_Sheets__c, Saves__c,
          Team__r.Id, Team__r.Name, Team__r.Logo_Url__c,
          Competition__r.Id, Competition__r.Name, Competition__r.Logo_URL__c,
          Season__r.Id, Season__r.Name
        FROM Player_Season_Stats__c
        WHERE Player__c = '${playerId}' ${seasonFilter}
        ORDER BY Season__r.Start_Date__c DESC, Competition__r.Name
      `);

      return stats;
    },
    CacheStrategy.playerStats
  );
}

/**
 * Get player awards
 */
export async function getPlayerAwards(playerId: string) {
  return getCached(
    `player:${playerId}:awards`,
    async () => {
      const client = getSalesforceClient();

      const awards = await client.query<Award>(`
        SELECT 
          Id, Name, Award_Type__c, Award_Category__c,
          Year__c, Season_Name__c, Count__c, Details__c,
          Rank__c, Sport__c, Icon_URL__c, Sort_Order__c,
          Team__r.Id, Team__r.Name, Team__r.Logo_Url__c,
          Competition__r.Id, Competition__r.Name,
          Season__r.Id, Season__r.Name
        FROM Award__c
        WHERE Player__c = '${playerId}'
        ORDER BY Sort_Order__c ASC NULLS LAST, Year__c DESC
      `);

      return awards;
    },
    3600
  );
}

/**
 * Get player career history
 */
export async function getPlayerCareer(playerId: string) {
  return getCached(
    `player:${playerId}:career`,
    async () => {
      const client = getSalesforceClient();

      const career = await client.query<TeamMembership>(`
        SELECT 
          Id, Name, Status__c, Jersey_Number__c, Position__c,
          Start_Date__c, End_Date__c, Transfer_Fee__c, Loan_Fee__c,
          Team__r.Id, Team__r.Name, Team__r.Logo_Url__c
        FROM Team_Membership__c
        WHERE Player__c = '${playerId}'
        ORDER BY Start_Date__c DESC
      `);

      return career;
    },
    3600
  );
}

/**
 * Get top scorers for a competition
 */
export async function getTopScorers(competitionId: string, limit: number = 20) {
  return getCached(
    CacheKeys.TOP_SCORERS(`competition:${competitionId}`),
    async () => {
      const client = getSalesforceClient();

      const scorers = await client.query<PlayerSeasonStats>(`
        SELECT 
          Id, Name,
          Goals__c, Assists__c, Appearances__c, Minutes_Played__c, Goals_Per_90__c,
          Player__r.Id, Player__r.Name, Player__r.Profile_Image_URL__c, Player__r.Position__c,
          Team__r.Id, Team__r.Name, Team__r.Logo_Url__c
        FROM Player_Season_Stats__c
        WHERE Competition__c = '${competitionId}' AND Goals__c > 0
        ORDER BY Goals__c DESC, Goals_Per_90__c DESC
        LIMIT ${limit}
      `);

      return scorers;
    },
    CacheStrategy.topScorers
  );
}

/**
 * Get top assists for a competition
 */
export async function getTopAssists(competitionId: string, limit: number = 20) {
  return getCached(
    CacheKeys.TOP_ASSISTS(`competition:${competitionId}`),
    async () => {
      const client = getSalesforceClient();

      const assists = await client.query<PlayerSeasonStats>(`
        SELECT 
          Id, Name,
          Assists__c, Goals__c, Appearances__c, Minutes_Played__c, Assists_Per_90__c,
          Player__r.Id, Player__r.Name, Player__r.Profile_Image_URL__c, Player__r.Position__c,
          Team__r.Id, Team__r.Name, Team__r.Logo_Url__c
        FROM Player_Season_Stats__c
        WHERE Competition__c = '${competitionId}' AND Assists__c > 0
        ORDER BY Assists__c DESC, Assists_Per_90__c DESC
        LIMIT ${limit}
      `);

      return assists;
    },
    CacheStrategy.topScorers
  );
}

/**
 * Get player by ESPN ID
 */
export async function getPlayerByESPNId(espnPlayerId: string) {
  return getCached(
    `player:espn:${espnPlayerId}`,
    async () => {
      const client = getSalesforceClient();

      const players = await client.query<Contact>(`
        SELECT 
          Id, Name, FirstName, LastName, ESPN_Player_ID__c,
          Position__c, Jersey_Number__c, Player_Role__c,
          Profile_Image_URL__c, Date_of_Birth__c, Nationality__c,
          Height__c, Weight__c
        FROM Contact
        WHERE ESPN_Player_ID__c = '${espnPlayerId}'
        LIMIT 1
      `);

      if (!players || players.length === 0) {
        return null;
      }

      return players[0];
    },
    3600
  );
}

/**
 * Get players by team (via Team_Membership__c)
 */
export async function getPlayersByTeam(teamId: string) {
  return getCached(
    `team:${teamId}:players`,
    async () => {
      const client = getSalesforceClient();

      const memberships = await client.query<TeamMembership>(`
        SELECT 
          Id, Name, Status__c, Jersey_Number__c, Position__c,
          Player__r.Id, Player__r.Name, Player__r.Profile_Image_URL__c,
          Player__r.Date_of_Birth__c, Player__r.Nationality__c, Player__r.Position__c
        FROM Team_Membership__c
        WHERE Team__c = '${teamId}' AND Status__c = 'Active'
        ORDER BY Jersey_Number__c ASC NULLS LAST
      `);

      return memberships;
    },
    3600
  );
}

/**
 * Get top scorers by sport
 */
export async function getTopScorersBySport(sport: string, limit: number = 20) {
  return getCached(
    CacheKeys.TOP_SCORERS(sport),
    async () => {
      const client = getSalesforceClient();

      const scorers = await client.query<PlayerSeasonStats>(`
        SELECT 
          Id, Name,
          Goals__c, Assists__c, Appearances__c, Minutes_Played__c, Goals_Per_90__c,
          Player__r.Id, Player__r.Name, Player__r.Profile_Image_URL__c, Player__r.Position__c,
          Team__r.Id, Team__r.Name, Team__r.Logo_Url__c,
          Competition__r.Id, Competition__r.Name
        FROM Player_Season_Stats__c
        WHERE Competition__r.Sport__c = '${sport}' AND Goals__c > 0
        ORDER BY Goals__c DESC, Goals_Per_90__c DESC
        LIMIT ${limit}
      `);

      return scorers;
    },
    CacheStrategy.topScorers
  );
}

