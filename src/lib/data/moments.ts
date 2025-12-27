/**
 * Server-Side Data Fetchers for Moments
 * 
 * These functions are designed for Server Components to fetch moment data directly.
 */

import {
  getMoments as queryMoments,
  getMomentById as queryMomentById,
  getTrendingMoments as queryTrendingMoments,
  getMomentsByMatch,
  getMomentsByPlayer,
  getMomentsByTeam,
} from '@/lib/salesforce/queries/moments';
import type { Moment } from '@/types/domain';
import type { MomentFilters } from '@/lib/salesforce/types';

/**
 * Get moments with filters
 */
export async function getMoments(filters?: MomentFilters): Promise<Moment[]> {
  return await queryMoments(filters || {});
}

/**
 * Get moment by ID
 */
export async function getMomentById(id: string): Promise<Moment | null> {
  return await queryMomentById(id);
}

/**
 * Get trending moments
 */
export async function getTrendingMoments(options?: { limit?: number; sport?: string; gender?: string }): Promise<Moment[]> {
  const { limit = 20, sport, gender } = options || {};
  return await queryTrendingMoments(limit, sport, gender);
}

/**
 * Get moments by match
 */
export async function getMomentsByMatchId(matchId: string): Promise<Moment[]> {
  return await getMomentsByMatch(matchId);
}

/**
 * Get moments by player
 */
export async function getMomentsByPlayerId(playerId: string, limit: number = 20): Promise<Moment[]> {
  return await getMomentsByPlayer(playerId, limit);
}

/**
 * Get moments by team
 */
export async function getMomentsByTeamId(teamId: string, limit: number = 20): Promise<Moment[]> {
  return await getMomentsByTeam(teamId, limit);
}

