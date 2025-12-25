import { getSalesforceClient } from '../client';
import type { Match, MatchPeriod, MatchEvent, MatchMoment, Lineup, MatchFilters } from '../types';
import { getCached } from '../../cache/redis';
import { CacheKeys, CacheStrategy } from '../../cache/strategies';

/**
 * Get matches with flexible filtering
 */
export async function getMatches(filters: MatchFilters = {}) {
  const cacheKey = `matches:${JSON.stringify(filters)}`;
  
  return getCached(
    cacheKey,
    async () => {
      const client = getSalesforceClient();
      
      // Build WHERE clause dynamically
      const conditions: string[] = [];
      
      if (filters.sport) {
        conditions.push(`Competition__r.Sport__c = '${filters.sport}'`);
      }
      if (filters.gender) {
        conditions.push(`Competition__r.Gender_Class__c = '${filters.gender}'`);
      }
      if (filters.competition) {
        conditions.push(`Competition__c = '${filters.competition}'`);
      }
      if (filters.team) {
        conditions.push(`(Home_Team__c = '${filters.team}' OR Away_Team__c = '${filters.team}')`);
      }
      if (filters.status) {
        conditions.push(`Match_Status__c = '${filters.status}'`);
      }
      if (filters.startDate) {
        conditions.push(`Match_Date__c >= ${filters.startDate}`);
      }
      if (filters.endDate) {
        conditions.push(`Match_Date__c <= ${filters.endDate}`);
      }
      
      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
      const limit = filters.limit || 50;

      const matches = await client.query<Match>(`
        SELECT 
          Id, Name, Match_Date__c, Match_Status__c, Venue__c,
          Home_Score__c, Away_Score__c, Attendance__c, Match_Week__c,
          Home_Team__r.Id, Home_Team__r.Name, Home_Team__r.Logo_Url__c, Home_Team__r.Abbreviation__c,
          Away_Team__r.Id, Away_Team__r.Name, Away_Team__r.Logo_Url__c, Away_Team__r.Abbreviation__c,
          Competition__r.Id, Competition__r.Name, Competition__r.Logo_URL__c, Competition__r.Sport__c,
          Season__r.Id, Season__r.Name
        FROM Match__c
        ${whereClause}
        ORDER BY Match_Date__c DESC
        LIMIT ${limit}
      `);

      return matches;
    },
    filters.status === 'Live' ? CacheStrategy.fixturesLive : CacheStrategy.fixturesUpcoming
  );
}

/**
 * Get match by ID with full details
 */
export async function getMatchById(matchId: string) {
  return getCached(
    CacheKeys.FIXTURE_DETAIL(matchId),
    async () => {
      const client = getSalesforceClient();

      // Fetch match details
      const matches = await client.query<Match>(`
        SELECT 
          Id, Name, Match_Date__c, Match_Status__c, Venue__c, Attendance__c,
          Home_Score__c, Away_Score__c, Match_Week__c, Neutral_Venue__c,
          Referee__c, Weather_Conditions__c,
          Home_Team__r.Id, Home_Team__r.Name, Home_Team__r.Logo_Url__c, 
          Home_Team__r.Primary_Color__c, Home_Team__r.Abbreviation__c,
          Away_Team__r.Id, Away_Team__r.Name, Away_Team__r.Logo_Url__c, 
          Away_Team__r.Primary_Color__c, Away_Team__r.Abbreviation__c,
          Competition__r.Id, Competition__r.Name, Competition__r.Sport__c, 
          Competition__r.Logo_URL__c, Competition__r.Gender_Class__c,
          Season__r.Id, Season__r.Name
        FROM Match__c
        WHERE Id = '${matchId}'
        LIMIT 1
      `);

      if (!matches || matches.length === 0) {
        return null;
      }

      return matches[0];
    },
    CacheStrategy.fixtureDetail
  );
}

/**
 * Get match periods (halves, quarters, etc.)
 */
