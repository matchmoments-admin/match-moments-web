/**
 * Stats Mapper
 * 
 * Transforms Salesforce stats records to Domain stat types
 */

import type { SF_Team_Season_Stats__c, SF_Player_Season_Stats__c } from '@/types/salesforce/raw';
import type { TeamSeasonStats, PlayerSeasonStats } from '@/types/domain';

/**
 * Map Salesforce Team_Season_Stats to Domain TeamSeasonStats
 */
export function mapTeamSeasonStats(sf: SF_Team_Season_Stats__c): TeamSeasonStats {
  return {
    id: sf.Id,
    teamId: sf.Team__c || '',
    teamName: sf.Team__r?.Name || 'Unknown Team',
    teamLogo: sf.Team__r?.Logo_Url__c,
    competitionId: sf.Competition__c || '',
    competitionName: sf.Competition__r?.Name || 'Unknown Competition',
    seasonId: sf.Season__c || '',
    matchesPlayed: sf.Matches_Played__c || 0,
    wins: sf.Wins__c || 0,
    draws: sf.Draws__c || 0,
    losses: sf.Losses__c || 0,
    goalsFor: sf.Goals_For__c || 0,
    goalsAgainst: sf.Goals_Against__c || 0,
    goalDifference: sf.Goal_Difference__c || 0,
    points: sf.Points__c || 0,
    leaguePosition: sf.League_Position__c,
    formLast5: sf.Form_Last_5__c,
    cleanSheets: sf.Clean_Sheets__c,
  };
}

/**
 * Map array of Salesforce Team_Season_Stats
 */
export function mapTeamSeasonStatsList(sfStats: SF_Team_Season_Stats__c[]): TeamSeasonStats[] {
  return sfStats.map(mapTeamSeasonStats);
}

/**
 * Map Salesforce Player_Season_Stats to Domain PlayerSeasonStats
 */
export function mapPlayerSeasonStats(sf: SF_Player_Season_Stats__c): PlayerSeasonStats {
  return {
    id: sf.Id,
    playerId: sf.Player__c || '',
    playerName: sf.Player__r?.Name || 'Unknown Player',
    teamId: sf.Team__c || '',
    teamName: sf.Team__r?.Name || 'Unknown Team',
    competitionId: sf.Competition__c || '',
    seasonId: sf.Season__c || '',
    appearances: sf.Appearances__c || 0,
    starts: sf.Starts__c,
    minutesPlayed: sf.Minutes_Played__c,
    goals: sf.Goals__c,
    assists: sf.Assists__c,
    yellowCards: sf.Yellow_Cards__c,
    redCards: sf.Red_Cards__c,
    goalsPerGame: sf.Goals_Per_90__c,
  };
}

/**
 * Map array of Salesforce Player_Season_Stats
 */
export function mapPlayerSeasonStatsList(sfStats: SF_Player_Season_Stats__c[]): PlayerSeasonStats[] {
  return sfStats.map(mapPlayerSeasonStats);
}

