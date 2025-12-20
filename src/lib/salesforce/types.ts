/**
 * Salesforce REST API Types
 * 
 * These types define the shape of Salesforce API responses and custom objects
 * used throughout the Match Moments application.
 */

// ============================================================================
// Salesforce REST API Response Types
// ============================================================================

/**
 * Standard Salesforce query response structure
 */
export interface SalesforceQueryResponse<T> {
  totalSize: number;
  done: boolean;
  records: T[];
  nextRecordsUrl?: string;
}

/**
 * Salesforce identity/user information
 */
export interface SalesforceIdentity {
  id: string;
  asserted_user: boolean;
  user_id: string;
  organization_id: string;
  username: string;
  nick_name: string;
  display_name: string;
  email: string;
  email_verified: boolean;
  first_name: string;
  last_name: string;
  timezone: string;
  photos: {
    picture: string;
    thumbnail: string;
  };
  addr_street?: string;
  addr_city?: string;
  addr_state?: string;
  addr_country?: string;
  addr_zip?: string;
  mobile_phone?: string;
  mobile_phone_verified: boolean;
  status: {
    created_date: string;
    body: string;
  };
  urls: {
    enterprise: string;
    metadata: string;
    partner: string;
    rest: string;
    sobjects: string;
    search: string;
    query: string;
    recent: string;
    tooling_soap: string;
    tooling_rest: string;
    profile: string;
    feeds: string;
    groups: string;
    users: string;
    feed_items: string;
    feed_elements: string;
    custom_domain?: string;
  };
  active: boolean;
  user_type: string;
  language: string;
  locale: string;
  utcOffset: number;
  last_modified_date: string;
  is_lightning_login_user: boolean;
}

/**
 * Salesforce error response
 */
export interface SalesforceError {
  message: string;
  errorCode: string;
  fields?: string[];
}

/**
 * JWT Bearer token response
 */
export interface JWTTokenResponse {
  access_token: string;
  scope: string;
  instance_url: string;
  id: string;
  token_type: string;
}

// ============================================================================
// Custom Salesforce Object Types
// ============================================================================

/**
 * Base Salesforce object with standard fields
 */
export interface SalesforceRecord {
  Id: string;
  Name: string;
  CreatedDate?: string;
  LastModifiedDate?: string;
  CreatedById?: string;
  LastModifiedById?: string;
}

/**
 * Team__c custom object
 */
export interface Team extends SalesforceRecord {
  Logo_URL__c?: string;
  Primary_Color__c?: string;
  Secondary_Color__c?: string;
  Sport__c?: string;
  Gender__c?: string;
  Country__c?: string;
  Founded_Year__c?: number;
  Stadium__c?: string;
}

/**
 * Competition__c custom object
 */
export interface Competition extends SalesforceRecord {
  Sport__c?: string;
  Gender__c?: string;
  Country__c?: string;
  Season__c?: string;
  Level__c?: string;
  Logo_URL__c?: string;
}

/**
 * Player__c custom object
 */
export interface Player extends SalesforceRecord {
  Photo_URL__c?: string;
  Position__c?: string;
  Jersey_Number__c?: number;
  Date_of_Birth__c?: string;
  Nationality__c?: string;
  Gender__c?: string;
  Height_cm__c?: number;
  Weight_kg__c?: number;
}

/**
 * Fixture_Period__c custom object
 */
export interface FixturePeriod extends SalesforceRecord {
  Fixture__c?: string;
  Period_Number__c?: number;
  Period_Type__c?: string;
  Home_Score_Period__c?: number;
  Away_Score_Period__c?: number;
  Home_Score_Cumulative__c?: number;
  Away_Score_Cumulative__c?: number;
  Start_Time__c?: string;
  End_Time__c?: string;
}

/**
 * Commentary_Event__c custom object
 */
