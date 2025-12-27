/**
 * Match Mapper
 * 
 * Transforms Salesforce Match__c records to Domain Match types
 */

import type { SF_Match__c } from '@/types/salesforce/raw';
import type { Match } from '@/types/domain';
import { mapTeam } from './team-mapper';
import { mapCompetition } from './competition-mapper';
import { mapMatchStatus, ensureDateObject, isMatchLive } from './helpers';

/**
 * Map Salesforce Match to Domain Match
 */
export function mapMatch(sf: SF_Match__c): Match {
  // Ensure required relationships are present
  if (!sf.Home_Team__r || !sf.Away_Team__r || !sf.Competition__r) {
    throw new Error(`Match ${sf.Id} must include Home_Team__r, Away_Team__r, and Competition__r relationships`);
  }
  
  const status = mapMatchStatus(sf.Status__c);
  const competition = mapCompetition(sf.Competition__r);
  const homeTeam = mapTeam(sf.Home_Team__r);
  const awayTeam = mapTeam(sf.Away_Team__r);
  
  return {
    id: sf.Id,
    homeTeam,
    awayTeam,
    competition,
    homeScore: sf.Home_Score_Final__c ?? 0,
    awayScore: sf.Away_Score_Final__c ?? 0,
    homeSubScore: sf.Home_Sub_Score__c,
    awaySubScore: sf.Away_Sub_Score__c,
    status,
    matchDate: ensureDateObject(sf.Match_Date_Time__c),
    venue: sf.Venue__c,
    attendance: sf.Attendance__c,
    isLive: isMatchLive(status),
    isNeutralVenue: sf.Neutral_Venue__c,
    sport: competition.sport,
    gender: homeTeam.gender, // Get gender from team, not competition (Competition__c doesn't have Gender_Class__c)
    referee: sf.Referee__c,
    broadcastUrl: sf.Broadcast_URL__c,
  };
}

/**
 * Map array of Salesforce Matches
 */
export function mapMatches(sfMatches: SF_Match__c[]): Match[] {
  return sfMatches
    .filter(sf => sf.Home_Team__r && sf.Away_Team__r && sf.Competition__r) // Filter out incomplete records
    .map(mapMatch);
}

/**
 * Map minimal match info for references
 */
export function mapMinimalMatch(sf: SF_Match__c | undefined): { id: string; name: string } | undefined {
  if (!sf) return undefined;
  
  return {
    id: sf.Id,
    name: sf.Name || 'Unknown Match',
  };
}

