import { NextRequest, NextResponse } from 'next/server';
import { getSalesforceClient } from '@/lib/salesforce/client';

/**
 * Health check endpoint for Salesforce JWT authentication
 * 
 * Tests:
 * - JWT authentication
 * - Token validity
 * - Salesforce connectivity
 * - API query capability
 */
export async function GET(request: NextRequest) {
  try {
    const client = getSalesforceClient();
    const startTime = Date.now();
    
    // Step 1: Authenticate
    console.log('[Health Check] Testing authentication...');
    await client.authenticate();
    const authTime = Date.now() - startTime;
    
    // Step 2: Get identity
    console.log('[Health Check] Getting user identity...');
    const identity = await client.getIdentity();
    const identityTime = Date.now() - startTime - authTime;
    
    // Step 3: Test a simple query
    console.log('[Health Check] Testing query capability...');
    const queryStart = Date.now();
    const testQuery = await client.query<any>(`
      SELECT COUNT(Id) recordCount
      FROM Match__c
    `);
    const queryTime = Date.now() - queryStart;
    
    // Step 4: Get client status
    const status = client.getStatus();
    
    const totalTime = Date.now() - startTime;
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      authentication: {
        connected: status.connected,
        method: 'JWT Bearer',
        tokenAge: status.tokenAge,
        tokenAgeMinutes: Math.floor(status.tokenAge / 60000),
        lastRefresh: new Date(status.lastRefresh).toISOString(),
        nextRefreshIn: Math.floor((7200000 - status.tokenAge) / 60000) + ' minutes',
      },
      identity: {
        username: identity.username,
        displayName: identity.display_name,
        organizationId: identity.organization_id,
        userId: identity.user_id,
        email: identity.email,
      },
      salesforce: {
        instanceUrl: status.instanceUrl,
        apiVersion: '60.0',
      },
      queryTest: {
        success: true,
        recordCount: testQuery[0]?.recordCount || 0,
        queryTime: `${queryTime}ms`,
      },
      performance: {
        authTime: `${authTime}ms`,
        identityTime: `${identityTime}ms`,
        queryTime: `${queryTime}ms`,
        totalTime: `${totalTime}ms`,
      },
    });
  } catch (error: any) {
    console.error('[Health Check] Failed:', error);
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: {
          message: error.message,
          type: error.constructor.name,
        },
        troubleshooting: {
          checkEnvironmentVariables: [
            'SALESFORCE_JWT_CLIENT_ID',
            'SALESFORCE_JWT_USERNAME',
            'SALESFORCE_JWT_PRIVATE_KEY',
            'SALESFORCE_INSTANCE_URL',
          ],
          documentation: '/JWT-SETUP.md',
          commonIssues: [
            'Certificate not uploaded to Connected App',
            'User not pre-authorized in Connected App',
            'Private key mismatch with uploaded certificate',
            'Connected App not configured for JWT Bearer Flow',
          ],
        },
      },
      { status: 500 }
    );
  }
}

