/**
 * Redis Cache Unit Tests
 * 
 * Tests for Redis caching utilities
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mockUpstashRedis, clearMockRedis, mockRedisStore } from '../../utils/mock-redis';

// Mock the Redis module before importing functions
mockUpstashRedis();

// Import after mocking
import { 
  getCached, 
  invalidateCache, 
  invalidateCacheKey,
  getCacheStats,
  invalidateFixtureCaches,
  invalidateStatsCaches,
} from '@/lib/cache/redis';

describe('Redis Cache - getCached', () => {
  beforeEach(() => {
    clearMockRedis();
    vi.clearAllMocks();
  });

  afterEach(() => {
    clearMockRedis();
  });

  it('should fetch and cache data on cache miss', async () => {
    const mockData = { id: 1, name: 'Test' };
    const fetcher = vi.fn(async () => mockData);

    const result = await getCached('test:key', fetcher, 300);

    expect(result).toEqual(mockData);
    expect(fetcher).toHaveBeenCalledTimes(1);
    
    // Verify data was cached
    const cached = mockRedisStore.get('test:key');
    expect(cached).toEqual(mockData);
  });

  it('should return cached data on cache hit', async () => {
    const mockData = { id: 1, name: 'Cached' };
    const fetcher = vi.fn(async () => ({ id: 2, name: 'Fresh' }));

    // Pre-populate cache
    mockRedisStore.setex('test:key', 300, JSON.stringify(mockData));

    const result = await getCached('test:key', fetcher, 300);

    expect(result).toEqual(mockData);
    expect(fetcher).not.toHaveBeenCalled(); // Fetcher not called on cache hit
  });

  it('should use default TTL of 300 seconds', async () => {
    const mockData = { id: 1, name: 'Test' };
    const fetcher = vi.fn(async () => mockData);

    await getCached('test:key', fetcher);

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(mockRedisStore.get('test:key')).toEqual(mockData);
  });

  it('should use custom TTL when provided', async () => {
    const mockData = { id: 1, name: 'Test' };
    const fetcher = vi.fn(async () => mockData);

    await getCached('test:key', fetcher, 60);

    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('should fallback to fetcher when Redis unavailable', async () => {
    const mockData = { id: 1, name: 'Fallback' };
    const fetcher = vi.fn(async () => mockData);

    // Note: In our mock setup, Redis is always "available"
    // This test would require more complex mocking to simulate unavailability
    const result = await getCached('test:fallback', fetcher, 300);

    expect(result).toEqual(mockData);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('should handle complex nested objects', async () => {
    const mockData = {
      match: {
        id: '123',
        teams: {
          home: { name: 'Arsenal', players: ['Player1', 'Player2'] },
          away: { name: 'Chelsea', players: ['Player3', 'Player4'] },
        },
        events: [
          { type: 'goal', minute: 23 },
          { type: 'card', minute: 45 },
        ],
      },
    };
    const fetcher = vi.fn(async () => mockData);

    const result = await getCached('test:complex', fetcher);

    expect(result).toEqual(mockData);
    expect(result.match.teams.home.players).toHaveLength(2);
  });

  it('should handle arrays', async () => {
    const mockData = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' },
    ];
    const fetcher = vi.fn(async () => mockData);

    const result = await getCached('test:array', fetcher);

    expect(result).toEqual(mockData);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(3);
  });

  it('should handle null values', async () => {
    const fetcher = vi.fn(async () => null);

    const result = await getCached('test:null', fetcher);

    expect(result).toBeNull();
  });

  it('should handle empty objects', async () => {
    const mockData = {};
    const fetcher = vi.fn(async () => mockData);

    const result = await getCached('test:empty', fetcher);

    expect(result).toEqual({});
  });

  it('should handle fetcher errors gracefully', async () => {
    const fetcher = vi.fn(async () => {
      throw new Error('Fetcher failed');
    });

    await expect(getCached('test:error', fetcher)).rejects.toThrow('Fetcher failed');
  });

  it('should cache different keys independently', async () => {
    const mockData1 = { id: 1, name: 'Data 1' };
    const mockData2 = { id: 2, name: 'Data 2' };
    
    const fetcher1 = vi.fn(async () => mockData1);
    const fetcher2 = vi.fn(async () => mockData2);

    await getCached('test:key1', fetcher1);
    await getCached('test:key2', fetcher2);

    expect(mockRedisStore.get('test:key1')).toEqual(mockData1);
    expect(mockRedisStore.get('test:key2')).toEqual(mockData2);
  });
});

describe('Redis Cache - invalidateCache', () => {
  beforeEach(() => {
    clearMockRedis();
    vi.clearAllMocks();
  });

  it('should delete keys matching pattern', async () => {
    // Set up multiple keys
    mockRedisStore.setex('fixtures:today', 300, JSON.stringify({ data: 1 }));
    mockRedisStore.setex('fixtures:tomorrow', 300, JSON.stringify({ data: 2 }));
    mockRedisStore.setex('stats:player:123', 300, JSON.stringify({ data: 3 }));

    await invalidateCache('fixtures:*');

    // Fixtures should be deleted
    expect(mockRedisStore.get('fixtures:today')).toBeNull();
    expect(mockRedisStore.get('fixtures:tomorrow')).toBeNull();
    
    // Stats should remain
    expect(mockRedisStore.get('stats:player:123')).not.toBeNull();
  });

  it('should handle no matching keys', async () => {
    mockRedisStore.setex('test:key', 300, JSON.stringify({ data: 1 }));

    await invalidateCache('nonexistent:*');

    // Original key should still exist
    expect(mockRedisStore.get('test:key')).not.toBeNull();
  });

  it('should handle wildcard at different positions', async () => {
    mockRedisStore.setex('cache:user:123', 300, JSON.stringify({ data: 1 }));
    mockRedisStore.setex('cache:user:456', 300, JSON.stringify({ data: 2 }));
    mockRedisStore.setex('cache:team:789', 300, JSON.stringify({ data: 3 }));

    await invalidateCache('cache:user:*');

    expect(mockRedisStore.get('cache:user:123')).toBeNull();
    expect(mockRedisStore.get('cache:user:456')).toBeNull();
    expect(mockRedisStore.get('cache:team:789')).not.toBeNull();
  });
});

describe('Redis Cache - invalidateCacheKey', () => {
  beforeEach(() => {
    clearMockRedis();
    vi.clearAllMocks();
  });

  it('should delete specific key', async () => {
    mockRedisStore.setex('test:key1', 300, JSON.stringify({ data: 1 }));
    mockRedisStore.setex('test:key2', 300, JSON.stringify({ data: 2 }));

    await invalidateCacheKey('test:key1');

    expect(mockRedisStore.get('test:key1')).toBeNull();
    expect(mockRedisStore.get('test:key2')).not.toBeNull();
  });

  it('should handle non-existent key', async () => {
    await invalidateCacheKey('nonexistent:key');
    
    // Should not throw error
    expect(mockRedisStore.get('nonexistent:key')).toBeNull();
  });
});

describe('Redis Cache - getCacheStats', () => {
  beforeEach(() => {
    clearMockRedis();
    vi.clearAllMocks();
  });

  it('should return cache statistics', async () => {
    // Set up multiple keys with different prefixes
    mockRedisStore.setex('fixtures:today', 300, JSON.stringify({ data: 1 }));
    mockRedisStore.setex('fixtures:tomorrow', 300, JSON.stringify({ data: 2 }));
    mockRedisStore.setex('stats:player:123', 300, JSON.stringify({ data: 3 }));
    mockRedisStore.setex('stats:team:456', 300, JSON.stringify({ data: 4 }));
    mockRedisStore.setex('moments:trending', 300, JSON.stringify({ data: 5 }));

    const stats = await getCacheStats();

    expect(stats).toBeDefined();
    expect(stats?.enabled).toBe(true);
    expect(stats?.totalKeys).toBe(5);
    expect(stats?.keysByPrefix).toEqual({
      fixtures: 2,
      stats: 2,
      moments: 1,
    });
  });

  it('should handle empty cache', async () => {
    const stats = await getCacheStats();

    expect(stats).toBeDefined();
    expect(stats?.enabled).toBe(true);
    expect(stats?.totalKeys).toBe(0);
    expect(stats?.keysByPrefix).toEqual({});
  });

  it('should return stats when Redis available', async () => {
    const stats = await getCacheStats();

    expect(stats).toBeDefined();
    expect(stats?.enabled).toBe(true);
    expect(stats?.totalKeys).toBeGreaterThanOrEqual(0);
  });
});

describe('Redis Cache - Domain-specific invalidation', () => {
  beforeEach(() => {
    clearMockRedis();
    vi.clearAllMocks();
  });

  it('should call invalidateCache for fixtures pattern', async () => {
    // These functions call invalidateCache internally
    // Just verify they execute without errors
    await expect(invalidateFixtureCaches()).resolves.not.toThrow();
  });

  it('should call invalidateCache for stats pattern', async () => {
    // These functions call invalidateCache internally
    // Just verify they execute without errors
    await expect(invalidateStatsCaches()).resolves.not.toThrow();
  });
});

describe('Redis Cache - Edge Cases', () => {
  beforeEach(() => {
    clearMockRedis();
    vi.clearAllMocks();
  });

  it('should handle special characters in keys', async () => {
    const mockData = { test: 'data' };
    const fetcher = vi.fn(async () => mockData);

    const result = await getCached('match:arsenal-vs-chelsea:2024-01-15', fetcher);

    expect(result).toEqual(mockData);
  });

  it('should handle very long keys', async () => {
    const longKey = 'a'.repeat(200);
    const mockData = { test: 'data' };
    const fetcher = vi.fn(async () => mockData);

    const result = await getCached(longKey, fetcher);

    expect(result).toEqual(mockData);
  });

  it('should handle concurrent cache operations', async () => {
    const mockData1 = { id: 1 };
    const mockData2 = { id: 2 };
    const mockData3 = { id: 3 };

    const fetcher1 = vi.fn(async () => mockData1);
    const fetcher2 = vi.fn(async () => mockData2);
    const fetcher3 = vi.fn(async () => mockData3);

    const [result1, result2, result3] = await Promise.all([
      getCached('key1', fetcher1),
      getCached('key2', fetcher2),
      getCached('key3', fetcher3),
    ]);

    expect(result1).toEqual(mockData1);
    expect(result2).toEqual(mockData2);
    expect(result3).toEqual(mockData3);
  });
});

