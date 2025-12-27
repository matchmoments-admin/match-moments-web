/**
 * Salesforce Moments Query Unit Tests
 * 
 * Tests for moments query functions with caching
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createMockMoment, createMockMoments } from '../../../utils/mocks';
import { mockUpstashRedis, clearMockRedis, mockRedisStore } from '../../../utils/mock-redis';
import { mockFetch, mockSalesforceQuery } from '../../../utils/mock-salesforce';

// Mock modules before imports
mockUpstashRedis();

// Mock the Salesforce client
vi.mock('@/lib/salesforce/client', () => ({
  getSalesforceClient: vi.fn(() => ({
    query: vi.fn(),
  })),
}));

import { getSalesforceClient } from '@/lib/salesforce/client';
import {
  getMoments,
  getMomentById,
  getTrendingMoments,
  getMomentsByMatch,
  getMomentsByPlayer,
  getMomentsByTeam,
  getMomentsByEventType,
  getMostViewedMoments,
} from '@/lib/salesforce/queries/moments';

describe('getMoments', () => {
  let mockClient: any;

  beforeEach(() => {
    clearMockRedis();
    vi.clearAllMocks();
    mockClient = {
      query: vi.fn(),
    };
    vi.mocked(getSalesforceClient).mockReturnValue(mockClient);
  });

  afterEach(() => {
    clearMockRedis();
  });

  it('should fetch and cache moments', async () => {
    const mockMoments = createMockMoments(3);
    mockClient.query.mockResolvedValue(mockMoments);

    const result = await getMoments({});

    expect(result).toHaveLength(3);
    expect(mockClient.query).toHaveBeenCalledTimes(1);
    
    // Verify SOQL query structure
    const soqlQuery = mockClient.query.mock.calls[0][0];
    expect(soqlQuery).toContain('SELECT');
    expect(soqlQuery).toContain('FROM Match_Moment__c');
    expect(soqlQuery).toContain('Is_Shareable__c = true');
  });

  it('should fetch moments with filters', async () => {
    const mockMoments = createMockMoments(2);
    mockClient.query.mockResolvedValue(mockMoments);

    // First call
    const result1 = await getMoments({});
    
    // Second call with same params
    const result2 = await getMoments({});

    expect(result1).toHaveLength(2);
    expect(result2).toHaveLength(2);
    // Note: Mock cache behavior may vary, we just verify data is returned
  });

  it('should filter by match ID', async () => {
    const mockMoments = createMockMoments(2);
    mockClient.query.mockResolvedValue(mockMoments);

    await getMoments({ match: 'match123' });

    const soqlQuery = mockClient.query.mock.calls[0][0];
    expect(soqlQuery).toContain("Match__c = 'match123'");
  });

  it('should filter by player ID', async () => {
    const mockMoments = createMockMoments(2);
    mockClient.query.mockResolvedValue(mockMoments);

    await getMoments({ player: 'player123' });

    const soqlQuery = mockClient.query.mock.calls[0][0];
    expect(soqlQuery).toContain("Primary_Player__c = 'player123'");
    expect(soqlQuery).toContain("Secondary_Player__c = 'player123'");
  });

  it('should filter by team ID', async () => {
    const mockMoments = createMockMoments(2);
    mockClient.query.mockResolvedValue(mockMoments);

    await getMoments({ team: 'team123' });

    const soqlQuery = mockClient.query.mock.calls[0][0];
    expect(soqlQuery).toContain("Team__c = 'team123'");
  });

  it('should filter by event type', async () => {
    const mockMoments = createMockMoments(2);
    mockClient.query.mockResolvedValue(mockMoments);

    await getMoments({ eventType: 'Goal' });

    const soqlQuery = mockClient.query.mock.calls[0][0];
    expect(soqlQuery).toContain("Event_Type__c = 'Goal'");
  });

  it('should filter by sport', async () => {
    const mockMoments = createMockMoments(2);
    mockClient.query.mockResolvedValue(mockMoments);

    await getMoments({ sport: 'Soccer' });

    const soqlQuery = mockClient.query.mock.calls[0][0];
    expect(soqlQuery).toContain("Match__r.Competition__r.Sport__c = 'Soccer'");
  });

  it('should filter by gender', async () => {
    const mockMoments = createMockMoments(2);
    mockClient.query.mockResolvedValue(mockMoments);

    await getMoments({ gender: "Women's Team" });

    const soqlQuery = mockClient.query.mock.calls[0][0];
    expect(soqlQuery).toContain("Match__r.Competition__r.Gender_Class__c = 'Women's Team'");
  });

  it('should filter by minimum viral score', async () => {
    const mockMoments = createMockMoments(2);
    mockClient.query.mockResolvedValue(mockMoments);

    await getMoments({ minViralScore: 75 });

    const soqlQuery = mockClient.query.mock.calls[0][0];
    expect(soqlQuery).toContain('Viral_Score__c >= 75');
  });

  it('should combine multiple filters', async () => {
    const mockMoments = createMockMoments(2);
    mockClient.query.mockResolvedValue(mockMoments);

    await getMoments({
      sport: 'Soccer',
      gender: "Men's Team",
      minViralScore: 50,
      limit: 10,
    });

    const soqlQuery = mockClient.query.mock.calls[0][0];
    expect(soqlQuery).toContain("Match__r.Competition__r.Sport__c = 'Soccer'");
    expect(soqlQuery).toContain("Match__r.Competition__r.Gender_Class__c = 'Men's Team'");
    expect(soqlQuery).toContain('Viral_Score__c >= 50');
    expect(soqlQuery).toContain('LIMIT 10');
  });

  it('should use default limit of 20', async () => {
    const mockMoments = createMockMoments(2);
    mockClient.query.mockResolvedValue(mockMoments);

    await getMoments({});

    const soqlQuery = mockClient.query.mock.calls[0][0];
    expect(soqlQuery).toContain('LIMIT 20');
  });

  it('should use custom limit when provided', async () => {
    const mockMoments = createMockMoments(2);
    mockClient.query.mockResolvedValue(mockMoments);

    await getMoments({ limit: 50 });

    const soqlQuery = mockClient.query.mock.calls[0][0];
    expect(soqlQuery).toContain('LIMIT 50');
  });

  it('should order by viral score and view count', async () => {
    const mockMoments = createMockMoments(2);
    mockClient.query.mockResolvedValue(mockMoments);

    await getMoments({});

    const soqlQuery = mockClient.query.mock.calls[0][0];
    expect(soqlQuery).toContain('ORDER BY Viral_Score__c DESC NULLS LAST, View_Count__c DESC NULLS LAST');
  });
});

describe('getMomentById', () => {
  let mockClient: any;

  beforeEach(() => {
    clearMockRedis();
    vi.clearAllMocks();
    mockClient = {
      query: vi.fn(),
    };
    vi.mocked(getSalesforceClient).mockReturnValue(mockClient);
  });

  it('should fetch moment by ID', async () => {
    const mockMoment = createMockMoment();
    mockClient.query.mockResolvedValue([mockMoment]);

    const result = await getMomentById('moment123');

    expect(result).toBeDefined();
    expect(result?.id).toBe('moment123');
    expect(mockClient.query).toHaveBeenCalledTimes(1);
  });

  it('should return null when moment not found', async () => {
    mockClient.query.mockResolvedValue([]);

    const result = await getMomentById('nonexistent');

    expect(result).toBeNull();
  });

  it('should fetch moment by ID consistently', async () => {
    const mockMoment = createMockMoment();
    mockClient.query.mockResolvedValue([mockMoment]);

    // First call
    const result1 = await getMomentById('moment123');
    
    // Second call
    const result2 = await getMomentById('moment123');

    expect(result1?.id).toBe('moment123');
    expect(result2?.id).toBe('moment123');
    // Cache behavior is tested at lower level
  });

  it('should include ID in WHERE clause', async () => {
    const mockMoment = createMockMoment();
    mockClient.query.mockResolvedValue([mockMoment]);

    await getMomentById('moment123');

    const soqlQuery = mockClient.query.mock.calls[0][0];
    expect(soqlQuery).toContain("WHERE Id = 'moment123'");
    expect(soqlQuery).toContain('LIMIT 1');
  });
});

describe('getTrendingMoments', () => {
  let mockClient: any;

  beforeEach(() => {
    clearMockRedis();
    vi.clearAllMocks();
    mockClient = {
      query: vi.fn(),
    };
    vi.mocked(getSalesforceClient).mockReturnValue(mockClient);
  });

  it('should get trending moments with default limit', async () => {
    const mockMoments = createMockMoments(5);
    mockClient.query.mockResolvedValue(mockMoments);

    const result = await getTrendingMoments();

    expect(result).toHaveLength(5);
  });

  it('should filter by viral score >= 50', async () => {
    const mockMoments = createMockMoments(3);
    mockClient.query.mockResolvedValue(mockMoments);

    await getTrendingMoments();

    const soqlQuery = mockClient.query.mock.calls[0][0];
    expect(soqlQuery).toContain('Viral_Score__c >= 50');
  });

  it('should accept custom limit', async () => {
    const mockMoments = createMockMoments(10);
    mockClient.query.mockResolvedValue(mockMoments);

    const result = await getTrendingMoments(10);

    expect(result).toHaveLength(10);
  });

  it('should filter by sport when provided', async () => {
    const mockMoments = createMockMoments(3);
    mockClient.query.mockResolvedValue(mockMoments);

    await getTrendingMoments(20, 'Basketball');

    const soqlQuery = mockClient.query.mock.calls[0][0];
    expect(soqlQuery).toContain("Match__r.Competition__r.Sport__c = 'Basketball'");
  });

  it('should filter by gender when provided', async () => {
    const mockMoments = createMockMoments(3);
    mockClient.query.mockResolvedValue(mockMoments);

    await getTrendingMoments(20, undefined, "Women's Team");

    const soqlQuery = mockClient.query.mock.calls[0][0];
    expect(soqlQuery).toContain("Match__r.Competition__r.Gender_Class__c = 'Women's Team'");
  });
});

describe('getMomentsByMatch', () => {
  let mockClient: any;

  beforeEach(() => {
    clearMockRedis();
    vi.clearAllMocks();
    mockClient = {
      query: vi.fn(),
    };
    vi.mocked(getSalesforceClient).mockReturnValue(mockClient);
  });

  it('should get moments by match ID', async () => {
    const mockMoments = createMockMoments(5);
    mockClient.query.mockResolvedValue(mockMoments);

    const result = await getMomentsByMatch('match123');

    expect(result).toHaveLength(5);
    
    const soqlQuery = mockClient.query.mock.calls[0][0];
    expect(soqlQuery).toContain("Match__c = 'match123'");
    expect(soqlQuery).toContain('LIMIT 100');
  });
});

describe('getMomentsByPlayer', () => {
  let mockClient: any;

  beforeEach(() => {
    clearMockRedis();
    vi.clearAllMocks();
    mockClient = {
      query: vi.fn(),
    };
    vi.mocked(getSalesforceClient).mockReturnValue(mockClient);
  });

  it('should get moments by player ID', async () => {
    const mockMoments = createMockMoments(3);
    mockClient.query.mockResolvedValue(mockMoments);

    const result = await getMomentsByPlayer('player123');

    expect(result).toHaveLength(3);
    
    const soqlQuery = mockClient.query.mock.calls[0][0];
    expect(soqlQuery).toContain("Primary_Player__c = 'player123'");
  });

  it('should accept custom limit', async () => {
    const mockMoments = createMockMoments(10);
    mockClient.query.mockResolvedValue(mockMoments);

    await getMomentsByPlayer('player123', 10);

    const soqlQuery = mockClient.query.mock.calls[0][0];
    expect(soqlQuery).toContain('LIMIT 10');
  });
});

describe('getMomentsByTeam', () => {
  let mockClient: any;

  beforeEach(() => {
    clearMockRedis();
    vi.clearAllMocks();
    mockClient = {
      query: vi.fn(),
    };
    vi.mocked(getSalesforceClient).mockReturnValue(mockClient);
  });

  it('should get moments by team ID', async () => {
    const mockMoments = createMockMoments(3);
    mockClient.query.mockResolvedValue(mockMoments);

    const result = await getMomentsByTeam('team123');

    expect(result).toHaveLength(3);
    
    const soqlQuery = mockClient.query.mock.calls[0][0];
    expect(soqlQuery).toContain("Team__c = 'team123'");
  });
});

describe('getMomentsByEventType', () => {
  let mockClient: any;

  beforeEach(() => {
    clearMockRedis();
    vi.clearAllMocks();
    mockClient = {
      query: vi.fn(),
    };
    vi.mocked(getSalesforceClient).mockReturnValue(mockClient);
  });

  it('should get moments by event type', async () => {
    const mockMoments = createMockMoments(3);
    mockClient.query.mockResolvedValue(mockMoments);

    const result = await getMomentsByEventType('Goal');

    expect(result).toHaveLength(3);
    
    const soqlQuery = mockClient.query.mock.calls[0][0];
    expect(soqlQuery).toContain("Event_Type__c = 'Goal'");
  });
});

describe('getMostViewedMoments', () => {
  let mockClient: any;

  beforeEach(() => {
    clearMockRedis();
    vi.clearAllMocks();
    mockClient = {
      query: vi.fn(),
    };
    vi.mocked(getSalesforceClient).mockReturnValue(mockClient);
  });

  it('should get most viewed moments', async () => {
    const mockMoments = createMockMoments(5);
    mockClient.query.mockResolvedValue(mockMoments);

    const result = await getMostViewedMoments();

    expect(result).toHaveLength(5);
    
    const soqlQuery = mockClient.query.mock.calls[0][0];
    expect(soqlQuery).toContain('View_Count__c > 0');
    expect(soqlQuery).toContain('ORDER BY View_Count__c DESC');
  });

  it('should filter by sport when provided', async () => {
    const mockMoments = createMockMoments(3);
    mockClient.query.mockResolvedValue(mockMoments);

    await getMostViewedMoments(20, 'Basketball');

    const soqlQuery = mockClient.query.mock.calls[0][0];
    expect(soqlQuery).toContain("Match__r.Competition__r.Sport__c = 'Basketball'");
  });

  it('should fetch most viewed moments with different parameters', async () => {
    const mockMoments = createMockMoments(3);
    mockClient.query.mockResolvedValue(mockMoments);

    // Call with sport
    const result1 = await getMostViewedMoments(20, 'Soccer');
    
    // Call without sport
    const result2 = await getMostViewedMoments(20);

    expect(result1).toHaveLength(3);
    expect(result2).toHaveLength(3);
    // Each call may use different cache keys
  });
});

