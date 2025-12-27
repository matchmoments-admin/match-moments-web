/**
 * Raw Salesforce Types - Mirror exact Salesforce schema
 * 
 * These types use Salesforce naming conventions (__c for custom fields, __r for relationships)
 * and represent the exact structure returned from Salesforce API queries.
 */

import type { SalesforceRecord } from '@/lib/salesforce/types';

// ============================================================================
// SPORTS DATA - Core Objects
// ============================================================================

/**
 * Season__c - Global calendar season across all competitions
 */
export interface SF_Season__c extends SalesforceRecord {
  Start_Date__c?: string;
  End_Date__c?: string;
  Sport__c?: string;
  Season_Type__c?: 'Calendar Year' | 'Split Year' | 'Tournament';
}

/**
 * Competition__c - Leagues, tournaments, seasons
 */
export interface SF_Competition__c extends SalesforceRecord {
  Season__c?: string;
  ESPN_League_ID__c?: string;
  Sport__c?: string;
  Gender_Class__c?: string;
  Tier__c?: 'Level 1' | 'Level 2' | 'Level 3' | 'Cup' | 'Tournament';
  Country__c?: string;
  Competition_Type__c?: string;
  Logo_URL__c?: string;
  Status__c?: string;
  
  // Relationships
  Season__r?: SF_Season__c;
}

/**
 * Match__c - Matches, games, events
 */
export interface SF_Match__c extends SalesforceRecord {
  Home_Team__c?: string;
  Away_Team__c?: string;
  Competition__c?: string;
  Season__c?: string;
  ESPN_Event_ID__c?: string;
  Match_Date_Time__c?: string; // Correct field name
  Status__c?: string; // Correct field name
  Home_Score_Final__c?: number; // Correct field name
  Away_Score_Final__c?: number; // Correct field name
  Home_Sub_Score__c?: number;
  Away_Sub_Score__c?: number;
  Neutral_Venue__c?: boolean;
  Venue__c?: string;
  Attendance__c?: number;
  Referee__c?: string;
  Weather_Conditions__c?: string;
  Display_Score__c?: string;
  Broadcast_URL__c?: string;
  Current_Period__c?: string;
  
  // Relationships
  Home_Team__r?: SF_Account;
  Away_Team__r?: SF_Account;
  Competition__r?: SF_Competition__c;
  Season__r?: SF_Season__c;
}

/**
 * Account (Team/Organization) - Standard object with custom fields
 */
export interface SF_Account extends SalesforceRecord {
  RecordTypeId?: string;
  Type?: string;
  
  // Team fields
  ESPN_Team_ID__c?: string;
  Sport__c?: string;
  League__c?: string; // eng.1, usa.nwsl
  Gender_Class__c?: "Women's Team" | "Men's Team" | 'Mixed';
  Abbreviation__c?: string; // MCI, LAL
  Logo_Url__c?: string;
  Venue_Name__c?: string;
  Primary_Color__c?: string;
  Secondary_Color__c?: string;
  Founded_Year__c?: number;
  Total_Awards__c?: number;
  Total_Trophies__c?: number;
}

/**
 * Contact (Player/Coach/Official) - Standard object with custom fields
 */
export interface SF_Contact extends SalesforceRecord {
  RecordTypeId?: string;
  FirstName?: string;
  LastName?: string;
  Email?: string;
  Phone?: string;
  
  // Player fields
  ESPN_Player_ID__c?: string;
  Position__c?: string;
  Jersey_Number__c?: number;
  Player_Role__c?: string;
  Profile_Image_URL__c?: string;
  Date_of_Birth__c?: string;
  Nationality__c?: string;
  Height__c?: number; // Correct field name
  Weight__c?: number; // Correct field name
  Total_Awards__c?: number;
  Total_Individual_Awards__c?: number;
  Total_Team_Trophies__c?: number;
}

/**
 * Match_Period__c - Halves, quarters, innings, sets
 */
export interface SF_Match_Period__c extends SalesforceRecord {
  Match__c?: string;
  Period_Number__c?: number;
  Period_Type__c?: string;
  Home_Score__c?: number;
  Away_Score__c?: number;
  Start_Time__c?: string;
  End_Time__c?: string;
}

/**
 * Match_Event__c - Live match events feed
 */
export interface SF_Match_Event__c extends SalesforceRecord {
  Match__c?: string;
  Event_Type__c?: string;
  Event_Minute__c?: number;
  Description__c?: string;
  Event_Time__c?: string;
}

/**
 * Match_Moment__c - Shareable viral moments
 */
export interface SF_Match_Moment__c extends SalesforceRecord {
  Match__c?: string;
  Match_Period__c?: string;
  Event_Type__c?: string;
  Event_Minute__c?: number;
  Event_Second__c?: number;
  Primary_Player__c?: string;
  Secondary_Player__c?: string;
  Team__c?: string;
  Description__c?: string;
  Video_URL__c?: string;
  Public_URL__c?: string;
  Is_Shareable__c?: boolean;
  Viral_Score__c?: number;
  Share_Count__c?: number;
  View_Count__c?: number;
  Social_Share_Title__c?: string;
  
