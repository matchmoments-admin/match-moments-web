/**
 * Article Mapper
 * 
 * Transforms Salesforce Article__c records to Domain Article types
 */

import type { SF_Article__c } from '@/types/salesforce/raw';
import type { Article } from '@/types/domain';
import { mapTeam } from './team-mapper';
import { ensureDateObject, normalizeSportName } from './helpers';
import { mapMinimalMatch } from './match-mapper';
import { mapMinimalPlayer } from './player-mapper';

/**
 * Map Salesforce Article to Domain Article
 */
export function mapArticle(sf: SF_Article__c): Article {
  // Determine article type
  const articleTypeRaw = sf.Article_Type__c?.toLowerCase() || 'news';
  const articleType: Article['type'] = ['news', 'blog', 'preview', 'recap', 'analysis'].includes(articleTypeRaw)
    ? articleTypeRaw as Article['type']
    : 'news';
  
  return {
    id: sf.Id,
    title: sf.Heading__c || 'Untitled',
    body: sf.Body__c || '',
    type: articleType,
    published: sf.Is_Published__c ?? false,
    imageUrl: sf.Header_Image_URL__c,
    author: sf.Source__c, // Using Source__c as author fallback
    publishedDate: ensureDateObject(sf.Article_Date__c),
    readingTime: sf.Reading_Time__c,
    sport: normalizeSportName(sf.Sport_Type__c),
    articleUrl: sf.Article_URL__c,
    source: sf.Source__c,
    relatedTeam: sf.Related_Team__r ? mapTeam(sf.Related_Team__r) : undefined,
    relatedMatch: mapMinimalMatch(sf.Related_Match__r),
    relatedPlayer: mapMinimalPlayer(sf.Related_Player__r),
  };
}

/**
 * Map array of Salesforce Articles
 */
export function mapArticles(sfArticles: SF_Article__c[]): Article[] {
  return sfArticles.map(mapArticle);
}

