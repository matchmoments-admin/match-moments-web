import { NextResponse } from 'next/server';
import { getSalesforceConnection } from '@/lib/salesforce/connection-oauth';

/**
 * Test endpoint to verify OAuth connection to Salesforce
 * 
 * Usage: GET http://localhost:3000/api/test-sf-oauth
 * 
 * This endpoint tests:
 * - OAuth credentials are correctly configured
 * - Refresh token is valid
 * - Connection to Salesforce can be established
 */
export async function GET() {
  try {
    console.log('[Test] Testing Salesforce OAuth connection...');
    
    const conn = await getSalesforceConnection();
    const identity = await conn.identity();
    
    console.log('[Test] ✓ OAuth connection successful!');
    
    return NextResponse.json({
      success: true,
      message: 'OAuth connection successful!',
      data: {
        user: identity.display_name,
        username: identity.username,
        organizationId: identity.organization_id,
        instanceUrl: conn.instanceUrl,
      },
    });
  } catch (error: any) {
    console.error('[Test] ✗ OAuth connection failed:', error.message);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      hint: error.message.includes('SALESFORCE_REFRESH_TOKEN')
        ? 'Run: npm run sf:oauth-setup'
        : error.message.includes('invalid_grant')
        ? 'Your refresh token expired. Run: npm run sf:oauth-setup'
        : 'Check your OAuth credentials in .env.local',
    }, { status: 500 });
  }
}
