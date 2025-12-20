import { NextResponse } from 'next/server';
import { getCached, getCacheStats, invalidateCacheKey } from '@/lib/cache/redis';

/**
 * Redis Cache Test Endpoint
 * 
 * Tests:
 * - Redis connection
 * - Basic set/get operations
 * - Cache hit/miss behavior
 * - TTL expiration
 * 
 * Usage:
 * - GET /api/test-redis - Run tests
 * - GET /api/test-redis?clear=true - Clear test cache and run again
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const shouldClear = searchParams.get('clear') === 'true';

    // Clear test caches if requested
    if (shouldClear) {
      await invalidateCacheKey('test:timestamp');
      await invalidateCacheKey('test:counter');
    }

    const testResults = [];

    // ===========================
    // Test 1: Basic Cache Hit/Miss
    // ===========================
    const timestamp1 = await getCached(
      'test:timestamp',
      async () => {
        console.log('🔄 Fetching fresh timestamp...');
        return new Date().toISOString();
      },
      10 // Cache for 10 seconds
    );

    // Should return cached value (same timestamp)
    const timestamp2 = await getCached(
      'test:timestamp',
      async () => {
        console.log('🔄 Fetching fresh timestamp...');
        return new Date().toISOString();
      },
      10
    );

    const isCacheWorking = timestamp1 === timestamp2;

    testResults.push({
      name: 'Cache Hit/Miss Behavior',
      status: isCacheWorking ? '✅ PASS' : '❌ FAIL',
      details: {
        firstFetch: timestamp1,
        secondFetch: timestamp2,
        cached: isCacheWorking,
      },
    });

    // ===========================
    // Test 2: Counter (Different Values)
    // ===========================
    let counter = 0;
    const count1 = await getCached(
      'test:counter',
      async () => {
        counter++;
        return counter;
      },
      10
    );

    const count2 = await getCached(
      'test:counter',
      async () => {
        counter++;
        return counter;
      },
      10
    );

    // Counter should be 1 both times (cached)
    const isCounterCached = count1 === 1 && count2 === 1 && counter === 1;

    testResults.push({
      name: 'Counter Caching',
      status: isCounterCached ? '✅ PASS' : '❌ FAIL',
      details: {
        count1,
        count2,
        actualCounter: counter,
        expected: 'Both should be 1 (from cache)',
      },
    });

    // ===========================
    // Test 3: Cache Stats
    // ===========================
    const stats = await getCacheStats();

    testResults.push({
      name: 'Cache Statistics',
      status: stats?.enabled ? '✅ PASS' : '⚠️  DISABLED',
      details: stats || { message: 'Redis not configured' },
    });

    // ===========================
    // Overall Status
    // ===========================
    const allPassed = testResults.every((t) => t.status === '✅ PASS');

    return NextResponse.json({
      success: true,
      status: allPassed ? 'All tests passed! 🎉' : 'Some tests failed ⚠️',
      timestamp: new Date().toISOString(),
      environment: {
        redisConfigured: !!process.env.UPSTASH_REDIS_REST_URL,
        upstashUrl: process.env.UPSTASH_REDIS_REST_URL 
          ? process.env.UPSTASH_REDIS_REST_URL.split('.upstash.io')[0] + '.upstash.io'
          : 'Not configured',
      },
      tests: testResults,
      tips: [
        '💡 Run with ?clear=true to reset test cache',
        '💡 Check /api/cache/stats for detailed cache info',
        '💡 If tests fail, verify Upstash credentials in .env.local',
      ],
    });
  } catch (error: any) {
    console.error('[Test Redis] Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
        hint: 'Make sure UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set',
      },
      { status: 500 }
    );
  }
}

