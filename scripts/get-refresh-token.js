#!/usr/bin/env node

/**
 * Simple OAuth Script - Get Refresh Token
 * This version doesn't auto-open browser
 */

const jsforce = require('jsforce');
const http = require('http');
const url = require('url');
require('dotenv').config({ path: '.env.local' });

const PORT = 3333;
const REDIRECT_URI = `http://localhost:${PORT}/callback`;

const clientId = process.env.SALESFORCE_CLIENT_ID;
const clientSecret = process.env.SALESFORCE_CLIENT_SECRET;
const instanceUrl = process.env.SALESFORCE_INSTANCE_URL;

if (!clientId || !clientSecret) {
  console.error('❌ Missing SALESFORCE_CLIENT_ID or SALESFORCE_CLIENT_SECRET in .env.local');
  process.exit(1);
}

// Use login.salesforce.com for Developer Edition
const loginUrl = 'https://login.salesforce.com';

const oauth2 = new jsforce.OAuth2({
  clientId: clientId,
  clientSecret: clientSecret,
  redirectUri: REDIRECT_URI,
  loginUrl: loginUrl,
});

const server = http.createServer(async (req, res) => {
  const reqUrl = url.parse(req.url, true);
  
  if (reqUrl.pathname === '/callback') {
    const code = reqUrl.query.code;
    
    if (!code) {
      res.writeHead(400, { 'Content-Type': 'text/html' });
      res.end('<h1>❌ Error</h1><p>No authorization code received.</p>');
      server.close();
      process.exit(1);
      return;
    }

    try {
      const conn = new jsforce.Connection({ oauth2 });
      await conn.authorize(code);
      
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
              <p>Authorization complete!</p>
              <p style="margin-top: 1rem;">Check your terminal for the refresh token.</p>
            </div>
          </body>
        </html>
      `);
      
      console.log('\n' + '='.repeat(70));
      console.log('✨ SUCCESS! OAuth tokens obtained');
      console.log('='.repeat(70));
      console.log('\n📝 Add this line to your .env.local file:\n');
      console.log('SALESFORCE_REFRESH_TOKEN=' + conn.refreshToken);
      console.log('\n' + '='.repeat(70));
      console.log('\n✅ Next: Restart your dev server and test the connection!');
      console.log('   Test: curl http://localhost:3001/api/test-sf-oauth\n');
      
      setTimeout(() => {
        server.close();
        process.exit(0);
      }, 2000);
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'text/html' });
      res.end('<h1>❌ Error</h1><p>' + error.message + '</p>');
      console.error('\n❌ Error:', error.message);
      server.close();
      process.exit(1);
    }
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  const authUrl = oauth2.getAuthorizationUrl({ scope: 'api refresh_token full' });
  
  console.log('\n' + '='.repeat(70));
  console.log('🔐 Salesforce OAuth 2.0 - Get Refresh Token');
  console.log('='.repeat(70));
  console.log('\n✓ Callback server running on http://localhost:' + PORT);
  console.log('✓ Login URL:', loginUrl);
  console.log('\n📱 COPY AND PASTE THIS URL INTO YOUR BROWSER:\n');
  console.log(authUrl);
  console.log('\n⏳ Waiting for authorization...');
  console.log('   (After you click "Allow" in Salesforce, you\'ll be redirected back)\n');
});
