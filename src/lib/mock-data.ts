import { getSportsImage, getCardImage, getPodcastArtwork } from './image-utils';
import type {
  Competition,
  Team,
  Player,
  Fixture,
  TrendingMoment,
  GenderCategory,
  SportType,
} from '@/types/sports';

export interface MockArticle {
  id: string;
  title: string;
  category: string;
  categoryHref: string;
  author: string;
  date: string;
  readTime: number;
  imageUrl: string;
  href: string;
}

export interface MockPodcast {
  id: string;
  title: string;
  showName: string;
  duration: string;
  date: string;
  imageUrl: string;
  href: string;
  type: 'podcast' | 'video';
}

export interface MockHeroSlide {
  id: string;
  title: string;
  category: string;
  categoryBadgeColor: string;
  imageUrl: string;
  href: string;
  metadata: string;
  hasPlayButton: boolean;
}

// Hero Carousel Slides
export const mockHeroSlides: MockHeroSlide[] = [
  {
    id: '1',
    title: 'The 2026 NBA Draft Is Too Good Not to Tank For',
    category: 'NBA Draft',
    categoryBadgeColor: 'bg-gray-800',
    imageUrl: getSportsImage('nba', { width: 1920, height: 1080 }),
    href: '/article/2026-nba-draft',
    metadata: '',
    hasPlayButton: false,
  },
  {
    id: '2',
    title: 'The Best NFL Bets for Week 15',
    category: 'NFL',
    categoryBadgeColor: 'bg-gray-900',
    imageUrl: getSportsImage('nfl', { width: 1920, height: 1080 }),
    href: '/article/nfl-week-15-bets',
    metadata: '',
    hasPlayButton: false,
  },
  {
    id: '3',
    title: 'Greatest Sports Moments of the Decade',
    category: 'Special',
    categoryBadgeColor: 'bg-black',
    imageUrl: getSportsImage('general', { width: 1920, height: 1080 }),
    href: '/article/greatest-moments',
    metadata: 'Match Moments Special • 15 min read',
    hasPlayButton: false,
  },
];

// Featured Articles (Homepage "The Latest" section)
export const mockFeaturedArticles: MockArticle[] = [
  {
    id: '1',
    title: 'John Cena Won Everyone Over in the End',
    category: 'WWE',
    categoryHref: '/topic/wwe',
    author: 'David Shoemaker',
    date: 'Dec. 12',
    readTime: 10,
    imageUrl: getCardImage('sports'),
    href: '/article/john-cena-legacy',
  },
  {
    id: '2',
    title: 'Pluribus Episode 7 Recap: It\'s a Jungle Out There',
    category: 'TV',
    categoryHref: '/topic/tv',
    author: 'Daniel Chin',
    date: 'Dec. 12',
    readTime: 7,
    imageUrl: getCardImage('general'),
    href: '/article/pluribus-episode-7',
  },
  {
    id: '3',
    title: 'The 2026 NBA Draft Is Too Good Not to Tank For',
    category: 'NBA Draft',
    categoryHref: '/topic/nba-draft',
    author: 'Danny Chau',
    date: 'Dec. 11',
    readTime: 12,
    imageUrl: getCardImage('nba'),
    href: '/article/2026-nba-draft',
  },
  {
    id: '4',
    title: 'Five Thoughts After Revisiting the Bizarre Percy Jackson Movie Sequel',
    category: 'Movies',
    categoryHref: '/topic/movies',
    author: 'Kellen Becoats',
    date: 'Dec. 12',
    readTime: 6,
    imageUrl: getCardImage('general'),
    href: '/article/percy-jackson-sequel',
  },
];

