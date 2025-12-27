/**
 * Mapper Helper Functions
 * 
 * Shared utilities for transforming Salesforce data to domain types
 */

import type { GenderType, MatchStatus } from '@/types/domain';

/**
 * Map Salesforce Gender_Class__c to domain gender type
 */
export function mapGenderClass(sfGender?: string): GenderType {
  if (!sfGender) return 'mixed';
  if (sfGender === "Women's Team") return 'womens';
  if (sfGender === "Men's Team") return 'mens';
  return 'mixed';
}

/**
 * Map Salesforce match status to domain match status
 */
export function mapMatchStatus(sfStatus?: string): MatchStatus {
  if (!sfStatus) return 'scheduled';
  
  const status = sfStatus.toLowerCase();
  
  // Live statuses
  if (status.includes('live') || status.includes('first half') || status.includes('second half')) {
    return 'live';
  }
  
  // Halftime
  if (status === 'halftime' || status.includes('half time')) {
    return 'halftime';
  }
  
  // Finished
  if (status === 'completed' || status === 'finished' || status.includes('full time')) {
    return 'finished';
  }
  
  // Postponed
  if (status === 'postponed') {
    return 'postponed';
  }
  
  // Cancelled
  if (status === 'cancelled' || status === 'canceled') {
    return 'cancelled';
  }
  
  return 'scheduled';
}

/**
 * Extract tier number from Salesforce tier string
 */
export function getTierNumber(tier?: string): number {
  if (!tier) return 1;
  const match = tier.match(/\d+/);
  return match ? parseInt(match[0]) : 1;
}

/**
 * Ensure date string is converted to Date object
 */
export function ensureDateObject(dateString?: string): Date {
  if (!dateString) return new Date();
  return new Date(dateString);
}

/**
 * Format Salesforce datetime for display
 */
export function formatSalesforceDate(dateString?: string): string {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString();
}

/**
 * Check if a match is currently live based on status
 */
export function isMatchLive(status: MatchStatus): boolean {
  return status === 'live' || status === 'halftime';
}

/**
 * Normalize sport name to lowercase
 */
export function normalizeSportName(sport?: string): string {
  return (sport || 'soccer').toLowerCase();
}

/**
 * Get fallback value if undefined
 */
export function getFallback<T>(value: T | undefined, fallback: T): T {
  return value !== undefined ? value : fallback;
}

/**
 * Generate full player name from Contact
 */
export function getPlayerFullName(firstName?: string, lastName?: string, name?: string): string {
  if (name) return name;
  if (firstName && lastName) return `${firstName} ${lastName}`;
  if (lastName) return lastName;
  if (firstName) return firstName;
  return 'Unknown Player';
}

/**
 * Extract YouTube video ID from URL
 */
export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
    /youtube\.com\/embed\/([^?\s]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}

/**
 * Generate video thumbnail URL
 */
export function generateVideoThumbnail(videoUrl: string, fallbackUrl: string): string {
  const youtubeId = extractYouTubeId(videoUrl);
  if (youtubeId) {
    return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
  }
  return fallbackUrl;
}

