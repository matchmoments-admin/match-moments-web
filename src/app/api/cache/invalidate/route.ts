import { NextRequest, NextResponse } from 'next/server';
import {
  invalidateCache,
  invalidateCacheKey,
  invalidateFixtureCaches,
  invalidateStatsCaches,
  invalidateRevenueCaches,
  invalidateSalesCaches,
  invalidateCustomerCaches,
  invalidateAllCaches,
} from '@/lib/cache/redis';

/**
 * Cache Invalidation API
 * 
 * Allows manual cache clearing for different categories:
 * - All caches
 * - Specific domain (fixtures, stats, revenue, sales, customers)
 * - Custom pattern
 * - Single key
 * 
 * Usage:
 * - DELETE /api/cache/invalidate?scope=all
 * - DELETE /api/cache/invalidate?scope=fixtures
 * - DELETE /api/cache/invalidate?scope=stats
 * - DELETE /api/cache/invalidate?scope=revenue
 * - DELETE /api/cache/invalidate?scope=sales
 * - DELETE /api/cache/invalidate?scope=customers
 * - DELETE /api/cache/invalidate?pattern=fixtures:today
 * - DELETE /api/cache/invalidate?key=fixtures:today
 * 
 * Security: In production, add authentication to this endpoint!
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get('scope');
    const pattern = searchParams.get('pattern');
    const key = searchParams.get('key');

    let message = '';

    // Invalidate by scope
    if (scope) {
      switch (scope.toLowerCase()) {
        case 'all':
          await invalidateAllCaches();
          message = 'All caches cleared';
          break;
        case 'fixtures':
          await invalidateFixtureCaches();
          message = 'Fixture caches cleared';
          break;
        case 'stats':
          await invalidateStatsCaches();
          message = 'Stats caches cleared';
          break;
        case 'revenue':
          await invalidateRevenueCaches();
          message = 'Revenue caches cleared';
          break;
        case 'sales':
          await invalidateSalesCaches();
          message = 'Sales caches cleared';
          break;
        case 'customers':
          await invalidateCustomerCaches();
          message = 'Customer caches cleared';
          break;
        default:
          return NextResponse.json(
            {
              success: false,
              error: `Invalid scope: ${scope}`,
              validScopes: ['all', 'fixtures', 'stats', 'revenue', 'sales', 'customers'],
            },
            { status: 400 }
          );
      }
    }
    // Invalidate by pattern
    else if (pattern) {
      await invalidateCache(pattern);
      message = `Caches matching pattern "${pattern}" cleared`;
    }
    // Invalidate single key
    else if (key) {
      await invalidateCacheKey(key);
      message = `Cache key "${key}" cleared`;
    }
    // No parameters
    else {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required parameter',
          usage: {
            scope: 'DELETE /api/cache/invalidate?scope=fixtures',
            pattern: 'DELETE /api/cache/invalidate?pattern=fixtures:*',
            key: 'DELETE /api/cache/invalidate?key=fixtures:today',
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[Cache Invalidation] Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * Get invalidation help/documentation
 */
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/cache/invalidate',
    method: 'DELETE',
    description: 'Invalidate (clear) cached data',
    authentication: '⚠️  WARNING: Add authentication before using in production!',
    parameters: {
      scope: {
        description: 'Predefined cache scope to clear',
        options: ['all', 'fixtures', 'stats', 'revenue', 'sales', 'customers'],
        example: 'DELETE /api/cache/invalidate?scope=fixtures',
      },
      pattern: {
        description: 'Redis key pattern to match (uses wildcards)',
        example: 'DELETE /api/cache/invalidate?pattern=fixtures:*',
      },
      key: {
        description: 'Specific cache key to delete',
        example: 'DELETE /api/cache/invalidate?key=fixtures:today',
      },
    },
    examples: [
      {
        description: 'Clear all fixture caches',
        curl: 'curl -X DELETE "http://localhost:3000/api/cache/invalidate?scope=fixtures"',
      },
      {
        description: 'Clear all caches (nuclear option)',
        curl: 'curl -X DELETE "http://localhost:3000/api/cache/invalidate?scope=all"',
      },
      {
        description: 'Clear today\'s fixtures only',
        curl: 'curl -X DELETE "http://localhost:3000/api/cache/invalidate?key=fixtures:today"',
      },
    ],
  });
}