// NFL Section Articles
export const mockNFLArticles: MockArticle[] = [
  {
    id: '1',
    title: 'The Best NFL Bets for Week 15',
    category: 'NFL',
    categoryHref: '/topic/nfl',
    author: 'Anthony Dabbundo',
    date: 'Dec. 11',
    readTime: 16,
    imageUrl: getSportsImage('nfl'),
    href: '/article/nfl-week-15-bets',
  },
  {
    id: '2',
    title: 'This Colts Season Needs a Hero. They\'re Turning to a Grandpa.',
    category: 'NFL',
    categoryHref: '/topic/nfl',
    author: 'Anthony Dabbundo',
    date: 'Dec. 10',
    readTime: 7,
    imageUrl: getSportsImage('football'),
    href: '/article/colts-philip-rivers',
  },
  {
    id: '3',
    title: 'Week 14 QB Notebook: The Chiefs Are Breaking Patrick Mahomes',
    category: 'NFL',
    categoryHref: '/topic/nfl',
    author: 'Danny Kelly',
    date: 'Dec. 9',
    readTime: 14,
    imageUrl: getSportsImage('nfl'),
    href: '/article/mahomes-chiefs-week-14',
  },
];

// NBA Section Articles
export const mockNBAArticles: MockArticle[] = [
  {
    id: '1',
    title: 'Will the Thunder\'s Dominance Clog Up the NBA Trade Market?',
    category: 'NBA',
    categoryHref: '/topic/nba',
    author: 'Kirk Goldsberry',
    date: 'Dec. 10',
    readTime: 7,
    imageUrl: getSportsImage('nba'),
    href: '/article/thunder-trade-market',
  },
  {
    id: '2',
    title: 'Should You Go All In for Giannis? History Screams No.',
    category: 'NBA',
    categoryHref: '/topic/nba',
    author: 'Howard Beck',
    date: 'Dec. 9',
    readTime: 11,
    imageUrl: getSportsImage('basketball'),
    href: '/article/giannis-trade-history',
  },
  {
    id: '3',
    title: 'Five Burning NBA Questions: Giannis Watch, LeBron, and Trade Season',
    category: 'NBA',
    categoryHref: '/topic/nba',
    author: 'Michael Pina',
    date: 'Dec. 8',
    readTime: 12,
    imageUrl: getSportsImage('nba'),
    href: '/article/burning-nba-questions',
  },
  {
    id: '4',
    title: 'The NBA Has Entered a Golden Age of Buckets',
    category: 'NBA',
    categoryHref: '/topic/nba',
    author: 'Kirk Goldsberry',
    date: 'Dec. 2',
    readTime: 7,
    imageUrl: getSportsImage('basketball'),
    href: '/article/golden-age-buckets',
  },
];

// Podcasts
export const mockPodcasts: MockPodcast[] = [
  {
    id: '1',
    title: 'The Fall of the Chiefs (Maybe), SGA Superstar Tips, the Wildes-Greeny Feud, and Week 15 Picks',
    showName: 'The Bill Simmons Podcast',
    duration: '2:03:00',
    date: 'Dec. 12',
    imageUrl: getPodcastArtwork(0),
    href: '/podcast/bill-simmons-chiefs',
    type: 'podcast',
  },
  {
    id: '2',
    title: 'Week 15 Preview: Grandpa Rivers, Drake and Josh, Sad Burrow, Hobbled Herbert',
    showName: 'The Ringer Fantasy Football Show',
    duration: '1:31:00',
    date: 'Dec. 12',
    imageUrl: getPodcastArtwork(1),
    href: '/podcast/fantasy-week-15',
    type: 'podcast',
  },
  {
    id: '3',
    title: 'Predicting the Week 15 NFL Headlines',
    showName: 'The Ringer NFL Show',
    duration: '29:00',
    date: 'Dec. 12',
    imageUrl: getPodcastArtwork(2),
    href: '/podcast/nfl-week-15-headlines',
    type: 'podcast',
  },
];

// Noteworthy Reads
export const mockNoteworthyReads = [
  {
    id: '1',
    title: 'A Tier-by-Tier Look at the Oscars\' Best Picture Contenders',
    href: '/article/oscars-best-picture',
  },
  {
    id: '2',
    title: 'Will the Thunder\'s Dominance Clog Up the NBA Trade Market?',
    href: '/article/thunder-trade-market',
  },
  {
    id: '3',
    title: 'Should You Go All In for Giannis? History Screams No.',
    href: '/article/giannis-trade-history',
  },
  {
    id: '4',
    title: 'The Ringer\'s Week 15 Fantasy Football Rankings',
    href: '/fantasy-rankings-week-15',
  },
  {
    id: '5',
    title: 'This Colts Season Needs a Hero. They\'re Turning to a Grandpa.',
    href: '/article/colts-philip-rivers',
  },
  {
    id: '6',
    title: 'The 100 Best TV Episodes of the Century',
    href: '/tv-best-episodes',
  },
  {
    id: '7',
    title: 'Week 14 QB Notebook: The Chiefs Are Breaking Patrick Mahomes',
    href: '/article/mahomes-chiefs-week-14',
  },
  {
    id: '8',
    title: 'The Potential Ripple Effects of the Netflix–Warner Bros. Deal',
    href: '/article/netflix-warner-bros',
  },
];

