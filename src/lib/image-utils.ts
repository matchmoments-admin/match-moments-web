/**
 * Image utilities for Match Moments sports website
 * Uses LoremFlickr for sports-specific placeholder images
 * For production, replace with actual sports images from your CDN
 */

export interface ImageOptions {
  width?: number;
  height?: number;
  query?: string;
  sport?: string;
  category?: 'sports' | 'nfl' | 'nba' | 'nhl' | 'soccer' | 'baseball' | 'basketball' | 'football';
}

/**
 * Generate a placeholder image URL using Lorem Picsum
 * Format: https://picsum.photos/{WIDTH}/{HEIGHT}?random={SEED}
 */
export function getPlaceholderImageUrl(width: number = 1200, height: number = 800, seed?: string): string {
  // Use Lorem Picsum for reliable placeholder images
  const randomSeed = seed || Math.floor(Math.random() * 1000);
  return `https://picsum.photos/${width}/${height}?random=${randomSeed}`;
}

/**
 * Get a sports-themed image by category with random selection
 */
export function getSportsImage(
  category: 'nfl' | 'nba' | 'nhl' | 'soccer' | 'baseball' | 'basketball' | 'football' | 'cricket' | 'tennis' | 'rugby' | 'general' = 'general',
  dimensions: { width: number; height: number } = { width: 1200, height: 800 }
): string {
  // Map categories to specific seed values for consistent but varied images
  const seedMap: Record<string, string> = {
    nfl: 'football',
    nba: 'basketball',
    basketball: 'basketball',
    football: 'football',
    soccer: 'soccer',
    baseball: 'baseball',
    tennis: 'tennis',
    cricket: 'cricket',
    rugby: 'rugby',
    nhl: 'hockey',
    general: 'sports',
  };

  const seed = seedMap[category] || 'sports';
  return getPlaceholderImageUrl(dimensions.width, dimensions.height, seed);
}

/**
 * Get a hero image (larger dimensions) - uses high-impact photos
 */
export function getHeroImage(category?: string): string {
  const seeds: Record<string, string> = {
    nfl: 'hero-nfl',
    nba: 'hero-nba',
    soccer: 'hero-soccer',
    basketball: 'hero-basketball',
    tennis: 'hero-tennis',
    default: 'hero-sports',
  };
  
  const seed = category ? (seeds[category] || seeds.default) : seeds.default;
  return getPlaceholderImageUrl(1920, 1080, seed);
}

/**
 * Get a card image (standard dimensions) - sport-specific
 */
export function getCardImage(category?: string): string {
  const seeds: Record<string, string> = {
    nfl: 'card-nfl',
    nba: 'card-nba',
    soccer: 'card-soccer',
    basketball: 'card-basketball',
    tennis: 'card-tennis',
    cricket: 'card-cricket',
    default: 'card-sports',
  };
  
  const seed = category ? (seeds[category] || seeds.default) : seeds.default;
  return getPlaceholderImageUrl(800, 600, seed);
}

/**
 * Get a thumbnail image (small dimensions) - sport-specific
 */
export function getThumbnailImage(category?: string): string {
  const seeds: Record<string, string> = {
    nfl: 'thumb-nfl',
    nba: 'thumb-nba',
    soccer: 'thumb-soccer',
    basketball: 'thumb-basketball',
    tennis: 'thumb-tennis',
    default: 'thumb-sports',
  };
  
  const seed = category ? (seeds[category] || seeds.default) : seeds.default;
  return getPlaceholderImageUrl(400, 300, seed);
}

/**
 * Get podcast/video artwork (square) - sport-specific
 */
export function getPodcastArtwork(index: number = 0): string {
  const seeds = [
    'podcast-1',
    'podcast-2',
    'podcast-3',
    'podcast-4',
  ];
  
  const safeIndex = index % seeds.length;
  const seed = seeds[safeIndex];
  return getPlaceholderImageUrl(600, 600, seed);
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
  return getPlaceholderImageUrl(width, height, category);
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
  return getPlaceholderImageUrl(width, height, category);
}

/**
 * Attribution helper for Lorem Picsum
 */
export function getImageAttribution(): string {
  return 'Placeholder images provided by Lorem Picsum (https://picsum.photos)';
}

// ============================================================================
// SPORTS-SPECIFIC PLACEHOLDERS (LoremFlickr)
// ============================================================================

/**
 * Free sports-specific placeholder services
 */
const PLACEHOLDER_SERVICES = {
  loremflickr: (sport: string, w: number, h: number) => 
    `https://loremflickr.com/${w}/${h}/${sport},sports`,
  unsplash: (sport: string, w: number, h: number) => 
    `https://source.unsplash.com/${w}x${h}/?${sport},sports`,
  picsum: (w: number, h: number) => 
    `https://picsum.photos/${w}/${h}?grayscale&blur=2`,
};

/**
 * Get sports-specific placeholder image (used by mappers)
 * Uses LoremFlickr for best sports-related images
 */
export function getSportsPlaceholder(
  sport: string, 
  options: ImageOptions = {}
): string {
  const { width = 640, height = 360 } = options;
  
  // Try LoremFlickr first (best for sports)
  return PLACEHOLDER_SERVICES.loremflickr(sport, width, height);
}

/**
 * Get team logo placeholder
 */
export function getTeamPlaceholder(teamName?: string): string {
  return '/placeholder-team.png';
}

/**
 * Get player photo placeholder
 */
export function getPlayerPlaceholder(playerName?: string): string {
  return '/placeholder-player.jpg';
}

/**
 * Get moment thumbnail - extract from video or use placeholder
 */
export function getMomentThumbnail(videoUrl?: string, sport: string = 'soccer'): string {
  if (videoUrl) {
    // Extract YouTube thumbnail
    const youtubeMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    if (youtubeMatch) {
      return `https://img.youtube.com/vi/${youtubeMatch[1]}/hqdefault.jpg`;
    }
  }
  return getSportsPlaceholder(sport, { width: 640, height: 360 });
}

/**
 * Get article header image - use provided or generate sports placeholder
 */
export function getArticleImage(headerImageUrl?: string, sport?: string): string {
  return headerImageUrl || getSportsPlaceholder(sport || 'sports', { width: 1200, height: 630 });
}

/**
 * Get competition logo placeholder
 */
export function getCompetitionPlaceholder(): string {
  return '/placeholder-competition.png';
}

