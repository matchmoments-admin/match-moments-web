/**
 * Server-Side Data Fetchers for Articles
 * 
 * These functions are designed for Server Components to fetch article data directly.
 */

import { getSalesforceClient } from '@/lib/salesforce/client';
import type { SF_Article__c } from '@/types/salesforce/raw';
import type { ArticleFilters } from '@/lib/salesforce/types';
import type { Article } from '@/types/domain';
import { getCached } from '@/lib/cache/redis';
import { mapArticles, mapArticle } from '@/lib/mappers';

/**
 * Get articles with filters
 */
export async function getArticles(filters?: ArticleFilters): Promise<Article[]> {
  const cacheKey = `articles:${JSON.stringify(filters || {})}`;
  
  return getCached(
    cacheKey,
    async () => {
      const client = getSalesforceClient();
      
      // Build WHERE clause
      const conditions: string[] = [];
      
      if (filters?.isPublished !== undefined) {
        conditions.push(`Is_Published__c = ${filters.isPublished}`);
      }
      if (filters?.team) {
        conditions.push(`Related_Team__c = '${filters.team}'`);
      }
      if (filters?.match) {
        conditions.push(`Related_Match__c = '${filters.match}'`);
      }
      if (filters?.player) {
        conditions.push(`Related_Player__c = '${filters.player}'`);
      }
      if (filters?.articleType) {
        conditions.push(`Article_Type__c = '${filters.articleType}'`);
      }
      
      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
      const limit = filters?.limit || 20;
      
      const sfArticles = await client.query<SF_Article__c>(`
        SELECT 
          Id, Name, Heading__c, Body__c, Is_Published__c,
          Article_Date__c, Article_URL__c, Source__c, Sport_Type__c,
          Header_Image_URL__c, Reading_Time__c, Article_Type__c,
          Related_Team__c, Related_Team__r.Id, Related_Team__r.Name, Related_Team__r.Logo_Url__c,
          Related_Team__r.Abbreviation__c, Related_Team__r.Sport__c, Related_Team__r.Gender_Class__c,
          Related_Match__c, Related_Match__r.Id, Related_Match__r.Name,
          Related_Player__c, Related_Player__r.Id, Related_Player__r.Name
        FROM Article__c
        ${whereClause}
        ORDER BY Article_Date__c DESC
        LIMIT ${limit}
      `);
      
      return mapArticles(sfArticles);
    },
    300 // 5 min cache
  );
}

/**
 * Get article by ID
 */
export async function getArticleById(id: string): Promise<Article | null> {
  return getCached(
    `article:${id}`,
    async () => {
      const client = getSalesforceClient();
      
      const sfArticles = await client.query<SF_Article__c>(`
        SELECT 
          Id, Name, Heading__c, Body__c, Is_Published__c,
          Article_Date__c, Article_URL__c, Source__c, Sport_Type__c,
          Header_Image_URL__c, Reading_Time__c, Article_Type__c,
          Related_Team__c, Related_Team__r.Id, Related_Team__r.Name, Related_Team__r.Logo_Url__c,
          Related_Team__r.Abbreviation__c, Related_Team__r.Sport__c, Related_Team__r.Gender_Class__c,
          Related_Match__c, Related_Match__r.Id, Related_Match__r.Name,
          Related_Player__c, Related_Player__r.Id, Related_Player__r.Name
        FROM Article__c
        WHERE Id = '${id}'
        LIMIT 1
      `);
      
      if (!sfArticles || sfArticles.length === 0) {
        return null;
      }
      
      return mapArticle(sfArticles[0]);
    },
    300
  );
}

/**
 * Get latest published articles
 */
export async function getLatestArticles(limit: number = 10): Promise<Article[]> {
  return getArticles({ isPublished: true, limit });
}