// Best of 2025 Articles
export const mockBestOf2025: MockArticle[] = [
  {
    id: '1',
    title: 'The 25 Best Albums of 2025',
    category: 'Music',
    categoryHref: '/topic/music',
    author: 'Justin Sayles',
    date: 'Dec. 11',
    readTime: 26,
    imageUrl: getCardImage('general'),
    href: '/article/best-albums-2025',
  },
  {
    id: '2',
    title: 'The Best Movies of 2025',
    category: 'Movies',
    categoryHref: '/topic/movies',
    author: 'Adam Nayman',
    date: 'Dec. 8',
    readTime: 10,
    imageUrl: getCardImage('general'),
    href: '/article/best-movies-2025',
  },
  {
    id: '3',
    title: 'The Best TV Shows of 2025',
    category: 'TV',
    categoryHref: '/topic/tv',
    author: 'Miles Surrey',
    date: 'Dec. 9',
    readTime: 9,
    imageUrl: getCardImage('general'),
    href: '/article/best-tv-2025',
  },
  {
    id: '4',
    title: 'The Best Video Games of 2025',
    category: 'Video Games',
    categoryHref: '/topic/video-games',
    author: 'Ben Lindbergh',
    date: 'Dec. 10',
    readTime: 14,
    imageUrl: getCardImage('general'),
    href: '/article/best-games-2025',
  },
];

// ============================================================================
// GENDER-SEGREGATED MOCK DATA
// ============================================================================

// Women's Competitions
export const mockWomensCompetitions: Competition[] = [
  {
    id: 'wsl-2024-25',
    name: "Women's Super League",
    shortName: 'WSL',
    sport: 'soccer',
    gender: 'womens',
    country: 'England',
    season: '2024/25',
    logoUrl: getSportsImage('soccer', { width: 200, height: 200 }),
    status: 'active',
    priority: 1,
    numberOfTeams: 12,
  },
  {
    id: 'nwsl-2025',
    name: 'National Women\'s Soccer League',
    shortName: 'NWSL',
    sport: 'soccer',
    gender: 'womens',
    country: 'United States',
    season: '2025',
    logoUrl: getSportsImage('soccer', { width: 200, height: 200 }),
    status: 'active',
    priority: 2,
    numberOfTeams: 14,
  },
  {
    id: 'uwcl-2024-25',
    name: 'UEFA Women\'s Champions League',
    shortName: 'UWCL',
    sport: 'soccer',
    gender: 'womens',
    country: 'Europe',
    season: '2024/25',
    logoUrl: getSportsImage('soccer', { width: 200, height: 200 }),
    status: 'active',
    priority: 3,
    numberOfTeams: 16,
  },
  {
    id: 'wnba-2025',
    name: 'Women\'s National Basketball Association',
    shortName: 'WNBA',
    sport: 'basketball',
    gender: 'womens',
    country: 'United States',
    season: '2025',
    logoUrl: getSportsImage('basketball', { width: 200, height: 200 }),
    status: 'active',
    priority: 1,
    numberOfTeams: 12,
  },
  {
    id: 'wncaa-2024-25',
    name: 'NCAA Women\'s Basketball',
    shortName: 'WNCAA',
    sport: 'basketball',
    gender: 'womens',
    country: 'United States',
    season: '2024/25',
    logoUrl: getSportsImage('basketball', { width: 200, height: 200 }),
    status: 'active',
    priority: 2,
  },
  {
    id: 'wicc-2025',
    name: 'ICC Women\'s Cricket World Cup',
    shortName: 'Women\'s WC',
    sport: 'cricket',
    gender: 'womens',
    country: 'International',
    season: '2025',
    logoUrl: getSportsImage('general', { width: 200, height: 200 }),
    status: 'upcoming',
    priority: 1,
  },
];

