import { getSportsImage, getCardImage, getPodcastArtwork } from './image-utils';

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
    imageUrl: getPodcastArtwork(),
    href: '/podcast/bill-simmons-chiefs',
    type: 'podcast',
  },
  {
    id: '2',
    title: 'Week 15 Preview: Grandpa Rivers, Drake and Josh, Sad Burrow, Hobbled Herbert',
    showName: 'The Ringer Fantasy Football Show',
    duration: '1:31:00',
    date: 'Dec. 12',
    imageUrl: getPodcastArtwork(),
    href: '/podcast/fantasy-week-15',
    type: 'podcast',
  },
  {
    id: '3',
    title: 'Predicting the Week 15 NFL Headlines',
    showName: 'The Ringer NFL Show',
    duration: '29:00',
    date: 'Dec. 12',
    imageUrl: getPodcastArtwork(),
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

