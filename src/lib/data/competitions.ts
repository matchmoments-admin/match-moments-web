/**
 * Server-Side Data Fetchers for Competitions
 * 
 * These functions are designed for Server Components to fetch competition data directly.
 */

import {
  getCompetitions as queryCompetitions,
  getCompetitionById as queryCompetitionById,
  getStandings as queryStandings,
  getFeaturedCompetitions as queryFeaturedCompetitions,
  getCompetitionsBySport as queryCompetitionsBySport,
} from '@/lib/salesforce/queries/competitions';
import type { Competition, TeamSeasonStats } from '@/types/domain';
import type { CompetitionFilters } from '@/lib/salesforce/types';

/**
 * Get competitions with filters
 */
export async function getCompetitions(filters?: CompetitionFilters): Promise<Competition[]> {
  return await queryCompetitions(filters || {});
}

/**
 * Get competition by ID
 */
export async function getCompetitionById(id: string): Promise<Competition | null> {
  return await queryCompetitionById(id);
}

/**
 * Get competition standings
 */
export async function getCompetitionStandings(competitionId: string, seasonId?: string): Promise<TeamSeasonStats[]> {
  return await queryStandings(competitionId, seasonId);
}

/**
 * Get featured competitions (Tier 1)
 * Note: Gender parameter deprecated as Gender_Class__c doesn't exist on Competition__c
 */
export async function getFeaturedCompetitions(options?: { sport?: string; gender?: string; limit?: number }): Promise<Competition[]> {
  const { sport } = options || {};
  // Note: gender parameter is ignored - Competition__c doesn't have Gender_Class__c field
  return await queryFeaturedCompetitions(sport);
}

/**
 * Get competitions by sport
 * Note: Gender parameter removed as Gender_Class__c doesn't exist on Competition__c
 */
export async function getCompetitionsBySport(sport: string): Promise<Competition[]> {
  return await queryCompetitionsBySport(sport);
}

