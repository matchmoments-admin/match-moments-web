/**
 * Native Salesforce REST API Client
 * 
 * A zero-dependency Salesforce client using native fetch() and Node.js crypto.
 * Implements JWT Bearer authentication with automatic token refresh.
 * 
 * Features:
 * - JWT Bearer authentication (service-to-service)
 * - Automatic token caching (2-hour lifetime)
 * - Automatic token refresh (5-minute buffer)
 * - Full REST API support (query, create, update, delete)
 * - Comprehensive error handling
 * - TypeScript-first with full type safety
 */

import type {
  SalesforceQueryResponse,
  SalesforceIdentity,
  JWTTokenResponse,
  SalesforceError,
  SalesforceRecord,
} from './types';

/**
 * Configuration for Salesforce client
 */
interface SalesforceClientConfig {
  clientId: string;
  username: string;
  privateKey: string;
  instanceUrl: string;
  loginUrl?: string;
  apiVersion?: string;
}

/**
 * Salesforce REST API Client
 */
export class SalesforceClient {
  private static instance: SalesforceClient | null = null;
  
  private accessToken: string | null = null;
  private instanceUrl: string;
  private isRefreshing: boolean = false;
  private lastRefresh: number = 0;
  private readonly TOKEN_LIFETIME = 7200000; // 2 hours in milliseconds
  private readonly REFRESH_BUFFER = 300000; // Refresh 5 minutes before expiry
  
  private readonly config: Required<SalesforceClientConfig>;
  
  /**
   * Private constructor - use getInstance() instead
   */
  private constructor(config?: Partial<SalesforceClientConfig>) {
    // Load config from environment variables with optional overrides
    this.config = {
      clientId: config?.clientId || process.env.SALESFORCE_JWT_CLIENT_ID || '',
      username: config?.username || process.env.SALESFORCE_JWT_USERNAME || '',
      privateKey: config?.privateKey || process.env.SALESFORCE_JWT_PRIVATE_KEY || '',
      instanceUrl: config?.instanceUrl || process.env.SALESFORCE_INSTANCE_URL || '',
      loginUrl: config?.loginUrl || this.determineLoginUrl(process.env.SALESFORCE_INSTANCE_URL || ''),
      apiVersion: config?.apiVersion || '60.0',
    };
    
    this.instanceUrl = this.config.instanceUrl;
    this.validateConfig();
  }
  
  /**
   * Get singleton instance
   */
  public static getInstance(config?: Partial<SalesforceClientConfig>): SalesforceClient {
    if (!SalesforceClient.instance) {
      SalesforceClient.instance = new SalesforceClient(config);
    }
    return SalesforceClient.instance;
  }
  
  /**
   * Reset singleton instance (useful for testing)
   */
  public static resetInstance(): void {
    SalesforceClient.instance = null;
  }
  
  // ==========================================================================
  // Authentication
  // ==========================================================================
  
  /**
   * Authenticate with Salesforce using JWT Bearer Flow
   */
  public async authenticate(): Promise<void> {
    // Return if already authenticated and token is valid
    if (this.isTokenValid()) {
      console.log('[SF Client] Using cached access token');
      return;
    }
    
    // Wait if already refreshing
    if (this.isRefreshing) {
      console.log('[SF Client] Waiting for token refresh to complete...');
      await this.waitForRefresh();
      return;
    }
    
    // Refresh the token
    await this.refreshToken();
  }
  