export async function getMatchPeriods(matchId: string) {
  return getCached(
    `match:${matchId}:periods`,
    async () => {
      const client = getSalesforceClient();

      const periods = await client.query<MatchPeriod>(`
        SELECT 
          Id, Name, Period_Number__c, Period_Type__c,
          Home_Score__c, Away_Score__c,
          Start_Time__c, End_Time__c
        FROM Match_Period__c
        WHERE Match__c = '${matchId}'
        ORDER BY Period_Number__c ASC
      `);

      return periods;
    },
    CacheStrategy.fixtureDetail
  );
}

/**
 * Get match events (live feed)
 */
export async function getMatchEvents(matchId: string) {
  return getCached(
    `match:${matchId}:events`,
    async () => {
      const client = getSalesforceClient();

      const events = await client.query<MatchEvent>(`
        SELECT 
          Id, Name, Event_Type__c, Event_Minute__c,
          Description__c, Event_Time__c
        FROM Match_Event__c
        WHERE Match__c = '${matchId}'
        ORDER BY Event_Minute__c ASC, Event_Time__c ASC
      `);

      return events;
    },
    CacheStrategy.fixturesLive
  );
}

/**
 * Get match moments (shareable highlights)
 */
export async function getMatchMoments(matchId: string) {
  return getCached(
    `match:${matchId}:moments`,
    async () => {
      const client = getSalesforceClient();

      const moments = await client.query<MatchMoment>(`
        SELECT 
          Id, Name, Event_Type__c, Event_Minute__c, Event_Second__c,
          Description__c, Social_Share_Title__c, Video_URL__c, Public_URL__c,
          Is_Shareable__c, Viral_Score__c, Share_Count__c, View_Count__c,
          Primary_Player__r.Id, Primary_Player__r.Name, Primary_Player__r.Profile_Image_URL__c,
          Secondary_Player__r.Id, Secondary_Player__r.Name,
          Team__r.Id, Team__r.Name, Team__r.Logo_Url__c,
          Match_Period__r.Period_Type__c, Match_Period__r.Period_Number__c
        FROM Match_Moment__c
        WHERE Match__c = '${matchId}' AND Is_Shareable__c = true
        ORDER BY Event_Minute__c ASC
      `);

      return moments;
    },
    CacheStrategy.fixtureDetail
  );
}

/**
 * Get match lineups
 */
export async function getMatchLineups(matchId: string) {
  return getCached(
    `match:${matchId}:lineups`,
    async () => {
      const client = getSalesforceClient();

      const lineups = await client.query<Lineup>(`
        SELECT 
          Id, Name, Formation__c, Starting_XI_Count__c,
          Lineup_JSON__c,
          Team__r.Id, Team__r.Name, Team__r.Logo_Url__c,
          Captain__r.Id, Captain__r.Name, Captain__r.Jersey_Number__c
        FROM Lineup__c
        WHERE Match__c = '${matchId}'
      `);

      return lineups;
    },
    CacheStrategy.fixtureDetail
  );
}

/**
 * Get live matches
 */
export async function getLiveMatches() {
  return getCached(
    CacheKeys.FIXTURES_LIVE,
    async () => {
      const client = getSalesforceClient();

      const matches = await client.query<Match>(`
        SELECT 
          Id, Name, Match_Date__c, Match_Status__c, Venue__c,
          Home_Score__c, Away_Score__c,
          Home_Team__r.Name, Home_Team__r.Logo_Url__c, Home_Team__r.Abbreviation__c,
          Away_Team__r.Name, Away_Team__r.Logo_Url__c, Away_Team__r.Abbreviation__c,
          Competition__r.Name, Competition__r.Logo_URL__c, Competition__r.Sport__c
        FROM Match__c
        WHERE Match_Status__c LIKE 'Live%'
        ORDER BY Match_Date__c DESC
        LIMIT 20
      `);

      return matches;
    },
    CacheStrategy.fixturesLive
  );
}

/**
 * Get upcoming matches
 */
