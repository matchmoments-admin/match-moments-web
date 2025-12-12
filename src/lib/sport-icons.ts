/**
 * Sport icons and metadata utilities
 * Provides consistent icons across the site for all sports
 */

import type { SportType } from '@/types/sports';

/**
 * Get icon for a sport
 */
export function getSportIcon(sport: SportType): string {
  const icons: Record<SportType, string> = {
    soccer: '⚽',
    cricket: '🏏',
    basketball: '🏀',
    tennis: '🎾',
    nfl: '🏈',
    rugby: '🏉',
    padel: '🎾',
    pickleball: '🏓',
    skiing: '⛷️',
  };

  return icons[sport] || '🏅';
}

/**
 * Get event icon for commentary events
 */
export function getEventIcon(eventType: string): string {
  const icons: Record<string, string> = {
    'Goal': '⚽',
    'Try': '🏉',
    'Touchdown': '🏈',
    'Basket': '🏀',
    'Ace': '🎾',
    'Wicket': '🏏',
    'Card': '🟨',
    'Yellow Card': '🟨',
    'Red Card': '🟥',
    'Substitution': '🔄',
    'Save': '🧤',
    'Penalty': '🎯',
    'VAR': '📹',
    'Injury': '🩹',
    'Kick-off': '▶️',
    'Half-time': '⏸️',
    'Full-time': '🏁',
    'Timeout': '⏱️',
    'Challenge': '🚩',
  };

  return icons[eventType] || '•';
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
 * Get sport with icon
 */
export function getSportWithIcon(sport: SportType): string {
  return `${getSportIcon(sport)} ${getSportDisplayName(sport)}`;
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

