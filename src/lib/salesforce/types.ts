/**
 * Salesforce REST API Types
 * 
 * Complete type definitions for all 25 Salesforce objects in the Match Moments Sports CRM.
 * Matches the final data model with correct field names and relationships.
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
// Base Salesforce Record
// ============================================================================

/**
 * Base Salesforce object with standard fields
 */
export interface SalesforceRecord {
  Id: string;
  Name?: string;
  CreatedDate?: string;
  LastModifiedDate?: string;
  CreatedById?: string;
  LastModifiedById?: string;
}

// ============================================================================
// STANDARD OBJECTS (Extended with Custom Fields)
// ============================================================================

/**
 * Account - Teams, Organizations, Customers, Sponsors (Polymorphic)
 * Record Types: Club_Team, National_Team, Organizing_Body, Customer
 */
export interface Account extends SalesforceRecord {
  // Standard Account fields
  RecordTypeId?: string;
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
  
  // Custom fields for Teams
  ESPN_Team_ID__c?: string; // External ID
  Sport__c?: string;
  League__c?: string; // eng.1, usa.nwsl, etc.
  Gender_Class__c?: string; // Men's Team, Women's Team, Mixed
  Abbreviation__c?: string; // MCI, LAL, NYY
  Logo_Url__c?: string;
  Venue_Name__c?: string;
  Primary_Color__c?: string;
  Secondary_Color__c?: string;
  Founded_Year__c?: number;
  
  // Custom fields for Revenue customers
  Account_Type__c?: string;
  Total_MRR__c?: number;
  Total_ARR__c?: number;
  Lifetime_Value__c?: number;
  Customer_Since__c?: string;
  
  // Rollup fields
  Total_Awards__c?: number;
  Total_Trophies__c?: number;
}

/**
 * Contact - Players, Coaches, Officials, Customers (Polymorphic)
 * Record Types: Player, Manager_Coach, Match_Official, Customer_Contact
 */
export interface Contact extends SalesforceRecord {
  // Standard Contact fields
  RecordTypeId?: string;
  FirstName?: string;
  LastName?: string;
  Email?: string;
  Phone?: string;
  
  // Custom fields for Players
  ESPN_Player_ID__c?: string; // External ID
  Position__c?: string;
  Jersey_Number__c?: number;
  Player_Role__c?: string;
  Profile_Image_URL__c?: string;
  Date_of_Birth__c?: string;
  Nationality__c?: string;
  Height_cm__c?: number;
  Weight_kg__c?: number;
  
  // Rollup fields
  Total_Awards__c?: number;
  Total_Individual_Awards__c?: number;
  Total_Team_Trophies__c?: number;
}

/**
 * Opportunity - Sales deals, subscriptions, sponsorships
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
  
  // Custom fields
  Opportunity_Type__c?: string; // Subscription, Sponsorship, Media, API
  Gender_Focus__c?: string; // Men's, Women's, Both
  Sport_Type__c?: string;
  MRR__c?: number;
  ARR__c?: number;
  Contract_Term__c?: number;
  Payment_Frequency__c?: string;
  Churn_Risk__c?: string;
  Auto_Renew__c?: boolean;
  
  // Relationships
  Account?: Account;
}

/**
 * Lead - Prospective customers
 */
export interface Lead extends SalesforceRecord {
  FirstName?: string;
  LastName?: string;
  Company?: string;
  Email?: string;
  Phone?: string;
  Status?: string;
  
  // Custom fields
  Lead_Type__c?: string;
  Gender_Focus__c?: string;
  Sport_Type__c?: string;
  Creator_Type__c?: string;
  League_Name__c?: string;
  Team_Name__c?: string;
  Lead_Score__c?: number;
}

// ============================================================================
// CUSTOM OBJECTS - SPORTS DATA
// ============================================================================

/**
 * Season__c - Global calendar season across all competitions
 */
export interface Season extends SalesforceRecord {
  Start_Date__c?: string;
  End_Date__c?: string;
  Sport__c?: string;
  Season_Type__c?: string; // Calendar Year, Split Year, Tournament
}

/**
 * Competition__c - Leagues, tournaments, seasons
 */
export interface Competition extends SalesforceRecord {
  Season__c?: string; // Lookup to Season__c
  ESPN_League_ID__c?: string; // External ID
  Competition_Name__c?: string;
  Sport__c?: string;
  Gender_Class__c?: string;
  Tier__c?: string; // Level 1, Level 2, Level 3, Cup, Tournament
  Country__c?: string;
  Competition_Type__c?: string;
  Logo_URL__c?: string;
  
