/**
 * Helper Functions Unit Tests
 * 
 * Tests for mapper utility functions
 */

import { describe, it, expect } from 'vitest';
import {
  mapGenderClass,
  mapMatchStatus,
  getTierNumber,
  ensureDateObject,
  isMatchLive,
  normalizeSportName,
  getFallback,
  getPlayerFullName,
  extractYouTubeId,
  generateVideoThumbnail,
  formatSalesforceDate,
} from '@/lib/mappers/helpers';

describe('mapGenderClass', () => {
  it('should map "Women\'s Team" to "womens"', () => {
    expect(mapGenderClass("Women's Team")).toBe('womens');
  });

  it('should map "Men\'s Team" to "mens"', () => {
    expect(mapGenderClass("Men's Team")).toBe('mens');
  });

  it('should return "mixed" for unknown values', () => {
    expect(mapGenderClass('Unknown')).toBe('mixed');
    expect(mapGenderClass('Co-ed')).toBe('mixed');
  });

  it('should return "mixed" for undefined', () => {
    expect(mapGenderClass(undefined)).toBe('mixed');
  });

  it('should return "mixed" for empty string', () => {
    expect(mapGenderClass('')).toBe('mixed');
  });
});

describe('mapMatchStatus', () => {
  it('should map live statuses to "live"', () => {
    expect(mapMatchStatus('Live')).toBe('live');
    expect(mapMatchStatus('Live - In Progress')).toBe('live');
    expect(mapMatchStatus('First Half')).toBe('live');
    expect(mapMatchStatus('Second Half')).toBe('live');
  });

  it('should map halftime statuses', () => {
    expect(mapMatchStatus('Halftime')).toBe('halftime');
    expect(mapMatchStatus('Half Time')).toBe('halftime');
  });

  it('should map finished statuses', () => {
    expect(mapMatchStatus('Completed')).toBe('finished');
    expect(mapMatchStatus('Finished')).toBe('finished');
    expect(mapMatchStatus('Full Time')).toBe('finished');
  });

  it('should map postponed status', () => {
    expect(mapMatchStatus('Postponed')).toBe('postponed');
  });

  it('should map cancelled statuses', () => {
    expect(mapMatchStatus('Cancelled')).toBe('cancelled');
    expect(mapMatchStatus('Canceled')).toBe('cancelled');
  });

  it('should default to "scheduled"', () => {
    expect(mapMatchStatus('Scheduled')).toBe('scheduled');
    expect(mapMatchStatus('Upcoming')).toBe('scheduled');
    expect(mapMatchStatus(undefined)).toBe('scheduled');
    expect(mapMatchStatus('')).toBe('scheduled');
  });

  it('should be case-insensitive', () => {
    expect(mapMatchStatus('LIVE')).toBe('live');
    expect(mapMatchStatus('completed')).toBe('finished');
    expect(mapMatchStatus('HalfTime')).toBe('halftime');
  });
});

describe('getTierNumber', () => {
  it('should extract tier number from string', () => {
    expect(getTierNumber('Tier 1')).toBe(1);
    expect(getTierNumber('Tier 2')).toBe(2);
    expect(getTierNumber('Tier 10')).toBe(10);
  });

  it('should extract number from different formats', () => {
    expect(getTierNumber('1st Tier')).toBe(1);
    expect(getTierNumber('Division 3')).toBe(3);
  });

  it('should return 1 for undefined', () => {
    expect(getTierNumber(undefined)).toBe(1);
  });

  it('should return 1 when no number found', () => {
    expect(getTierNumber('Premier')).toBe(1);
    expect(getTierNumber('Championship')).toBe(1);
  });
});

describe('ensureDateObject', () => {
  it('should convert ISO string to Date', () => {
    const result = ensureDateObject('2024-01-15T15:00:00.000Z');
    expect(result).toBeInstanceOf(Date);
    expect(result.getFullYear()).toBe(2024);
    expect(result.getMonth()).toBe(0); // January is 0
    expect(result.getDate()).toBe(15);
  });

  it('should handle various date formats', () => {
    expect(ensureDateObject('2024-01-15')).toBeInstanceOf(Date);
    expect(ensureDateObject('01/15/2024')).toBeInstanceOf(Date);
  });

  it('should return current date for undefined', () => {
    const result = ensureDateObject(undefined);
    expect(result).toBeInstanceOf(Date);
    expect(result.getTime()).toBeCloseTo(Date.now(), -2); // Within ~100ms
  });

  it('should return current date for empty string', () => {
    const result = ensureDateObject('');
    expect(result).toBeInstanceOf(Date);
  });
});

