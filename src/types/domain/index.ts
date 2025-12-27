/**
 * Domain/UI Types - Clean, frontend-friendly types
 * 
 * These types are free from Salesforce notation and represent
 * the data structure that UI components consume.
 */

// ============================================================================
// CORE TYPES
// ============================================================================

export type MatchStatus = 'scheduled' | 'live' | 'halftime' | 'finished' | 'postponed' | 'cancelled';
export type GenderType = 'womens' | 'mens' | 'mixed';
export type SportType = 'soccer' | 'cricket' | 'basketball' | 'tennis' | 'nfl' | 'rugby' | 'padel' | 'pickleball' | 'skiing';

// ============================================================================
// TEAM & PLAYER TYPES
// ============================================================================

export interface Team {
  id: string;
  name: string;
  shortName: string;
  logoUrl: string;
  sport: string;
  gender: GenderType;
  abbreviation?: string;
  venue?: string;
  primaryColor?: string;
  secondaryColor?: string;
  foundedYear?: number;
}

export interface Player {
  id: string;
  name: string;
  position?: string;
  jerseyNumber?: number;
  photoUrl?: string;
  dateOfBirth?: Date;
  nationality?: string;
  height?: number;
  weight?: number;
  currentTeam: string;
  sport: string;
  gender: GenderType;
}

// ============================================================================
// COMPETITION & SEASON TYPES
// ============================================================================

export interface Season {
  id: string;
  name: string;
  startDate?: Date;
  endDate?: Date;
  sport?: string;
  seasonType?: 'Calendar Year' | 'Split Year' | 'Tournament';
}

export interface Competition {
  id: string;
  name: string;
  sport: string;
  gender: GenderType;
  logoUrl?: string;
  tier: number;
  country?: string;
  season: {
    id: string;
    name: string;
    startDate?: Date;
    endDate?: Date;
  };
  status?: string;
}

// ============================================================================
// MATCH TYPES
// ============================================================================

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  competition: Competition;
  homeScore: number;
  awayScore: number;
  homeSubScore?: number;
  awaySubScore?: number;
  status: MatchStatus;
  matchDate: Date;
  venue?: string;
  attendance?: number;
  isLive: boolean;
  isNeutralVenue?: boolean;
  sport: string;
  gender: GenderType;
  referee?: string;
  broadcastUrl?: string;
}

export interface MatchPeriod {
  id: string;
  periodNumber: number;
  periodType: string;
  homeScore: number;
  awayScore: number;
  startTime?: Date;
  endTime?: Date;
}

// ============================================================================
// MOMENT TYPES
// ============================================================================

export interface Moment {
  id: string;
  eventType: string;
  eventMinute: number;
  eventSecond?: number;
  description: string;
  shareTitle?: string;
  videoUrl?: string;
  publicUrl?: string;
  viralScore?: number;
  shareCount?: number;
  viewCount?: number;
  primaryPlayer?: {
    id: string;
    name: string;
    photoUrl?: string;
  };
  secondaryPlayer?: {
    id: string;
    name: string;
  };
  team?: {
    id: string;
    name: string;
    logoUrl?: string;
  };
  match: {
    id: string;
    homeTeam: string;
    awayTeam: string;
    competition: string;
  };
  sport: string;
  gender: GenderType;
  thumbnailUrl: string;
}

// ============================================================================
// ARTICLE TYPES
// ============================================================================

export interface Article {
  id: string;
  title: string;
  body: string;
  type: 'news' | 'blog' | 'preview' | 'recap' | 'analysis';
  published: boolean;
  imageUrl?: string;
  author?: string;
  publishedDate: Date;
  readingTime?: number;
  sport?: string;
  articleUrl?: string;
  source?: string;
  relatedTeam?: Team;
  relatedMatch?: { id: string; name: string };
  relatedPlayer?: { id: string; name: string };
}

// ============================================================================
// STATS TYPES
// ============================================================================

export interface TeamSeasonStats {
  id: string;
  teamId: string;
  teamName: string;
  teamLogo?: string;
  competitionId: string;
  competitionName: string;
  seasonId: string;
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  leaguePosition?: number;
  formLast5?: string;
  cleanSheets?: number;
}

export interface PlayerSeasonStats {
  id: string;
  playerId: string;
  playerName: string;
  teamId: string;
  teamName: string;
  competitionId: string;
  seasonId: string;
  appearances: number;
  starts?: number;
  minutesPlayed?: number;
  goals?: number;
  assists?: number;
  yellowCards?: number;
  redCards?: number;
  goalsPerGame?: number;
}

// ============================================================================
// AWARD TYPES
// ============================================================================

export interface Award {
  id: string;
  type: string;
  category: 'Individual Award' | 'Team Trophy' | 'Medal' | 'Selection' | 'Scoring Title';
  year?: number;
  seasonName?: string;
  count?: number;
  details?: string;
  rank?: number;
  iconUrl?: string;
  sport?: string;
  team?: string;
  competition?: string;
}

// ============================================================================
// LEGACY COMPATIBILITY (from existing sports.ts)
// ============================================================================

// Keep existing types for backward compatibility
export interface TrendingMoment extends Moment {
  fixtureId: string; // Alias for match.id
}

export interface Fixture extends Match {
  // Alias type for backward compatibility
}

export type GenderCategory = GenderType;

