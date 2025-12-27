/**
 * Moment Mapper
 * 
 * Transforms Salesforce Match_Moment__c records to Domain Moment types
 */

import type { SF_Match_Moment__c } from '@/types/salesforce/raw';
import type { Moment } from '@/types/domain';
import { mapGenderClass, normalizeSportName, generateVideoThumbnail } from './helpers';
import { mapMinimalPlayer } from './player-mapper';
import { mapMinimalTeam } from './team-mapper';
import { getSportsPlaceholder } from '@/lib/image-utils';

/**
 * Map Salesforce Match_Moment to Domain Moment
 */
export function mapMoment(sf: SF_Match_Moment__c): Moment {
  // Extract sport and gender from match context
  // Note: Gender comes from team, not competition (Competition__c doesn't have Gender_Class__c)
  const sport = normalizeSportName(sf.Match__r?.Competition__r?.Sport__c);
  const gender = mapGenderClass(sf.Match__r?.Home_Team__r?.Gender_Class__c);
  
  // Generate thumbnail from video or use sports placeholder
  const fallbackUrl = getSportsPlaceholder(sport, { width: 640, height: 360 });
  const thumbnailUrl = sf.Video_URL__c 
    ? generateVideoThumbnail(sf.Video_URL__c, fallbackUrl)
    : fallbackUrl;
  
  return {
    id: sf.Id,
    eventType: sf.Event_Type__c || 'Event',
    eventMinute: sf.Event_Minute__c || 0,
    eventSecond: sf.Event_Second__c,
    description: sf.Description__c || '',
    shareTitle: sf.Social_Share_Title__c,
    videoUrl: sf.Video_URL__c,
    publicUrl: sf.Public_URL__c,
    viralScore: sf.Viral_Score__c,
    shareCount: sf.Share_Count__c,
    viewCount: sf.View_Count__c,
    primaryPlayer: mapMinimalPlayer(sf.Primary_Player__r),
    secondaryPlayer: sf.Secondary_Player__r ? {
      id: sf.Secondary_Player__r.Id,
      name: sf.Secondary_Player__r.Name || '',
    } : undefined,
    team: mapMinimalTeam(sf.Team__r),
    match: {
      id: sf.Match__r?.Id || '',
      homeTeam: sf.Match__r?.Home_Team__r?.Name || '',
      awayTeam: sf.Match__r?.Away_Team__r?.Name || '',
      competition: sf.Match__r?.Competition__r?.Name || '',
    },
    sport,
    gender,
    thumbnailUrl,
  };
}

/**
 * Map array of Salesforce Match_Moments
 */
export function mapMoments(sfMoments: SF_Match_Moment__c[]): Moment[] {
  return sfMoments.map(mapMoment);
}