describe('formatSalesforceDate', () => {
  it('should format date string to locale date', () => {
    const result = formatSalesforceDate('2024-01-15T15:00:00.000Z');
    expect(result).toBeTruthy();
    expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/); // Match MM/DD/YYYY or similar
  });

  it('should return empty string for undefined', () => {
    expect(formatSalesforceDate(undefined)).toBe('');
  });

  it('should return empty string for empty string', () => {
    expect(formatSalesforceDate('')).toBe('');
  });
});

describe('isMatchLive', () => {
  it('should return true for live status', () => {
    expect(isMatchLive('live')).toBe(true);
  });

  it('should return true for halftime status', () => {
    expect(isMatchLive('halftime')).toBe(true);
  });

  it('should return false for other statuses', () => {
    expect(isMatchLive('finished')).toBe(false);
    expect(isMatchLive('scheduled')).toBe(false);
    expect(isMatchLive('postponed')).toBe(false);
    expect(isMatchLive('cancelled')).toBe(false);
  });
});

describe('normalizeSportName', () => {
  it('should convert to lowercase', () => {
    expect(normalizeSportName('Soccer')).toBe('soccer');
    expect(normalizeSportName('BASKETBALL')).toBe('basketball');
    expect(normalizeSportName('Football')).toBe('football');
  });

  it('should default to "soccer" for undefined', () => {
    expect(normalizeSportName(undefined)).toBe('soccer');
  });

  it('should handle already lowercase names', () => {
    expect(normalizeSportName('soccer')).toBe('soccer');
  });
});

describe('getFallback', () => {
  it('should return value when defined', () => {
    expect(getFallback('test', 'fallback')).toBe('test');
    expect(getFallback(0, 10)).toBe(0);
    expect(getFallback(false, true)).toBe(false);
  });

  it('should return fallback when undefined', () => {
    expect(getFallback(undefined, 'fallback')).toBe('fallback');
  });

  it('should not treat null as undefined', () => {
    expect(getFallback(null, 'fallback')).toBe(null);
  });
});

describe('getPlayerFullName', () => {
  it('should return name when provided', () => {
    expect(getPlayerFullName('John', 'Doe', 'John Doe Jr.')).toBe('John Doe Jr.');
  });

  it('should combine first and last name', () => {
    expect(getPlayerFullName('John', 'Doe')).toBe('John Doe');
  });

  it('should return last name only', () => {
    expect(getPlayerFullName(undefined, 'Doe')).toBe('Doe');
  });

  it('should return first name only', () => {
    expect(getPlayerFullName('John', undefined)).toBe('John');
  });

  it('should return "Unknown Player" when all undefined', () => {
    expect(getPlayerFullName(undefined, undefined, undefined)).toBe('Unknown Player');
  });

  it('should handle empty strings', () => {
    expect(getPlayerFullName('', '', '')).toBe('Unknown Player');
  });
});

describe('extractYouTubeId', () => {
  it('should extract from watch URL', () => {
    expect(extractYouTubeId('https://youtube.com/watch?v=abc123')).toBe('abc123');
    expect(extractYouTubeId('https://www.youtube.com/watch?v=xyz789')).toBe('xyz789');
  });

  it('should extract from short URL', () => {
    expect(extractYouTubeId('https://youtu.be/abc123')).toBe('abc123');
  });

  it('should extract from embed URL', () => {
    expect(extractYouTubeId('https://youtube.com/embed/abc123')).toBe('abc123');
    expect(extractYouTubeId('https://www.youtube.com/embed/xyz789')).toBe('xyz789');
  });

  it('should handle URLs with additional parameters', () => {
    expect(extractYouTubeId('https://youtube.com/watch?v=abc123&t=30s')).toBe('abc123');
  });

  it('should return null for non-YouTube URLs', () => {
    expect(extractYouTubeId('https://vimeo.com/123456')).toBeNull();
    expect(extractYouTubeId('https://example.com')).toBeNull();
  });

  it('should return null for invalid URLs', () => {
    expect(extractYouTubeId('')).toBeNull();
    expect(extractYouTubeId('not a url')).toBeNull();
  });
});

describe('generateVideoThumbnail', () => {
  it('should generate YouTube thumbnail URL', () => {
    const result = generateVideoThumbnail(
      'https://youtube.com/watch?v=abc123',
      'https://example.com/fallback.jpg'
    );
    expect(result).toBe('https://img.youtube.com/vi/abc123/hqdefault.jpg');
  });

  it('should use fallback for non-YouTube URLs', () => {
    const fallback = 'https://example.com/fallback.jpg';
    const result = generateVideoThumbnail('https://vimeo.com/123', fallback);
    expect(result).toBe(fallback);
  });

  it('should handle short YouTube URLs', () => {
    const result = generateVideoThumbnail(
      'https://youtu.be/xyz789',
      'https://example.com/fallback.jpg'
    );
    expect(result).toBe('https://img.youtube.com/vi/xyz789/hqdefault.jpg');
  });
});

