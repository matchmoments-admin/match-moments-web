import { getSalesforceClient } from '../client';
import type { Article, ArticleFilters } from '../types';
import { getCached } from '../../cache/redis';

/**
 * Get articles with flexible filtering
 */
export async function getArticles(filters: ArticleFilters = {}) {
  const cacheKey = `articles:${JSON.stringify(filters)}`;
  
  return getCached(
    cacheKey,
    async () => {
      const client = getSalesforceClient();
      
      // Build WHERE clause dynamically
      const conditions: string[] = [];
      
      if (filters.isPublished !== undefined) {
        conditions.push(`Is_Published__c = ${filters.isPublished}`);
      } else {
        // Default to only published articles
        conditions.push('Is_Published__c = true');
      }
      
      if (filters.team) {
        conditions.push(`Related_Team__c = '${filters.team}'`);
      }
      if (filters.match) {
        conditions.push(`Related_Match__c = '${filters.match}'`);
      }
      if (filters.player) {
        conditions.push(`Related_Player__c = '${filters.player}'`);
      }
      if (filters.articleType) {
        conditions.push(`Article_Type__c = '${filters.articleType}'`);
      }
      
      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
      const limit = filters.limit || 20;

      const articles = await client.query<Article>(`
        SELECT 
          Id, Name, Heading__c, Body__c,
          Article_Date__c, Is_Published__c,
          Article_URL__c, Source__c, Sport_Type__c,
          Header_Image_URL__c, Reading_Time__c,
          Related_Match__c, Related_Match__r.Id, Related_Match__r.Name, Related_Match__r.Match_Date_Time__c,
          Related_Team__c, Related_Team__r.Id, Related_Team__r.Name, Related_Team__r.Logo_Url__c,
          Related_Player__c, Related_Player__r.Id, Related_Player__r.Name, Related_Player__r.Profile_Image_URL__c
        FROM Article__c
        ${whereClause}
        ORDER BY Article_Date__c DESC NULLS LAST, CreatedDate DESC
        LIMIT ${limit}
      `);

      return articles;
    },
    900 // 15 min cache
  );
}

/**
 * Get article by ID
 */
export async function getArticleById(articleId: string) {
  return getCached(
    `article:${articleId}`,
    async () => {
      const client = getSalesforceClient();

      const articles = await client.query<Article>(`
        SELECT 
          Id, Name, Heading__c, Body__c,
          Article_Date__c, Is_Published__c,
          Article_URL__c, Source__c, Sport_Type__c,
          Header_Image_URL__c, Reading_Time__c,
          Related_Match__c, Related_Match__r.Id, Related_Match__r.Name, Related_Match__r.Match_Date_Time__c,
          Related_Team__c, Related_Team__r.Id, Related_Team__r.Name, Related_Team__r.Logo_Url__c,
          Related_Player__c, Related_Player__r.Id, Related_Player__r.Name, Related_Player__r.Profile_Image_URL__c
        FROM Article__c
        WHERE Id = '${articleId}'
        LIMIT 1
      `);

      if (!articles || articles.length === 0) {
        return null;
      }

      return articles[0];
    },
    900
  );
}

/**
 * Get latest articles
 */
export async function getLatestArticles(limit: number = 10) {
  return getArticles({
    isPublished: true,
    limit
  });
}

/**
 * Get articles by team
 */
export async function getArticlesByTeam(teamId: string, limit: number = 10) {
  return getArticles({
    team: teamId,
    limit
  });
}

/**
 * Get articles by match
 */
export async function getArticlesByMatch(matchId: string) {
  return getArticles({
    match: matchId,
    limit: 50
  });
}

/**
 * Get articles by player
 */
export async function getArticlesByPlayer(playerId: string, limit: number = 10) {
  return getArticles({
    player: playerId,
    limit
  });
}

/**
 * Get articles by competition
 */
export async function getArticlesByCompetition(competitionId: string, limit: number = 10) {
  return getArticles({
    competition: competitionId,
    limit
  });
}

/**
 * Get articles by type
 */
export async function getArticlesByType(articleType: string, limit: number = 20) {
  return getArticles({
    articleType,
    limit
  });
}

