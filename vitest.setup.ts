/**
 * Vitest Global Setup
 * 
 * Runs before all tests to configure the testing environment
 */

import { expect, vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock environment variables
process.env.UPSTASH_REDIS_REST_URL = 'http://mock-redis.test';
process.env.UPSTASH_REDIS_REST_TOKEN = 'mock-token';
process.env.SALESFORCE_JWT_CLIENT_ID = 'mock-client-id';
process.env.SALESFORCE_JWT_USERNAME = 'test@example.com';
process.env.SALESFORCE_JWT_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7VJTUt9Us8cKj
-----END PRIVATE KEY-----`;
process.env.SALESFORCE_INSTANCE_URL = 'https://test.salesforce.com';

// Global test utilities
global.console = {
  ...console,
  // Suppress console logs during tests (unless debugging)
  log: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  // Keep errors visible
  error: console.error,
};

// Reset all mocks after each test
afterEach(() => {
  vi.clearAllMocks();
});

