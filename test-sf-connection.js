const jsforce = require('jsforce');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  console.log('🔍 Testing Salesforce Connection...\n');
  
  console.log('📋 Environment Configuration:');
  console.log('─────────────────────────────────────');
  console.log('Login URL:', process.env.SALESFORCE_LOGIN_URL || '(not set)');
  console.log('Instance URL:', process.env.SALESFORCE_INSTANCE_URL || '(not set)');
  console.log('Username:', process.env.SALESFORCE_USERNAME || '(not set)');
  console.log('Password length:', process.env.SALESFORCE_PASSWORD?.length || 0);
  console.log('Security Token length:', process.env.SALESFORCE_SECURITY_TOKEN?.length || 0);
  console.log('');

  // Test 1: Try with login.salesforce.com (Developer Edition)
  console.log('🧪 Test 1: Trying login.salesforce.com (Developer Edition default)');
  console.log('─────────────────────────────────────');
  await attemptLogin('https://login.salesforce.com');

  // Test 2: Try with test.salesforce.com (Sandbox/Test)
  console.log('\n🧪 Test 2: Trying test.salesforce.com (Sandbox/Test)');
  console.log('─────────────────────────────────────');
  await attemptLogin('https://test.salesforce.com');
}

async function attemptLogin(loginUrl) {
  try {
    if (!process.env.SALESFORCE_USERNAME || !process.env.SALESFORCE_PASSWORD) {
      console.log('❌ Missing credentials in .env.local');
      return;
    }

    const conn = new jsforce.Connection({ loginUrl });

    // Concatenate password + security token
    const password = process.env.SALESFORCE_PASSWORD + (process.env.SALESFORCE_SECURITY_TOKEN || '');
    
    console.log(`Attempting login to ${loginUrl}...`);
    const userInfo = await conn.login(process.env.SALESFORCE_USERNAME, password);
    
    console.log('\n✅ SUCCESS!');
    console.log('User ID:', userInfo.id);
    console.log('Org ID:', userInfo.organizationId);
    console.log('Access Token:', conn.accessToken?.substring(0, 20) + '...');
    console.log('Instance URL:', conn.instanceUrl);
    
    // Test a query
    console.log('\n📊 Testing SOQL query...');
    const result = await conn.query('SELECT Id, Name, Email FROM User LIMIT 1');
    console.log('Query successful! Found', result.totalSize, 'users');
    if (result.records.length > 0) {
      console.log('Sample user:', {
        Name: result.records[0].Name,
        Email: result.records[0].Email
      });
    }
    
    return true;
  } catch (error) {
    console.error('\n❌ FAILED!');
    console.error('Error:', error.message);
    
    if (error.errorCode) {
      console.error('Error Code:', error.errorCode);
    }
    
    console.error('\n💡 Common issues:');
    console.error('  1. Wrong password or security token');
    console.error('  2. Security token expired (reset in Salesforce: Setup → Reset My Security Token)');
    console.error('  3. User account locked or inactive');
    console.error('  4. IP restrictions (Setup → Network Access → Trusted IP Ranges)');
    console.error('  5. Wrong login URL (Developer Edition = login.salesforce.com, Sandbox = test.salesforce.com)');
    
    return false;
  }
}

testConnection();
