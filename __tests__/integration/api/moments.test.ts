/**
 * Moments API Integration Tests
 * 
 * Tests for /api/sports/moments endpoints
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GET as getMomentById } from '@/app/api/sports/moments/[id]/route';
import { createMockMoment, createMockMoments } from '../../utils/mocks';

// Mock the Salesforce queries
vi.mock('@/lib/salesforce/queries/moments', () => ({
  getMomentById: vi.fn(),
  getMoments: vi.fn(),
  getTrendingMoments: vi.fn(),
}));

import * as momentQueries from '@/lib/salesforce/queries/moments';

describe('GET /api/sports/moments/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return moment by ID', async () => {
    const mockMoment = {
      id: 'moment123',
      eventType: 'Goal',
      eventMinute: 23,
      description: 'Brilliant goal',
      sport: 'soccer',
    };

    vi.mocked(momentQueries.getMomentById).mockResolvedValue(mockMoment as any);

    const request = new Request('http://localhost:3000/api/sports/moments/moment123');
    const params = Promise.resolve({ id: 'moment123' });

    const response = await getMomentById(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toEqual(mockMoment);
    expect(momentQueries.getMomentById).toHaveBeenCalledWith('moment123');
  });

  it('should return 404 when moment not found', async () => {
    vi.mocked(momentQueries.getMomentById).mockResolvedValue(null);

    const request = new Request('http://localhost:3000/api/sports/moments/nonexistent');
    const params = Promise.resolve({ id: 'nonexistent' });

    const response = await getMomentById(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.success).toBe(false);
    expect(data.error).toBe('Moment not found');
  });

  it('should return 500 on server error', async () => {
    vi.mocked(momentQueries.getMomentById).mockRejectedValue(
      new Error('Database connection failed')
    );

    const request = new Request('http://localhost:3000/api/sports/moments/moment123');
    const params = Promise.resolve({ id: 'moment123' });

    const response = await getMomentById(request, { params });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toContain('Failed to fetch moment');
  });

  it('should handle Salesforce query errors', async () => {
    vi.mocked(momentQueries.getMomentById).mockRejectedValue(
      new Error('INVALID_FIELD: No such column \'Invalid_Field__c\' on entity \'Match_Moment__c\'')
    );

    const request = new Request('http://localhost:3000/api/sports/moments/moment123');
    const params = Promise.resolve({ id: 'moment123' });

    const response = await getMomentById(request, { params });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
  });
});

describe('API Response Format', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return success response with correct structure', async () => {
    const mockMoment = {
      id: 'moment123',
      eventType: 'Goal',
      eventMinute: 23,
    };

    vi.mocked(momentQueries.getMomentById).mockResolvedValue(mockMoment as any);

    const request = new Request('http://localhost:3000/api/sports/moments/moment123');
    const params = Promise.resolve({ id: 'moment123' });

    const response = await getMomentById(request, { params });
    const data = await response.json();

    expect(data).toHaveProperty('success');
    expect(data).toHaveProperty('data');
    expect(data.success).toBe(true);
  });

  it('should return error response with correct structure', async () => {
    vi.mocked(momentQueries.getMomentById).mockResolvedValue(null);

    const request = new Request('http://localhost:3000/api/sports/moments/nonexistent');
    const params = Promise.resolve({ id: 'nonexistent' });

    const response = await getMomentById(request, { params });
    const data = await response.json();

    expect(data).toHaveProperty('success');
    expect(data).toHaveProperty('error');
    expect(data.success).toBe(false);
  });
});

describe('API Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle authentication errors', async () => {
    vi.mocked(momentQueries.getMomentById).mockRejectedValue(
      new Error('Salesforce authentication failed')
    );

    const request = new Request('http://localhost:3000/api/sports/moments/moment123');
    const params = Promise.resolve({ id: 'moment123' });

    const response = await getMomentById(request, { params });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBeTruthy();
  });

  it('should handle timeout errors', async () => {
    vi.mocked(momentQueries.getMomentById).mockRejectedValue(
      new Error('Request timeout')
    );

    const request = new Request('http://localhost:3000/api/sports/moments/moment123');
    const params = Promise.resolve({ id: 'moment123' });

    const response = await getMomentById(request, { params });

    expect(response.status).toBe(500);
  });

  it('should handle malformed data errors', async () => {
    vi.mocked(momentQueries.getMomentById).mockRejectedValue(
      new Error('Cannot read property of undefined')
    );

    const request = new Request('http://localhost:3000/api/sports/moments/moment123');
    const params = Promise.resolve({ id: 'moment123' });

    const response = await getMomentById(request, { params });

    expect(response.status).toBe(500);
  });
});

describe('API Caching Behavior', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call query function on each request', async () => {
    const mockMoment = {
      id: 'moment123',
      eventType: 'Goal',
    };

    vi.mocked(momentQueries.getMomentById).mockResolvedValue(mockMoment as any);

    const request1 = new Request('http://localhost:3000/api/sports/moments/moment123');
    const params1 = Promise.resolve({ id: 'moment123' });
    
    const request2 = new Request('http://localhost:3000/api/sports/moments/moment123');
    const params2 = Promise.resolve({ id: 'moment123' });

    await getMomentById(request1, { params: params1 });
    await getMomentById(request2, { params: params2 });

    // Both requests should call the query (caching happens at lower level)
    expect(momentQueries.getMomentById).toHaveBeenCalledTimes(2);
  });
});

describe('API Data Transformation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return transformed moment data', async () => {
    const mockMoment = {
      id: 'moment123',
      eventType: 'Goal',
      eventMinute: 23,
      eventSecond: 45,
      description: 'Amazing goal by Saka',
      primaryPlayer: {
        id: 'player123',
        name: 'Bukayo Saka',
      },
      team: {
        id: 'team123',
        name: 'Arsenal FC',
      },
      sport: 'soccer',
      gender: 'mens',
    };

    vi.mocked(momentQueries.getMomentById).mockResolvedValue(mockMoment as any);

    const request = new Request('http://localhost:3000/api/sports/moments/moment123');
    const params = Promise.resolve({ id: 'moment123' });

    const response = await getMomentById(request, { params });
    const data = await response.json();

    expect(data.data.id).toBe('moment123');
    expect(data.data.eventType).toBe('Goal');
    expect(data.data.primaryPlayer).toBeDefined();
    expect(data.data.team).toBeDefined();
  });

  it('should handle moments with minimal data', async () => {
    const mockMoment = {
      id: 'moment123',
      eventType: 'Event',
      eventMinute: 0,
      sport: 'soccer',
      gender: 'mens',
    };

    vi.mocked(momentQueries.getMomentById).mockResolvedValue(mockMoment as any);

    const request = new Request('http://localhost:3000/api/sports/moments/moment123');
    const params = Promise.resolve({ id: 'moment123' });

    const response = await getMomentById(request, { params });
    const data = await response.json();

    expect(data.data).toBeDefined();
    expect(data.data.id).toBe('moment123');
  });
});

describe('API Input Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle valid Salesforce IDs', async () => {
    const mockMoment = { id: 'a0X123456789012', eventType: 'Goal' };
    vi.mocked(momentQueries.getMomentById).mockResolvedValue(mockMoment as any);

    const request = new Request('http://localhost:3000/api/sports/moments/a0X123456789012');
    const params = Promise.resolve({ id: 'a0X123456789012' });

    const response = await getMomentById(request, { params });

    expect(response.status).toBe(200);
  });

  it('should handle short IDs', async () => {
    vi.mocked(momentQueries.getMomentById).mockResolvedValue(null);

    const request = new Request('http://localhost:3000/api/sports/moments/123');
    const params = Promise.resolve({ id: '123' });

    const response = await getMomentById(request, { params });

    expect(response.status).toBe(404);
  });

  it('should handle alphanumeric IDs', async () => {
    const mockMoment = { id: 'moment-abc-123', eventType: 'Goal' };
    vi.mocked(momentQueries.getMomentById).mockResolvedValue(mockMoment as any);

    const request = new Request('http://localhost:3000/api/sports/moments/moment-abc-123');
    const params = Promise.resolve({ id: 'moment-abc-123' });

    const response = await getMomentById(request, { params });

    expect(response.status).toBe(200);
  });
});

