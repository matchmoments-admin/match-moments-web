#!/usr/bin/env node

/**
 * Quick OAuth Connection Test
 * Tests if your Salesforce OAuth credentials are working
 */

const jsforce = require('jsforce');
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Testing Salesforce OAuth Connection...\n');

// Check environment variables
console.log('📋 Environment Configuration:');
console.log('─'.repeat(50));
console.log('Client ID:', process.env.SALESFORCE_CLIENT_ID ? 
  process.env.SALESFORCE_CLIENT_ID.substring(0, 20) + '...' : '❌ NOT SET');
console.log('Client Secret:', process.env.SALESFORCE_CLIENT_SECRET ? 
  '✓ Set (' + process.env.SALESFORCE_CLIENT_SECRET.length + ' chars)' : '❌ NOT SET');
console.log('Refresh Token:', process.env.SALESFORCE_REFRESH_TOKEN ? 
  '✓ Set (' + process.env.SALESFORCE_REFRESH_TOKEN.length + ' chars)' : '❌ NOT SET');
console.log('Instance URL:', process.env.SALESFORCE_INSTANCE_URL || '❌ NOT SET');
console.log('');

// Validate required vars
if (!process.env.SALESFORCE_CLIENT_ID || 
    !process.env.SALESFORCE_CLIENT_SECRET || 
    !process.env.SALESFORCE_REFRESH_TOKEN) {
  console.error('❌ Missing required environment variables!\n');
  console.error('Please ensure your .env.local has:');
  console.error('  - SALESFORCE_CLIENT_ID');
  console.error('  - SALESFORCE_CLIENT_SECRET');
  console.error('  - SALESFORCE_REFRESH_TOKEN');
  console.error('\nRun: npm run sf:oauth-setup');
  process.exit(1);
}

// Determine login URL
const instanceUrl = process.env.SALESFORCE_INSTANCE_URL?.toLowerCase();
const isSandbox = instanceUrl?.includes('.sandbox.my.salesforce.com');
const loginUrl = isSandbox ? 'https://test.salesforce.com' : 'https://login.salesforce.com';

console.log('🔐 OAuth Configuration:');
console.log('─'.repeat(50));
console.log('Login URL:', loginUrl);
console.log('Org Type:', isSandbox ? 'Sandbox' : 'Production/Developer Edition');
console.log('');

// Test connection
(async () => {
  try {
    console.log('🧪 Attempting OAuth connection...');
    console.log('─'.repeat(50));
    
    const oauth2 = new jsforce.OAuth2({
      clientId: process.env.SALESFORCE_CLIENT_ID,
      clientSecret: process.env.SALESFORCE_CLIENT_SECRET,
      redirectUri: process.env.SALESFORCE_REDIRECT_URI || 'http://localhost:3333/callback',
      loginUrl: loginUrl,
    });

    const conn = new jsforce.Connection({
      oauth2: oauth2,
      instanceUrl: process.env.SALESFORCE_INSTANCE_URL,
      refreshToken: process.env.SALESFORCE_REFRESH_TOKEN,
    });

    // Test the connection
    const identity = await conn.identity();
    
    console.log('\n✅ SUCCESS! Connected to Salesforce\n');
    console.log('📊 Connection Details:');
    console.log('─'.repeat(50));
    console.log('User ID:', identity.user_id);
    console.log('Username:', identity.username);
    console.log('Display Name:', identity.display_name);
    console.log('Email:', identity.email);
    console.log('Organization ID:', identity.organization_id);
    console.log('Instance URL:', conn.instanceUrl);
    console.log('');
    
    console.log('🎉 Your OAuth setup is working correctly!\n');
    console.log('Next steps:');
    console.log('  1. Start your dev server: npm run dev');
    console.log('  2. Test in browser: http://localhost:3001/api/test-salesforce-data/connection');
    console.log('  3. Try logging in with Google and accessing Salesforce data');
    
  } catch (error) {
    console.error('\n❌ FAILED to connect!\n');
    console.error('Error:', error.message);
    console.error('');
    
    if (error.message.includes('invalid_grant') || error.message.includes('authentication failure')) {
      console.error('💡 This means your refresh token is invalid or expired.\n');
      console.error('Common causes:');
      console.error('  1. Wrong login URL (should be login.salesforce.com for Developer Edition)');
      console.error('  2. Refresh token was revoked in Salesforce');
      console.error('  3. Connected App settings changed');
      console.error('  4. Using wrong Salesforce org');
      console.error('');
      console.error('🔧 Fix:');
      console.error('  1. Run: npm run sf:oauth-setup');
      console.error('  2. Make sure browser opens to login.salesforce.com');
      console.error('  3. Log in and approve access');
      console.error('  4. Copy the new refresh token to .env.local');
      console.error('  5. Run this test again');
    } else if (error.message.includes('redirect_uri_mismatch')) {
      console.error('💡 Your callback URL doesn\'t match the Connected App.\n');
      console.error('🔧 Fix:');
      console.error('  1. Go to Salesforce Setup → App Manager');
      console.error('  2. Edit your Connected App');
      console.error('  3. Make sure Callback URL is: http://localhost:3333/callback');
      console.error('  4. Save and try again');
    } else {
      console.error('💡 Unexpected error. Check the error message above.\n');
      console.error('🔧 Try:');
      console.error('  1. Verify all environment variables are set correctly');
      console.error('  2. Check Salesforce Connected App is Active');
      console.error('  3. Run: npm run sf:oauth-setup');
    }
    
    console.error('\n📖 For more help, see: SALESFORCE_OAUTH_FIX.md\n');
    process.exit(1);
  }
})();
