/**
 * Server-Side Data Fetchers for Matches
 * 
 * These functions are designed for Server Components to fetch match data directly.
 * They wrap the Salesforce query functions and return domain types.
 */

import {
  getMatches as queryMatches,
  getMatchById as queryMatchById,
  getLiveMatches as queryLiveMatches,
  getUpcomingMatches as queryUpcomingMatches,
  getTodayMatches as queryTodayMatches,
  getMatchMoments,
} from '@/lib/salesforce/queries/matches';
import type { Match, Moment } from '@/types/domain';
import type { MatchFilters } from '@/lib/salesforce/types';

/**
 * Get matches with filters
 */
export async function getMatches(filters?: MatchFilters): Promise<Match[]> {
  return await queryMatches(filters || {});
}

/**
 * Get match by ID
 */
export async function getMatchById(id: string): Promise<Match | null> {
  return await queryMatchById(id);
}

/**
 * Get live matches for display
 */
export async function getLiveMatchesForDisplay(): Promise<Match[]> {
  return await queryLiveMatches();
}

/**
 * Get upcoming matches for display
 */
export async function getUpcomingMatchesForDisplay(days: number = 7): Promise<Match[]> {
  return await queryUpcomingMatches(days);
}

/**
 * Get today's matches
 */
export async function getTodayMatchesForDisplay(): Promise<Match[]> {
  return await queryTodayMatches();
}

/**
 * Get match moments (highlights)
 */
export async function getMatchMomentsForDisplay(matchId: string): Promise<Moment[]> {
  const sfMoments = await getMatchMoments(matchId);
  // Already mapped in the query function
  return sfMoments as any; // Type assertion needed due to legacy type
}

