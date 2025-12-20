import { Redis } from '@upstash/redis';

// Initialize Redis client (Upstash for serverless compatibility)
let redis: Redis | null = null;

/**
 * Get Redis client (Upstash for serverless Vercel deployment)
 * 
 * Environment variables required:
 * - UPSTASH_REDIS_REST_URL: Your Upstash Redis REST URL
 * - UPSTASH_REDIS_REST_TOKEN: Your Upstash Redis REST token
 */
function getRedisClient(): Redis | null {
  // Check for Upstash environment variables
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    console.warn('[CACHE] Redis credentials not configured, caching disabled');
    return null;
  }

  // Singleton pattern - create client once
  if (!redis) {
    try {
      redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      });
      console.log('[CACHE] Upstash Redis initialized for serverless');
    } catch (error) {
      console.error('[CACHE] Redis initialization failed:', error);
      return null;
    }
  }

  return redis;
}

/**
 * Get cached data or fetch fresh if not exists
 * 
 * @param key Cache key (e.g., 'fixtures:today')
 * @param fetcher Function that fetches fresh data
 * @param ttl Time to live in seconds (default: 300)
 * @returns Cached or fresh data
 * 
 * @example
 * const fixtures = await getCached(
 *   'fixtures:today',
 *   async () => salesforceClient.query(...),
 *   60
 * );
 */
export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 300
): Promise<T> {
  const client = getRedisClient();

  // Fallback: If Redis not available, just fetch directly
  if (!client) {
    return await fetcher();
  }

  try {
    // Try to get from cache
    const cached = await client.get<T>(key);

    if (cached !== null) {
      console.log(`✅ [CACHE HIT] ${key}`);
      return cached;
    }

    console.log(`❌ [CACHE MISS] ${key}`);

    // Fetch fresh data
    const data = await fetcher();

    // Store in cache with TTL (Upstash handles serialization)
    await client.setex(key, ttl, JSON.stringify(data));
    
    console.log(`💾 [CACHE SET] ${key} (TTL: ${ttl}s)`);

    return data;
  } catch (error) {
    console.error(`⚠️  [CACHE ERROR] ${key}:`, error);

    // Fallback: If cache fails, just fetch data directly
    return await fetcher();
  }
}

/**
 * Invalidate (delete) cache by pattern
 * 
 * @param pattern Redis key pattern (e.g., 'fixtures:*')
 * 
 * @example
 * await invalidateCache('fixtures:*'); // Delete all fixture caches
 */
export async function invalidateCache(pattern: string): Promise<void> {
  const client = getRedisClient();

  if (!client) {
    return;
  }

  try {
    const keys = await client.keys(pattern);

    if (keys.length > 0) {
      await client.del(...keys);
      console.log(`🗑️  [CACHE INVALIDATED] ${keys.length} keys matching ${pattern}`);
    } else {
      console.log(`[CACHE INVALIDATE] No keys found matching ${pattern}`);
    }
  } catch (error) {
    console.error(`⚠️  [CACHE INVALIDATE ERROR] ${pattern}:`, error);
  }
}

/**
 * Invalidate a single cache key
 * 
 * @param key Exact cache key to delete
 */
export async function invalidateCacheKey(key: string): Promise<void> {
  const client = getRedisClient();

  if (!client) {
    return;
  }

  try {
    await client.del(key);
    console.log(`🗑️  [CACHE INVALIDATED] ${key}`);
  } catch (error) {
    console.error(`⚠️  [CACHE INVALIDATE ERROR] ${key}:`, error);
  }
}

/**
 * Get cache statistics
 * 
 * @returns Cache info and key count
 */
export async function getCacheStats(): Promise<{
  enabled: boolean;
  totalKeys: number;
  keysByPrefix: Record<string, number>;
} | null> {
  const client = getRedisClient();

  if (!client) {
    return { enabled: false, totalKeys: 0, keysByPrefix: {} };
  }

  try {
    const allKeys = await client.keys('*');
    
    // Group keys by prefix
    const keysByPrefix: Record<string, number> = {};
    allKeys.forEach((key) => {
      const prefix = key.split(':')[0];
      keysByPrefix[prefix] = (keysByPrefix[prefix] || 0) + 1;
    });

    return {
      enabled: true,
      totalKeys: allKeys.length,
      keysByPrefix,
    };
  } catch (error) {
    console.error('Failed to get cache stats:', error);
    return null;
  }
}

// =============================================================================
// Domain-specific cache invalidation functions
// =============================================================================

/**
 * Invalidate all revenue-related caches
 */
export async function invalidateRevenueCaches(): Promise<void> {
  await invalidateCache('dashboard:revenue:*');
}

/**
 * Invalidate all sales-related caches
 */
export async function invalidateSalesCaches(): Promise<void> {
  await invalidateCache('dashboard:sales:*');
}

/**
 * Invalidate all customer-related caches
 */
export async function invalidateCustomerCaches(): Promise<void> {
  await invalidateCache('dashboard:customers:*');
}

/**
 * Invalidate all fixture-related caches
 */
export async function invalidateFixtureCaches(): Promise<void> {
  await invalidateCache('fixtures:*');
}

/**
 * Invalidate all stats-related caches
 */
export async function invalidateStatsCaches(): Promise<void> {
  await invalidateCache('stats:*');
}

/**
 * Invalidate ALL caches (use sparingly!)
 */
export async function invalidateAllCaches(): Promise<void> {
  const client = getRedisClient();
  
  if (!client) {
    return;
  }

  try {
    const allKeys = await client.keys('*');
    
    if (allKeys.length > 0) {
      await client.del(...allKeys);
      console.log(`🗑️  [CACHE FLUSH] Deleted all ${allKeys.length} cache keys`);
    }
  } catch (error) {
    console.error('⚠️  [CACHE FLUSH ERROR]:', error);
  }
}

// Export the client for advanced usage
export { redis, getRedisClient };

