import { Connection, OAuth2 } from 'jsforce';
import { cookies } from 'next/headers';

/**
 * Get Salesforce connection using cookie-based session (for user-authenticated routes)
 * This is used after a user has logged in via the OAuth flow
 */
export async function getSalesforceConnectionFromSession(): Promise<Connection> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("salesforce_access_token")?.value;
  const instanceUrl = cookieStore.get("salesforce_instance_url")?.value;

  if (!accessToken || !instanceUrl) {
    throw new Error(
      'No Salesforce session found. Please log in at /api/oauth2/auth'
    );
  }

  const conn = new Connection({
    accessToken: accessToken,
    instanceUrl: instanceUrl,
  });

  return conn;
}

let connectionPool: Connection | null = null;

/**
 * Get or create a Salesforce connection using OAuth 2.0 with refresh token
 * This is used for server-side operations where user authentication is not required
 * 
 * Required environment variables:
 * - SALESFORCE_CLIENT_ID: Your Connected App's Consumer Key
 * - SALESFORCE_CLIENT_SECRET: Your Connected App's Consumer Secret
 * - SALESFORCE_REFRESH_TOKEN: Your refresh token (obtained once during initial setup)
 * - SALESFORCE_INSTANCE_URL: Your Salesforce instance URL
 */
export async function getSalesforceConnection(): Promise<Connection> {
  // Return existing connection if valid
  if (connectionPool && connectionPool.accessToken) {
    try {
      // Test connection is still valid
      await connectionPool.identity();
      return connectionPool;
    } catch (error) {
      // Token expired, will refresh below
      console.log('[Salesforce] Access token expired, refreshing...');
      connectionPool = null;
    }
  }

  // Validate required environment variables
  if (!process.env.SALESFORCE_CLIENT_ID || !process.env.SALESFORCE_CLIENT_SECRET) {
    throw new Error(
      'Missing OAuth credentials. Please set SALESFORCE_CLIENT_ID and SALESFORCE_CLIENT_SECRET in your .env.local file.'
    );
  }

  if (!process.env.SALESFORCE_REFRESH_TOKEN) {
    throw new Error(
      'Missing SALESFORCE_REFRESH_TOKEN. Run "npm run sf:oauth-setup" to obtain a refresh token.'
    );
  }

  try {
    // Determine login URL based on instance URL
    let loginUrl = 'https://login.salesforce.com';
    
    // Only use test.salesforce.com for actual sandbox orgs (not Developer Edition)
    // Developer Edition domains end with .develop.my.salesforce.com and use login.salesforce.com
    // Sandbox domains end with .sandbox.my.salesforce.com and use test.salesforce.com
    // IMPORTANT: Developer Edition is NOT a sandbox despite having a custom domain
    if (process.env.SALESFORCE_INSTANCE_URL) {
      const instanceUrl = process.env.SALESFORCE_INSTANCE_URL.toLowerCase();
      // Only switch to test.salesforce.com for actual sandboxes (has .sandbox. in URL)
      if (instanceUrl.includes('.sandbox.my.salesforce.com')) {
        loginUrl = 'https://test.salesforce.com';
      }
    }

    // Create OAuth2 configuration
    const oauth2 = new OAuth2({
      clientId: process.env.SALESFORCE_CLIENT_ID,
      clientSecret: process.env.SALESFORCE_CLIENT_SECRET,
      redirectUri: process.env.SALESFORCE_REDIRECT_URI || 'http://localhost:3001/api/oauth2/callback',
      loginUrl: loginUrl,
    });

    console.log(`[Salesforce] Connecting with OAuth 2.0 to ${loginUrl}...`);

    // Create connection with refresh token
    const conn = new Connection({
      oauth2: oauth2,
      instanceUrl: process.env.SALESFORCE_INSTANCE_URL,
      refreshToken: process.env.SALESFORCE_REFRESH_TOKEN,
    });

    // Test the connection and trigger token refresh if needed
    await conn.identity();

    connectionPool = conn;
    console.log(`[Salesforce] ✓ OAuth connected successfully to ${conn.instanceUrl}`);
    
    return conn;
  } catch (error: any) {
    console.error('[Salesforce] OAuth connection failed:', error.message);
    
    if (error.message?.includes('invalid_grant')) {
      throw new Error(
        'Refresh token is invalid or expired. Run "npm run sf:oauth-setup" to get a new refresh token.'
      );
    }
    
    throw new Error(
      `Failed to connect to Salesforce: ${error.message}. Please check your OAuth credentials.`
    );
  }
}

/**
 * Test if Salesforce connection is working
 */
export async function testSalesforceConnection(): Promise<boolean> {
  try {
    const conn = await getSalesforceConnection();
    await conn.identity();
    return true;
  } catch (error: any) {
    console.error('[Salesforce] Connection test failed:', error.message);
    return false;
  }
}

/**
 * Clear the connection pool (useful for testing)
 */
export function clearConnectionPool(): void {
  connectionPool = null;
  console.log('[Salesforce] Connection pool cleared');
}
