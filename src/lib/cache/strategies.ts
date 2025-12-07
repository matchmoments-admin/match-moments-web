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
  // Fixtures
  FIXTURES_TODAY: 'fixtures:today',
  FIXTURES_LIVE: 'fixtures:live',
  FIXTURES_UPCOMING: 'fixtures:upcoming',
  FIXTURE_DETAIL: (id: string) => `fixtures:detail:${id}`,
  FIXTURES_BY_COMPETITION: (competitionId: string) => `fixtures:competition:${competitionId}`,

  // Stats
  STANDINGS: (sport: string) => `stats:standings:${sport}`,
  TOP_SCORERS: (sport: string) => `stats:scorers:${sport}`,
  TOP_ASSISTS: (sport: string) => `stats:assists:${sport}`,
  PLAYER_STATS: (playerId: string) => `stats:player:${playerId}`,

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
};

// Cache TTL assignments
export const CacheStrategy = {
  // Fixtures - live data refreshes frequently
  fixturesLive: CacheTTL.REAL_TIME,
  fixturesToday: CacheTTL.SHORT,
  fixturesUpcoming: CacheTTL.MEDIUM,
  fixtureDetail: CacheTTL.SHORT, // Could be live
  fixturesByCompetition: CacheTTL.MEDIUM,

  // Stats - updated after matches
  standings: CacheTTL.MEDIUM,
  topScorers: CacheTTL.MEDIUM,
  playerStats: CacheTTL.LONG,

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

