/**
 * Competition Mapper
 * 
 * Transforms Salesforce Competition__c records to Domain Competition types
 */

import type { SF_Competition__c, SF_Season__c } from '@/types/salesforce/raw';
import type { Competition, Season } from '@/types/domain';
import { mapGenderClass, normalizeSportName, getTierNumber, ensureDateObject } from './helpers';

/**
 * Map Salesforce Season to Domain Season
 */
export function mapSeason(sf: SF_Season__c): Season {
  return {
    id: sf.Id,
    name: sf.Name || 'Unknown Season',
    startDate: sf.Start_Date__c ? ensureDateObject(sf.Start_Date__c) : undefined,
    endDate: sf.End_Date__c ? ensureDateObject(sf.End_Date__c) : undefined,
    sport: sf.Sport__c?.toLowerCase(),
    seasonType: sf.Season_Type__c,
  };
}

/**
 * Map Salesforce Competition to Domain Competition
 */
export function mapCompetition(sf: SF_Competition__c): Competition {
  const season = sf.Season__r ? mapSeason(sf.Season__r) : {
    id: sf.Season__c || '',
    name: 'Unknown Season',
  };
  
  return {
    id: sf.Id,
    name: sf.Name || 'Unknown Competition',
    sport: normalizeSportName(sf.Sport__c),
    gender: mapGenderClass(sf.Gender_Class__c),
    logoUrl: sf.Logo_URL__c,
    tier: getTierNumber(sf.Tier__c),
    country: sf.Country__c,
    season,
    status: sf.Status__c,
  };
}

/**
 * Map array of Salesforce Competitions
 */
export function mapCompetitions(sfCompetitions: SF_Competition__c[]): Competition[] {
  return sfCompetitions.map(mapCompetition);
}

/**
 * Map minimal competition info (id, name, logo only)
 */
export function mapMinimalCompetition(sf: SF_Competition__c | undefined): { id: string; name: string; logoUrl?: string } | undefined {
  if (!sf) return undefined;
  
  return {
    id: sf.Id,
    name: sf.Name || 'Unknown Competition',
    logoUrl: sf.Logo_URL__c,
  };
}

