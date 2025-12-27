/**
 * Mock Data
 * 
 * Salesforce record mocks for testing
 */

import type { SF_Account, SF_Match__c, SF_Match_Moment__c, SF_Competition__c, SF_Contact } from '@/types/salesforce/raw';

/**
 * Mock Salesforce Account (Team)
 */
export const createMockTeam = (overrides?: Partial<SF_Account>): SF_Account => ({
  Id: 'team123',
  Name: 'Arsenal FC',
  Abbreviation__c: 'ARS',
  Logo_Url__c: 'https://example.com/arsenal.png',
  Sport__c: 'Soccer',
  Gender_Class__c: "Men's Team",
  Venue_Name__c: 'Emirates Stadium',
  Primary_Color__c: '#EF0107',
  Secondary_Color__c: '#023474',
  Founded_Year__c: 1886,
  ...overrides,
});

/**
 * Mock Salesforce Competition
 */
export const createMockCompetition = (overrides?: Partial<SF_Competition__c>): SF_Competition__c => ({
  Id: 'comp123',
  Name: 'Premier League',
  Competition_Code__c: 'EPL',
  Sport__c: 'Soccer',
  Gender_Class__c: "Men's Team",
  Country__c: 'England',
  Tier__c: 'Tier 1',
  Competition_Type__c: 'League',
  Logo_URL__c: 'https://example.com/epl.png',
  ...overrides,
});

/**
 * Mock Salesforce Contact (Player)
 */
export const createMockPlayer = (overrides?: Partial<SF_Contact>): SF_Contact => ({
  Id: 'player123',
  Name: 'Bukayo Saka',
  FirstName: 'Bukayo',
  LastName: 'Saka',
  Profile_Image_URL__c: 'https://example.com/saka.png',
  Jersey_Number__c: '7',
  Position__c: 'Forward',
  Date_of_Birth__c: '2001-09-05',
  Nationality__c: 'England',
  Height_cm__c: 178,
  Weight_kg__c: 72,
  ...overrides,
});

/**
 * Mock Salesforce Match
 */
export const createMockMatch = (overrides?: Partial<SF_Match__c>): SF_Match__c => ({
  Id: 'match123',
  Name: 'Arsenal vs Chelsea',
  Match_Date_Time__c: '2024-01-15T15:00:00.000Z',
  Status__c: 'Completed',
  Home_Score_Final__c: 2,
  Away_Score_Final__c: 1,
  Home_Sub_Score__c: null,
  Away_Sub_Score__c: null,
  Venue__c: 'Emirates Stadium',
  Attendance__c: 60000,
  Neutral_Venue__c: false,
  Referee__c: 'Michael Oliver',
  Broadcast_URL__c: null,
  Home_Team__r: createMockTeam(),
  Away_Team__r: createMockTeam({
    Id: 'team456',
    Name: 'Chelsea FC',
    Abbreviation__c: 'CHE',
    Logo_Url__c: 'https://example.com/chelsea.png',
    Primary_Color__c: '#034694',
  }),
  Competition__r: createMockCompetition(),
  ...overrides,
});

/**
 * Mock Salesforce Match Moment
 */
export const createMockMoment = (overrides?: Partial<SF_Match_Moment__c>): SF_Match_Moment__c => ({
  Id: 'moment123',
  Name: 'Saka Goal - 23\'',
  Event_Type__c: 'Goal',
  Event_Minute__c: 23,
  Event_Second__c: 45,
  Description__c: 'Brilliant solo goal by Bukayo Saka',
  Social_Share_Title__c: '⚽ Bukayo Saka with a stunning goal!',
  Video_URL__c: 'https://youtube.com/watch?v=abc123',
  Public_URL__c: 'https://example.com/moment/123',
  Is_Shareable__c: true,
  Viral_Score__c: 85,
  Share_Count__c: 1500,
  View_Count__c: 50000,
  Primary_Player__r: createMockPlayer(),
  Secondary_Player__r: null,
  Team__r: createMockTeam(),
  Match__r: createMockMatch(),
  Match_Period__r: {
    Period_Type__c: 'First Half',
    Period_Number__c: 1,
  },
  ...overrides,
});

/**
 * Create multiple mock teams
 */
export const createMockTeams = (count: number): SF_Account[] => {
  return Array.from({ length: count }, (_, i) => 
    createMockTeam({
      Id: `team${i + 1}`,
      Name: `Team ${i + 1}`,
      Abbreviation__c: `T${i + 1}`,
    })
  );
};

/**
 * Create multiple mock matches
 */
export const createMockMatches = (count: number): SF_Match__c[] => {
  return Array.from({ length: count }, (_, i) => 
    createMockMatch({
      Id: `match${i + 1}`,
      Name: `Match ${i + 1}`,
    })
  );
};

/**
 * Create multiple mock moments
 */
export const createMockMoments = (count: number): SF_Match_Moment__c[] => {
  return Array.from({ length: count }, (_, i) => 
    createMockMoment({
      Id: `moment${i + 1}`,
      Name: `Moment ${i + 1}`,
      Event_Minute__c: (i + 1) * 10,
    })
  );
};

