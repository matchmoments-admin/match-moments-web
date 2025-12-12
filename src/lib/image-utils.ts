/**
 * Image utilities for Match Moments sports website
 * Uses Unsplash Source API for random sport-themed images
 * Images from https://unsplash.com/s/photos/Sport
 */

export interface UnsplashImageOptions {
  width?: number;
  height?: number;
  query?: string;
  category?: 'sports' | 'nfl' | 'nba' | 'nhl' | 'soccer' | 'baseball' | 'basketball' | 'football';
}

/**
 * Generate a random sport-themed image URL from Unsplash
 * Uses Unsplash Source API for truly random but relevant sports images
 * Format: https://source.unsplash.com/{WIDTH}x{HEIGHT}/?{QUERY}
 */
export function getUnsplashImage(query: string, width: number = 1200, height: number = 800): string {
  // Use Unsplash Source API for random images with specific queries
  return `https://source.unsplash.com/${width}x${height}/?${query}`;
}

/**
 * Get a sports-themed image by category with random selection
 */
export function getSportsImage(
  category: 'nfl' | 'nba' | 'nhl' | 'soccer' | 'baseball' | 'basketball' | 'football' | 'cricket' | 'tennis' | 'rugby' | 'general' = 'general',
  dimensions: { width: number; height: number } = { width: 1200, height: 800 }
): string {
  // Map categories to specific Unsplash search queries for better results
  const queryMap: Record<string, string> = {
    nfl: 'american-football,nfl',
    nba: 'basketball,nba',
    basketball: 'basketball,sports',
    football: 'american-football',
    soccer: 'soccer,football',
    baseball: 'baseball,sports',
    tennis: 'tennis,sports',
    cricket: 'cricket,sports',
    rugby: 'rugby,sports',
    nhl: 'hockey,nhl',
    general: 'sports,athletes',
  };

  const query = queryMap[category] || 'sports';
  return getUnsplashImage(query, dimensions.width, dimensions.height);
}

/**
 * Get a hero image (larger dimensions) - uses high-impact sports photos
 */
export function getHeroImage(category?: string): string {
  const queries: Record<string, string> = {
    nfl: 'american-football,action',
    nba: 'basketball,action',
    soccer: 'soccer,action',
    basketball: 'basketball,action',
    tennis: 'tennis,action',
    default: 'sports,action,dramatic',
  };
  
  const query = category ? (queries[category] || queries.default) : queries.default;
  return getUnsplashImage(query, 1920, 1080);
}

/**
 * Get a card image (standard dimensions) - sport-specific
 */
export function getCardImage(category?: string): string {
  const queries: Record<string, string> = {
    nfl: 'american-football',
    nba: 'basketball',
    soccer: 'soccer',
    basketball: 'basketball',
    tennis: 'tennis',
    cricket: 'cricket',
    default: 'sports,athletes',
  };
  
  const query = category ? (queries[category] || queries.default) : queries.default;
  return getUnsplashImage(query, 800, 600);
}

/**
 * Get a thumbnail image (small dimensions) - sport-specific
 */
export function getThumbnailImage(category?: string): string {
  const queries: Record<string, string> = {
    nfl: 'american-football',
    nba: 'basketball',
    soccer: 'soccer',
    basketball: 'basketball',
    tennis: 'tennis',
    default: 'sports',
  };
  
  const query = category ? (queries[category] || queries.default) : queries.default;
  return getUnsplashImage(query, 400, 300);
}

/**
 * Get podcast/video artwork (square) - sport-specific
 */
export function getPodcastArtwork(index: number = 0): string {
  const queries = [
    'sports,podcast',
    'basketball,podcast',
    'football,podcast',
    'soccer,podcast',
  ];
  
  const safeIndex = index % queries.length;
  const query = queries[safeIndex];
  return getUnsplashImage(query, 600, 600);
}

/**
 * Calculate read time based on word count
 * Average reading speed: 200 words per minute
 */
export function calculateReadTime(wordCount: number): number {
  const wordsPerMinute = 200;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Format read time for display
 */
export function formatReadTime(minutes: number): string {
  if (minutes < 1) return '< 1 min read';
  if (minutes === 1) return '1 min read';
  return `${minutes} min read`;
}

/**
 * Generate a placeholder image with specific aspect ratio
 */
export function getPlaceholderImage(
  width: number,
  height: number,
  category: string = 'sports'
): string {
  // Use a generic sports photo for placeholders
  return getUnsplashImage('5IHz5WhosQE', width, height);
}

/**
 * Get image by aspect ratio
 */
export function getImageByAspectRatio(
  aspectRatio: '16:9' | '4:3' | '1:1',
  category: string = 'sports'
): string {
  const dimensions: Record<string, { width: number; height: number }> = {
    '16:9': { width: 1600, height: 900 },
    '4:3': { width: 1200, height: 900 },
    '1:1': { width: 1000, height: 1000 },
  };

  const { width, height } = dimensions[aspectRatio];
  const photoId = '5IHz5WhosQE'; // Runner on track - versatile image
  return getUnsplashImage(photoId, width, height);
}

/**
 * Attribution helper - Always credit Unsplash photographers
 * Usage: Add this to image alt text or nearby the image
 */
export function getUnsplashAttribution(photographerName: string, photoUrl: string): string {
  return `Photo by ${photographerName} on Unsplash`;
}

/**
 * Generate Unsplash photo page URL for attribution links
 */
export function getUnsplashPhotoUrl(photoId: string): string {
  return `https://unsplash.com/photos/${photoId}`;
}