export async function getUpcomingMatches(days: number = 7) {
  return getCached(
    CacheKeys.FIXTURES_UPCOMING,
    async () => {
      const client = getSalesforceClient();
      const today = new Date().toISOString().split('T')[0];
      const futureDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const matches = await client.query<Match>(`
        SELECT 
          Id, Name, Match_Date__c, Match_Status__c, Venue__c,
          Home_Team__r.Name, Home_Team__r.Logo_Url__c, Home_Team__r.Abbreviation__c,
          Away_Team__r.Name, Away_Team__r.Logo_Url__c, Away_Team__r.Abbreviation__c,
          Competition__r.Name, Competition__r.Logo_URL__c, Competition__r.Sport__c
        FROM Match__c
        WHERE Match_Date__c >= ${today}T00:00:00Z
          AND Match_Date__c < ${futureDate}T23:59:59Z
          AND Match_Status__c = 'Scheduled'
        ORDER BY Match_Date__c ASC
        LIMIT 50
      `);

      return matches;
    },
    CacheStrategy.fixturesUpcoming
  );
}

/**
 * Get recent matches (results)
 */
export async function getRecentMatches(days: number = 7) {
  return getCached(
    `matches:recent:${days}`,
    async () => {
      const client = getSalesforceClient();
      const today = new Date().toISOString().split('T')[0];
      const pastDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const matches = await client.query<Match>(`
        SELECT 
          Id, Name, Match_Date__c, Match_Status__c, Venue__c,
          Home_Score__c, Away_Score__c,
          Home_Team__r.Name, Home_Team__r.Logo_Url__c, Home_Team__r.Abbreviation__c,
          Away_Team__r.Name, Away_Team__r.Logo_Url__c, Away_Team__r.Abbreviation__c,
          Competition__r.Name, Competition__r.Logo_URL__c, Competition__r.Sport__c
        FROM Match__c
        WHERE Match_Date__c >= ${pastDate}T00:00:00Z
          AND Match_Date__c < ${today}T23:59:59Z
          AND Match_Status__c = 'Finished'
        ORDER BY Match_Date__c DESC
        LIMIT 50
      `);

      return matches;
    },
    { ttl: 3600, staleWhileRevalidate: true }
  );
}

/**
 * Get today's matches
 */
export async function getTodayMatches() {
  return getCached(
    CacheKeys.FIXTURES_TODAY,
    async () => {
      const client = getSalesforceClient();
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const matches = await client.query<Match>(`
        SELECT 
          Id, Name, Match_Date__c, Match_Status__c, Venue__c,
          Home_Score__c, Away_Score__c,
          Home_Team__r.Name, Home_Team__r.Logo_Url__c, Home_Team__r.Abbreviation__c,
          Away_Team__r.Name, Away_Team__r.Logo_Url__c, Away_Team__r.Abbreviation__c,
          Competition__r.Name, Competition__r.Logo_URL__c, Competition__r.Sport__c
        FROM Match__c
        WHERE Match_Date__c >= ${today}T00:00:00Z
          AND Match_Date__c < ${tomorrow}T00:00:00Z
        ORDER BY Match_Date__c ASC
      `);

      return matches;
    },
    CacheStrategy.fixturesToday
  );
}

/**
 * Get matches by team
 */
export async function getMatchesByTeam(teamId: string, limit: number = 20) {
  return getMatches({
    team: teamId,
    limit
  });
}

/**
 * Get matches by competition
 */
export async function getMatchesByCompetition(competitionId: string, limit: number = 20) {
  return getCached(
    CacheKeys.FIXTURES_BY_COMPETITION(competitionId),
    async () => {
      const client = getSalesforceClient();

      const matches = await client.query<Match>(`
        SELECT 
          Id, Name, Match_Date__c, Match_Status__c, Venue__c,
          Home_Score__c, Away_Score__c, Match_Week__c,
          Home_Team__r.Name, Home_Team__r.Logo_Url__c, Home_Team__r.Abbreviation__c,
          Away_Team__r.Name, Away_Team__r.Logo_Url__c, Away_Team__r.Abbreviation__c
        FROM Match__c
        WHERE Competition__c = '${competitionId}'
        ORDER BY Match_Date__c DESC
        LIMIT ${limit}
      `);

      return matches;
    },
    CacheStrategy.fixturesByCompetition
  );
}

