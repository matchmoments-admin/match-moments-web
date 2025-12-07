import jsforce from 'jsforce';

let connectionPool: jsforce.Connection | null = null;

export async function getSalesforceConnection(): Promise<jsforce.Connection> {
  // Return existing connection if valid
  if (connectionPool && connectionPool.accessToken) {
    try {
      // Test connection
      await connectionPool.identity();
      return connectionPool;
    } catch (error) {
      // Connection expired, create new one
      console.log('[SF] Connection expired, refreshing...');
      connectionPool = null;
    }
  }

  // Create new connection with OAuth 2.0
  if (process.env.SALESFORCE_CLIENT_ID && process.env.SALESFORCE_CLIENT_SECRET) {
    const oauth2 = new jsforce.OAuth2({
      loginUrl: process.env.SALESFORCE_LOGIN_URL || 'https://login.salesforce.com',
      clientId: process.env.SALESFORCE_CLIENT_ID,
      clientSecret: process.env.SALESFORCE_CLIENT_SECRET,
      redirectUri: process.env.SALESFORCE_REDIRECT_URI || 'http://localhost:3000/api/auth/salesforce/callback',
    });

    const conn = new jsforce.Connection({
      oauth2,
      instanceUrl: process.env.SALESFORCE_INSTANCE_URL,
      accessToken: process.env.SALESFORCE_ACCESS_TOKEN,
      refreshToken: process.env.SALESFORCE_REFRESH_TOKEN,
    });

    connectionPool = conn;
    console.log('[SF] OAuth connection established');
    return conn;
  }

  // Fallback to username/password flow for development
  if (process.env.SALESFORCE_USERNAME && process.env.SALESFORCE_PASSWORD) {
    const conn = new jsforce.Connection({
      loginUrl: process.env.SALESFORCE_LOGIN_URL || 'https://login.salesforce.com',
    });

    const password = process.env.SALESFORCE_PASSWORD + (process.env.SALESFORCE_SECURITY_TOKEN || '');
    await conn.login(process.env.SALESFORCE_USERNAME, password);

    connectionPool = conn;
    console.log('[SF] Username/password connection established');
    return conn;
  }

  throw new Error('No Salesforce credentials configured');
}

export async function testSalesforceConnection(): Promise<boolean> {
  try {
    const conn = await getSalesforceConnection();
    await conn.identity();
    return true;
  } catch (error) {
    console.error('[SF] Connection test failed:', error);
    return false;
  }
}

