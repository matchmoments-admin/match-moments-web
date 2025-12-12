/**
 * Type definitions for gender-segregated, multi-sport architecture
 * Match Moments - Women's Sports Focus Platform
 */

// ============================================================================
// GENDER & SPORT TYPES
// ============================================================================

/**
 * Gender category for sports content
 * - 'womens': Women's sports (60% focus)
 * - 'mens': Men's sports
 * - 'both': Mixed/co-ed events (e.g., some tennis tournaments)
 */
export type GenderCategory = 'womens' | 'mens' | 'both';

/**
 * Sport types supported on the platform
 * Ordered by global fan size
 */
export type SportType =
  | 'soccer'      // 3.5B fans
  | 'cricket'     // 2.5B fans
  | 'basketball'  // 2.2B fans
  | 'tennis'      // 1B fans
  | 'nfl'         // 400M fans
  | 'rugby'       // 390M fans
  | 'padel'       // 25M fans
  | 'pickleball'  // 8.9M fans
  | 'skiing';     // 200M fans

/**
 * Sport metadata for display and navigation
 */
export interface SportMetadata {
  id: SportType;
  name: string;
  icon: string;
  globalFans: string;
  priority: number; // 0 = highest priority
  status: 'active' | 'coming-soon';
}

// ============================================================================
// ROUTE & NAVIGATION TYPES
// ============================================================================

/**
 * Route parameters for dynamic sport pages
 */
export interface RouteParams {
  gender: GenderCategory;
  sport: SportType;
  competitionId?: string;
  teamId?: string;
  playerId?: string;
  fixtureId?: string;
  momentId?: string;
}

/**
 * Breadcrumb item for hierarchical navigation
 */
export interface BreadcrumbItem {
  label: string;
  href: string;
  current?: boolean;
}

// ============================================================================
// COMPETITION TYPES
// ============================================================================

/**
 * Competition/League information
 */
export interface Competition {
  id: string;
  name: string;
  shortName?: string;
  sport: SportType;
  gender: GenderCategory;
  country?: string;
  season: string;
  logoUrl?: string;
  status: 'active' | 'upcoming' | 'completed';
  priority?: number; // For featured competitions
  numberOfTeams?: number;
  startDate?: string;
  endDate?: string;
}

/**
 * Competition standing row
 */
export interface CompetitionStanding {
  position: number;
  teamId: string;
  teamName: string;
  teamLogoUrl?: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form?: string; // e.g., "WWDLW"
}

// ============================================================================
// TEAM TYPES
// ============================================================================

/**
 * Team information
 */
export interface Team {
  id: string;
  name: string;
  shortName?: string;
  logoUrl?: string;
  sport: SportType;
  gender: GenderCategory;
  country?: string;
  stadium?: string;
  foundedYear?: number;
  colors?: {
    primary: string;
    secondary: string;
  };
}

/**
 * Team statistics for a competition
 */
export interface TeamStats {
  teamId: string;
  competitionId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  cleanSheets?: number;
  form?: string;
}

// ============================================================================
// PLAYER TYPES
// ============================================================================

/**
 * Player information
 */
export interface Player {
  id: string;
  name: string;
  position: string;
  jerseyNumber?: number;
  photoUrl?: string;
  dateOfBirth?: string;
  nationality?: string;
  height?: number; // cm
  weight?: number; // kg
  currentTeamId: string;
  currentTeamName: string;
  sport: SportType;
  gender: GenderCategory;
}

/**
 * Player season statistics
 */
export interface PlayerSeasonStats {
  playerId: string;
  competitionId: string;
  season: string;
  appearances: number;
  goals?: number;
  assists?: number;
  yellowCards?: number;
  redCards?: number;
  minutesPlayed?: number;
  // Sport-specific stats
  [key: string]: any;
}

// ============================================================================
// FIXTURE/MATCH TYPES
// ============================================================================

/**
 * Match/Fixture information
 */
export interface Fixture {
  id: string;
  homeTeam: {
    id: string;
    name: string;
    logoUrl?: string;
  };
  awayTeam: {
    id: string;
    name: string;
    logoUrl?: string;
  };
  homeScore: number;
  awayScore: number;
  competition: {
    id: string;
    name: string;
    logoUrl?: string;
  };
  sport: SportType;
  gender: GenderCategory;
  matchDate: string; // ISO string
  venue?: string;
  status: 'scheduled' | 'live' | 'halftime' | 'finished' | 'postponed' | 'cancelled';
  currentMinute?: number;
}

/**
 * Match period (half, quarter, inning, etc.)
 */
export interface FixturePeriod {
  periodNumber: number;
  periodType: string; // 'Half', 'Quarter', 'Inning', etc.
  homeScore: number;
  awayScore: number;
  cumulativeHomeScore: number;
  cumulativeAwayScore: number;
}

/**
 * Extended fixture with full details
 */
export interface FixtureDetail extends Fixture {
  periods: FixturePeriod[];
  events: CommentaryEvent[];
  lineups?: MatchLineup;
  stats?: MatchStats;
}

// ============================================================================
// MOMENT/EVENT TYPES
// ============================================================================

/**
 * Commentary event / moment
 */
