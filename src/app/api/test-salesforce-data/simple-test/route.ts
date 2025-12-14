import { NextResponse } from 'next/server';
import jsforce from 'jsforce';

/**
 * Simple Salesforce connection test using username/password
 * This bypasses OAuth and directly tests if you can retrieve data
 * GET /api/test-salesforce-data/simple-test
 */
export async function GET() {
  try {
    // Check if we have the required credentials
    const username = process.env.SALESFORCE_USERNAME;
    const password = process.env.SALESFORCE_PASSWORD;
    const securityToken = process.env.SALESFORCE_SECURITY_TOKEN;
    const instanceUrl = process.env.SALESFORCE_INSTANCE_URL;

    if (!username || !password || !securityToken) {
      return NextResponse.json({
        success: false,
        message: 'Missing credentials',
        help: 'Please set SALESFORCE_USERNAME, SALESFORCE_PASSWORD, and SALESFORCE_SECURITY_TOKEN in your .env.local file',
        debug: {
          hasUsername: !!username,
          hasPassword: !!password,
          hasSecurityToken: !!securityToken,
        }
      }, { status: 400 });
    }

    console.log('[Simple Test] Attempting to connect to Salesforce...');
    console.log('[Simple Test] Instance URL:', instanceUrl);
    console.log('[Simple Test] Username:', username);

    // Create a simple connection with username/password
    const conn = new jsforce.Connection({
      loginUrl: instanceUrl || 'https://login.salesforce.com'
    });

    // Login
    console.log('[Simple Test] Logging in...');
    await conn.login(username, password + securityToken);

    console.log('[Simple Test] ✓ Login successful!');

    // Try to query a contact
    console.log('[Simple Test] Querying contacts...');
    const result = await conn.query('SELECT Id, FirstName, LastName, Email FROM Contact LIMIT 1');

    if (result.totalSize > 0) {
      const contact = result.records[0];
      return NextResponse.json({
        success: true,
        message: 'Successfully connected and retrieved a contact!',
        connection: {
          instanceUrl: conn.instanceUrl,
          userId: conn.userInfo?.id,
        },
        contact: {
          id: contact.Id,
          firstName: contact.FirstName,
          lastName: contact.LastName,
          email: contact.Email,
        },
        totalContacts: result.totalSize,
      });
    } else {
      return NextResponse.json({
        success: true,
        message: 'Connected successfully but no contacts found in your Salesforce org',
        connection: {
          instanceUrl: conn.instanceUrl,
          userId: conn.userInfo?.id,
        },
        totalContacts: 0,
      });
    }

  } catch (error: any) {
    console.error('[Simple Test] Error:', error);
    
    let helpfulMessage = 'Failed to connect or query Salesforce';
    let nextSteps: string[] = [];

    if (error.errorCode === 'INVALID_LOGIN') {
      helpfulMessage = 'Login failed - check your credentials';
      nextSteps = [
        '1. Verify SALESFORCE_USERNAME is correct',
        '2. Verify SALESFORCE_PASSWORD is correct',
        '3. Verify SALESFORCE_SECURITY_TOKEN is correct (from email or reset it)',
        '4. Make sure you\'re using the correct instance URL',
        '',
        'Note: If your org has SOAP API disabled, this won\'t work.',
        'In that case, you\'ll need to use OAuth instead.'
      ];
    } else if (error.message?.includes('API_DISABLED_FOR_ORG')) {
      helpfulMessage = 'API access is disabled for your org';
      nextSteps = [
        'Go to Setup → Profiles → System Administrator',
        'Edit → Check "API Enabled"',
        'Save and try again'
      ];
    }

    return NextResponse.json({
      success: false,
      message: helpfulMessage,
      error: error.message || error.toString(),
      errorCode: error.errorCode,
      nextSteps: nextSteps.length > 0 ? nextSteps : undefined,
    }, { status: 500 });
  }
}
