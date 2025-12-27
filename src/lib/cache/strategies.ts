// Cache Time-To-Live (TTL) strategies in seconds

export const CacheTTL = {
  REAL_TIME: 30,        // 30 seconds - for live data (live scores)
  SHORT: 300,           // 5 minutes - frequently changing data
  MEDIUM: 1800,         // 30 minutes - moderate changes (standings, stats)
  LONG: 3600,           // 1 hour - stable data (historical results)
  VERY_LONG: 86400,     // 24 hours - rarely changes (archived content)
};

// Cache key patterns
export const CacheKeys = {
  // Matches (formerly Fixtures)
  FIXTURES_TODAY: 'matches:today',
  FIXTURES_LIVE: 'matches:live',
  FIXTURES_UPCOMING: 'matches:upcoming',
  FIXTURE_DETAIL: (id: string) => `matches:detail:${id}`,
  FIXTURES_BY_COMPETITION: (competitionId: string) => `matches:competition:${competitionId}`,
  MATCHES_BY_TEAM: (teamId: string) => `matches:team:${teamId}`,
  MATCHES_RECENT: (days: number) => `matches:recent:${days}`,
  
  // Gender/Sport-specific matches
  MATCHES_LIVE_BY_GENDER: (gender: string) => `matches:live:${gender}`,
  MATCHES_LIVE_BY_SPORT: (sport: string) => `matches:live:sport:${sport}`,
  MATCHES_UPCOMING_BY_GENDER: (gender: string, days: number) => `matches:upcoming:${gender}:${days}`,

  // Teams
  TEAM: (id: string) => `team:${id}`,
  TEAM_STATS: (id: string) => `team:${id}:stats`,
  TEAM_SQUAD: (id: string) => `team:${id}:squad`,
  TEAMS_BY_SPORT: (sport: string, gender: string) => `teams:${sport}:${gender}`,
  
  // Players
  PLAYER: (id: string) => `player:${id}`,
  PLAYER_STATS: (playerId: string) => `stats:player:${playerId}`,
  PLAYER_AWARDS: (id: string) => `player:${id}:awards`,
  PLAYER_CAREER: (id: string) => `player:${id}:career`,
  PLAYERS_BY_TEAM: (teamId: string) => `players:team:${teamId}`,

  // Competitions
  COMPETITION: (id: string) => `competition:${id}`,
  COMPETITIONS_BY_SPORT: (sport: string, gender: string) => `competitions:${sport}:${gender}`,
  STANDINGS: (competitionId: string) => `standings:competition:${competitionId}`,
  
  // Gender/Sport-specific competitions
  COMPETITIONS_FEATURED: (gender: string, sport?: string) => 
    sport ? `competitions:featured:${gender}:${sport}` : `competitions:featured:${gender}`,
  COMPETITIONS_BY_GENDER: (gender: string) => `competitions:gender:${gender}`,
  
  // Stats
  TOP_SCORERS: (competitionId: string) => `stats:scorers:${competitionId}`,
  TOP_ASSISTS: (competitionId: string) => `stats:assists:${competitionId}`,

  // Seasons
  SEASON: (id: string) => `season:${id}`,
  SEASONS_BY_SPORT: (sport: string) => `seasons:sport:${sport}`,
  CURRENT_SEASON: (sport: string) => `season:current:${sport}`,

  // Articles
  ARTICLES: 'articles:all',
  ARTICLE: (id: string) => `article:${id}`,
  ARTICLES_BY_TEAM: (teamId: string) => `articles:team:${teamId}`,
  ARTICLES_BY_MATCH: (matchId: string) => `articles:match:${matchId}`,
  ARTICLES_BY_PLAYER: (playerId: string) => `articles:player:${playerId}`,
  ARTICLES_LATEST: 'articles:latest',

  // Moments
  MOMENTS: 'moments:all',
  MOMENT: (id: string) => `moment:${id}`,
  MOMENTS_BY_MATCH: (matchId: string) => `moments:match:${matchId}`,
  MOMENTS_BY_PLAYER: (playerId: string) => `moments:player:${playerId}`,
  MOMENTS_TRENDING: 'moments:trending',
  MOMENTS_MOST_VIEWED: 'moments:most-viewed',
  
  // Gender/Sport-specific moments
  MOMENTS_TRENDING_BY_GENDER: (gender: string) => `moments:trending:${gender}`,
  MOMENTS_TRENDING_BY_SPORT: (sport: string) => `moments:trending:sport:${sport}`,
  MOMENTS_BY_GENDER_SPORT: (gender: string, sport: string) => `moments:${gender}:${sport}`,

  // Revenue (Dashboard)
  REVENUE_METRICS: 'dashboard:revenue:metrics',
  REVENUE_BY_STREAM: 'dashboard:revenue:by-stream',
  REVENUE_BY_GENDER: 'dashboard:revenue:by-gender',
  MRR_TREND: 'dashboard:revenue:mrr-trend',

  // Sales (Dashboard)
  SALES_PIPELINE: 'dashboard:sales:pipeline',
  SALES_OPPORTUNITIES: 'dashboard:sales:opportunities',
  SALES_FORECAST: 'dashboard:sales:forecast',
  SALES_METRICS: 'dashboard:sales:metrics',

  // Customers (Dashboard)
  CUSTOMER_LIST: 'dashboard:customers:list',
  CUSTOMER_HEALTH: 'dashboard:customers:health',
  CHURN_RISK: 'dashboard:customers:churn-risk',

  // Operations (Dashboard)
  API_USAGE: 'dashboard:operations:api-usage',
  SYSTEM_HEALTH: 'dashboard:operations:system-health',

  // Women's Sports (Dashboard)
  WOMENS_REVENUE: 'dashboard:womens:revenue',
  WOMENS_ENGAGEMENT: 'dashboard:womens:engagement',
  WOMENS_COVERAGE: 'dashboard:womens:coverage',
  
  // Homepage data
  HOMEPAGE_DATA: 'homepage:all-data',
  HOMEPAGE_LIVE_MATCHES: 'homepage:live-matches',
  HOMEPAGE_TRENDING_MOMENTS: 'homepage:trending-moments',
  HOMEPAGE_FEATURED_COMPETITIONS: 'homepage:featured-competitions',
};