export interface CommentaryEvent {
  id: string;
  fixtureId: string;
  eventType: string; // 'Goal', 'Card', 'Substitution', 'Save', etc.
  eventMinute: number;
  description: string;
  socialShareTitle?: string;
  primaryPlayer?: {
    id: string;
    name: string;
  };
  secondaryPlayer?: {
    id: string;
    name: string;
  };
  videoUrl?: string;
  imageUrl?: string;
  viralScore?: number; // 0-100
  totalViews?: number;
  totalShares?: number;
  period?: {
    periodType: string;
    periodNumber: number;
    homeScore: number;
    awayScore: number;
    cumulativeHomeScore: number;
    cumulativeAwayScore: number;
  };
}

/**
 * Trending moment (for feeds)
 */
export interface TrendingMoment extends CommentaryEvent {
  fixture: {
    id: string;
    homeTeam: string;
    awayTeam: string;
    competition: string;
  };
  sport: SportType;
  gender: GenderCategory;
  thumbnailUrl: string;
}

// ============================================================================
// LINEUP & STATS TYPES
// ============================================================================

/**
 * Match lineup
 */
export interface MatchLineup {
  homeTeam: {
    formation?: string;
    starters: LineupPlayer[];
    substitutes: LineupPlayer[];
  };
  awayTeam: {
    formation?: string;
    starters: LineupPlayer[];
    substitutes: LineupPlayer[];
  };
}

/**
 * Player in a lineup
 */
export interface LineupPlayer {
  playerId: string;
  playerName: string;
  jerseyNumber: number;
  position: string;
  captain?: boolean;
  events?: {
    type: 'goal' | 'yellow-card' | 'red-card' | 'substitution';
    minute: number;
  }[];
}

/**
 * Match statistics
 */
export interface MatchStats {
  homeTeam: TeamMatchStats;
  awayTeam: TeamMatchStats;
}

/**
 * Team statistics for a single match
 */
export interface TeamMatchStats {
  possession?: number; // percentage
  shots?: number;
  shotsOnTarget?: number;
  corners?: number;
  fouls?: number;
  offsides?: number;
  yellowCards?: number;
  redCards?: number;
  passes?: number;
  passAccuracy?: number; // percentage
  // Sport-specific stats
  [key: string]: any;
}

// ============================================================================
// DISPLAY/UI TYPES
// ============================================================================

/**
 * Sport card for homepage/navigation
 */
export interface SportCard {
  sport: SportType;
  name: string;
  icon: string;
  globalFans: string;
  womensHref: string;
  mensHref: string;
  bothHref: string;
  tag?: string; // e.g., "Growing Fast", "Fastest Growing"
  priority: number;
}

/**
 * Gender navigation card
 */
export interface GenderNavCard {
  gender: GenderCategory;
  title: string;
  description: string;
  href: string;
  isPrimary: boolean; // Women's = true (60% focus)
  stats: {
    label: string;
    value: string;
  }[];
}

/**
 * Live score widget data
 */
export interface LiveScoreWidget {
  fixtures: Fixture[];
  sport?: SportType;
  gender?: GenderCategory;
  autoRefresh?: boolean;
}

// ============================================================================
// EXPORT CONSTANTS
// ============================================================================

/**
 * Sport metadata constants
 */
export const SPORT_METADATA: Record<SportType, SportMetadata> = {
  soccer: {
    id: 'soccer',
    name: 'Soccer',
    icon: '⚽',
    globalFans: '3.5B',
    priority: 0,
    status: 'active',
  },
  cricket: {
    id: 'cricket',
    name: 'Cricket',
    icon: '🏏',
    globalFans: '2.5B',
    priority: 1,
    status: 'active',
  },
  basketball: {
    id: 'basketball',
    name: 'Basketball',
    icon: '🏀',
    globalFans: '2.2B',
    priority: 2,
    status: 'active',
  },
  tennis: {
    id: 'tennis',
    name: 'Tennis',
    icon: '🎾',
    globalFans: '1B',
    priority: 3,
    status: 'active',
  },
  nfl: {
    id: 'nfl',
    name: 'American Football',
    icon: '🏈',
    globalFans: '400M',
    priority: 4,
    status: 'active',
  },
  rugby: {
    id: 'rugby',
    name: 'Rugby',
    icon: '🏉',
    globalFans: '390M',
    priority: 5,
    status: 'active',
  },
  padel: {
    id: 'padel',
    name: 'Padel',
    icon: '🎾',
    globalFans: '25M',
    priority: 6,
    status: 'coming-soon',
  },
  pickleball: {
    id: 'pickleball',
    name: 'Pickleball',
    icon: '🏓',
    globalFans: '8.9M',
    priority: 7,
    status: 'coming-soon',
  },
  skiing: {
    id: 'skiing',
    name: 'Skiing',
    icon: '⛷️',
    globalFans: '200M',
    priority: 8,
    status: 'coming-soon',
  },
};

/**
 * Gender display names
 */
export const GENDER_LABELS: Record<GenderCategory, string> = {
  womens: "Women's Sports",
  mens: "Men's Sports",
  both: 'All Sports',
};

