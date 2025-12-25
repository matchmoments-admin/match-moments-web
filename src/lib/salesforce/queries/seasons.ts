import { getSalesforceClient } from '../client';
import type { Season } from '../types';
import { getCached } from '../../cache/redis';

/**
 * Get seasons with optional sport filter
 */
export async function getSeasons(sport?: string) {
  const cacheKey = sport ? `seasons:sport:${sport}` : 'seasons:all';
  
  return getCached(
    cacheKey,
    async () => {
      const client = getSalesforceClient();
      
      const whereClause = sport ? `WHERE Sport__c = '${sport}'` : '';

      const seasons = await client.query<Season>(`
        SELECT 
          Id, Name, Start_Date__c, End_Date__c,
          Sport__c, Season_Type__c
        FROM Season__c
        ${whereClause}
        ORDER BY Start_Date__c DESC
      `);

      return seasons;
    },
    3600
  );
}

/**
 * Get season by ID
 */
export async function getSeasonById(seasonId: string) {
  return getCached(
    `season:${seasonId}`,
    async () => {
      const client = getSalesforceClient();

      const seasons = await client.query<Season>(`
        SELECT 
          Id, Name, Start_Date__c, End_Date__c,
          Sport__c, Season_Type__c
        FROM Season__c
        WHERE Id = '${seasonId}'
        LIMIT 1
      `);

      if (!seasons || seasons.length === 0) {
        return null;
      }

      return seasons[0];
    },
    3600
  );
}

/**
 * Get current season for a sport
 */
export async function getCurrentSeason(sport: string) {
  return getCached(
    `season:current:${sport}`,
    async () => {
      const client = getSalesforceClient();
      const today = new Date().toISOString().split('T')[0];

      const seasons = await client.query<Season>(`
        SELECT 
          Id, Name, Start_Date__c, End_Date__c,
          Sport__c, Season_Type__c
        FROM Season__c
        WHERE Sport__c = '${sport}'
          AND Start_Date__c <= ${today}
          AND End_Date__c >= ${today}
        ORDER BY Start_Date__c DESC
        LIMIT 1
      `);

      if (!seasons || seasons.length === 0) {
        // If no current season, get the most recent one
        const recentSeasons = await client.query<Season>(`
          SELECT 
            Id, Name, Start_Date__c, End_Date__c,
            Sport__c, Season_Type__c
          FROM Season__c
          WHERE Sport__c = '${sport}'
          ORDER BY Start_Date__c DESC
          LIMIT 1
        `);
        
        return recentSeasons[0] || null;
      }

      return seasons[0];
    },
    3600
  );
}

/**
 * Get season by name (e.g., "2024-2025")
 */
export async function getSeasonByName(seasonName: string) {
  return getCached(
    `season:name:${seasonName}`,
    async () => {
      const client = getSalesforceClient();

      const seasons = await client.query<Season>(`
        SELECT 
          Id, Name, Start_Date__c, End_Date__c,
          Sport__c, Season_Type__c
        FROM Season__c
        WHERE Name = '${seasonName}'
        LIMIT 1
      `);

      if (!seasons || seasons.length === 0) {
        return null;
      }

      return seasons[0];
    },
    3600
  );
}

