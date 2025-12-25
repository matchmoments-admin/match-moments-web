import { NextResponse } from 'next/server';
import { getSalesforceClient } from '@/lib/salesforce/client';

const OBJECTS_TO_CHECK = [
  'Competition__c',
  'Account',
  'Contact',
  'Match__c',
  'Season__c',
  'Article__c',
  'Moment__c',
  'Player_Season_Stats__c',
  'Team_Season_Stats__c',
];

export async function GET() {
  try {
    const client = getSalesforceClient();
    const results: any = {};
    
    for (const objectName of OBJECTS_TO_CHECK) {
      try {
        const describe = await client.connection.sobject(objectName).describe();
        results[objectName] = {
          exists: true,
          label: describe.label,
          customFields: describe.fields
            .filter((f: any) => f.custom)
            .map((f: any) => ({
              name: f.name,
              type: f.type,
              label: f.label,
            })),
          allFields: describe.fields.map((f: any) => f.name),
        };
      } catch (error: any) {
        results[objectName] = {
          exists: false,
          error: error.message,
        };
      }
    }
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

