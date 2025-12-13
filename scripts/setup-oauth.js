#!/usr/bin/env node

/**
 * Salesforce OAuth 2.0 Setup Script
 * 
 * This script helps you obtain a refresh token for OAuth 2.0 authentication
 * by walking you through the OAuth flow and providing a local callback server.
 */

const jsforce = require('jsforce');
const http = require('http');
const url = require('url');
const open = require('open');
require('dotenv').config({ path: '.env.local' });

const PORT = 3333;
const REDIRECT_URI = `http://localhost:${PORT}/callback`;

console.log('🔐 Salesforce OAuth 2.0 Setup\n');
console.log('='.repeat(50));

// Validate environment variables
const clientId = process.env.SALESFORCE_CLIENT_ID;
const clientSecret = process.env.SALESFORCE_CLIENT_SECRET;
const instanceUrl = process.env.SALESFORCE_INSTANCE_URL;

console.log('\n📋 Step 1: Checking Prerequisites');
console.log('-'.repeat(50));

if (!clientId || !clientSecret) {
  console.error('\n❌ Missing OAuth credentials!');
  console.error('\nYou need to:');
  console.error('1. Create a Connected App in Salesforce (see SALESFORCE_SETUP.md)');
  console.error('2. Add these to your .env.local file:');
  console.error('   SALESFORCE_CLIENT_ID=your_consumer_key');
  console.error('   SALESFORCE_CLIENT_SECRET=your_consumer_secret');
  console.error('\nThen run this script again.');
  process.exit(1);
}

console.log('✓ Client ID:', clientId.substring(0, 20) + '...');
console.log('✓ Client Secret:', '*'.repeat(clientSecret.length));
console.log('✓ Instance URL:', instanceUrl || 'Not set');

// Determine login URL
const isDevOrSandbox = instanceUrl?.toLowerCase().includes('sandbox') ||
                       instanceUrl?.toLowerCase().includes('develop') ||
                       instanceUrl?.toLowerCase().includes('test') ||
                       instanceUrl?.toLowerCase().includes('scratch');

const loginUrl = isDevOrSandbox ? 'https://test.salesforce.com' : 'https://login.salesforce.com';

console.log('\n🔗 Step 2: OAuth Configuration');
console.log('-'.repeat(50));
console.log('Login URL:', loginUrl);
console.log('Redirect URI:', REDIRECT_URI);

// Create OAuth2 instance
const oauth2 = new jsforce.OAuth2({
  clientId: clientId,
  clientSecret: clientSecret,
  redirectUri: REDIRECT_URI,
  loginUrl: loginUrl,
});

console.log('\n⚠️  IMPORTANT: Ensure your Connected App includes this callback URL:');
console.log(`   ${REDIRECT_URI}`);
console.log('\nIf not, add it in Salesforce:');
console.log('   Setup → App Manager → [Your App] → Edit → Callback URL');

// Create callback server
let server;

function createCallbackServer() {
  return new Promise((resolve, reject) => {
    server = http.createServer(async (req, res) => {
      const reqUrl = url.parse(req.url, true);
      
      if (reqUrl.pathname === '/callback') {
        const code = reqUrl.query.code;
        
        if (!code) {
          res.writeHead(400, { 'Content-Type': 'text/html' });
          res.end('<h1>❌ Error</h1><p>No authorization code received.</p>');
          reject(new Error('No authorization code received'));
          return;
        }

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
          <html>
            <head>
              <style>
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
                  margin: 0;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: white;
                }
                .container {
                  text-align: center;
                  background: rgba(255, 255, 255, 0.1);
                  padding: 3rem;
                  border-radius: 1rem;
                  backdrop-filter: blur(10px);
                }
                h1 { margin: 0 0 1rem 0; font-size: 3rem; }
                p { margin: 0; font-size: 1.2rem; opacity: 0.9; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>✅ Success!</h1>
                <p>Authorization complete. You can close this window.</p>
                <p style="margin-top: 1rem;">Check your terminal for the refresh token.</p>
              </div>
            </body>
          </html>
        `);

        try {
          // Exchange code for tokens
          const conn = new jsforce.Connection({ oauth2 });
          await conn.authorize(code);
          
          resolve({
            accessToken: conn.accessToken,
            refreshToken: conn.refreshToken,
            instanceUrl: conn.instanceUrl,
          });
        } catch (error) {
          reject(error);
        }
      } else {
        res.writeHead(404);
        res.end('Not found');
      }
    });

    server.listen(PORT, () => {
      console.log(`\n🌐 Callback server started on http://localhost:${PORT}`);
    });
  });
}

// Main flow
(async () => {
  try {
    console.log('\n🚀 Step 3: Starting OAuth Flow');
    console.log('-'.repeat(50));
    
    // Start callback server
    const tokenPromise = createCallbackServer();
    
    // Build authorization URL
    const authUrl = oauth2.getAuthorizationUrl({ scope: 'api refresh_token full' });
    
    console.log('\n📱 Opening browser for authorization...');
    console.log('If browser doesn\'t open automatically, visit:');
    console.log(authUrl);
    
    // Open browser
    await open(authUrl);
    
    console.log('\n⏳ Waiting for authorization...');
    console.log('(Log into Salesforce and click "Allow" to authorize access)');
    
    // Wait for callback
    const tokens = await tokenPromise;
    
    // Close server
    server.close();
    
    console.log('\n✨ SUCCESS! OAuth tokens obtained');
    console.log('='.repeat(50));
    console.log('\n📝 Add this to your .env.local file:\n');
    console.log('SALESFORCE_REFRESH_TOKEN=' + tokens.refreshToken);
    console.log('\nYour complete .env.local should have:');
    console.log('SALESFORCE_CLIENT_ID=' + clientId);
    console.log('SALESFORCE_CLIENT_SECRET=' + clientSecret);
    console.log('SALESFORCE_REFRESH_TOKEN=' + tokens.refreshToken);
    console.log('SALESFORCE_INSTANCE_URL=' + tokens.instanceUrl);
    console.log('SALESFORCE_REDIRECT_URI=' + REDIRECT_URI);
    
    console.log('\n✅ Next steps:');
    console.log('1. Copy the refresh token above to your .env.local file');
    console.log('2. Update your imports to use connection-oauth.ts instead of connection.ts');
    console.log('3. Restart your dev server');
    console.log('4. Test the connection: http://localhost:3000/api/test-salesforce-data/connection');
    
    console.log('\n💡 Important: Store the refresh token securely!');
    console.log('   - Never commit it to git');
    console.log('   - For production, use environment variables in Vercel');
    console.log('   - Refresh tokens don\'t expire (until revoked)');
    
  } catch (error) {
    console.error('\n❌ OAuth setup failed:', error.message);
    if (server) server.close();
    process.exit(1);
  }
})();