  // Relationships
  Season__r?: Season;
}

/**
 * Match__c - Matches, games, events (formerly Fixture__c)
 */
export interface Match extends SalesforceRecord {
  Home_Team__c?: string; // Lookup to Account
  Away_Team__c?: string; // Lookup to Account
  Competition__c?: string; // Lookup to Competition__c
  Season__c?: string; // Lookup to Season__c
  ESPN_Event_ID__c?: string; // External ID
  Match_Date__c?: string;
  Match_Status__c?: string;
  Home_Score__c?: number;
  Away_Score__c?: number;
  Neutral_Venue__c?: boolean;
  Venue__c?: string;
  Attendance__c?: number;
  Match_Week__c?: number;
  Referee__c?: string;
  Weather_Conditions__c?: string;
  
  // Relationships
  Home_Team__r?: Account;
  Away_Team__r?: Account;
  Competition__r?: Competition;
  Season__r?: Season;
}

/**
 * Match_Period__c - Halves, quarters, innings, sets (formerly Fixture_Period__c)
 */
export interface MatchPeriod extends SalesforceRecord {
  Match__c?: string; // Master-Detail to Match__c
  Period_Number__c?: number;
  Period_Type__c?: string; // Half, Quarter, Inning, Set
  Home_Score__c?: number;
  Away_Score__c?: number;
  Start_Time__c?: string;
  End_Time__c?: string;
}

/**
 * Match_Event__c - Live match events feed (formerly Live_Feed__c)
 */
export interface MatchEvent extends SalesforceRecord {
  Match__c?: string; // Lookup to Match__c
  Event_Type__c?: string;
  Event_Minute__c?: number;
  Description__c?: string;
  Event_Time__c?: string;
}

/**
 * Match_Moment__c - Shareable viral moments (formerly Commentary_Event__c)
 */
export interface MatchMoment extends SalesforceRecord {
  Match__c?: string; // Lookup to Match__c
  Match_Period__c?: string; // Lookup to Match_Period__c
  Event_Type__c?: string;
  Event_Minute__c?: number;
  Event_Second__c?: number;
  Primary_Player__c?: string; // Lookup to Contact
  Secondary_Player__c?: string; // Lookup to Contact
  Team__c?: string; // Lookup to Account
  Description__c?: string;
  Video_URL__c?: string;
  Public_URL__c?: string;
  Is_Shareable__c?: boolean;
  Viral_Score__c?: number;
  Share_Count__c?: number;
  View_Count__c?: number;
  Social_Share_Title__c?: string;
  
  // Relationships
  Match__r?: Match;
  Match_Period__r?: MatchPeriod;
  Primary_Player__r?: Contact;
  Secondary_Player__r?: Contact;
  Team__r?: Account;
}

/**
 * Match_Participation__c - Junction object linking players to matches
 */
export interface MatchParticipation extends SalesforceRecord {
  Match__c?: string; // Lookup to Match__c
  Player__c?: string; // Lookup to Contact
  Team__c?: string; // Lookup to Account
  Role__c?: string; // Starter, Substitute, Manager, Referee
  Minutes_Played__c?: number;
  Position__c?: string;
  Jersey_Number__c?: number;
  
  // Relationships
  Match__r?: Match;
  Player__r?: Contact;
  Team__r?: Account;
}

/**
 * Lineup__c - Team formations and starting XI
 */
export interface Lineup extends SalesforceRecord {
  Match__c?: string; // Master-Detail to Match__c
  Team__c?: string; // Lookup to Account
  Formation__c?: string; // 4-3-3, 4-4-2, etc.
  Captain__c?: string; // Lookup to Contact
  Starting_XI_Count__c?: number;
  Lineup_JSON__c?: string; // Long Text - Full lineup data
  
  // Relationships
  Match__r?: Match;
  Team__r?: Account;
  Captain__r?: Contact;
}

/**
 * Team_Membership__c - Historical record of player-team relationships
 */
export interface TeamMembership extends SalesforceRecord {
  Player__c?: string; // Master-Detail to Contact
  Team__c?: string; // Lookup to Account
  Start_Date__c?: string;
  End_Date__c?: string;
  Status__c?: string; // Active, Former, On Loan
  Jersey_Number__c?: number;
  Position__c?: string;
  Transfer_Fee__c?: number;
  Loan_Fee__c?: number;
  
