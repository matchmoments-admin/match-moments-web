import { Connection } from 'jsforce';

let connectionPool: Connection | null = null;

/**
 * Get or create a Salesforce connection using username/password authentication
 * 
 * Required environment variables:
 * - SALESFORCE_USERNAME: Your Salesforce username
 * - SALESFORCE_PASSWORD: Your Salesforce password
 * - SALESFORCE_SECURITY_TOKEN: Your Salesforce security token (if required)
 * - SALESFORCE_INSTANCE_URL: Your Salesforce instance URL (e.g., https://orgfarm-ea0fd22bba-dev-ed.develop.my.salesforce.com)
 */
export async function getSalesforceConnection(): Promise<Connection> {
  // Return existing connection if valid
  if (connectionPool && connectionPool.accessToken) {
    try {
      // Test connection is still valid
      await connectionPool.identity();
      return connectionPool;
    } catch (error) {
      // Connection expired, create new one
      console.log('[Salesforce] Connection expired, reconnecting...');
      connectionPool = null;
    }
  }

  // Username/password authentication
  if (!process.env.SALESFORCE_USERNAME || !process.env.SALESFORCE_PASSWORD) {
    throw new Error(
      'Missing Salesforce credentials. Please set SALESFORCE_USERNAME and SALESFORCE_PASSWORD in your .env.local file.'
    );
  }

  try {
    // Determine login URL based on instance URL
    let loginUrl = 'https://login.salesforce.com';
    
    // If instance URL contains sandbox/develop/test domains, use test.salesforce.com
    if (process.env.SALESFORCE_INSTANCE_URL) {
      const instanceUrl = process.env.SALESFORCE_INSTANCE_URL.toLowerCase();
      if (instanceUrl.includes('sandbox') || 
          instanceUrl.includes('develop') || 
          instanceUrl.includes('test') ||
          instanceUrl.includes('scratch')) {
        loginUrl = 'https://test.salesforce.com';
      }
    }

    const conn = new Connection({ loginUrl });

    // Combine password with security token (if provided)
      const password = process.env.SALESFORCE_PASSWORD + (process.env.SALESFORCE_SECURITY_TOKEN || '');
    
    console.log(`[Salesforce] Connecting to ${loginUrl}...`);
      await conn.login(process.env.SALESFORCE_USERNAME, password);

      connectionPool = conn;
    console.log(`[Salesforce] ✓ Connected successfully to ${conn.instanceUrl}`);
    
      return conn;
  } catch (error: any) {
    console.error('[Salesforce] Connection failed:', error.message);
    throw new Error(
      `Failed to connect to Salesforce: ${error.message}. Please check your credentials and security token.`
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

