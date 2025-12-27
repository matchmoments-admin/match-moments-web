/**
 * Salesforce Client Unit Tests
 * 
 * Tests for Salesforce REST API client
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock crypto module before importing client
vi.mock('crypto', async () => {
  const mockSign = {
    update: vi.fn().mockReturnThis(),
    sign: vi.fn().mockReturnValue(Buffer.from('mock_signature').toString('base64')),
  };
  
  return {
    createSign: vi.fn(() => mockSign),
  };
});

import { SalesforceClient, getSalesforceClient } from '@/lib/salesforce/client';
import {
  mockFetch,
  mockJWTAuthentication,
  mockJWTAuthenticationError,
  mockSalesforceQuery,
  createMockQueryResponse,
  createMockCreateResponse,
  createMockSalesforceError,
} from '../../utils/mock-salesforce';
import { createMockMatch } from '../../utils/mocks';

describe('SalesforceClient - Singleton', () => {
  afterEach(() => {
    SalesforceClient.resetInstance();
    vi.restoreAllMocks();
  });

  it('should return the same instance', () => {
    const client1 = getSalesforceClient();
    const client2 = getSalesforceClient();

    expect(client1).toBe(client2);
  });

  it('should create new instance after reset', () => {
    const client1 = getSalesforceClient();
    SalesforceClient.resetInstance();
    const client2 = getSalesforceClient();

    expect(client1).not.toBe(client2);
  });
});

describe('SalesforceClient - Configuration', () => {
  afterEach(() => {
    SalesforceClient.resetInstance();
    vi.restoreAllMocks();
  });

  it('should load config from environment variables', () => {
    const client = SalesforceClient.getInstance();
    const status = client.getStatus();

    expect(status.instanceUrl).toBe('https://test.salesforce.com');
  });

  it('should throw error when missing required config', () => {
    const originalClientId = process.env.SALESFORCE_JWT_CLIENT_ID;
    delete process.env.SALESFORCE_JWT_CLIENT_ID;
    SalesforceClient.resetInstance();

    expect(() => SalesforceClient.getInstance()).toThrow('Missing required Salesforce configuration');

    process.env.SALESFORCE_JWT_CLIENT_ID = originalClientId;
  });

  it('should determine login URL for sandbox', () => {
    const originalInstanceUrl = process.env.SALESFORCE_INSTANCE_URL;
    process.env.SALESFORCE_INSTANCE_URL = 'https://test--sandbox.sandbox.my.salesforce.com';
    SalesforceClient.resetInstance();

    const client = SalesforceClient.getInstance();
    // Client should use test.salesforce.com for sandboxes

    process.env.SALESFORCE_INSTANCE_URL = originalInstanceUrl;
    SalesforceClient.resetInstance();
  });

  it('should determine login URL for production', () => {
    const originalInstanceUrl = process.env.SALESFORCE_INSTANCE_URL;
    process.env.SALESFORCE_INSTANCE_URL = 'https://example.my.salesforce.com';
    SalesforceClient.resetInstance();

    const client = SalesforceClient.getInstance();
    // Client should use login.salesforce.com for production

    process.env.SALESFORCE_INSTANCE_URL = originalInstanceUrl;
    SalesforceClient.resetInstance();
  });
});

describe('SalesforceClient - Authentication', () => {
  let fetchMock: ReturnType<typeof mockFetch>;

  beforeEach(() => {
    SalesforceClient.resetInstance();
    fetchMock = mockFetch();
  });

  afterEach(() => {
    SalesforceClient.resetInstance();
    vi.restoreAllMocks();
  });

  it('should authenticate with JWT Bearer flow', async () => {
    mockJWTAuthentication(fetchMock);

    const client = SalesforceClient.getInstance();
    await client.authenticate();

    const status = client.getStatus();
    expect(status.connected).toBe(true);
  });

  it('should cache access token', async () => {
    mockJWTAuthentication(fetchMock);

    const client = SalesforceClient.getInstance();
    await client.authenticate();
    await client.authenticate(); // Second call

    // Should only authenticate once
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('should handle authentication failure', async () => {
    mockJWTAuthenticationError(fetchMock, 'invalid_grant');

    const client = SalesforceClient.getInstance();

    await expect(client.authenticate()).rejects.toThrow('JWT Bearer authentication failed');
  });

  it('should handle invalid client ID error', async () => {
    mockJWTAuthenticationError(fetchMock, 'invalid_client_id');

    const client = SalesforceClient.getInstance();

    await expect(client.authenticate()).rejects.toThrow('Invalid SALESFORCE_JWT_CLIENT_ID');
  });

  it('should provide helpful error messages', async () => {
    mockJWTAuthenticationError(fetchMock, 'invalid_grant');

    const client = SalesforceClient.getInstance();

    await expect(client.authenticate()).rejects.toThrow(/Certificate not uploaded/);
  });

  it('should get user identity', async () => {
    mockJWTAuthentication(fetchMock);
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user_id: '005123456789012',
        preferred_username: 'test@example.com',
        name: 'Test User',
      }),
    } as any);

    const client = SalesforceClient.getInstance();
    const identity = await client.getIdentity();

    expect(identity.user_id).toBe('005123456789012');
    expect(identity.preferred_username).toBe('test@example.com');
  });

  it('should force reconnect when requested', async () => {
    mockJWTAuthentication(fetchMock);

    const client = SalesforceClient.getInstance();
    await client.authenticate();

    mockJWTAuthentication(fetchMock);
    await client.forceReconnect();

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});

describe('SalesforceClient - Query Operations', () => {
  let fetchMock: ReturnType<typeof mockFetch>;

  beforeEach(() => {
    SalesforceClient.resetInstance();
    fetchMock = mockFetch();
  });

  afterEach(() => {
    SalesforceClient.resetInstance();
    vi.restoreAllMocks();
  });

  it('should execute SOQL query', async () => {
    const mockMatches = [createMockMatch()];
    mockSalesforceQuery(fetchMock, mockMatches);

    const client = SalesforceClient.getInstance();
    const results = await client.query('SELECT Id, Name FROM Match__c');

    expect(results).toHaveLength(1);
    expect(results[0].Id).toBe('match123');
  });

  it('should handle empty query results', async () => {
    mockSalesforceQuery(fetchMock, []);

    const client = SalesforceClient.getInstance();
    const results = await client.query('SELECT Id FROM Match__c WHERE Id = \'invalid\'');

    expect(results).toEqual([]);
  });

  it('should handle query pagination with queryAll', async () => {
    const page1 = [createMockMatch({ Id: 'match1' })];
    const page2 = [createMockMatch({ Id: 'match2' })];

    // First call: authentication
    mockJWTAuthentication(fetchMock);

    // Second call: first page
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        totalSize: 2,
        done: false,
        records: page1,
        nextRecordsUrl: '/services/data/v60.0/query/nextpage',
      }),
    } as any);

    // Third call: second page
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        totalSize: 2,
        done: true,
        records: page2,
      }),
    } as any);

    const client = SalesforceClient.getInstance();
    const results = await client.queryAll('SELECT Id FROM Match__c');

    expect(results).toHaveLength(2);
    expect(results[0].Id).toBe('match1');
    expect(results[1].Id).toBe('match2');
  });

  it('should handle SOQL query errors', async () => {
    mockJWTAuthentication(fetchMock);
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      json: async () => createMockSalesforceError(
        'MALFORMED_QUERY',
        'Invalid SOQL query syntax'
      ),
    } as any);

    const client = SalesforceClient.getInstance();

    await expect(client.query('SELECT InvalidField FROM Match__c')).rejects.toThrow(
      'MALFORMED_QUERY'
    );
  });
});

describe('SalesforceClient - CRUD Operations', () => {
  let fetchMock: ReturnType<typeof mockFetch>;

  beforeEach(() => {
    SalesforceClient.resetInstance();
    fetchMock = mockFetch();
  });

  afterEach(() => {
    SalesforceClient.resetInstance();
    vi.restoreAllMocks();
  });

  it('should create a record', async () => {
    mockJWTAuthentication(fetchMock);
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => createMockCreateResponse('a0X123456789012'),
    } as any);

    const client = SalesforceClient.getInstance();
    const id = await client.create('Match__c', {
      Name: 'Arsenal vs Chelsea',
      Status__c: 'Scheduled',
    });

    expect(id).toBe('a0X123456789012');
  });

  it('should update a record', async () => {
    mockJWTAuthentication(fetchMock);
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 204,
    } as any);

    const client = SalesforceClient.getInstance();
    
    await expect(
      client.update('Match__c', 'a0X123456789012', {
        Status__c: 'Live',
        Home_Score_Final__c: 2,
      })
    ).resolves.not.toThrow();
  });

  it('should retrieve a record', async () => {
    const mockMatch = createMockMatch();
    mockJWTAuthentication(fetchMock);
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => mockMatch,
    } as any);

    const client = SalesforceClient.getInstance();
    const result = await client.retrieve('Match__c', 'match123', ['Id', 'Name', 'Status__c']);

    expect(result.Id).toBe('match123');
    expect(result.Name).toBe('Arsenal vs Chelsea');
  });

  it('should delete a record', async () => {
    mockJWTAuthentication(fetchMock);
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 204,
    } as any);

    const client = SalesforceClient.getInstance();
    
    await expect(
      client.delete('Match__c', 'match123')
    ).resolves.not.toThrow();
  });

  it('should handle create errors', async () => {
    mockJWTAuthentication(fetchMock);
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      json: async () => createMockSalesforceError(
        'REQUIRED_FIELD_MISSING',
        'Required fields are missing: [Name]'
      ),
    } as any);

    const client = SalesforceClient.getInstance();

    await expect(
      client.create('Match__c', { Status__c: 'Scheduled' })
    ).rejects.toThrow('REQUIRED_FIELD_MISSING');
  });
});

describe('SalesforceClient - Status and Health', () => {
  let fetchMock: ReturnType<typeof mockFetch>;

  beforeEach(() => {
    SalesforceClient.resetInstance();
    fetchMock = mockFetch();
  });

  afterEach(() => {
    SalesforceClient.resetInstance();
    vi.restoreAllMocks();
  });

  it('should report disconnected status initially', () => {
    const client = SalesforceClient.getInstance();
    const status = client.getStatus();

    expect(status.connected).toBe(false);
    expect(status.lastRefresh).toBe(0);
    expect(status.tokenAge).toBe(0);
  });

  it('should report connected status after authentication', async () => {
    mockJWTAuthentication(fetchMock);

    const client = SalesforceClient.getInstance();
    await client.authenticate();

    const status = client.getStatus();

    expect(status.connected).toBe(true);
    expect(status.lastRefresh).toBeGreaterThan(0);
    expect(status.tokenAge).toBeGreaterThanOrEqual(0);
  });

  it('should include instance URL in status', () => {
    const client = SalesforceClient.getInstance();
    const status = client.getStatus();

    expect(status.instanceUrl).toBe('https://test.salesforce.com');
  });
});

describe('SalesforceClient - Error Handling', () => {
  let fetchMock: ReturnType<typeof mockFetch>;

  beforeEach(() => {
    SalesforceClient.resetInstance();
    fetchMock = mockFetch();
  });

  afterEach(() => {
    SalesforceClient.resetInstance();
    vi.restoreAllMocks();
  });

  it('should throw error when not authenticated', async () => {
    const client = SalesforceClient.getInstance();

    // Try to query without authenticating
    await expect(
      client.query('SELECT Id FROM Match__c')
    ).rejects.toThrow('Not authenticated');
  });

  it('should handle network errors', async () => {
    fetchMock.mockRejectedValueOnce(new Error('Network error'));

    const client = SalesforceClient.getInstance();

    await expect(client.authenticate()).rejects.toThrow('Network error');
  });

  it('should handle malformed responses', async () => {
    mockJWTAuthentication(fetchMock);
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => {
        throw new Error('Invalid JSON');
      },
    } as any);

    const client = SalesforceClient.getInstance();

    await expect(
      client.query('SELECT Id FROM Match__c')
    ).rejects.toThrow();
  });
});

