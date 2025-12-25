import { getSalesforceClient } from '../client';
import type { Fixture, FixturePeriod, CommentaryEvent } from '../types';
import { getCached } from '../../cache/redis';
import { CacheKeys, CacheStrategy } from '../../cache/strategies';

/**
 * Get today's fixtures with caching
 */
export async function getTodayFixtures() {
  return getCached(
    CacheKeys.FIXTURES_TODAY,
    async () => {
      const client = getSalesforceClient();
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const fixtures = await client.query<Fixture>(`
        SELECT 
          Id, Name, Fixture_DateTime__c, Status__c, Venue__c,
          Home_Score_Final__c, Away_Score_Final__c,
          Home_Team__r.Name, Home_Team__r.Logo_URL__c,
          Away_Team__r.Name, Away_Team__r.Logo_URL__c,
          Competition__r.Name,
          Current_Period__r.Period_Type__c,
          Current_Period__r.Period_Number__c
        FROM Fixture__c
        WHERE Fixture_DateTime__c >= ${today}T00:00:00Z
          AND Fixture_DateTime__c < ${tomorrow}T00:00:00Z
        ORDER BY Fixture_DateTime__c ASC
      `);

      return fixtures;
    },
    CacheStrategy.fixturesToday
  );
}

/**
 * Get live fixtures with caching
 */
export async function getLiveFixtures() {
  return getCached(
    CacheKeys.FIXTURES_LIVE,
    async () => {
      const client = getSalesforceClient();

      const fixtures = await client.query<Fixture>(`
        SELECT 
          Id, Name, Fixture_DateTime__c, Status__c, Venue__c,
          Home_Score_Final__c, Away_Score_Final__c,
          Home_Team__r.Name, Home_Team__r.Logo_URL__c,
          Away_Team__r.Name, Away_Team__r.Logo_URL__c,
          Competition__r.Name,
          Current_Period__r.Period_Type__c,
          Current_Period__r.Period_Number__c
        FROM Fixture__c
        WHERE Status__c LIKE 'Live%'
        ORDER BY Fixture_DateTime__c DESC
      `);

      return fixtures;
    },
    CacheStrategy.fixturesLive
  );
}

/**
 * Get upcoming fixtures with caching
 */
export async function getUpcomingFixtures(days: number = 7) {
  return getCached(
    CacheKeys.FIXTURES_UPCOMING,
    async () => {
      const client = getSalesforceClient();
      const today = new Date().toISOString().split('T')[0];
      const futureDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const fixtures = await client.query<Fixture>(`
        SELECT 
          Id, Name, Fixture_DateTime__c, Status__c, Venue__c,
          Home_Score_Final__c, Away_Score_Final__c,
          Home_Team__r.Name, Home_Team__r.Logo_URL__c,
          Away_Team__r.Name, Away_Team__r.Logo_URL__c,
          Competition__r.Name
        FROM Fixture__c
        WHERE Fixture_DateTime__c >= ${today}T00:00:00Z
          AND Fixture_DateTime__c < ${futureDate}T23:59:59Z
          AND Status__c = 'Scheduled'
        ORDER BY Fixture_DateTime__c ASC
      `);

      return fixtures;
    },
    CacheStrategy.fixturesUpcoming
  );
}

/**
 * Get detailed fixture data with periods and commentary
 */
export async function getFixtureData(fixtureId: string): Promise<any | null> {
  return getCached(
    CacheKeys.FIXTURE_DETAIL(fixtureId),
    async () => {
      const client = getSalesforceClient();

      // Fetch fixture details
      const fixtures = await client.query<Fixture>(`
        SELECT 
          Id, Name, Fixture_DateTime__c, Status__c, Venue__c, Attendance__c,
          Home_Score_Final__c, Away_Score_Final__c,
          Home_Team__r.Name, Home_Team__r.Logo_URL__c, Home_Team__r.Primary_Color__c,
          Away_Team__r.Name, Away_Team__r.Logo_URL__c, Away_Team__r.Primary_Color__c,
          Competition__r.Name, Competition__r.Sport__c,
          Current_Period__r.Period_Type__c,
          Current_Period__r.Period_Number__c
        FROM Fixture__c
        WHERE Id = '${fixtureId}'
        LIMIT 1
      `);

      if (!fixtures || fixtures.length === 0) {
        return null;
      }

      const fixture = fixtures[0];

      // Fetch periods
      const periods = await client.query<FixturePeriod>(`
        SELECT 
          Period_Number__c, Period_Type__c,
          Home_Score_Period__c, Away_Score_Period__c,
          Home_Score_Cumulative__c, Away_Score_Cumulative__c
        FROM Fixture_Period__c
        WHERE Fixture__c = '${fixtureId}'
        ORDER BY Period_Number__c ASC
      `);

      // Fetch commentary events
      const commentary = await client.query<CommentaryEvent>(`
        SELECT 
          Id, Event_Minute__c, Event_Type__c, Description__c,
          Primary_Player__r.Name, Event_Importance__c
        FROM Commentary_Event__c
        WHERE Fixture__c = '${fixtureId}'
        ORDER BY Event_Minute__c ASC
      `);

      return {
        ...fixture,
        periods,
        commentary,
      };
    },
    CacheStrategy.fixtureDetail
  );
}

/**
 * Get fixtures by competition with caching
 */
export async function getFixturesByCompetition(competitionId: string, limit: number = 20) {
  return getCached(
    CacheKeys.FIXTURES_BY_COMPETITION(competitionId),
    async () => {
      const client = getSalesforceClient();

      const fixtures = await client.query<Fixture>(`
        SELECT 
          Id, Name, Fixture_DateTime__c, Status__c, Venue__c,
          Home_Score_Final__c, Away_Score_Final__c,
          Home_Team__r.Name, Home_Team__r.Logo_URL__c,
          Away_Team__r.Name, Away_Team__r.Logo_URL__c
        FROM Fixture__c
        WHERE Competition__c = '${competitionId}'
        ORDER BY Fixture_DateTime__c DESC
        LIMIT ${limit}
      `);

      return fixtures;
    },
    CacheStrategy.fixturesByCompetition
  );
}
