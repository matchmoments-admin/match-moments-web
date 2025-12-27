/**
 * Mock Salesforce Client
 * 
 * Mock implementation for testing Salesforce integration
 */

import { vi } from 'vitest';

/**
 * Mock JWT token response
 */
export const mockJWTTokenResponse = {
  access_token: 'mock_access_token_12345',
  instance_url: 'https://test.salesforce.com',
  id: 'https://test.salesforce.com/id/00D123456789012/005123456789012',
  token_type: 'Bearer',
  issued_at: Date.now().toString(),
};

/**
 * Mock Salesforce identity response
 */
export const mockSalesforceIdentity = {
  sub: 'https://test.salesforce.com/id/00D123456789012/005123456789012',
  user_id: '005123456789012',
  organization_id: '00D123456789012',
  preferred_username: 'test@example.com',
  nickname: 'test',
  name: 'Test User',
  email: 'test@example.com',
  email_verified: true,
  active: true,
};

/**
 * Mock successful query response
 */
export function createMockQueryResponse<T>(records: T[]) {
  return {
    totalSize: records.length,
    done: true,
    records,
  };
}

/**
 * Mock paginated query response
 */
export function createMockPaginatedQueryResponse<T>(
  records: T[],
  nextRecordsUrl?: string
) {
  return {
    totalSize: records.length,
    done: !nextRecordsUrl,
    records,
    nextRecordsUrl,
  };
}

/**
 * Mock successful create response
 */
export function createMockCreateResponse(id: string) {
  return {
    id,
    success: true,
    errors: [],
  };
}

/**
 * Mock successful update response
 */
export function createMockUpdateResponse() {
  return {
    success: true,
    errors: [],
  };
}

/**
 * Mock Salesforce error response
 */
export function createMockSalesforceError(errorCode: string, message: string) {
  return [
    {
      errorCode,
      message,
      fields: [],
    },
  ];
}

/**
 * Mock fetch for Salesforce API calls
 */
export function mockFetch() {
  const mockFn = vi.fn();
  global.fetch = mockFn as any;
  return mockFn;
}

/**
 * Setup mock fetch to return JWT token
 */
export function mockJWTAuthentication(fetchMock: ReturnType<typeof mockFetch>) {
  fetchMock.mockResolvedValueOnce({
    ok: true,
    json: async () => mockJWTTokenResponse,
  } as any);
}

/**
 * Setup mock fetch to return authentication error
 */
export function mockJWTAuthenticationError(
  fetchMock: ReturnType<typeof mockFetch>,
  error: string = 'invalid_grant'
) {
  fetchMock.mockResolvedValueOnce({
    ok: false,
    json: async () => ({
      error,
      error_description: 'Authentication failed',
    }),
  } as any);
}

/**
 * Setup mock fetch to return query results
 */
export function mockSalesforceQuery<T>(
  fetchMock: ReturnType<typeof mockFetch>,
  records: T[]
) {
  // First call: authentication
  mockJWTAuthentication(fetchMock);
  
  // Second call: query
  fetchMock.mockResolvedValueOnce({
    ok: true,
    json: async () => createMockQueryResponse(records),
  } as any);
}

/**
 * Setup mock fetch to return Salesforce API error
 */
export function mockSalesforceError(
  fetchMock: ReturnType<typeof mockFetch>,
  errorCode: string,
  message: string
) {
  // First call: authentication
  mockJWTAuthentication(fetchMock);
  
  // Second call: error response
  fetchMock.mockResolvedValueOnce({
    ok: false,
    status: 400,
    statusText: 'Bad Request',
    json: async () => createMockSalesforceError(errorCode, message),
  } as any);
}

/**
 * Mock crypto module for JWT signing
 */
export function mockCrypto() {
  const mockSign = {
    update: vi.fn().mockReturnThis(),
    sign: vi.fn().mockReturnValue('mock_signature_base64'),
  };
  
  vi.mock('crypto', () => ({
    createSign: vi.fn(() => mockSign),
  }));
  
  return mockSign;
}

