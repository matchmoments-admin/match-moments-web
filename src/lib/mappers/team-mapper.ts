/**
 * Team Mapper
 * 
 * Transforms Salesforce Account records to Domain Team types
 */

import type { SF_Account } from '@/types/salesforce/raw';
import type { Team } from '@/types/domain';
import { mapGenderClass, normalizeSportName, getFallback } from './helpers';

/**
 * Map Salesforce Account to Domain Team
 */
export function mapTeam(sf: SF_Account): Team {
  return {
    id: sf.Id,
    name: sf.Name || 'Unknown Team',
    shortName: sf.Abbreviation__c || sf.Name || 'Unknown',
    logoUrl: sf.Logo_Url__c || '/placeholder-team.png',
    sport: normalizeSportName(sf.Sport__c),
    gender: mapGenderClass(sf.Gender_Class__c),
    abbreviation: sf.Abbreviation__c,
    venue: sf.Venue_Name__c,
    primaryColor: sf.Primary_Color__c,
    secondaryColor: sf.Secondary_Color__c,
    foundedYear: sf.Founded_Year__c,
  };
}

/**
 * Map array of Salesforce Accounts to Teams
 */
export function mapTeams(sfAccounts: SF_Account[]): Team[] {
  return sfAccounts.map(mapTeam);
}

/**
 * Map minimal team info (id, name, logo only)
 */
export function mapMinimalTeam(sf: SF_Account | undefined): { id: string; name: string; logoUrl?: string } | undefined {
  if (!sf) return undefined;
  
  return {
    id: sf.Id,
    name: sf.Name || 'Unknown Team',
    logoUrl: sf.Logo_Url__c,
  };
}