// Men's Competitions
export const mockMensCompetitions: Competition[] = [
  {
    id: 'epl-2024-25',
    name: 'Premier League',
    shortName: 'EPL',
    sport: 'soccer',
    gender: 'mens',
    country: 'England',
    season: '2024/25',
    logoUrl: getSportsImage('soccer', { width: 200, height: 200 }),
    status: 'active',
    priority: 1,
    numberOfTeams: 20,
  },
  {
    id: 'nba-2024-25',
    name: 'National Basketball Association',
    shortName: 'NBA',
    sport: 'basketball',
    gender: 'mens',
    country: 'United States',
    season: '2024/25',
    logoUrl: getSportsImage('basketball', { width: 200, height: 200 }),
    status: 'active',
    priority: 1,
    numberOfTeams: 30,
  },
  {
    id: 'nfl-2024',
    name: 'National Football League',
    shortName: 'NFL',
    sport: 'nfl',
    gender: 'mens',
    country: 'United States',
    season: '2024',
    logoUrl: getSportsImage('nfl', { width: 200, height: 200 }),
    status: 'active',
    priority: 1,
    numberOfTeams: 32,
  },
];

// Women's Teams
export const mockWomensTeams: Team[] = [
  {
    id: 'chelsea-women',
    name: 'Chelsea FC Women',
    shortName: 'Chelsea',
    logoUrl: getSportsImage('soccer', { width: 100, height: 100 }),
    sport: 'soccer',
    gender: 'womens',
    country: 'England',
    stadium: 'Kingsmeadow',
    foundedYear: 1992,
  },
  {
    id: 'arsenal-women',
    name: 'Arsenal WFC',
    shortName: 'Arsenal',
    logoUrl: getSportsImage('soccer', { width: 100, height: 100 }),
    sport: 'soccer',
    gender: 'womens',
    country: 'England',
    stadium: 'Meadow Park',
    foundedYear: 1987,
  },
  {
    id: 'uswnt',
    name: 'United States Women\'s National Team',
    shortName: 'USWNT',
    logoUrl: getSportsImage('soccer', { width: 100, height: 100 }),
    sport: 'soccer',
    gender: 'womens',
    country: 'United States',
  },
  {
    id: 'liberty',
    name: 'New York Liberty',
    shortName: 'Liberty',
    logoUrl: getSportsImage('basketball', { width: 100, height: 100 }),
    sport: 'basketball',
    gender: 'womens',
    country: 'United States',
    stadium: 'Barclays Center',
    foundedYear: 1997,
  },
  {
    id: 'aces',
    name: 'Las Vegas Aces',
    shortName: 'Aces',
    logoUrl: getSportsImage('basketball', { width: 100, height: 100 }),
    sport: 'basketball',
    gender: 'womens',
    country: 'United States',
    stadium: 'Michelob ULTRA Arena',
    foundedYear: 1997,
  },
];

// Men's Teams
export const mockMensTeams: Team[] = [
  {
    id: 'man-city',
    name: 'Manchester City',
    shortName: 'Man City',
    logoUrl: getSportsImage('soccer', { width: 100, height: 100 }),
    sport: 'soccer',
    gender: 'mens',
    country: 'England',
    stadium: 'Etihad Stadium',
    foundedYear: 1880,
  },
  {
    id: 'lakers',
    name: 'Los Angeles Lakers',
    shortName: 'Lakers',
    logoUrl: getSportsImage('basketball', { width: 100, height: 100 }),
    sport: 'basketball',
    gender: 'mens',
    country: 'United States',
    stadium: 'Crypto.com Arena',
    foundedYear: 1947,
  },
  {
    id: 'chiefs',
    name: 'Kansas City Chiefs',
    shortName: 'Chiefs',
    logoUrl: getSportsImage('nfl', { width: 100, height: 100 }),
    sport: 'nfl',
    gender: 'mens',
    country: 'United States',
    stadium: 'Arrowhead Stadium',
    foundedYear: 1960,
  },
];