  /**
   * Refresh the access token using JWT Bearer Flow
   */
  private async refreshToken(): Promise<void> {
    this.isRefreshing = true;
    
    try {
      console.log(`[SF Client] Authenticating with JWT Bearer Flow to ${this.config.loginUrl}...`);
      
      const jwt = await this.generateJWT();
      const tokenResponse = await this.exchangeJWTForToken(jwt);
      
      this.accessToken = tokenResponse.access_token;
      this.instanceUrl = tokenResponse.instance_url;
      this.lastRefresh = Date.now();
      
      console.log('[SF Client] ✓ Authentication successful');
      console.log(`[SF Client] Instance: ${this.instanceUrl}`);
    } catch (error: any) {
      console.error('[SF Client] Authentication failed:', error.message);
      
      // Provide helpful error messages
      if (error.message?.includes('invalid_grant')) {
        throw new Error(
          'JWT Bearer authentication failed. Possible causes:\n' +
          '1. Certificate not uploaded to Connected App\n' +
          '2. User not pre-authorized in Connected App\n' +
          '3. Private key mismatch with uploaded certificate\n' +
          '4. Connected App not configured for JWT Bearer Flow\n' +
          'See JWT-SETUP.md for configuration steps.'
        );
      }
      
      if (error.message?.includes('invalid_client_id')) {
        throw new Error(
          'Invalid SALESFORCE_JWT_CLIENT_ID. Check your Connected App Consumer Key.'
        );
      }
      
      throw new Error(`Salesforce JWT authentication failed: ${error.message}`);
    } finally {
      this.isRefreshing = false;
    }
  }
  
  /**
   * Generate JWT for authentication
   */
  private async generateJWT(): Promise<string> {
    const crypto = await import('crypto');
    
    // JWT header
    const header = {
      alg: 'RS256',
      typ: 'JWT'
    };
    
    // JWT payload
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: this.config.clientId,
      sub: this.config.username,
      aud: this.config.loginUrl,
      exp: now + 300 // 5 minutes expiration
    };
    
    // Base64URL encode
    const encodeBase64Url = (obj: any): string => {
      return Buffer.from(JSON.stringify(obj))
        .toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
    };
    
    const encodedHeader = encodeBase64Url(header);
    const encodedPayload = encodeBase64Url(payload);
    const signatureInput = `${encodedHeader}.${encodedPayload}`;
    
    // Sign with private key
    const privateKey = this.formatPrivateKey(this.config.privateKey);
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(signatureInput);
    const signature = sign.sign(privateKey, 'base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
    
    return `${signatureInput}.${signature}`;
  }
  
