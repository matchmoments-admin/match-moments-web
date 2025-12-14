import { NextResponse } from 'next/server';
import { getSalesforceConnection } from '@/lib/salesforce/connection-oauth';

/**
 * Test Salesforce connection status
 * GET /api/test-salesforce-data/connection
 */
export async function GET() {
  try {
    // Log environment variables (without exposing sensitive data)
    console.log('[SF CONNECTION TEST] Environment check:', {
      hasUsername: !!process.env.SALESFORCE_USERNAME,
      hasPassword: !!process.env.SALESFORCE_PASSWORD,
      hasSecurityToken: !!process.env.SALESFORCE_SECURITY_TOKEN,
      hasInstanceUrl: !!process.env.SALESFORCE_INSTANCE_URL,
      usernamePrefix: process.env.SALESFORCE_USERNAME?.substring(0, 5) + '...',
      instanceUrl: process.env.SALESFORCE_INSTANCE_URL,
    });
    
    const conn = await getSalesforceConnection();
    
    // Test the connection by getting identity
    const identity = await conn.identity();
    
    return NextResponse.json({
      connected: true,
      message: 'Successfully connected to Salesforce',
      instanceUrl: conn.instanceUrl,
      userId: identity.user_id,
      orgId: identity.organization_id,
      userInfo: {
        displayName: identity.display_name,
        email: identity.email,
      }
    });
  } catch (error: any) {
    console.error('[SF CONNECTION TEST] Full error:', {
      message: error.message,
      name: error.name,
      errorCode: error.errorCode,
      stack: error.stack,
    });
    
    // Provide more helpful error messages
    let helpfulMessage = error.message || 'Failed to connect to Salesforce';
    let solutionSteps: string[] = [];
    
    if (error.message?.includes('INVALID_LOGIN')) {
      helpfulMessage = 'Authentication failed - likely due to SOAP API being disabled in your Salesforce org.';
      solutionSteps = [
        '1. Run diagnostic: npm run sf:diagnose',
        '2. Read the fix guide: FIX_SALESFORCE_CONNECTION.md',
        '3. Choose Option 1 (Enable SOAP API) or Option 2 (OAuth 2.0)',
        '',
        'Quick fix: Enable SOAP API in Salesforce (Setup → Profiles → API Enabled)',
        'Recommended: Switch to OAuth 2.0 (npm run sf:oauth-setup)',
      ];
    }
    
    if (error.message?.includes('SOAP API')) {
      helpfulMessage = 'SOAP API is disabled in your Salesforce org.';
      solutionSteps = [
        '📖 Read: FIX_SALESFORCE_CONNECTION.md for complete instructions',
        '',
        'Option 1: Enable SOAP API (quickest)',
        '  → Setup → Profiles → Enable "API Enabled"',
        '',
        'Option 2: Switch to OAuth 2.0 (recommended)',
        '  → Run: npm run sf:oauth-setup',
      ];
    }
    
    return NextResponse.json({
      connected: false,
      message: helpfulMessage,
      solution: solutionSteps.length > 0 ? solutionSteps.join('\n') : undefined,
      documentation: {
        mainGuide: 'FIX_SALESFORCE_CONNECTION.md',
        quickReference: 'SALESFORCE_README.md',
        fullDocs: 'SALESFORCE_SETUP.md',
      },
      commands: {
        diagnose: 'npm run sf:diagnose',
        oauthSetup: 'npm run sf:oauth-setup',
      },
      error: error.toString(),
      errorCode: error.errorCode || error.name,
      debug: {
        hasUsername: !!process.env.SALESFORCE_USERNAME,
        hasPassword: !!process.env.SALESFORCE_PASSWORD,
        hasSecurityToken: !!process.env.SALESFORCE_SECURITY_TOKEN,
        instanceUrl: process.env.SALESFORCE_INSTANCE_URL,
      }
    }, { status: 500 });
  }
}