// Women's Players
export const mockWomensPlayers: Player[] = [
  {
    id: 'sam-kerr',
    name: 'Sam Kerr',
    position: 'Forward',
    jerseyNumber: 20,
    photoUrl: getSportsImage('soccer', { width: 400, height: 400 }),
    dateOfBirth: '1993-09-10',
    nationality: 'Australia',
    height: 168,
    currentTeamId: 'chelsea-women',
    currentTeamName: 'Chelsea FC Women',
    sport: 'soccer',
    gender: 'womens',
  },
  {
    id: 'alexia-putellas',
    name: 'Alexia Putellas',
    position: 'Midfielder',
    jerseyNumber: 11,
    photoUrl: getSportsImage('soccer', { width: 400, height: 400 }),
    dateOfBirth: '1994-02-04',
    nationality: 'Spain',
    height: 173,
    currentTeamId: 'barcelona-femeni',
    currentTeamName: 'FC Barcelona Femení',
    sport: 'soccer',
    gender: 'womens',
  },
  {
    id: 'aja-wilson',
    name: 'A\'ja Wilson',
    position: 'Forward/Center',
    jerseyNumber: 22,
    photoUrl: getSportsImage('basketball', { width: 400, height: 400 }),
    dateOfBirth: '1996-08-08',
    nationality: 'United States',
    height: 193,
    currentTeamId: 'aces',
    currentTeamName: 'Las Vegas Aces',
    sport: 'basketball',
    gender: 'womens',
  },
];

// Men's Players
export const mockMensPlayers: Player[] = [
  {
    id: 'erling-haaland',
    name: 'Erling Haaland',
    position: 'Forward',
    jerseyNumber: 9,
    photoUrl: getSportsImage('soccer', { width: 400, height: 400 }),
    dateOfBirth: '2000-07-21',
    nationality: 'Norway',
    height: 195,
    currentTeamId: 'man-city',
    currentTeamName: 'Manchester City',
    sport: 'soccer',
    gender: 'mens',
  },
  {
    id: 'lebron-james',
    name: 'LeBron James',
    position: 'Forward',
    jerseyNumber: 23,
    photoUrl: getSportsImage('basketball', { width: 400, height: 400 }),
    dateOfBirth: '1984-12-30',
    nationality: 'United States',
    height: 206,
    currentTeamId: 'lakers',
    currentTeamName: 'Los Angeles Lakers',
    sport: 'basketball',
    gender: 'mens',
  },
  {
    id: 'patrick-mahomes',
    name: 'Patrick Mahomes',
    position: 'Quarterback',
    jerseyNumber: 15,
    photoUrl: getSportsImage('nfl', { width: 400, height: 400 }),
    dateOfBirth: '1995-09-17',
    nationality: 'United States',
    height: 191,
    currentTeamId: 'chiefs',
    currentTeamName: 'Kansas City Chiefs',
    sport: 'nfl',
    gender: 'mens',
  },
];

// Women's Fixtures
export const mockWomensFixtures: Fixture[] = [
  {
    id: 'wsl-fixture-1',
    homeTeam: {
      id: 'chelsea-women',
      name: 'Chelsea FC Women',
      logoUrl: getSportsImage('soccer', { width: 100, height: 100 }),
    },
    awayTeam: {
      id: 'arsenal-women',
      name: 'Arsenal WFC',
      logoUrl: getSportsImage('soccer', { width: 100, height: 100 }),
    },
    homeScore: 2,
    awayScore: 1,
    competition: {
      id: 'wsl-2024-25',
      name: "Women's Super League",
      logoUrl: getSportsImage('soccer', { width: 100, height: 100 }),
    },
    sport: 'soccer',
    gender: 'womens',
    matchDate: '2025-12-15T15:00:00Z',
    venue: 'Kingsmeadow',
    status: 'finished',
  },
  {
    id: 'wnba-fixture-1',
    homeTeam: {
      id: 'liberty',
      name: 'New York Liberty',
      logoUrl: getSportsImage('basketball', { width: 100, height: 100 }),
    },
    awayTeam: {
      id: 'aces',
      name: 'Las Vegas Aces',
      logoUrl: getSportsImage('basketball', { width: 100, height: 100 }),
    },
    homeScore: 87,
    awayScore: 84,
    competition: {
      id: 'wnba-2025',
      name: 'WNBA',
      logoUrl: getSportsImage('basketball', { width: 100, height: 100 }),
    },
    sport: 'basketball',
    gender: 'womens',
    matchDate: '2025-12-13T19:00:00Z',
    venue: 'Barclays Center',
    status: 'finished',
  },
];

