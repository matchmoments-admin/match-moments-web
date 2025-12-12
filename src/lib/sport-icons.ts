/**
 * Sport icons and metadata utilities
 * Provides consistent chrome/monochrome icons across the site for all sports
 * Uses Lucide React for styleable SVG icons
 */

import type { LucideIcon } from 'lucide-react';
import {
  Circle,
  Trophy,
  Zap,
  Target,
  RefreshCw,
  Shield,
  Play,
  Pause,
  Flag,
  Timer,
  Video,
  X,
  Clock,
} from 'lucide-react';

import type { SportType } from '@/types/sports';

/**
 * Get icon component for a sport
 */
export function getSportIconComponent(sport: SportType): LucideIcon {
  const icons: Record<SportType, LucideIcon> = {
    soccer: Circle, // Soccer ball shape
    cricket: Trophy, // Generic sport icon
    basketball: Circle, // Ball shape
    tennis: Circle, // Ball shape
    nfl: Trophy, // American football
    rugby: Trophy, // Rugby ball
    padel: Circle, // Ball shape
    pickleball: Circle, // Ball shape
    skiing: Zap, // Speed/movement
  };

  return icons[sport] || Trophy;
}

/**
 * Get event icon component for commentary events
 */
export function getEventIconComponent(eventType: string): LucideIcon {
  const icons: Record<string, LucideIcon> = {
    'Goal': Target,
    'Try': Target,
    'Touchdown': Target,
    'Basket': Target,
    'Ace': Zap,
    'Wicket': Target,
    'Card': Shield,
    'Yellow Card': Shield,
    'Red Card': Shield,
    'Substitution': RefreshCw,
    'Save': Shield,
    'Penalty': Target,
    'VAR': Video,
    'Injury': X,
    'Kick-off': Play,
    'Half-time': Pause,
    'Full-time': Flag,
    'Timeout': Timer,
    'Challenge': Flag,
  };

  return icons[eventType] || Clock;
}

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

