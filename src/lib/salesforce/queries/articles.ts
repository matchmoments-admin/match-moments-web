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
        conditions.push(`Team__c = '${filters.team}'`);
      }
      if (filters.competition) {
        conditions.push(`Competition__c = '${filters.competition}'`);
      }
      if (filters.match) {
        conditions.push(`Match__c = '${filters.match}'`);
      }
      if (filters.player) {
        conditions.push(`Player__c = '${filters.player}'`);
      }
      if (filters.articleType) {
        conditions.push(`Article_Type__c = '${filters.articleType}'`);
      }
      
      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
      const limit = filters.limit || 20;

      const articles = await client.query<Article>(`
        SELECT 
          Id, Name, Heading__c, Body__c, Article_Type__c,
          Is_Published__c, Published_Date__c, Author__c,
          Article_URL__c, Source__c, Thumbnail_URL__c,
          Team__r.Id, Team__r.Name, Team__r.Logo_Url__c,
          Competition__r.Id, Competition__r.Name,
          Match__r.Id, Match__r.Name,
          Player__r.Id, Player__r.Name, Player__r.Profile_Image_URL__c
        FROM Article__c
        ${whereClause}
        ORDER BY Published_Date__c DESC NULLS LAST, CreatedDate DESC
        LIMIT ${limit}
      `);

      return articles;
    },
    { ttl: 900, staleWhileRevalidate: true } // 15 min cache
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
          Id, Name, Heading__c, Body__c, Article_Type__c,
          Is_Published__c, Published_Date__c, Author__c,
          Article_URL__c, Source__c, Thumbnail_URL__c,
          Team__r.Id, Team__r.Name, Team__r.Logo_Url__c,
          Competition__r.Id, Competition__r.Name,
          Match__r.Id, Match__r.Name, Match__r.Match_Date__c,
          Player__r.Id, Player__r.Name, Player__r.Profile_Image_URL__c
        FROM Article__c
        WHERE Id = '${articleId}'
        LIMIT 1
      `);

      if (!articles || articles.length === 0) {
        return null;
      }

      return articles[0];
    },
    { ttl: 900, staleWhileRevalidate: true }
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

