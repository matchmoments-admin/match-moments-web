/**
 * Sport icons and metadata utilities
 * Provides SIDEARM-style sport-specific icons across the site
 * Uses custom SVG icons inspired by SIDEARM Sports icon library
 * See: https://icons.dev.sidearmdev.com/sport-icons/index.html
 */

import {
  BoltIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  PlayIcon,
  PauseIcon,
  FlagIcon,
  ClockIcon,
  VideoCameraIcon,
  XMarkIcon,
  EyeIcon,
  ShareIcon,
  FireIcon,
  TrophyIcon,
  ArrowsPointingOutIcon,
} from '@heroicons/react/24/outline';

import type { SportType } from '@/types/sports';
import type { ForwardRefExoticComponent, SVGProps } from 'react';

// Type for Heroicons components
export type HeroIcon = ForwardRefExoticComponent<SVGProps<SVGSVGElement>>;

/**
 * SVG path data for SIDEARM-style sport icons
 */
interface SportIconData {
  viewBox: string;
  paths: string[];
}

const sportIconData: Record<string, SportIconData> = {
  soccer: {
    viewBox: '0 0 16 16',
    paths: [
      'M8 0.5C3.86 0.5 0.5 3.86 0.5 8s3.36 7.5 7.5 7.5 7.5-3.36 7.5-7.5S12.14 0.5 8 0.5zm0 13.5c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z',
      'M8 3l1.5 2.5h2.5l-2 1.5.5 2.5L8 8l-2.5 1.5.5-2.5-2-1.5h2.5z'
    ]
  },
  football: {
    viewBox: '0 0 16 16',
    paths: [
      'M13.667 3.267a1.32 1.32 0 0 0-.934-.934A10.582 10.582 0 0 0 10.2 2L14 5.8c0-1.067-.2-1.933-.333-2.533ZM2.333 12.733c.134.467.467.8.934.934C3.8 13.8 4.733 14 5.8 14L2 10.2c0 1.067.2 1.933.333 2.533Zm-.2-4.066 5.2 5.266c3.2-.466 6-2.866 6.6-6.533L8.667 2.067c-3.2.466-6 2.933-6.534 6.6Zm7.667-3a.203.203 0 0 1 .267 0l.266.266c.067.067.067.2 0 .267l-.666.667.666.666c.067.067.067.2 0 .267l-.266.267a.203.203 0 0 1-.267 0L9.133 7.4l-.6.6.667.667c.067.066.067.2 0 .266l-.267.267a.203.203 0 0 1-.266 0L8 8.533l-.533.534.666.666c.067.067.067.2 0 .267l-.266.267a.203.203 0 0 1-.267 0L6.933 9.6l-.666.667a.203.203 0 0 1-.267 0L5.733 10a.203.203 0 0 1 0-.267l.667-.666-.667-.667a.203.203 0 0 1 0-.267L6 7.867a.203.203 0 0 1 .267 0l.666.666L7.467 8 6.8 7.333a.203.203 0 0 1 0-.266l.267-.267a.203.203 0 0 1 .266 0L8 7.467l.533-.534-.666-.666a.203.203 0 0 1 0-.267l.266-.267a.203.203 0 0 1 .267 0l.667.667.733-.733Z'
    ]
  },
  basketball: {
    viewBox: '0 0 16 16',
    paths: [
      'M8 0.5C3.86 0.5 0.5 3.86 0.5 8s3.36 7.5 7.5 7.5 7.5-3.36 7.5-7.5S12.14 0.5 8 0.5zm5.5 7h-5v-5c2.76.5 4.93 2.67 5.5 5.5zm-6 0h-5C3.07 4.67 5.24 2.5 8 2v5.5zm-5.5 1h5v5c-2.76-.5-4.93-2.67-5.5-5.5zm6 0v5c2.76-.5 4.93-2.67 5.5-5.5h-5.5z'
    ]
  },
  tennis: {
    viewBox: '0 0 16 16',
    paths: [
      'M8 0.5C3.86 0.5 0.5 3.86 0.5 8s3.36 7.5 7.5 7.5 7.5-3.36 7.5-7.5S12.14 0.5 8 0.5zm0 13.5c-1.5 0-2.87-.55-3.93-1.46C5.13 11.5 6.5 10.5 8 10.5s2.87 1 3.93 2.04C10.87 13.45 9.5 14 8 14zm4.46-2.57C11.13 10.27 9.63 9.5 8 9.5s-3.13.77-4.46 1.93C2.55 10.37 2 9.24 2 8c0-1.24.55-2.37 1.54-3.43C4.87 5.73 6.37 6.5 8 6.5s3.13-.77 4.46-1.93C13.45 5.63 14 6.76 14 8c0 1.24-.55 2.37-1.54 3.43zM8 5.5C6.5 5.5 5.13 4.5 4.07 3.46 5.13 2.55 6.5 2 8 2s2.87.55 3.93 1.46C10.87 4.5 9.5 5.5 8 5.5z'
    ]
  },
  cricket: {
    viewBox: '0 0 16 16',
    paths: [
      'M11.5 2L6 7.5 8.5 10 14 4.5 11.5 2zM5 8.5L1.5 12c-.3.3-.3.8 0 1.1l1.4 1.4c.3.3.8.3 1.1 0L7.5 11 5 8.5z',
      'M3.5 5.5c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2z'
    ]
  },
  rugby: {
    viewBox: '0 0 16 16',
    paths: [
      'M12.5 1.5c-1.5 0-3.5.5-5.5 2.5S4.5 7.5 4.5 9s.5 3.5 2.5 5.5 4 2.5 5.5 2.5c.5 0 1-.5 1-1 0-1.5-.5-3.5-2.5-5.5S7.5 6.5 6 6.5c-.5 0-1-.5-1-1 0-1.5.5-3.5 2.5-5.5S11 1.5 12.5 1.5c.5 0 1 .5 1 1zm-1 2c-1 0-2 .3-3 1l4 4c.7-1 1-2 1-3 0-.5-.5-.5-1-.5-1-.5-1-.5-1-.5zm-6 7c1 0 2-.3 3-1l-4-4c-.7 1-1 2-1 3 0 .5.5.5 1 .5 1 .5 1 .5 1 .5z'
    ]
  },
  skiing: {
    viewBox: '0 0 16 16',
    paths: [
      'M11 4c.83 0 1.5-.67 1.5-1.5S11.83 1 11 1s-1.5.67-1.5 1.5S10.17 4 11 4z',
      'M13.5 15c-.3 0-.5-.2-.5-.5 0-.3.2-.5.5-.5l1-.5-3-7-2 1-1-2-3 1.5c-.3.1-.6 0-.7-.3-.1-.3 0-.6.3-.7l3.5-1.5c.2-.1.5 0 .6.2l.8 1.6 1.6-.8c.2-.1.5 0 .6.2l3.5 8c.1.2 0 .5-.2.6l-1.5.7c-.2 0-.3.1-.5.1z'
    ]
  },
  generic: {
    viewBox: '0 0 16 16',
    paths: [
      'M8 0.5C3.86 0.5 0.5 3.86 0.5 8s3.36 7.5 7.5 7.5 7.5-3.36 7.5-7.5S12.14 0.5 8 0.5zm0 13.5c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z',
      'M10.5 5.5L8 8l2.5 2.5M5.5 5.5L8 8l-2.5 2.5M8 5.5v5'
    ]
  }
};

