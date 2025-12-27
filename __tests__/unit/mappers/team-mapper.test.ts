/**
 * Team Mapper Unit Tests
 * 
 * Tests for team transformation functions
 */

import { describe, it, expect } from 'vitest';
import { mapTeam, mapTeams, mapMinimalTeam } from '@/lib/mappers/team-mapper';
import { createMockTeam, createMockTeams } from '../../utils/mocks';

describe('mapTeam', () => {
  it('should map complete team data', () => {
    const sfTeam = createMockTeam();
    const result = mapTeam(sfTeam);

    expect(result).toEqual({
      id: sfTeam.Id,
      name: sfTeam.Name,
      shortName: sfTeam.Abbreviation__c,
      logoUrl: sfTeam.Logo_Url__c,
      sport: 'soccer',
      gender: 'mens',
      abbreviation: sfTeam.Abbreviation__c,
      venue: sfTeam.Venue_Name__c,
      primaryColor: sfTeam.Primary_Color__c,
      secondaryColor: sfTeam.Secondary_Color__c,
      foundedYear: sfTeam.Founded_Year__c,
    });
  });

  it('should handle missing optional fields', () => {
    const sfTeam = createMockTeam({
      Abbreviation__c: undefined,
      Logo_Url__c: undefined,
      Venue_Name__c: undefined,
      Primary_Color__c: undefined,
      Secondary_Color__c: undefined,
      Founded_Year__c: undefined,
    });

    const result = mapTeam(sfTeam);

    expect(result.shortName).toBe(sfTeam.Name); // Falls back to name
    expect(result.logoUrl).toBe('/placeholder-team.png');
    expect(result.abbreviation).toBeUndefined();
    expect(result.venue).toBeUndefined();
    expect(result.primaryColor).toBeUndefined();
    expect(result.secondaryColor).toBeUndefined();
    expect(result.foundedYear).toBeUndefined();
  });

  it('should map women\'s teams correctly', () => {
    const sfTeam = createMockTeam({
      Gender_Class__c: "Women's Team",
    });

    const result = mapTeam(sfTeam);

    expect(result.gender).toBe('womens');
  });

  it('should normalize sport names', () => {
    const sfTeam = createMockTeam({
      Sport__c: 'BASKETBALL',
    });

    const result = mapTeam(sfTeam);

    expect(result.sport).toBe('basketball');
  });

  it('should handle missing name with default', () => {
    const sfTeam = createMockTeam({
      Name: '',
    });

    const result = mapTeam(sfTeam);

    expect(result.name).toBe('Unknown Team');
    expect(result.shortName).toBe('Unknown');
  });

  it('should use abbreviation as shortName when available', () => {
    const sfTeam = createMockTeam({
      Name: 'Arsenal Football Club',
      Abbreviation__c: 'ARS',
    });

    const result = mapTeam(sfTeam);

    expect(result.shortName).toBe('ARS');
  });
});

describe('mapTeams', () => {
  it('should map array of teams', () => {
    const sfTeams = createMockTeams(3);
    const result = mapTeams(sfTeams);

    expect(result).toHaveLength(3);
    expect(result[0].id).toBe('team1');
    expect(result[1].id).toBe('team2');
    expect(result[2].id).toBe('team3');
  });

  it('should handle empty array', () => {
    const result = mapTeams([]);
    expect(result).toEqual([]);
  });

  it('should map each team correctly', () => {
    const sfTeams = createMockTeams(2);
    const result = mapTeams(sfTeams);

    result.forEach((team, index) => {
      expect(team.id).toBe(sfTeams[index].Id);
      expect(team.name).toBe(sfTeams[index].Name);
      expect(team.sport).toBe('soccer');
    });
  });
});

describe('mapMinimalTeam', () => {
  it('should map minimal team info', () => {
    const sfTeam = createMockTeam();
    const result = mapMinimalTeam(sfTeam);

    expect(result).toEqual({
      id: sfTeam.Id,
      name: sfTeam.Name,
      logoUrl: sfTeam.Logo_Url__c,
    });
  });

  it('should return undefined for undefined input', () => {
    const result = mapMinimalTeam(undefined);
    expect(result).toBeUndefined();
  });

  it('should handle missing logo URL', () => {
    const sfTeam = createMockTeam({
      Logo_Url__c: undefined,
    });

    const result = mapMinimalTeam(sfTeam);

    expect(result).toEqual({
      id: sfTeam.Id,
      name: sfTeam.Name,
      logoUrl: undefined,
    });
  });

  it('should handle missing name with default', () => {
    const sfTeam = createMockTeam({
      Name: '',
    });

    const result = mapMinimalTeam(sfTeam);

    expect(result?.name).toBe('Unknown Team');
  });
});