/**
 * Cache warming function for homepage
 */
export async function warmHomepageCache() {
  try {
    // Dynamically import to avoid circular dependencies
    const { getLiveMatchesForDisplay, getUpcomingMatchesForDisplay } = await import('@/lib/data/matches');
    const { getTrendingMoments } = await import('@/lib/data/moments');
    const { getFeaturedCompetitions } = await import('@/lib/data/competitions');
    
    await Promise.all([
      getLiveMatchesForDisplay(),
      getUpcomingMatchesForDisplay(7),
      getTrendingMoments({ limit: 12 }),
      getFeaturedCompetitions({ gender: 'womens', limit: 3 }),
    ]);
    
    console.log('✅ Homepage cache warmed successfully');
  } catch (error) {
    console.error('❌ Error warming homepage cache:', error);
  }
}

// Cache TTL assignments
export const CacheStrategy = {
  // Matches - live data refreshes frequently
  fixturesLive: CacheTTL.REAL_TIME,          // 30s
  fixturesToday: CacheTTL.SHORT,             // 5min
  fixturesUpcoming: CacheTTL.MEDIUM,         // 30min
  fixtureDetail: CacheTTL.SHORT,             // 5min - could be live
  fixturesByCompetition: CacheTTL.MEDIUM,    // 30min
  matchesRecent: CacheTTL.LONG,              // 1hr - historical

  // Teams - relatively stable
  team: CacheTTL.LONG,                       // 1hr
  teamStats: CacheTTL.MEDIUM,                // 30min
  teamSquad: CacheTTL.LONG,                  // 1hr
  teamsBySpor: CacheTTL.LONG,                // 1hr

  // Players - relatively stable
  player: CacheTTL.LONG,                     // 1hr
  playerStats: CacheTTL.LONG,                // 1hr
  playerAwards: CacheTTL.LONG,               // 1hr
  playerCareer: CacheTTL.LONG,               // 1hr

  // Competitions - stable
  competition: CacheTTL.LONG,                // 1hr
  competitionsBySport: CacheTTL.LONG,        // 1hr
  standings: CacheTTL.MEDIUM,                // 30min - updates after matches
  topScorers: CacheTTL.MEDIUM,               // 30min - updates after matches

  // Seasons - very stable
  season: CacheTTL.VERY_LONG,                // 24hr
  seasonsBySport: CacheTTL.VERY_LONG,        // 24hr

  // Articles - updated frequently
  articles: CacheTTL.SHORT,                  // 5min
  article: CacheTTL.SHORT,                   // 5min
  articlesLatest: CacheTTL.SHORT,            // 5min

  // Moments - trending content, moderate updates
  moments: CacheTTL.SHORT,                   // 5min
  moment: CacheTTL.SHORT,                    // 5min
  momentsTrending: CacheTTL.SHORT,           // 5min
  momentsMostViewed: CacheTTL.SHORT,         // 5min

  // Revenue - updated less frequently
  revenueMetrics: CacheTTL.MEDIUM,
  revenueByStream: CacheTTL.MEDIUM,
  revenueByGender: CacheTTL.MEDIUM,

  // Sales - updated frequently
  salesPipeline: CacheTTL.SHORT,
  salesOpportunities: CacheTTL.SHORT,
  salesForecast: CacheTTL.MEDIUM,
  salesMetrics: CacheTTL.MEDIUM,

  // Customers
  customerList: CacheTTL.SHORT,
  customerHealth: CacheTTL.SHORT,

  // Operations
  apiUsage: CacheTTL.SHORT,
  systemHealth: CacheTTL.REAL_TIME,

  // Women's Sports
  womensMetrics: CacheTTL.MEDIUM,
};