  /**
   * Exchange JWT for access token
   */
  private async exchangeJWTForToken(jwt: string): Promise<JWTTokenResponse> {
    const tokenEndpoint = `${this.config.loginUrl}/services/oauth2/token`;
    const params = new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    });
    
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error_description || error.error || 'JWT Bearer token exchange failed');
    }
    
    return await response.json();
  }
  
  /**
   * Check if access token is still valid
   */
  private isTokenValid(): boolean {
    if (!this.accessToken) {
      return false;
    }
    
    const tokenAge = Date.now() - this.lastRefresh;
    const isValid = tokenAge < (this.TOKEN_LIFETIME - this.REFRESH_BUFFER);
    
    if (!isValid) {
      console.log('[SF Client] Token expired or close to expiration');
    }
    
    return isValid;
  }
  
  /**
   * Wait for an ongoing token refresh to complete
   */
  private async waitForRefresh(): Promise<void> {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (!this.isRefreshing) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
      
      // Timeout after 30 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        resolve();
      }, 30000);
    });
  }
  
  // ==========================================================================
  // Query Methods
  // ==========================================================================
  
  /**
   * Execute a SOQL query
   * 
   * @example
   * const fixtures = await client.query<Fixture>('SELECT Id, Name FROM Fixture__c');
   */
  public async query<T extends SalesforceRecord>(soql: string): Promise<T[]> {
    await this.authenticate();
    
    const endpoint = `${this.instanceUrl}/services/data/v${this.config.apiVersion}/query`;
    const url = `${endpoint}?q=${encodeURIComponent(soql)}`;
    
    const response = await this.makeRequest<SalesforceQueryResponse<T>>(url, {
      method: 'GET'
    });
    
    return response.records;
  }
  
  /**
   * Execute a SOQL query and fetch all records (including pagination)
   * 
   * @example
   * const allFixtures = await client.queryAll<Fixture>('SELECT Id, Name FROM Fixture__c');
   */
  public async queryAll<T extends SalesforceRecord>(soql: string): Promise<T[]> {
    await this.authenticate();
    
    let allRecords: T[] = [];
    let nextRecordsUrl: string | undefined;
    
    // Initial query
    const endpoint = `${this.instanceUrl}/services/data/v${this.config.apiVersion}/query`;
    const url = `${endpoint}?q=${encodeURIComponent(soql)}`;
    
    let response = await this.makeRequest<SalesforceQueryResponse<T>>(url, {
      method: 'GET'
    });
    
    allRecords = allRecords.concat(response.records);
    nextRecordsUrl = response.nextRecordsUrl;
    
    // Fetch remaining pages
    while (nextRecordsUrl) {
      const nextUrl = `${this.instanceUrl}${nextRecordsUrl}`;
      response = await this.makeRequest<SalesforceQueryResponse<T>>(nextUrl, {
        method: 'GET'
      });
      
      allRecords = allRecords.concat(response.records);
      nextRecordsUrl = response.nextRecordsUrl;
    }
    
    return allRecords;
  }
  
  // ==========================================================================
  // CRUD Operations
  // ==========================================================================
  
  /**
   * Create a new record
   * 
   * @returns The ID of the created record
   * 
   * @example
   * const fixtureId = await client.create('Fixture__c', {
   *   Name: 'Arsenal vs Chelsea',
   *   Status__c: 'Scheduled'
   * });
   */
  public async create(sobject: string, data: Record<string, any>): Promise<string> {
    await this.authenticate();
    
    const endpoint = `${this.instanceUrl}/services/data/v${this.config.apiVersion}/sobjects/${sobject}`;
    
    const response = await this.makeRequest<{ id: string; success: boolean }>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    
    return response.id;
  }
  
  /**
   * Update an existing record
   * 
   * @example
   * await client.update('Fixture__c', 'a0X...', {
   *   Status__c: 'Live - In Progress',
   *   Home_Score_Final__c: 2
   * });
   */
  public async update(sobject: string, id: string, data: Record<string, any>): Promise<void> {
    await this.authenticate();
    
    const endpoint = `${this.instanceUrl}/services/data/v${this.config.apiVersion}/sobjects/${sobject}/${id}`;
    
    await this.makeRequest<void>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }
  
  /**
   * Delete a record
   * 
   * @example
   * await client.delete('Fixture__c', 'a0X...');
   */
  public async delete(sobject: string, id: string): Promise<void> {
    await this.authenticate();
    
    const endpoint = `${this.instanceUrl}/services/data/v${this.config.apiVersion}/sobjects/${sobject}/${id}`;
    
    await this.makeRequest<void>(endpoint, {
      method: 'DELETE'
    });
  }
  
  /**
   * Get a single record by ID
   * 
   * @example
   * const fixture = await client.retrieve<Fixture>('Fixture__c', 'a0X...', [
   *   'Id', 'Name', 'Status__c'
   * ]);
   */
  public async retrieve<T extends SalesforceRecord>(
    sobject: string,
    id: string,
    fields: string[]
  ): Promise<T> {
    await this.authenticate();
    
    const endpoint = `${this.instanceUrl}/services/data/v${this.config.apiVersion}/sobjects/${sobject}/${id}`;
    const url = `${endpoint}?fields=${fields.join(',')}`;
    
    return await this.makeRequest<T>(url, {
      method: 'GET'
    });
  }
  
  // ==========================================================================
  // Utility Methods
  // ==========================================================================
  
  /**
   * Get user identity information
   */
  public async getIdentity(): Promise<SalesforceIdentity> {
    await this.authenticate();
    
    const endpoint = `${this.instanceUrl}/services/oauth2/userinfo`;
    
    return await this.makeRequest<SalesforceIdentity>(endpoint, {
      method: 'GET'
    });
  }
  
  /**
   * Get client status for health checks
   */
  public getStatus(): {
    connected: boolean;
    lastRefresh: number;
    tokenAge: number;
    instanceUrl: string;
  } {
    return {
      connected: this.accessToken !== null && this.isTokenValid(),
      lastRefresh: this.lastRefresh,
      tokenAge: this.lastRefresh > 0 ? Date.now() - this.lastRefresh : 0,
      instanceUrl: this.instanceUrl,
    };
  }
  
  /**
   * Force a new authentication (useful for error recovery)
   */
  public async forceReconnect(): Promise<void> {
    console.log('[SF Client] Force reconnecting...');
    this.accessToken = null;
    this.lastRefresh = 0;
    await this.authenticate();
  }
  
  // ==========================================================================
  // Private Helper Methods
  // ==========================================================================
  
  /**
   * Make an authenticated HTTP request to Salesforce
   */
  private async makeRequest<T>(url: string, options: RequestInit): Promise<T> {
    if (!this.accessToken) {
      throw new Error('Not authenticated. Call authenticate() first.');
    }
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    // Handle HTTP errors
    if (!response.ok) {
      await this.handleErrorResponse(response);
    }
    
    // Handle 204 No Content (successful update/delete)
    if (response.status === 204) {
      return undefined as T;
    }
    
    return await response.json();
  }
  
  /**
   * Handle error responses from Salesforce
   */
  private async handleErrorResponse(response: Response): Promise<never> {
    let errorMessage = `Salesforce API error: ${response.status} ${response.statusText}`;
    
    try {
      const errorData = await response.json();
      
      // Salesforce returns errors as an array
      if (Array.isArray(errorData) && errorData.length > 0) {
        const errors = errorData as SalesforceError[];
        errorMessage = errors.map(e => `${e.errorCode}: ${e.message}`).join(', ');
      } else if (errorData.error) {
        errorMessage = errorData.error_description || errorData.error;
      }
    } catch {
      // If we can't parse the error, use the default message
    }
    
    throw new Error(errorMessage);
  }
  
  /**
   * Validate configuration
   */
  private validateConfig(): void {
    const required = ['clientId', 'username', 'privateKey', 'instanceUrl'] as const;
    const missing = required.filter(key => !this.config[key]);
    
    if (missing.length > 0) {
      throw new Error(
        `Missing required Salesforce configuration: ${missing.join(', ')}\n` +
        'Set the following environment variables:\n' +
        '- SALESFORCE_JWT_CLIENT_ID\n' +
        '- SALESFORCE_JWT_USERNAME\n' +
        '- SALESFORCE_JWT_PRIVATE_KEY\n' +
        '- SALESFORCE_INSTANCE_URL\n' +
        'See JWT-SETUP.md for details.'
      );
    }
  }
  
  /**
   * Determine login URL based on instance URL
   */
  private determineLoginUrl(instanceUrl: string): string {
    const lowerUrl = instanceUrl.toLowerCase();
    
    // Use test.salesforce.com for sandboxes
    if (lowerUrl.includes('.sandbox.my.salesforce.com')) {
      return 'https://test.salesforce.com';
    }
    
    // Use login.salesforce.com for production and Developer Edition
    return 'https://login.salesforce.com';
  }
  
  /**
   * Format private key to ensure proper line breaks
   */
  private formatPrivateKey(key: string): string {
    // Remove any existing formatting
    let formatted = key.replace(/\\n/g, '\n').trim();
    
    // Ensure proper BEGIN/END markers
    if (!formatted.startsWith('-----BEGIN')) {
      formatted = '-----BEGIN PRIVATE KEY-----\n' + formatted;
    }
    if (!formatted.endsWith('-----')) {
      formatted = formatted + '\n-----END PRIVATE KEY-----';
    }
    
    return formatted;
  }
}

// ==========================================================================
// Convenience Exports
// ==========================================================================

/**
 * Get the singleton Salesforce client instance
 * 
 * @example
 * const client = getSalesforceClient();
 * const fixtures = await client.query<Fixture>('SELECT Id, Name FROM Fixture__c');
 */
export function getSalesforceClient(): SalesforceClient {
  return SalesforceClient.getInstance();
}

/**
 * Test if Salesforce connection is working
 */
export async function testSalesforceConnection(): Promise<boolean> {
  try {
    const client = getSalesforceClient();
    await client.authenticate();
    await client.getIdentity();
    return true;
  } catch (error: any) {
    console.error('[SF Client] Connection test failed:', error.message);
    return false;
  }
}