  // Relationships
  Player__r?: Contact;
  Team__r?: Account;
}

/**
 * Team_Season_Stats__c - Aggregated team performance per season
 */
export interface TeamSeasonStats extends SalesforceRecord {
  Team__c?: string; // Lookup to Account
  Competition__c?: string; // Lookup to Competition__c
  Season__c?: string; // Lookup to Season__c
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
  Team__r?: Account;
  Competition__r?: Competition;
  Season__r?: Season;
}

/**
 * Player_Season_Stats__c - Aggregated player performance per season
 */
export interface PlayerSeasonStats extends SalesforceRecord {
  Player__c?: string; // Lookup to Contact
  Team__c?: string; // Lookup to Account
  Competition__c?: string; // Lookup to Competition__c
  Season__c?: string; // Lookup to Season__c
  Appearances__c?: number;
  Starts__c?: number;
  Minutes_Played__c?: number;
  Goals__c?: number;
  Assists__c?: number;
  Yellow_Cards__c?: number;
  Red_Cards__c?: number;
  Goals_Per_90__c?: number; // Formula
  Assists_Per_90__c?: number; // Formula
  Shots__c?: number;
  Shots_On_Target__c?: number;
  Shot_Accuracy_Percentage__c?: number;
  Pass_Completion_Percentage__c?: number;
  Clean_Sheets__c?: number;
  Saves__c?: number;
  
  // Relationships
  Player__r?: Contact;
  Team__r?: Account;
  Competition__r?: Competition;
  Season__r?: Season;
}

/**
 * Award__c - Track all player achievements, trophies, medals, honors
 */
export interface Award extends SalesforceRecord {
  Player__c?: string; // Lookup to Contact
  Team__c?: string; // Lookup to Account
  Competition__c?: string; // Lookup to Competition__c
  Season__c?: string; // Lookup to Season__c
  Award_Type__c?: string; // Text field - "Player of the Year", "Golden Boot", etc.
  Award_Category__c?: string; // Individual Award, Team Trophy, Medal, Selection, etc.
  Year__c?: number;
  Season_Name__c?: string; // Display name - "19/20", "2024"
  Count__c?: number; // For "2x Winner"
  Details__c?: string; // Achievement details - "8 Goals", "2025, 2019"
  Rank__c?: number; // Placement - 1, 2, 3 for medals
  Sport__c?: string;
  Icon_URL__c?: string; // Trophy/medal image
  Sort_Order__c?: number; // Display order
  
  // Relationships
  Player__r?: Contact;
  Team__r?: Account;
  Competition__r?: Competition;
  Season__r?: Season;
}

/**
 * Article__c - News, blogs, analysis, content
 */
export interface Article extends SalesforceRecord {
  Team__c?: string; // Lookup to Account
  Competition__c?: string; // Lookup to Competition__c
  Match__c?: string; // Lookup to Match__c
  Player__c?: string; // Lookup to Contact
  Article_Type__c?: string; // News, Blog, Preview, Recap, Analysis
  Heading__c?: string;
  Body__c?: string; // Long Text
  Is_Published__c?: boolean;
  Article_URL__c?: string;
  Source__c?: string;
  Thumbnail_URL__c?: string;
  Published_Date__c?: string;
  Author__c?: string;
  
  // Relationships
  Team__r?: Account;
  Competition__r?: Competition;
  Match__r?: Match;
  Player__r?: Contact;
}

/**
 * Social_Engagement__c - Track viral moments and engagement
 */
export interface SocialEngagement extends SalesforceRecord {
  Match_Moment__c?: string; // Lookup to Match_Moment__c
  Match__c?: string; // Lookup to Match__c
  Engagement_Type__c?: string; // Likes, Shares, Comments, Views
  Count__c?: number;
  Platform__c?: string;
  Sentiment__c?: string;
  
  // Relationships
  Match_Moment__r?: MatchMoment;
  Match__r?: Match;
}

// ============================================================================
// CUSTOM OBJECTS - REVENUE
// ============================================================================

/**
 * Revenue_Stream__c - Track revenue by month/quarter
 */
export interface RevenueStream extends SalesforceRecord {
  Account__c?: string; // Lookup to Account (Primary)
  Opportunity__c?: string; // Lookup to Opportunity (Optional)
  Stream_Type__c?: string;
  Amount__c?: number;
  Revenue_Date__c?: string;
  Payment_Status__c?: string;
  Women_Premium_Applied__c?: boolean;
  
