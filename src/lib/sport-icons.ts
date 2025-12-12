/**
 * Sport icons and metadata utilities
 * Uses react-icons for all icon components
 * See: https://react-icons.github.io/react-icons/
 */

import {
  MdSportsSoccer,
  MdSportsBasketball,
  MdSportsTennis,
  MdSportsCricket,
  MdSportsFootball,
  MdSportsRugby,
  MdDownhillSkiing,
  MdSports,
} from 'react-icons/md'; // Material Design icons for sports

import {
  IoFlashOutline,
  IoRefreshOutline,
  IoShieldCheckmarkOutline,
  IoPlayOutline,
  IoPauseOutline,
  IoFlagOutline,
  IoTimeOutline,
  IoVideocamOutline,
  IoCloseOutline,
  IoEyeOutline,
  IoShareSocialOutline,
  IoExpandOutline,
  IoChevronForwardOutline,
  IoSearchOutline,
  IoMenuOutline,
  IoMicOutline,
  IoFemaleOutline,
  IoMaleOutline,
  IoCalendarOutline,
  IoListOutline,
  IoStatsChartOutline,
  IoHomeOutline,
  IoTrophyOutline,
  IoLayersOutline,
  IoPersonOutline,
  IoSettingsOutline,
  IoHelpCircleOutline,
  IoChatbubbleOutline,
  IoInformationCircleOutline,
} from 'react-icons/io5'; // Ionicons outline

import {
  BsFire,
  BsTrophy,
  BsArrowRight,
  BsNewspaper,
  BsGraphUp,
  BsPeople,
  BsLightbulb,
  BsQuestionCircle,
  BsStars,
  BsCpu,
  BsBarChart,
  BsCurrencyDollar,
  BsPerson,
  BsTools,
  BsShield,
  BsCode,
  BsEnvelope,
  BsTelephone,
} from 'react-icons/bs'; // Bootstrap icons

import type { SportType } from '@/types/sports';
import type { IconType } from 'react-icons';

// Type for react-icons components
export type ReactIcon = IconType;

/**
 * Get icon component for a sport
 */
export function getSportIconComponent(sport: SportType): ReactIcon {
  const icons: Record<SportType, ReactIcon> = {
    soccer: MdSportsSoccer,
    cricket: MdSportsCricket,
    basketball: MdSportsBasketball,
    tennis: MdSportsTennis,
    nfl: MdSportsFootball,
    rugby: MdSportsRugby,
    padel: MdSportsTennis,
    pickleball: MdSportsTennis,
    skiing: MdDownhillSkiing,
  };

  return icons[sport] || MdSports;
}

/**
 * Get event icon component for commentary events
 */
export function getEventIconComponent(eventType: string): ReactIcon {
  const icons: Record<string, ReactIcon> = {
    'Goal': IoExpandOutline,
    'Try': IoExpandOutline,
    'Touchdown': IoExpandOutline,
    'Basket': IoExpandOutline,
    'Ace': IoFlashOutline,
    'Wicket': IoExpandOutline,
    'Card': IoShieldCheckmarkOutline,
    'Yellow Card': IoShieldCheckmarkOutline,
    'Red Card': IoShieldCheckmarkOutline,
    'Substitution': IoRefreshOutline,
    'Save': IoShieldCheckmarkOutline,
    'Penalty': IoExpandOutline,
    'VAR': IoVideocamOutline,
    'Injury': IoCloseOutline,
    'Kick-off': IoPlayOutline,
    'Half-time': IoPauseOutline,
    'Full-time': IoFlagOutline,
    'Timeout': IoTimeOutline,
    'Challenge': IoFlagOutline,
  };

  return icons[eventType] || IoTimeOutline;
}

/**
 * Centralized icon exports for common UI elements
 * Use these throughout the app for consistency
 */
export const ICONS = {
  // Sport icons
  soccer: MdSportsSoccer,
  basketball: MdSportsBasketball,
  tennis: MdSportsTennis,
  cricket: MdSportsCricket,
  football: MdSportsFootball,
  rugby: MdSportsRugby,
  skiing: MdDownhillSkiing,
  sports: MdSports,
  
  // Event icons
  trophy: BsTrophy,
  bolt: IoFlashOutline,
  shield: IoShieldCheckmarkOutline,
  play: IoPlayOutline,
  pause: IoPauseOutline,
  flag: IoFlagOutline,
  clock: IoTimeOutline,
  video: IoVideocamOutline,
  
  // UI icons
  flame: BsFire,
  eye: IoEyeOutline,
  share: IoShareSocialOutline,
  refresh: IoRefreshOutline,
  close: IoCloseOutline,
  expand: IoExpandOutline,
  chevronRight: IoChevronForwardOutline,
  arrowRight: BsArrowRight,
  search: IoSearchOutline,
  menu: IoMenuOutline,
  microphone: IoMicOutline,
  
  // Gender icons
  female: IoFemaleOutline,
  male: IoMaleOutline,
  
  // Navigation icons
  home: IoHomeOutline,
  calendar: IoCalendarOutline,
  list: IoListOutline,
  stats: IoStatsChartOutline,
  trophyOutline: IoTrophyOutline,
  layers: IoLayersOutline,
  person: IoPersonOutline,
  settings: IoSettingsOutline,
  help: IoHelpCircleOutline,
  chat: IoChatbubbleOutline,
  info: IoInformationCircleOutline,
  
  // Content icons
  newspaper: BsNewspaper,
  graphUp: BsGraphUp,
  people: BsPeople,
  lightbulb: BsLightbulb,
  questionCircle: BsQuestionCircle,
  stars: BsStars,
  cpu: BsCpu,
  barChart: BsBarChart,
  dollar: BsCurrencyDollar,
  personBadge: BsPerson,
  trophyIcon: BsTrophy,
  tools: BsTools,
  shieldCheck: BsShield,
  code: BsCode,
  envelope: BsEnvelope,
  telephone: BsTelephone,
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
    'Goal': 'text-current',
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
