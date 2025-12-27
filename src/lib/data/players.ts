/**
 * Server-Side Data Fetchers for Players
 * 
 * These functions are designed for Server Components to fetch player data directly.
 */

import { getSalesforceClient } from '@/lib/salesforce/client';
import type { SF_Contact } from '@/types/salesforce/raw';
import type { PlayerFilters } from '@/lib/salesforce/types';
import type { Player } from '@/types/domain';
import { getCached } from '@/lib/cache/redis';
import { mapPlayers, mapPlayer } from '@/lib/mappers';

/**
 * Get players with filters
 */
export async function getPlayers(filters?: PlayerFilters): Promise<Player[]> {
  const cacheKey = `players:${JSON.stringify(filters || {})}`;
  
  return getCached(
    cacheKey,
    async () => {
      const client = getSalesforceClient();
      
      // Build WHERE clause
      const conditions: string[] = ["RecordType.Name = 'Player'"];
      
      if (filters?.sport) {
        // Sport is typically derived from team relationship
        conditions.push(`AccountId != null`);
      }
      if (filters?.position) {
        conditions.push(`Position__c = '${filters.position}'`);
      }
      if (filters?.nationality) {
        conditions.push(`Nationality__c = '${filters.nationality}'`);
      }
      
      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
      const limit = filters?.limit || 50;
      
      const sfContacts = await client.query<SF_Contact>(`
        SELECT 
          Id, Name, FirstName, LastName, ESPN_Player_ID__c,
          Position__c, Jersey_Number__c, Player_Role__c,
          Profile_Image_URL__c, Date_of_Birth__c, Nationality__c,
          Height__c, Weight__c, Total_Awards__c
        FROM Contact
        ${whereClause}
        ORDER BY Name ASC
        LIMIT ${limit}
      `);
      
      return mapPlayers(sfContacts);
    },
    3600 // 1 hour cache
  );
}

/**
 * Get player by ID
 */
export async function getPlayerById(id: string): Promise<Player | null> {
  return getCached(
    `player:${id}`,
    async () => {
      const client = getSalesforceClient();
      
      const sfContacts = await client.query<SF_Contact>(`
        SELECT 
          Id, Name, FirstName, LastName, ESPN_Player_ID__c,
          Position__c, Jersey_Number__c, Player_Role__c,
          Profile_Image_URL__c, Date_of_Birth__c, Nationality__c,
          Height__c, Weight__c, Total_Awards__c
        FROM Contact
        WHERE Id = '${id}'
        LIMIT 1
      `);
      
      if (!sfContacts || sfContacts.length === 0) {
        return null;
      }
      
      return mapPlayer(sfContacts[0]);
    },
    3600
  );
}