/**
 * Get SVG icon data for a sport
 */
export function getSportIconData(sport: SportType): SportIconData {
  const iconMap: Record<SportType, string> = {
    soccer: 'soccer',
    cricket: 'cricket',
    basketball: 'basketball',
    tennis: 'tennis',
    nfl: 'football',
    rugby: 'rugby',
    padel: 'tennis',
    pickleball: 'tennis',
    skiing: 'skiing',
  };

  const iconKey = iconMap[sport] || 'generic';
  return sportIconData[iconKey];
}

/**
 * Get icon component for a sport - returns Heroicon as placeholder
 * For actual rendering, use the getSportIconData function with a custom SVG component
 */
export function getSportIconComponent(sport: SportType): HeroIcon {
  // Return Heroicons as fallback for now
  const icons: Record<SportType, HeroIcon> = {
    soccer: BoltIcon,
    cricket: BoltIcon,
    basketball: BoltIcon,
    tennis: BoltIcon,
    nfl: BoltIcon,
    rugby: BoltIcon,
    padel: BoltIcon,
    pickleball: BoltIcon,
    skiing: BoltIcon,
  };

  return icons[sport] || BoltIcon;
}

/**
 * Get event icon component for commentary events
 */
export function getEventIconComponent(eventType: string): HeroIcon {
  const icons: Record<string, HeroIcon> = {
    'Goal': ArrowsPointingOutIcon,
    'Try': ArrowsPointingOutIcon,
    'Touchdown': ArrowsPointingOutIcon,
    'Basket': ArrowsPointingOutIcon,
    'Ace': BoltIcon,
    'Wicket': ArrowsPointingOutIcon,
    'Card': ShieldCheckIcon,
    'Yellow Card': ShieldCheckIcon,
    'Red Card': ShieldCheckIcon,
    'Substitution': ArrowPathIcon,
    'Save': ShieldCheckIcon,
    'Penalty': ArrowsPointingOutIcon,
    'VAR': VideoCameraIcon,
    'Injury': XMarkIcon,
    'Kick-off': PlayIcon,
    'Half-time': PauseIcon,
    'Full-time': FlagIcon,
    'Timeout': ClockIcon,
    'Challenge': FlagIcon,
  };

  return icons[eventType] || ClockIcon;
}

