/**
 * Player Mapper
 * 
 * Transforms Salesforce Contact records to Domain Player types
 */

import type { SF_Contact } from '@/types/salesforce/raw';
import type { Player } from '@/types/domain';
import { mapGenderClass, normalizeSportName, ensureDateObject, getPlayerFullName } from './helpers';

/**
 * Map Salesforce Contact to Domain Player
 */
export function mapPlayer(sf: SF_Contact): Player {
  const fullName = getPlayerFullName(sf.FirstName, sf.LastName, sf.Name);
  
  return {
    id: sf.Id,
    name: fullName,
    position: sf.Position__c,
    jerseyNumber: sf.Jersey_Number__c,
    photoUrl: sf.Profile_Image_URL__c || '/placeholder-player.jpg',
    dateOfBirth: sf.Date_of_Birth__c ? ensureDateObject(sf.Date_of_Birth__c) : undefined,
    nationality: sf.Nationality__c,
    height: sf.Height__c,
    weight: sf.Weight__c,
    currentTeam: '', // Will be populated from context
    sport: 'soccer', // Will be populated from context
    gender: 'mixed', // Will be populated from context
  };
}

/**
 * Map array of Salesforce Contacts to Players
 */
export function mapPlayers(sfContacts: SF_Contact[]): Player[] {
  return sfContacts.map(mapPlayer);
}

/**
 * Map minimal player info (id, name, photo only)
 */
export function mapMinimalPlayer(sf: SF_Contact | undefined): { id: string; name: string; photoUrl?: string } | undefined {
  if (!sf) return undefined;
  
  return {
    id: sf.Id,
    name: getPlayerFullName(sf.FirstName, sf.LastName, sf.Name),
    photoUrl: sf.Profile_Image_URL__c,
  };
}