export interface CommentaryEvent extends SalesforceRecord {
  Fixture__c?: string;
  Event_Minute__c?: number;
  Event_Type__c?: string;
  Description__c?: string;
  Primary_Player__c?: string;
  Primary_Player__r?: Player;
  Event_Importance__c?: string;
  Timestamp__c?: string;
}

/**
 * Fixture__c custom object with related data
 */
export interface Fixture extends SalesforceRecord {
  Fixture_DateTime__c?: string;
  Status__c?: string;
  Venue__c?: string;
  Attendance__c?: number;
  Home_Score_Final__c?: number;
  Away_Score_Final__c?: number;
  Home_Team__c?: string;
  Away_Team__c?: string;
  Competition__c?: string;
  Current_Period__c?: string;
  Season__c?: string;
  Match_Week__c?: number;
  Referee__c?: string;
  Weather_Conditions__c?: string;
  
  // Relationships
  Home_Team__r?: Team;
  Away_Team__r?: Team;
  Competition__r?: Competition;
  Current_Period__r?: FixturePeriod;
}

/**
 * Extended fixture with periods and commentary
 */
export interface FixtureDetail extends Fixture {
  periods?: FixturePeriod[];
  commentary?: CommentaryEvent[];
}

/**
 * Team_Season_Stats__c custom object
 */
export interface TeamSeasonStats extends SalesforceRecord {
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
  Position__c?: number;
  Home_Wins__c?: number;
  Away_Wins__c?: number;
  Clean_Sheets__c?: number;
  
  // Relationships
  Team__r?: Team;
  Competition__r?: Competition;
}

/**
 * Player_Season_Stats__c custom object
 */
export interface PlayerSeasonStats extends SalesforceRecord {
  Player__c?: string;
  Team__c?: string;
  Competition__c?: string;
  Season__c?: string;
  Goals__c?: number;
  Assists__c?: number;
  Appearances__c?: number;
  Minutes_Played__c?: number;
  Goals_Per_90__c?: number;
  Assists_Per_90__c?: number;
  Shots__c?: number;
  Shots_On_Target__c?: number;
  Shot_Accuracy_Percentage__c?: number;
  Pass_Completion_Percentage__c?: number;
  Yellow_Cards__c?: number;
  Red_Cards__c?: number;
  Clean_Sheets__c?: number;
  Saves__c?: number;
  
  // Relationships
  Player__r?: Player;
  Team__r?: Team;
  Competition__r?: Competition;
}

/**
 * Moment__c custom object (highlights/clips)
 */
export interface Moment extends SalesforceRecord {
  Fixture__c?: string;
  Player__c?: string;
  Moment_Type__c?: string;
  Moment_Minute__c?: number;
  Video_URL__c?: string;
  Thumbnail_URL__c?: string;
  Description__c?: string;
  Importance__c?: string;
  Duration_Seconds__c?: number;
  Views__c?: number;
  Likes__c?: number;
  
  // Relationships
  Fixture__r?: Fixture;
  Player__r?: Player;
}

/**
 * Account (Salesforce standard object)
 */
export interface Account extends SalesforceRecord {
  Type?: string;
  Industry?: string;
  AnnualRevenue?: number;
  NumberOfEmployees?: number;
  Phone?: string;
  Website?: string;
  BillingStreet?: string;
  BillingCity?: string;
  BillingState?: string;
  BillingPostalCode?: string;
  BillingCountry?: string;
}

/**
 * Opportunity (Salesforce standard object)
 */
export interface Opportunity extends SalesforceRecord {
  AccountId?: string;
  Amount?: number;
  CloseDate?: string;
  StageName?: string;
  Probability?: number;
  Type?: string;
  LeadSource?: string;
  Description?: string;
  
  // Relationships
  Account?: Account;
}

// ============================================================================
// Helper Types
// ============================================================================

/**
 * Query options for Salesforce queries
 */
export interface QueryOptions {
  limit?: number;
  offset?: number;
  includeDeleted?: boolean;
}

/**
 * Cache configuration
 */
export interface CacheConfig {
  key: string;
  ttl: number;
}
