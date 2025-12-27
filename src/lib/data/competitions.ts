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
  getCompetitionsBySportAndGender,
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
 */
export async function getFeaturedCompetitions(options?: { sport?: string; gender?: string; limit?: number }): Promise<Competition[]> {
  const { sport, gender } = options || {};
  return await queryFeaturedCompetitions(sport, gender);
}

/**
 * Get competitions by sport and gender
 */
export async function getCompetitionsBySport(sport: string, gender: string): Promise<Competition[]> {
  return await getCompetitionsBySportAndGender(sport, gender);
}

