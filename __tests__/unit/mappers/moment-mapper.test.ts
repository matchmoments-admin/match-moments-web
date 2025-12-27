/**
 * Moment Mapper Unit Tests
 * 
 * Tests for moment transformation functions
 */

import { describe, it, expect, vi } from 'vitest';
import { mapMoment, mapMoments } from '@/lib/mappers/moment-mapper';
import { createMockMoment, createMockMoments } from '../../utils/mocks';

// Mock image-utils module
vi.mock('@/lib/image-utils', () => ({
  getSportsPlaceholder: vi.fn((sport: string) => `https://placeholder.com/${sport}.jpg`),
}));

describe('mapMoment', () => {
  it('should map complete moment data', () => {
    const sfMoment = createMockMoment();
    const result = mapMoment(sfMoment);

    expect(result).toMatchObject({
      id: sfMoment.Id,
      eventType: sfMoment.Event_Type__c,
      eventMinute: sfMoment.Event_Minute__c,
      eventSecond: sfMoment.Event_Second__c,
      description: sfMoment.Description__c,
      shareTitle: sfMoment.Social_Share_Title__c,
      videoUrl: sfMoment.Video_URL__c,
      publicUrl: sfMoment.Public_URL__c,
      viralScore: sfMoment.Viral_Score__c,
      shareCount: sfMoment.Share_Count__c,
      viewCount: sfMoment.View_Count__c,
      sport: 'soccer',
      gender: 'mens',
    });

    expect(result.primaryPlayer).toBeDefined();
    expect(result.primaryPlayer?.id).toBe(sfMoment.Primary_Player__r!.Id);
    expect(result.team).toBeDefined();
    expect(result.team?.id).toBe(sfMoment.Team__r!.Id);
    expect(result.match).toBeDefined();
  });

  it('should handle missing optional fields with defaults', () => {
    const sfMoment = createMockMoment({
      Event_Type__c: undefined,
      Event_Minute__c: undefined,
      Event_Second__c: undefined,
      Description__c: undefined,
      Social_Share_Title__c: undefined,
      Video_URL__c: undefined,
      Public_URL__c: undefined,
      Viral_Score__c: undefined,
      Share_Count__c: undefined,
      View_Count__c: undefined,
    });

    const result = mapMoment(sfMoment);

    expect(result.eventType).toBe('Event');
    expect(result.eventMinute).toBe(0);
    expect(result.eventSecond).toBeUndefined();
    expect(result.description).toBe('');
    expect(result.shareTitle).toBeUndefined();
    expect(result.videoUrl).toBeUndefined();
  });

  it('should generate YouTube thumbnail from video URL', () => {
    const sfMoment = createMockMoment({
      Video_URL__c: 'https://youtube.com/watch?v=abc123',
    });

    const result = mapMoment(sfMoment);

    expect(result.thumbnailUrl).toBe('https://img.youtube.com/vi/abc123/hqdefault.jpg');
  });

  it('should use placeholder when no video URL', () => {
    const sfMoment = createMockMoment({
      Video_URL__c: undefined,
    });

    const result = mapMoment(sfMoment);

    expect(result.thumbnailUrl).toMatch(/placeholder\.com\/soccer\.jpg/);
  });

  it('should map primary player when present', () => {
    const sfMoment = createMockMoment();
    const result = mapMoment(sfMoment);

    expect(result.primaryPlayer).toBeDefined();
    expect(result.primaryPlayer?.name).toBe('Bukayo Saka');
  });

  it('should handle missing primary player', () => {
    const sfMoment = createMockMoment({
      Primary_Player__r: undefined,
    });

    const result = mapMoment(sfMoment);

    expect(result.primaryPlayer).toBeUndefined();
  });

  it('should map secondary player when present', () => {
    const sfMoment = createMockMoment({
      Secondary_Player__r: {
        Id: 'player456',
        Name: 'Martin Ødegaard',
        FirstName: 'Martin',
        LastName: 'Ødegaard',
      },
    });

    const result = mapMoment(sfMoment);

    expect(result.secondaryPlayer).toBeDefined();
    expect(result.secondaryPlayer?.id).toBe('player456');
    expect(result.secondaryPlayer?.name).toBe('Martin Ødegaard');
  });

  it('should handle missing secondary player', () => {
    const sfMoment = createMockMoment({
      Secondary_Player__r: null,
    });

    const result = mapMoment(sfMoment);

    expect(result.secondaryPlayer).toBeUndefined();
  });

  it('should map match context', () => {
    const sfMoment = createMockMoment();
    const result = mapMoment(sfMoment);

    expect(result.match).toEqual({
      id: sfMoment.Match__r!.Id,
      homeTeam: 'Arsenal FC',
      awayTeam: 'Chelsea FC',
      competition: 'Premier League',
    });
  });

  it('should handle missing match context gracefully', () => {
    const sfMoment = createMockMoment({
      Match__r: {
        ...createMockMoment().Match__r!,
        Id: undefined as any,
        Home_Team__r: undefined,
        Away_Team__r: undefined,
        Competition__r: undefined,
      },
    });

    const result = mapMoment(sfMoment);

    expect(result.match).toEqual({
      id: '',
      homeTeam: '',
      awayTeam: '',
      competition: '',
    });
  });

  it('should extract sport from match competition', () => {
    const sfMoment = createMockMoment();
    sfMoment.Match__r!.Competition__r!.Sport__c = 'Basketball';

    const result = mapMoment(sfMoment);

    expect(result.sport).toBe('basketball');
  });

  it('should extract gender from match home team', () => {
    const sfMoment = createMockMoment();
    // Gender comes from team, not competition (Competition__c doesn't have Gender_Class__c)
    sfMoment.Match__r!.Home_Team__r!.Gender_Class__c = "Women's Team";

    const result = mapMoment(sfMoment);

    expect(result.gender).toBe('womens');
  });

  it('should default sport to soccer when missing', () => {
    const sfMoment = createMockMoment({
      Match__r: {
        ...createMockMoment().Match__r!,
        Competition__r: {
          ...createMockMoment().Match__r!.Competition__r!,
          Sport__c: undefined,
        },
      },
    });

    const result = mapMoment(sfMoment);

    expect(result.sport).toBe('soccer');
  });

  it('should map team information', () => {
    const sfMoment = createMockMoment();
    const result = mapMoment(sfMoment);

    expect(result.team).toBeDefined();
    expect(result.team?.id).toBe(sfMoment.Team__r!.Id);
    expect(result.team?.name).toBe(sfMoment.Team__r!.Name);
  });

  it('should handle different event types', () => {
    const eventTypes = ['Goal', 'Save', 'Card', 'Substitution', 'Injury'];

    eventTypes.forEach(eventType => {
      const sfMoment = createMockMoment({
        Event_Type__c: eventType,
      });

      const result = mapMoment(sfMoment);

      expect(result.eventType).toBe(eventType);
    });
  });

  it('should handle event timing correctly', () => {
    const sfMoment = createMockMoment({
      Event_Minute__c: 45,
      Event_Second__c: 30,
    });

    const result = mapMoment(sfMoment);

    expect(result.eventMinute).toBe(45);
    expect(result.eventSecond).toBe(30);
  });

  it('should handle viral scores', () => {
    const sfMoment = createMockMoment({
      Viral_Score__c: 95,
      Share_Count__c: 5000,
      View_Count__c: 250000,
    });

    const result = mapMoment(sfMoment);

    expect(result.viralScore).toBe(95);
    expect(result.shareCount).toBe(5000);
    expect(result.viewCount).toBe(250000);
  });
});

describe('mapMoments', () => {
  it('should map array of moments', () => {
    const sfMoments = createMockMoments(3);
    const result = mapMoments(sfMoments);

    expect(result).toHaveLength(3);
    expect(result[0].id).toBe('moment1');
    expect(result[1].id).toBe('moment2');
    expect(result[2].id).toBe('moment3');
  });

  it('should handle empty array', () => {
    const result = mapMoments([]);
    expect(result).toEqual([]);
  });

  it('should map each moment correctly', () => {
    const sfMoments = createMockMoments(2);
    const result = mapMoments(sfMoments);

    result.forEach((moment, index) => {
      expect(moment.id).toBe(sfMoments[index].Id);
      expect(moment.eventType).toBeDefined();
      expect(moment.sport).toBe('soccer');
    });
  });

  it('should preserve moment order', () => {
    const sfMoments = createMockMoments(5);
    const result = mapMoments(sfMoments);

    result.forEach((moment, index) => {
      expect(moment.eventMinute).toBe((index + 1) * 10);
    });
  });
});

