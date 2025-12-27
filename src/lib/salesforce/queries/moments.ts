import { getSalesforceClient } from '../client';
import type { SF_Match_Moment__c } from '@/types/salesforce/raw';
import type { MomentFilters } from '../types';
import type { Moment } from '@/types/domain';
import { getCached } from '../../cache/redis';
import { mapMoments, mapMoment } from '@/lib/mappers';

/**
 * Get moments with flexible filtering
 */
export async function getMoments(filters: MomentFilters = {}): Promise<Moment[]> {
  const cacheKey = `moments:${JSON.stringify(filters)}`;
  
  return getCached(
    cacheKey,
    async () => {
      const client = getSalesforceClient();
      
      // Build WHERE clause dynamically
      const conditions: string[] = ['Is_Shareable__c = true'];
      
      if (filters.match) {
        conditions.push(`Match__c = '${filters.match}'`);
      }
      if (filters.player) {
        conditions.push(`(Primary_Player__c = '${filters.player}' OR Secondary_Player__c = '${filters.player}')`);
      }
      if (filters.team) {
        conditions.push(`Team__c = '${filters.team}'`);
      }
      if (filters.eventType) {
        conditions.push(`Event_Type__c = '${filters.eventType}'`);
      }
      if (filters.sport) {
        conditions.push(`Match__r.Competition__r.Sport__c = '${filters.sport}'`);
      }
      if (filters.gender) {
        // Gender is on teams, not competition
        conditions.push(`Match__r.Home_Team__r.Gender_Class__c = '${filters.gender}'`);
      }
      if (filters.minViralScore) {
        conditions.push(`Viral_Score__c >= ${filters.minViralScore}`);
      }
      
      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
      const limit = filters.limit || 20;

      const sfMoments = await client.query<SF_Match_Moment__c>(`
        SELECT 
          Id, Name, Event_Type__c, Event_Minute__c, Event_Second__c,
          Description__c, Social_Share_Title__c,
          Video_URL__c, Public_URL__c, Is_Shareable__c,
          Viral_Score__c, Share_Count__c, View_Count__c,
          Primary_Player__r.Id, Primary_Player__r.Name, Primary_Player__r.FirstName, Primary_Player__r.LastName,
          Primary_Player__r.Profile_Image_URL__c,
          Secondary_Player__r.Id, Secondary_Player__r.Name, Secondary_Player__r.FirstName, Secondary_Player__r.LastName,
          Team__r.Id, Team__r.Name, Team__r.Logo_Url__c,
          Match__r.Id, Match__r.Name, Match__r.Match_Date_Time__c,
          Match__r.Home_Team__r.Name, Match__r.Home_Team__r.Gender_Class__c, Match__r.Away_Team__r.Name,
          Match__r.Competition__r.Name, Match__r.Competition__r.Sport__c,
          Match_Period__r.Period_Type__c, Match_Period__r.Period_Number__c
        FROM Match_Moment__c
        ${whereClause}
        ORDER BY Viral_Score__c DESC NULLS LAST, View_Count__c DESC NULLS LAST
        LIMIT ${limit}
      `);

      return mapMoments(sfMoments);
    },
    300 // 5 min cache
  );
}

/**
 * Get moment by ID
 */
export async function getMomentById(momentId: string): Promise<Moment | null> {
  return getCached(
    `moment:${momentId}`,
    async () => {
      const client = getSalesforceClient();

      const sfMoments = await client.query<SF_Match_Moment__c>(`
        SELECT 
          Id, Name, Event_Type__c, Event_Minute__c, Event_Second__c,
          Description__c, Social_Share_Title__c,
          Video_URL__c, Public_URL__c, Is_Shareable__c,
          Viral_Score__c, Share_Count__c, View_Count__c,
          Primary_Player__r.Id, Primary_Player__r.Name, Primary_Player__r.FirstName, Primary_Player__r.LastName,
          Primary_Player__r.Profile_Image_URL__c,
          Secondary_Player__r.Id, Secondary_Player__r.Name,
          Team__r.Id, Team__r.Name, Team__r.Logo_Url__c,
          Match__r.Id, Match__r.Name, Match__r.Match_Date_Time__c,
          Match__r.Home_Team__r.Name, Match__r.Home_Team__r.Gender_Class__c, Match__r.Away_Team__r.Name,
          Match__r.Competition__r.Name, Match__r.Competition__r.Sport__c,
          Match_Period__r.Period_Type__c, Match_Period__r.Period_Number__c
        FROM Match_Moment__c
        WHERE Id = '${momentId}'
        LIMIT 1
      `);

      if (!sfMoments || sfMoments.length === 0) {
        return null;
      }

      return mapMoment(sfMoments[0]);
    },
    300
  );
}

/**
 * Get trending moments (viral highlights)
 */
export async function getTrendingMoments(limit: number = 20, sport?: string, gender?: string): Promise<Moment[]> {
  return getMoments({
    sport,
    gender,
    minViralScore: 50,
    limit
  });
}

/**
 * Get moments by match
 */
export async function getMomentsByMatch(matchId: string) {
  return getMoments({
    match: matchId,
    limit: 100
  });
}

/**
 * Get moments by player
 */
export async function getMomentsByPlayer(playerId: string, limit: number = 20) {
  return getMoments({
    player: playerId,
    limit
  });
}

/**
 * Get moments by team
 */
export async function getMomentsByTeam(teamId: string, limit: number = 20) {
  return getMoments({
    team: teamId,
    limit
  });
}

/**
 * Get moments by event type
 */
export async function getMomentsByEventType(eventType: string, limit: number = 20) {
  return getMoments({
    eventType,
    limit
  });
}

/**
 * Get most viewed moments
 */
export async function getMostViewedMoments(limit: number = 20, sport?: string) {
  const cacheKey = sport ? `moments:most-viewed:${sport}` : 'moments:most-viewed:all';
  
  return getCached(
    cacheKey,
    async () => {
      const client = getSalesforceClient();
      
      const sportFilter = sport ? `AND Match__r.Competition__r.Sport__c = '${sport}'` : '';

      const sfMoments = await client.query<SF_Match_Moment__c>(`
        SELECT 
          Id, Name, Event_Type__c, Event_Minute__c, Event_Second__c,
          Description__c, Social_Share_Title__c,
          Video_URL__c, Public_URL__c, Is_Shareable__c,
          Viral_Score__c, Share_Count__c, View_Count__c,
          Primary_Player__r.Id, Primary_Player__r.Name, Primary_Player__r.FirstName, Primary_Player__r.LastName,
          Primary_Player__r.Profile_Image_URL__c,
          Team__r.Id, Team__r.Name, Team__r.Logo_Url__c,
          Match__r.Id, Match__r.Name, Match__r.Match_Date_Time__c,
          Match__r.Home_Team__r.Name, Match__r.Home_Team__r.Gender_Class__c, Match__r.Away_Team__r.Name,
          Match__r.Competition__r.Name, Match__r.Competition__r.Sport__c
        FROM Match_Moment__c
        WHERE Is_Shareable__c = true AND View_Count__c > 0 ${sportFilter}
        ORDER BY View_Count__c DESC
        LIMIT ${limit}
      `);

      return mapMoments(sfMoments);
    },
    300
  );
}