/**
 * Centralized icon exports for common UI elements
 * Use these throughout the app for consistency
 */
export const ICONS = {
  // Sport/Event icons
  trophy: TrophyIcon,
  bolt: BoltIcon,
  shield: ShieldCheckIcon,
  play: PlayIcon,
  pause: PauseIcon,
  flag: FlagIcon,
  clock: ClockIcon,
  video: VideoCameraIcon,
  
  // UI icons
  flame: FireIcon,
  eye: EyeIcon,
  share: ShareIcon,
  refresh: ArrowPathIcon,
  close: XMarkIcon,
  expand: ArrowsPointingOutIcon,
} as const;

/**
 * Get sport display name
 */
export function getSportDisplayName(sport: SportType): string {
  const names: Record<SportType, string> = {
    soccer: 'Soccer',
    cricket: 'Cricket',
    basketball: 'Basketball',
    tennis: 'Tennis',
    nfl: 'American Football',
    rugby: 'Rugby',
    padel: 'Padel',
    pickleball: 'Pickleball',
    skiing: 'Skiing',
  };

  return names[sport] || sport;
}

/**
 * Get gender badge color classes
 */
export function getGenderBadgeClasses(gender: 'womens' | 'mens' | 'both'): string {
  const classes: Record<string, string> = {
    womens: 'bg-purple-100 text-purple-800',
    mens: 'bg-blue-100 text-blue-800',
    both: 'bg-gray-100 text-gray-800',
  };

  return classes[gender] || classes.both;
}

/**
 * Get gender display name
 */
export function getGenderDisplayName(gender: 'womens' | 'mens' | 'both'): string {
  const names: Record<string, string> = {
    womens: "Women's",
    mens: "Men's",
    both: 'All',
  };

  return names[gender] || 'All';
}

/**
 * Get event icon color classes based on event type
 * Returns monochrome classes that inherit from parent or use muted colors
 */
export function getEventIconClasses(eventType: string): string {
  const classes: Record<string, string> = {
    'Goal': 'text-current', // Inherits color from parent
    'Try': 'text-current',
    'Touchdown': 'text-current',
    'Basket': 'text-current',
    'Ace': 'text-current',
    'Wicket': 'text-current',
    'Card': 'text-yellow-600',
    'Yellow Card': 'text-yellow-600',
    'Red Card': 'text-red-600',
    'Substitution': 'text-current',
    'Save': 'text-current',
    'Penalty': 'text-current',
    'VAR': 'text-current',
    'Injury': 'text-current',
    'Kick-off': 'text-current',
    'Half-time': 'text-current',
    'Full-time': 'text-current',
    'Timeout': 'text-current',
    'Challenge': 'text-current',
  };

  return classes[eventType] || 'text-current';
}

