/**
 * Match Mapper Unit Tests
 * 
 * Tests for match transformation functions
 */

import { describe, it, expect } from 'vitest';
import { mapMatch, mapMatches, mapMinimalMatch } from '@/lib/mappers/match-mapper';
import { createMockMatch, createMockMatches, createMockTeam, createMockCompetition } from '../../utils/mocks';

describe('mapMatch', () => {
  it('should map complete match data', () => {
    const sfMatch = createMockMatch();
    const result = mapMatch(sfMatch);

    expect(result).toMatchObject({
      id: sfMatch.Id,
      homeScore: sfMatch.Home_Score_Final__c,
      awayScore: sfMatch.Away_Score_Final__c,
      status: 'finished',
      venue: sfMatch.Venue__c,
      attendance: sfMatch.Attendance__c,
      isNeutralVenue: false,
      referee: sfMatch.Referee__c,
    });

    expect(result.homeTeam.id).toBe(sfMatch.Home_Team__r!.Id);
    expect(result.awayTeam.id).toBe(sfMatch.Away_Team__r!.Id);
    expect(result.competition.id).toBe(sfMatch.Competition__r!.Id);
    expect(result.matchDate).toBeInstanceOf(Date);
  });

  it('should throw error when missing required relationships', () => {
    const sfMatch = createMockMatch({
      Home_Team__r: undefined,
    });

    expect(() => mapMatch(sfMatch)).toThrow(
      'must include Home_Team__r, Away_Team__r, and Competition__r'
    );
  });

  it('should throw error when missing away team', () => {
    const sfMatch = createMockMatch({
      Away_Team__r: undefined,
    });

    expect(() => mapMatch(sfMatch)).toThrow();
  });

  it('should throw error when missing competition', () => {
    const sfMatch = createMockMatch({
      Competition__r: undefined,
    });

    expect(() => mapMatch(sfMatch)).toThrow();
  });

  it('should handle null scores with default 0', () => {
    const sfMatch = createMockMatch({
      Home_Score_Final__c: null,
      Away_Score_Final__c: null,
    });

    const result = mapMatch(sfMatch);

    expect(result.homeScore).toBe(0);
    expect(result.awayScore).toBe(0);
  });

  it('should map live match correctly', () => {
    const sfMatch = createMockMatch({
      Status__c: 'Live - In Progress',
    });

    const result = mapMatch(sfMatch);

    expect(result.status).toBe('live');
    expect(result.isLive).toBe(true);
  });

  it('should map halftime match correctly', () => {
    const sfMatch = createMockMatch({
      Status__c: 'Halftime',
    });

    const result = mapMatch(sfMatch);

    expect(result.status).toBe('halftime');
    expect(result.isLive).toBe(true);
  });

  it('should map scheduled match correctly', () => {
    const sfMatch = createMockMatch({
      Status__c: 'Scheduled',
      Home_Score_Final__c: null,
      Away_Score_Final__c: null,
    });

    const result = mapMatch(sfMatch);

    expect(result.status).toBe('scheduled');
    expect(result.isLive).toBe(false);
  });

  it('should handle neutral venue', () => {
    const sfMatch = createMockMatch({
      Neutral_Venue__c: true,
    });

    const result = mapMatch(sfMatch);

    expect(result.isNeutralVenue).toBe(true);
  });

  it('should include sport and gender from competition', () => {
    const sfMatch = createMockMatch({
      Competition__r: createMockCompetition({
        Sport__c: 'Basketball',
        Gender_Class__c: "Women's Team",
      }),
    });

    const result = mapMatch(sfMatch);

    expect(result.sport).toBe('basketball');
    expect(result.gender).toBe('womens');
  });

  it('should handle optional fields', () => {
    const sfMatch = createMockMatch({
      Venue__c: undefined,
      Attendance__c: undefined,
      Referee__c: undefined,
      Broadcast_URL__c: undefined,
      Home_Sub_Score__c: undefined,
      Away_Sub_Score__c: undefined,
    });

    const result = mapMatch(sfMatch);

    expect(result.venue).toBeUndefined();
    expect(result.attendance).toBeUndefined();
    expect(result.referee).toBeUndefined();
    expect(result.broadcastUrl).toBeUndefined();
    expect(result.homeSubScore).toBeUndefined();
    expect(result.awaySubScore).toBeUndefined();
  });

  it('should handle sub-scores for sports like basketball', () => {
    const sfMatch = createMockMatch({
      Home_Sub_Score__c: '25-22-28-30',
      Away_Sub_Score__c: '20-25-26-24',
    });

    const result = mapMatch(sfMatch);

    expect(result.homeSubScore).toBe('25-22-28-30');
    expect(result.awaySubScore).toBe('20-25-26-24');
  });
});

describe('mapMatches', () => {
  it('should map array of matches', () => {
    const sfMatches = createMockMatches(3);
    const result = mapMatches(sfMatches);

    expect(result).toHaveLength(3);
    expect(result[0].id).toBe('match1');
    expect(result[1].id).toBe('match2');
    expect(result[2].id).toBe('match3');
  });

  it('should handle empty array', () => {
    const result = mapMatches([]);
    expect(result).toEqual([]);
  });

  it('should filter out matches with missing relationships', () => {
    const sfMatches = [
      createMockMatch({ Id: 'match1' }),
      createMockMatch({ Id: 'match2', Home_Team__r: undefined }), // Invalid
      createMockMatch({ Id: 'match3' }),
      createMockMatch({ Id: 'match4', Competition__r: undefined }), // Invalid
    ];

    const result = mapMatches(sfMatches);

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('match1');
    expect(result[1].id).toBe('match3');
  });

  it('should map each match correctly', () => {
    const sfMatches = createMockMatches(2);
    const result = mapMatches(sfMatches);

    result.forEach((match, index) => {
      expect(match.id).toBe(sfMatches[index].Id);
      expect(match.homeTeam).toBeDefined();
      expect(match.awayTeam).toBeDefined();
      expect(match.competition).toBeDefined();
    });
  });
});

describe('mapMinimalMatch', () => {
  it('should map minimal match info', () => {
    const sfMatch = createMockMatch();
    const result = mapMinimalMatch(sfMatch);

    expect(result).toEqual({
      id: sfMatch.Id,
      name: sfMatch.Name,
    });
  });

  it('should return undefined for undefined input', () => {
    const result = mapMinimalMatch(undefined);
    expect(result).toBeUndefined();
  });

  it('should handle missing name with default', () => {
    const sfMatch = createMockMatch({
      Name: '',
    });

    const result = mapMinimalMatch(sfMatch);

    expect(result?.name).toBe('Unknown Match');
  });
});