// Men's Fixtures
export const mockMensFixtures: Fixture[] = [
  {
    id: 'epl-fixture-1',
    homeTeam: {
      id: 'man-city',
      name: 'Manchester City',
      logoUrl: getSportsImage('soccer', { width: 100, height: 100 }),
    },
    awayTeam: {
      id: 'liverpool',
      name: 'Liverpool',
      logoUrl: getSportsImage('soccer', { width: 100, height: 100 }),
    },
    homeScore: 1,
    awayScore: 1,
    competition: {
      id: 'epl-2024-25',
      name: 'Premier League',
      logoUrl: getSportsImage('soccer', { width: 100, height: 100 }),
    },
    sport: 'soccer',
    gender: 'mens',
    matchDate: '2025-12-14T17:30:00Z',
    venue: 'Etihad Stadium',
    status: 'finished',
  },
];

// Trending Women's Moments
export const mockTrendingWomensMoments: TrendingMoment[] = [
  {
    id: 'moment-w-1',
    fixtureId: 'wsl-fixture-1',
    eventType: 'Goal',
    eventMinute: 67,
    description: 'Stunning strike from outside the box',
    socialShareTitle: 'Sam Kerr Screamer! 🚀',
    primaryPlayer: {
      id: 'sam-kerr',
      name: 'Sam Kerr',
    },
    viralScore: 95,
    totalViews: 2500000,
    totalShares: 85000,
    fixture: {
      id: 'wsl-fixture-1',
      homeTeam: 'Chelsea FC Women',
      awayTeam: 'Arsenal WFC',
      competition: "Women's Super League",
    },
    sport: 'soccer',
    gender: 'womens',
    thumbnailUrl: getSportsImage('soccer', { width: 800, height: 450 }),
    videoUrl: 'https://example.com/video',
  },
  {
    id: 'moment-w-2',
    fixtureId: 'wnba-fixture-1',
    eventType: 'Clutch Shot',
    eventMinute: 48,
    description: 'Game-winning three-pointer with 2 seconds left',
    socialShareTitle: 'A\'ja Wilson Ice Cold! ❄️🏀',
    primaryPlayer: {
      id: 'aja-wilson',
      name: 'A\'ja Wilson',
    },
    viralScore: 92,
    totalViews: 1800000,
    totalShares: 62000,
    fixture: {
      id: 'wnba-fixture-1',
      homeTeam: 'New York Liberty',
      awayTeam: 'Las Vegas Aces',
      competition: 'WNBA',
    },
    sport: 'basketball',
    gender: 'womens',
    thumbnailUrl: getSportsImage('basketball', { width: 800, height: 450 }),
    videoUrl: 'https://example.com/video',
  },
];

// Trending Men's Moments
export const mockTrendingMensMoments: TrendingMoment[] = [
  {
    id: 'moment-m-1',
    fixtureId: 'epl-fixture-1',
    eventType: 'Goal',
    eventMinute: 45,
    description: 'Incredible solo run and finish',
    socialShareTitle: 'Haaland Does It Again! ⚽',
    primaryPlayer: {
      id: 'erling-haaland',
      name: 'Erling Haaland',
    },
    viralScore: 88,
    totalViews: 3200000,
    totalShares: 95000,
    fixture: {
      id: 'epl-fixture-1',
      homeTeam: 'Manchester City',
      awayTeam: 'Liverpool',
      competition: 'Premier League',
    },
    sport: 'soccer',
    gender: 'mens',
    thumbnailUrl: getSportsImage('soccer', { width: 800, height: 450 }),
    videoUrl: 'https://example.com/video',
  },
];

// All Trending Moments Combined
export const mockAllTrendingMoments: TrendingMoment[] = [
  ...mockTrendingWomensMoments,
  ...mockTrendingMensMoments,
].sort((a, b) => (b.viralScore || 0) - (a.viralScore || 0));

