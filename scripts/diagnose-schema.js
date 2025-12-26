/**
 * Diagnose Salesforce Schema - Check Field Availability
 * 
 * This script checks which fields actually exist in your Salesforce org
 * and compares them to what the code expects.
 */

const { getSalesforceClient } = require('../src/lib/salesforce/client.ts');

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
  'Match_Period__c',
  'Match_Event__c',
  'Match_Moment__c',
  'Lineup__c',
  'Team_Membership__c',
  'Award__c'
];

async function describeObject(client, objectName) {
  try {
    const describe = await client.connection.sobject(objectName).describe();
    return {
      name: objectName,
      exists: true,
      fields: describe.fields.map(f => ({
        name: f.name,
        type: f.type,
        label: f.label,
        custom: f.custom
      }))
    };
  } catch (error) {
    return {
      name: objectName,
      exists: false,
      error: error.message
    };
  }
}

async function diagnoseSchema() {
  console.log('🔍 Diagnosing Salesforce Schema...\n');
  
  const client = getSalesforceClient();
  
  const results = {};
  
  for (const objectName of OBJECTS_TO_CHECK) {
    console.log(`Checking ${objectName}...`);
    results[objectName] = await describeObject(client, objectName);
  }
  
  console.log('\n📊 SCHEMA ANALYSIS\n');
  console.log('='.repeat(80));
  
  for (const [objectName, info] of Object.entries(results)) {
    console.log(`\n${objectName}:`);
    if (!info.exists) {
      console.log(`  ❌ Object does not exist`);
      continue;
    }
    
    console.log(`  ✅ Object exists with ${info.fields.length} fields`);
    console.log(`  Custom fields:`);
    
    const customFields = info.fields.filter(f => f.custom);
    if (customFields.length === 0) {
      console.log(`    (none)`);
    } else {
      customFields.forEach(f => {
        console.log(`    - ${f.name} (${f.type})`);
      });
    }
  }
  
  // Save full results to file
  const fs = require('fs');
  fs.writeFileSync(
    'salesforce-schema-report.json',
    JSON.stringify(results, null, 2)
  );
  
  console.log('\n\n📝 Full report saved to: salesforce-schema-report.json');
}

diagnoseSchema().catch(console.error);

