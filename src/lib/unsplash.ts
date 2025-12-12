/**
 * Unsplash image utility for placeholder images
 * Uses Unsplash Source API (no API key required for basic usage)
 */

const UNSPLASH_BASE = 'https://source.unsplash.com';

export interface UnsplashImageOptions {
  width?: number;
  height?: number;
  keywords?: string[];
  random?: boolean;
}

/**
 * Get an Unsplash image URL for sports-related content
 */
export function getUnsplashImage(options: UnsplashImageOptions = {}): string {
  const {
    width = 1200,
    height = 800,
    keywords = ['sports'],
    random = true,
  } = options;

  // Use Unsplash Source API with keywords
  // Format: https://source.unsplash.com/{width}x{height}/?{keywords}
  const keywordString = keywords.join(',');
  const randomParam = random ? '&sig=' + Math.random() : '';
  
  return `${UNSPLASH_BASE}/${width}x${height}/?${keywordString}${randomParam}`;
}

/**
 * Get sports-specific image URLs
 */
export const sportsImages = {
  basketball: () => getUnsplashImage({ keywords: ['basketball', 'nba'] }),
  football: () => getUnsplashImage({ keywords: ['football', 'nfl'] }),
  soccer: () => getUnsplashImage({ keywords: ['soccer', 'football'] }),
  baseball: () => getUnsplashImage({ keywords: ['baseball', 'mlb'] }),
  general: () => getUnsplashImage({ keywords: ['sports', 'athlete'] }),
  hero: () => getUnsplashImage({ width: 1920, height: 600, keywords: ['sports'] }),
  card: () => getUnsplashImage({ width: 1200, height: 800, keywords: ['sports'] }),
  thumbnail: () => getUnsplashImage({ width: 400, height: 400, keywords: ['sports'] }),
};