  // Relationships
  Match__r?: SF_Match__c;
  Match_Period__r?: SF_Match_Period__c;
  Primary_Player__r?: SF_Contact;
  Secondary_Player__r?: SF_Contact;
  Team__r?: SF_Account;
}

/**
 * Team_Season_Stats__c - Aggregated team performance per season
 */
export interface SF_Team_Season_Stats__c extends SalesforceRecord {
  Team__c?: string;
  Competition__c?: string;
  Season__c?: string;
  Matches_Played__c?: number;
  Wins__c?: number;
  Draws__c?: number;
  Losses__c?: number;
  Goals_For__c?: number;
  Goals_Against__c?: number;
  Goal_Difference__c?: number;
  Points__c?: number;
  Form_Last_5__c?: string;
  League_Position__c?: number;
  Home_Wins__c?: number;
  Away_Wins__c?: number;
  Clean_Sheets__c?: number;
  
  // Relationships
  Team__r?: SF_Account;
  Competition__r?: SF_Competition__c;
  Season__r?: SF_Season__c;
}

/**
 * Player_Season_Stats__c - Aggregated player performance per season
 */
export interface SF_Player_Season_Stats__c extends SalesforceRecord {
  Player__c?: string;
  Team__c?: string;
  Competition__c?: string;
  Season__c?: string;
  Appearances__c?: number;
  Starts__c?: number;
  Minutes_Played__c?: number;
  Goals__c?: number;
  Assists__c?: number;
  Yellow_Cards__c?: number;
  Red_Cards__c?: number;
  Goals_Per_90__c?: number;
  Assists_Per_90__c?: number;
  Shots__c?: number;
  Shots_On_Target__c?: number;
  Shot_Accuracy_Percentage__c?: number;
  Pass_Completion_Percentage__c?: number;
  Clean_Sheets__c?: number;
  Saves__c?: number;
  
  // Relationships
  Player__r?: SF_Contact;
  Team__r?: SF_Account;
  Competition__r?: SF_Competition__c;
  Season__r?: SF_Season__c;
}

/**
 * Article__c - News, blogs, analysis, content
 */
export interface SF_Article__c extends SalesforceRecord {
  Related_Team__c?: string; // Correct field name
  Related_Match__c?: string; // Correct field name
  Related_Player__c?: string; // Correct field name
  Heading__c?: string;
  Body__c?: string;
  Is_Published__c?: boolean;
  Article_Date__c?: string;
  Article_URL__c?: string;
  Source__c?: string;
  Sport_Type__c?: string;
  Header_Image_URL__c?: string; // Correct field name
  Reading_Time__c?: number;
  Article_Type__c?: string;
  
  // Relationships
  Related_Team__r?: SF_Account;
  Related_Match__r?: SF_Match__c;
  Related_Player__r?: SF_Contact;
}

/**
 * Award__c - Track all player achievements, trophies, medals, honors
 */
export interface SF_Award__c extends SalesforceRecord {
  Player__c?: string;
  Team__c?: string;
  Competition__c?: string;
  Season__c?: string;
  Award_Type__c?: string; // Text field
  Award_Category__c?: 'Individual Award' | 'Team Trophy' | 'Medal' | 'Selection' | 'Scoring Title' | 'Team of Season' | 'Championship Ring' | 'Hall of Fame';
  Year__c?: number;
  Season_Name__c?: string;
  Count__c?: number;
  Details__c?: string;
  Rank__c?: number;
  Sport__c?: string;
  Icon_URL__c?: string;
  Sort_Order__c?: number;
  
  // Relationships
  Player__r?: SF_Contact;
  Team__r?: SF_Account;
  Competition__r?: SF_Competition__c;
  Season__r?: SF_Season__c;
}

/**
 * Lineup__c - Team formations and starting XI
 */
export interface SF_Lineup__c extends SalesforceRecord {
  Match__c?: string;
  Team__c?: string;
  Formation__c?: string;
  Captain__c?: string;
  Starting_XI_Count__c?: number;
  Lineup_JSON__c?: string;
  
  // Relationships
  Match__r?: SF_Match__c;
  Team__r?: SF_Account;
  Captain__r?: SF_Contact;
}

/**
 * Match_Participation__c - Junction linking players to matches
 */
export interface SF_Match_Participation__c extends SalesforceRecord {
  Match__c?: string;
  Player__c?: string;
  Team__c?: string;
  Role__c?: string;
  Minutes_Played__c?: number;
  Position__c?: string;
  Jersey_Number__c?: number;
  
  // Relationships
  Match__r?: SF_Match__c;
  Player__r?: SF_Contact;
  Team__r?: SF_Account;
}

