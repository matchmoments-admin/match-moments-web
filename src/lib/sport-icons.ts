/**
 * Sport icons and metadata utilities
 * Provides consistent chrome/monochrome icons across the site for all sports
 * Uses Heroicons for clean, professional black/white aesthetic
 */

import type { ForwardRefExoticComponent, SVGProps } from 'react';
import {
  TrophyIcon,
  BoltIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  PlayIcon,
  PauseIcon,
  FlagIcon,
  ClockIcon,
  VideoCameraIcon,
  XMarkIcon,
  ArrowsPointingOutIcon,
  EyeIcon,
  ShareIcon,
  FireIcon,
} from '@heroicons/react/24/outline';

import type { SportType } from '@/types/sports';

// Type for Heroicons components
export type HeroIcon = ForwardRefExoticComponent<SVGProps<SVGSVGElement>>;

/**
 * Get icon component for a sport
 */
export function getSportIconComponent(sport: SportType): HeroIcon {
  const icons: Record<SportType, HeroIcon> = {
    soccer: ArrowsPointingOutIcon, // Ball/sport shape
    cricket: TrophyIcon, // Generic sport icon
    basketball: ArrowsPointingOutIcon, // Ball shape
    tennis: ArrowsPointingOutIcon, // Ball shape
    nfl: TrophyIcon, // American football
    rugby: TrophyIcon, // Rugby
    padel: ArrowsPointingOutIcon, // Ball shape
    pickleball: ArrowsPointingOutIcon, // Ball shape
    skiing: BoltIcon, // Speed/movement
  };

  return icons[sport] || TrophyIcon;
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

