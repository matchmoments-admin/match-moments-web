/**
 * Image utilities for Match Moments sports website
 * Uses proper Unsplash images following their guidelines
 * Images from https://unsplash.com/s/photos/sport
 */

export interface UnsplashImageOptions {
  width?: number;
  height?: number;
  query?: string;
  category?: 'sports' | 'nfl' | 'nba' | 'nhl' | 'soccer' | 'baseball' | 'basketball' | 'football';
}

/**
 * Curated Unsplash sport images with proper photo IDs
 * All images from Unsplash: https://unsplash.com/s/photos/sport
 */
const UNSPLASH_SPORTS_IMAGES = {
  // Basketball images
  basketball: [
    'OtXADkUh3-I', // Basketball game action
    'sYbH8JH9fqg', // Basketball player shooting
    'JKjBsuKpatU', // Basketball court aerial
    'WYd_PkCa1BY', // Basketball dunk
  ],
  // Football/NFL images  
  football: [
    '2EGNqazbAMk', // Football player running
    'tTuYcaS_ydI', // American football game
    '7EbGqGP_c8w', // Football stadium
    'BKKYrahJ-N4', // Football action
  ],
  // Soccer images
  soccer: [
    '7EbGqGP_c8w', // Soccer stadium
    'o0S0f5WvyRE', // Soccer player action
    'WNk-f-TnZDw', // Soccer ball close-up
    'jBxdgT4wLSM', // Soccer match
  ],
  // General sports/athletics
  athletics: [
    '5IHz5WhosQE', // Runner on track (Braden Collum)
    'U2q75VJmvE8', // Cyclist group
    '_rZnChsIUuI', // Athlete jumping
    'gjK9lBPCca8', // Swimming
  ],
  // Tennis
  tennis: [
    'KxkUWc_J3tM', // Tennis player serving
    'Q-JtiMmONrk', // Tennis court
  ],
  // Gym/fitness
  fitness: [
    'CQfNt66ttZM', // Weight lifting
    'FP7cfYPPUKM', // Yoga group
    'wnX4F1D3c-0', // Dumbbells
  ],
  // General action sports
  action: [
    'n6gnCa77Urc', // Mountain biking
    'o3v8g-V2rVI', // Rock climbing  
    '8mqOw4K-Hbw', // Running at sunset
  ],
};

/**
 * Generate an Unsplash image URL with specific dimensions
 * Format: https://images.unsplash.com/photo-{PHOTO_ID}?w={WIDTH}&h={HEIGHT}&fit=crop&q=80
 */
export function getUnsplashImage(photoId: string, width: number = 1200, height: number = 800): string {
  return `https://images.unsplash.com/photo-${photoId}?w=${width}&h=${height}&fit=crop&q=80`;
}

/**
 * Get a random image from a category
 */
function getRandomImageFromCategory(category: keyof typeof UNSPLASH_SPORTS_IMAGES): string {
  const images = UNSPLASH_SPORTS_IMAGES[category];
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
}

/**
 * Get a sports-themed image by category
 */
export function getSportsImage(
  category: 'nfl' | 'nba' | 'nhl' | 'soccer' | 'baseball' | 'basketball' | 'football' | 'general' = 'general',
  dimensions: { width: number; height: number } = { width: 1200, height: 800 }
): string {
  const categoryMap: Record<string, keyof typeof UNSPLASH_SPORTS_IMAGES> = {
    nfl: 'football',
    nba: 'basketball',
    basketball: 'basketball',
    football: 'football',
    soccer: 'soccer',
    tennis: 'tennis',
    general: 'athletics',
  };

  const imageCategory = categoryMap[category] || 'athletics';
  const photoId = getRandomImageFromCategory(imageCategory);
  
  return getUnsplashImage(photoId, dimensions.width, dimensions.height);
}

/**
 * Get a hero image (larger dimensions) - uses high-impact sports photos
 */
export function getHeroImage(category?: string): string {
  // Use dramatic action shots for hero images
  const heroPhotoIds = [
    '5IHz5WhosQE', // Runner on track - dramatic
    'OtXADkUh3-I', // Basketball game action
    '2EGNqazbAMk', // Football player running
    '7EbGqGP_c8w', // Stadium shot
  ];
  
  const randomId = heroPhotoIds[Math.floor(Math.random() * heroPhotoIds.length)];
  return getUnsplashImage(randomId, 1920, 1080);
}

/**
 * Get a card image (standard dimensions)
 */
export function getCardImage(category?: string): string {
  const cardPhotoIds = [
    'OtXADkUh3-I', // Basketball
    '2EGNqazbAMk', // Football
    '5IHz5WhosQE', // Running
    'U2q75VJmvE8', // Cycling
    'CQfNt66ttZM', // Weight lifting
    'WNk-f-TnZDw', // Soccer
  ];
  
  const randomId = cardPhotoIds[Math.floor(Math.random() * cardPhotoIds.length)];
  return getUnsplashImage(randomId, 800, 600);
}

/**
 * Get a thumbnail image (small dimensions)
 */
export function getThumbnailImage(category?: string): string {
  const thumbnailPhotoIds = [
    'OtXADkUh3-I', // Basketball
    '5IHz5WhosQE', // Running
    'CQfNt66ttZM', // Gym
  ];
  
  const randomId = thumbnailPhotoIds[Math.floor(Math.random() * thumbnailPhotoIds.length)];
  return getUnsplashImage(randomId, 400, 300);
}

/**
 * Get podcast/video artwork (square)
 */
export function getPodcastArtwork(): string {
  // Use fitness/sports imagery for podcast covers
  const podcastPhotoIds = [
    'FP7cfYPPUKM', // Yoga group - community vibe
    'CQfNt66ttZM', // Weight lifting
    'wnX4F1D3c-0', // Dumbbells
  ];
  
  const randomId = podcastPhotoIds[Math.floor(Math.random() * podcastPhotoIds.length)];
  return getUnsplashImage(randomId, 600, 600);
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

