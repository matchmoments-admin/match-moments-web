import { NextResponse } from 'next/server';
import { getSalesforceClient } from '@/lib/salesforce/client';
import type { Account } from '@/lib/salesforce/types';

/**
 * Test API Route: Display Salesforce Accounts via JWT Bearer Flow
 * 
 * This endpoint demonstrates that JWT Bearer authentication works by:
 * 1. Connecting to Salesforce using service account (no user login)
 * 2. Querying Account records
 * 3. Displaying results in JSON format
 * 
 * Test with: http://localhost:3000/api/test-jwt-accounts
 */
export async function GET() {
  try {
    console.log('[API] Testing JWT Bearer connection...');
    
    // Get Salesforce client
    const client = getSalesforceClient();
    
    // Authenticate (will use cached token if available)
    await client.authenticate();
    
    // Get user identity
    const identity = await client.getIdentity();
    
    // Query Salesforce Accounts (limited to 10 for testing)
    const accounts = await client.query<Account>(`
      SELECT Id, Name, Type, Industry, Phone, BillingCity, BillingState
      FROM Account
      ORDER BY CreatedDate DESC
      LIMIT 10
    `);
    
    // Get connection status
    const status = client.getStatus();
    
    // Return success response with data
    return NextResponse.json({
      success: true,
      message: 'JWT Bearer authentication successful! 🎉',
      connection: {
        authenticated: true,
        username: identity.username,
        organizationId: identity.organization_id,
        instanceUrl: status.instanceUrl,
        tokenAge: Math.round(status.tokenAge / 1000) + ' seconds',
        lastRefresh: new Date(status.lastRefresh).toISOString()
      },
      accounts: {
        totalSize: accounts.length,
        records: accounts.map((acc) => ({
          id: acc.Id,
          name: acc.Name,
          type: acc.Type || 'N/A',
          industry: acc.Industry || 'N/A',
          phone: acc.Phone || 'N/A',
          location: acc.BillingCity && acc.BillingState 
            ? `${acc.BillingCity}, ${acc.BillingState}`
            : 'N/A'
        }))
      },
      nextSteps: [
        'JWT Bearer Flow is working! ✅',
        'Native REST API implementation complete',
        'All queries now use native fetch() with caching',
        'jsforce dependency can be removed'
      ]
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('[API] JWT connection test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'JWT Bearer authentication failed',
      message: error.message,
      troubleshooting: [
        'Check that you completed all steps in JWT-SETUP.md',
        'Verify certificate is uploaded to Connected App',
        'Ensure user is pre-authorized in Connected App settings',
        'Confirm environment variables are set correctly',
        'Wait 2-10 minutes after Connected App changes'
      ],
      envVarsNeeded: [
        'SALESFORCE_JWT_CLIENT_ID',
        'SALESFORCE_JWT_USERNAME', 
        'SALESFORCE_JWT_PRIVATE_KEY',
        'SALESFORCE_INSTANCE_URL'
      ],
      envVarsPresent: {
        SALESFORCE_JWT_CLIENT_ID: !!process.env.SALESFORCE_JWT_CLIENT_ID,
        SALESFORCE_JWT_USERNAME: !!process.env.SALESFORCE_JWT_USERNAME,
        SALESFORCE_JWT_PRIVATE_KEY: !!process.env.SALESFORCE_JWT_PRIVATE_KEY,
        SALESFORCE_INSTANCE_URL: !!process.env.SALESFORCE_INSTANCE_URL
      }
    }, { status: 500 });
  }
}
