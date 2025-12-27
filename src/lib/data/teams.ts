/**
 * Server-Side Data Fetchers for Teams
 * 
 * These functions are designed for Server Components to fetch team data directly.
 */

import { getSalesforceClient } from '@/lib/salesforce/client';
import type { SF_Account } from '@/types/salesforce/raw';
import type { TeamFilters } from '@/lib/salesforce/types';
import type { Team } from '@/types/domain';
import { getCached } from '@/lib/cache/redis';
import { mapTeams, mapTeam } from '@/lib/mappers';

/**
 * Get teams with filters
 */
export async function getTeams(filters?: TeamFilters): Promise<Team[]> {
  const cacheKey = `teams:${JSON.stringify(filters || {})}`;
  
  return getCached(
    cacheKey,
    async () => {
      const client = getSalesforceClient();
      
      // Build WHERE clause
      const conditions: string[] = ["RecordType.Name = 'Club_Team'"];
      
      if (filters?.sport) {
        conditions.push(`Sport__c = '${filters.sport}'`);
      }
      if (filters?.gender) {
        conditions.push(`Gender_Class__c = '${filters.gender}'`);
      }
      if (filters?.league) {
        conditions.push(`League__c = '${filters.league}'`);
      }
      if (filters?.country) {
        conditions.push(`BillingCountry = '${filters.country}'`);
      }
      
      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
      const limit = filters?.limit || 50;
      
      const sfAccounts = await client.query<SF_Account>(`
        SELECT 
          Id, Name, ESPN_Team_ID__c, Sport__c, League__c, Gender_Class__c,
          Abbreviation__c, Logo_Url__c, Venue_Name__c, Primary_Color__c,
          Secondary_Color__c, Founded_Year__c, Total_Awards__c
        FROM Account
        ${whereClause}
        ORDER BY Name ASC
        LIMIT ${limit}
      `);
      
      return mapTeams(sfAccounts);
    },
    3600 // 1 hour cache
  );
}

/**
 * Get team by ID
 */
export async function getTeamById(id: string): Promise<Team | null> {
  return getCached(
    `team:${id}`,
    async () => {
      const client = getSalesforceClient();
      
      const sfAccounts = await client.query<SF_Account>(`
        SELECT 
          Id, Name, ESPN_Team_ID__c, Sport__c, League__c, Gender_Class__c,
          Abbreviation__c, Logo_Url__c, Venue_Name__c, Primary_Color__c,
          Secondary_Color__c, Founded_Year__c, Total_Awards__c
        FROM Account
        WHERE Id = '${id}'
        LIMIT 1
      `);
      
      if (!sfAccounts || sfAccounts.length === 0) {
        return null;
      }
      
      return mapTeam(sfAccounts[0]);
    },
    3600
  );
}

