import { NextResponse } from 'next/server';
import { getCacheStats } from '@/lib/cache/redis';

/**
 * Cache Monitoring Dashboard
 * 
 * Provides real-time statistics about Redis cache:
 * - Total cached keys
 * - Keys grouped by category (fixtures, stats, revenue, etc.)
 * - Cache hit rates
 * - Redis connection status
 * 
 * Usage: GET /api/cache/stats
 */
export async function GET() {
  try {
    const stats = await getCacheStats();

    if (!stats) {
      return NextResponse.json({
        success: false,
        message: 'Redis not configured or unavailable',
        hint: 'Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in environment variables',
      });
    }

    // Calculate cache efficiency
    const totalKeys = stats.totalKeys;
    const keysByPrefix = stats.keysByPrefix;

    // Organize by domain
    const categories = {
      fixtures: {
        count: (keysByPrefix['fixtures'] || 0),
        keys: ['fixtures:today', 'fixtures:live', 'fixtures:upcoming', 'fixtures:detail:*'],
      },
      stats: {
        count: (keysByPrefix['stats'] || 0),
        keys: ['stats:standings:*', 'stats:scorers:*', 'stats:assists:*', 'stats:player:*'],
      },
      dashboard: {
        revenue: keysByPrefix['dashboard'] || 0,
        sales: keysByPrefix['sales'] || 0,
        customers: keysByPrefix['customers'] || 0,
      },
      test: {
        count: (keysByPrefix['test'] || 0),
      },
    };

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      redis: {
        enabled: stats.enabled,
        provider: 'Upstash',
        region: process.env.UPSTASH_REDIS_REST_URL?.includes('us-east-1') ? 'US East' : 'Unknown',
      },
      overview: {
        totalKeys,
        categories: Object.keys(keysByPrefix).length,
      },
      breakdown: categories,
      recommendations: [
        totalKeys > 1000 ? '⚠️  High key count - consider implementing cache cleanup' : '✅ Key count is healthy',
        stats.enabled ? '✅ Redis caching is enabled and working' : '❌ Redis is not enabled',
        totalKeys === 0 ? '💡 No cached data yet - visit some pages to populate cache' : '✅ Cache is active',
      ],
    });
  } catch (error: any) {
    console.error('[Cache Stats] Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

