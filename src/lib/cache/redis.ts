import Redis from 'ioredis';

let redis: Redis | null = null;

function getRedisClient(): Redis | null {
  if (!process.env.REDIS_URL) {
    console.warn('[CACHE] Redis URL not configured, caching disabled');
    return null;
  }

  if (!redis) {
    try {
      redis = new Redis(process.env.REDIS_URL);
      console.log('[CACHE] Redis connected');
    } catch (error) {
      console.error('[CACHE] Redis connection failed:', error);
      return null;
    }
  }

  return redis;
}

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 300
): Promise<T> {
  const client = getRedisClient();

  // If Redis not available, just fetch directly
  if (!client) {
    return await fetcher();
  }

  try {
    // Try to get from cache
    const cached = await client.get(key);

    if (cached) {
      console.log(`[CACHE HIT] ${key}`);
      return JSON.parse(cached);
    }

    console.log(`[CACHE MISS] ${key}`);

    // Fetch fresh data
    const data = await fetcher();

    // Store in cache
    await client.setex(key, ttl, JSON.stringify(data));

    return data;
  } catch (error) {
    console.error(`[CACHE ERROR] ${key}:`, error);

    // If cache fails, just fetch data directly
    return await fetcher();
  }
}

export async function invalidateCache(pattern: string): Promise<void> {
  const client = getRedisClient();

  if (!client) {
    return;
  }

  try {
    const keys = await client.keys(pattern);

    if (keys.length > 0) {
      await client.del(...keys);
      console.log(`[CACHE INVALIDATED] ${keys.length} keys matching ${pattern}`);
    }
  } catch (error) {
    console.error(`[CACHE INVALIDATE ERROR] ${pattern}:`, error);
  }
}

// Invalidate specific cache keys
export async function invalidateRevenueCaches(): Promise<void> {
  await invalidateCache('dashboard:revenue:*');
}

export async function invalidateSalesCaches(): Promise<void> {
  await invalidateCache('dashboard:sales:*');
}

export async function invalidateCustomerCaches(): Promise<void> {
  await invalidateCache('dashboard:customers:*');
}

export async function invalidateFixtureCaches(): Promise<void> {
  await invalidateCache('fixtures:*');
}

export async function invalidateStatsCaches(): Promise<void> {
  await invalidateCache('stats:*');
}

// Graceful shutdown
export async function closeRedisConnection(): Promise<void> {
  if (redis) {
    await redis.quit();
    redis = null;
    console.log('[CACHE] Redis connection closed');
  }
}

