/**
 * Image utilities for The Ringer-style sports website
 * Generates Unsplash placeholder images with sports themes
 */

export interface UnsplashImageOptions {
  width?: number;
  height?: number;
  query?: string;
  category?: 'sports' | 'nfl' | 'nba' | 'nhl' | 'soccer' | 'baseball' | 'basketball' | 'football';
}

/**
 * Generate an Unsplash image URL with specific dimensions and query
 */
export function getUnsplashImage(options: UnsplashImageOptions = {}): string {
  const {
    width = 1200,
    height = 800,
    query = 'sports',
    category,
  } = options;

  const searchQuery = category || query;
  return `https://source.unsplash.com/random/${width}x${height}/?${searchQuery}`;
}

/**
 * Get a sports-themed image by category
 */
export function getSportsImage(
  category: 'nfl' | 'nba' | 'nhl' | 'soccer' | 'baseball' | 'basketball' | 'football' | 'general' = 'general',
  dimensions: { width: number; height: number } = { width: 1200, height: 800 }
): string {
  const queries: Record<string, string> = {
    nfl: 'nfl,football,american-football',
    nba: 'nba,basketball,basketball-game',
    nhl: 'nhl,hockey,ice-hockey',
    soccer: 'soccer,football,stadium',
    baseball: 'baseball,mlb,baseball-game',
    basketball: 'basketball,sports,arena',
    football: 'football,nfl,quarterback',
    general: 'sports,action,athlete',
  };

  const query = queries[category] || queries.general;
  return `https://source.unsplash.com/random/${dimensions.width}x${dimensions.height}/?${query}`;
}

/**
 * Get a hero image (larger dimensions)
 */
export function getHeroImage(category?: string): string {
  return getUnsplashImage({
    width: 1920,
    height: 1080,
    query: category || 'sports,action',
  });
}

/**
 * Get a card image (standard dimensions)
 */
export function getCardImage(category?: string): string {
  return getUnsplashImage({
    width: 800,
    height: 600,
    query: category || 'sports',
  });
}

/**
 * Get a thumbnail image (small dimensions)
 */
export function getThumbnailImage(category?: string): string {
  return getUnsplashImage({
    width: 400,
    height: 300,
    query: category || 'sports',
  });
}

/**
 * Get podcast/video artwork (square)
 */
export function getPodcastArtwork(): string {
  return getUnsplashImage({
    width: 600,
    height: 600,
    query: 'sports,commentary,podcast',
  });
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
  return getUnsplashImage({ width, height, query: category });
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
  return getUnsplashImage({ width, height, query: category });
}

