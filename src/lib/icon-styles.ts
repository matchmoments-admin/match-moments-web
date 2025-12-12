/**
 * Icon styling constants for consistent chrome/refined aesthetic
 * Based on Lucide React best practices
 */

/**
 * Icon size variants
 */
export const ICON_SIZES = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-7 w-7',
  '2xl': 'h-8 w-8',
} as const;

/**
 * Icon stroke widths for chrome aesthetic
 * - Default (1.5): Refined, professional look
 * - Thin (1): Delicate, minimal
 * - Bold (2): Prominent, attention-grabbing
 */
export const ICON_STROKES = {
  thin: 'stroke-[1]',
  default: 'stroke-[1.5]',
  bold: 'stroke-2',
} as const;

/**
 * Common icon class combinations for consistent styling
 */
export const ICON_STYLES = {
  // Navigation icons - refined and subtle
  nav: `${ICON_SIZES.lg} ${ICON_STROKES.default}`,
  
  // Header icons - slightly larger and bolder
  header: `${ICON_SIZES.lg} ${ICON_STROKES.bold}`,
  
  // Inline icons - small and refined
  inline: `${ICON_SIZES.sm} ${ICON_STROKES.default}`,
  
  // Feature icons - medium size, refined
  feature: `${ICON_SIZES.md} ${ICON_STROKES.default}`,
  
  // Media icons (play, video, mic) - medium with default stroke
  media: `${ICON_SIZES.md} ${ICON_STROKES.default}`,
  
  // Action icons (close, menu) - bold and prominent
  action: `${ICON_SIZES.lg} ${ICON_STROKES.bold}`,
  
  // Arrow icons - thin and refined
  arrow: `${ICON_SIZES.sm} ${ICON_STROKES.thin}`,
  
  // Hero/large icons - extra large with refined stroke
  hero: `${ICON_SIZES['2xl']} ${ICON_STROKES.default}`,
} as const;

/**
 * Helper to combine icon styles with custom classes
 */
export function iconClass(preset: keyof typeof ICON_STYLES, ...classes: string[]): string {
  return [ICON_STYLES[preset], ...classes].filter(Boolean).join(' ');
}

/**
 * Common transitions for hover effects
 */
export const ICON_TRANSITIONS = {
  default: 'transition-all duration-150 ease-in-out',
  slow: 'transition-all duration-300 ease-in-out',
} as const;

