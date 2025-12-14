import { getSalesforceConnection } from '../connection-oauth';

export async function getStandings(sport: string) {
  const conn = await getSalesforceConnection();

  const result = await conn.query(`
    SELECT 
      Id, Team__r.Name, Team__r.Logo_URL__c,
      Matches_Played__c, Wins__c, Draws__c, Losses__c,
      Goals_For__c, Goals_Against__c, Goal_Difference__c,
      Points__c, Form_Last_5__c, Position__c
    FROM Team_Season_Stats__c
    WHERE Competition__r.Sport__c = '${sport}'
      AND Season__c = '2024'
    ORDER BY Points__c DESC, Goal_Difference__c DESC
  `);

  return result.records;
}

export async function getTopScorers(sport: string, limit: number = 20) {
  const conn = await getSalesforceConnection();

  const result = await conn.query(`
    SELECT 
      Id, Player__r.Name, Player__r.Photo_URL__c,
      Team__r.Name, Team__r.Logo_URL__c,
      Goals__c, Assists__c, Appearances__c,
      Minutes_Played__c, Goals_Per_90__c
    FROM Player_Season_Stats__c
    WHERE Competition__r.Sport__c = '${sport}'
      AND Season__c = '2024'
      AND Goals__c > 0
    ORDER BY Goals__c DESC
    LIMIT ${limit}
  `);

  return result.records;
}

export async function getPlayerStats(playerId: string) {
  const conn = await getSalesforceConnection();

  const result = await conn.query(`
    SELECT 
      Id, Player__r.Name, Player__r.Photo_URL__c, Player__r.Position__c,
      Team__r.Name, Team__r.Logo_URL__c,
      Competition__r.Name,
      Goals__c, Assists__c, Appearances__c, Minutes_Played__c,
      Goals_Per_90__c, Assists_Per_90__c, Shots__c, Shots_On_Target__c,
      Pass_Completion_Percentage__c, Yellow_Cards__c, Red_Cards__c
    FROM Player_Season_Stats__c
    WHERE Player__c = '${playerId}'
      AND Season__c = '2024'
    ORDER BY Competition__r.Name
  `);

  return result.records;
}

export async function getTopAssists(sport: string, limit: number = 20) {
  const conn = await getSalesforceConnection();

  const result = await conn.query(`
    SELECT 
      Id, Player__r.Name, Player__r.Photo_URL__c,
      Team__r.Name, Team__r.Logo_URL__c,
      Assists__c, Goals__c, Appearances__c,
      Minutes_Played__c, Assists_Per_90__c
    FROM Player_Season_Stats__c
    WHERE Competition__r.Sport__c = '${sport}'
      AND Season__c = '2024'
      AND Assists__c > 0
    ORDER BY Assists__c DESC
    LIMIT ${limit}
  `);

  return result.records;
}