  // Relationships
  Account__r?: Account;
  Opportunity__r?: Opportunity;
}

/**
 * Subscription__c - User/team subscriptions
 */
export interface Subscription extends SalesforceRecord {
  Account__c?: string; // Lookup to Account
  Opportunity__c?: string; // Lookup to Opportunity
  Subscription_Tier__c?: string;
  Status__c?: string;
  Start_Date__c?: string;
  End_Date__c?: string;
  Auto_Renew__c?: boolean;
  Monthly_Price__c?: number;
  Women_Content_Usage__c?: number;
  
  // Relationships
  Account__r?: Account;
  Opportunity__r?: Opportunity;
}

/**
 * Sponsorship__c - Brand sponsorship deals
 */
export interface Sponsorship extends SalesforceRecord {
  Opportunity__c?: string; // Lookup to Opportunity
  Account__c?: string; // Lookup to Account (Sponsor)
  Competition__c?: string; // Lookup to Competition__c
  Match__c?: string; // Lookup to Match__c
  Sponsorship_Type__c?: string;
  Annual_Fee__c?: number;
  Impressions_Guaranteed__c?: number;
  Impressions_Delivered__c?: number;
  
  // Relationships
  Opportunity__r?: Opportunity;
  Account__r?: Account;
  Competition__r?: Competition;
  Match__r?: Match;
}

/**
 * Media_License__c - Content licensing deals
 */
export interface MediaLicense extends SalesforceRecord {
  Opportunity__c?: string; // Lookup to Opportunity
  Account__c?: string; // Lookup to Account (Licensee)
  Competition__c?: string; // Lookup to Competition__c
  License_Type__c?: string;
  Territory__c?: string;
  Content_Types__c?: string;
  Usage_Rights__c?: string;
  
  // Relationships
  Opportunity__r?: Opportunity;
  Account__r?: Account;
  Competition__r?: Competition;
}

/**
 * League_Partnership__c - Official league partnerships
 */
export interface LeaguePartnership extends SalesforceRecord {
  Opportunity__c?: string; // Lookup to Opportunity
  League__c?: string; // Lookup to Competition__c
  Account__c?: string; // Lookup to Account (League Org)
  Partnership_Type__c?: string;
  Annual_Fee__c?: number;
  Data_Access__c?: boolean;
  Logo_Usage__c?: boolean;
  
  // Relationships
  Opportunity__r?: Opportunity;
  League__r?: Competition;
  Account__r?: Account;
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

/**
 * Query filters for matches
 */
export interface MatchFilters {
  sport?: string;
  gender?: string;
  competition?: string;
  team?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}

/**
 * Query filters for teams
 */
export interface TeamFilters {
  sport?: string;
  gender?: string;
  league?: string;
  country?: string;
  limit?: number;
}

/**
 * Query filters for players
 */
export interface PlayerFilters {
  sport?: string;
  gender?: string;
  team?: string;
  position?: string;
  nationality?: string;
  limit?: number;
}

/**
 * Query filters for competitions
 */
export interface CompetitionFilters {
  sport?: string;
  gender?: string;
  season?: string;
  country?: string;
  tier?: string;
  limit?: number;
}

/**
 * Query filters for articles
 */
export interface ArticleFilters {
  team?: string;
  competition?: string;
  match?: string;
  player?: string;
  articleType?: string;
  isPublished?: boolean;
  limit?: number;
}

/**
 * Query filters for moments
 */
export interface MomentFilters {
  match?: string;
  player?: string;
  team?: string;
  eventType?: string;
  sport?: string;
  gender?: string;
  minViralScore?: number;
  limit?: number;
}

// ============================================================================
// Backward Compatibility Aliases (deprecated - use new names)
// ============================================================================

/** @deprecated Use Match instead */
export type Fixture = Match;

/** @deprecated Use MatchPeriod instead */
export type FixturePeriod = MatchPeriod;

/** @deprecated Use MatchEvent instead */
export type LiveFeed = MatchEvent;

/** @deprecated Use MatchMoment instead */
export type CommentaryEvent = MatchMoment;

/** @deprecated Use MatchParticipation instead */
export type FixtureParticipation = MatchParticipation;

/** @deprecated Use Account (with RecordType) instead */
export type Team = Account;

/** @deprecated Use Contact (with RecordType) instead */
export type Player = Contact;

/** @deprecated Use MatchMoment instead */
export type Moment = MatchMoment;
