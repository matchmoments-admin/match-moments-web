/**
 * Mock Redis Client
 * 
 * In-memory implementation of @upstash/redis for testing
 */

import { vi } from 'vitest';

/**
 * In-memory store for cached data
 */
class MockRedisStore {
  private store = new Map<string, { value: any; expiresAt?: number }>();
  
  get<T = any>(key: string): T | null {
    const item = this.store.get(key);
    
    if (!item) {
      return null;
    }
    
    // Check if expired
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }
    
    return item.value as T;
  }
  
  setex(key: string, ttl: number, value: string): void {
    const expiresAt = Date.now() + (ttl * 1000);
    this.store.set(key, {
      value: JSON.parse(value),
      expiresAt,
    });
  }
  
  del(...keys: string[]): number {
    let deleted = 0;
    for (const key of keys) {
      if (this.store.delete(key)) {
        deleted++;
      }
    }
    return deleted;
  }
  
  keys(pattern: string): string[] {
    const regex = new RegExp('^' + pattern.replace('*', '.*') + '$');
    return Array.from(this.store.keys()).filter(key => regex.test(key));
  }
  
  clear(): void {
    this.store.clear();
  }
  
  size(): number {
    return this.store.size;
  }
}

/**
 * Global mock store instance
 */
export const mockRedisStore = new MockRedisStore();

/**
 * Create a mock Redis client
 */
export function createMockRedis() {
  return {
    get: vi.fn((key: string) => mockRedisStore.get(key)),
    setex: vi.fn((key: string, ttl: number, value: string) => mockRedisStore.setex(key, ttl, value)),
    del: vi.fn((...keys: string[]) => mockRedisStore.del(...keys)),
    keys: vi.fn((pattern: string) => mockRedisStore.keys(pattern)),
  };
}

/**
 * Mock the @upstash/redis module
 */
export function mockUpstashRedis() {
  const mockRedis = createMockRedis();
  
  vi.mock('@upstash/redis', () => ({
    Redis: class MockRedis {
      constructor() {
        return mockRedis;
      }
    },
  }));
  
  return { mockRedis, mockRedisStore };
}

/**
 * Clear all cached data (useful in beforeEach)
 */
export function clearMockRedis() {
  mockRedisStore.clear();
}

