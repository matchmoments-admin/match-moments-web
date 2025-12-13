#!/usr/bin/env node

/**
 * Salesforce Connection Diagnostic Tool
 * 
 * This script helps identify connection issues by testing various configurations
 */

const jsforce = require('jsforce');
require('dotenv').config({ path: '.env.local' });

const username = process.env.SALESFORCE_USERNAME;
const password = process.env.SALESFORCE_PASSWORD;
const securityToken = process.env.SALESFORCE_SECURITY_TOKEN;
const instanceUrl = process.env.SALESFORCE_INSTANCE_URL;

console.log('🔍 Salesforce Connection Diagnostic\n');
console.log('='.repeat(50));

// Step 1: Check environment variables
console.log('\n📋 Step 1: Environment Variables Check');
console.log('-'.repeat(50));
console.log('✓ Username:', username ? `${username.substring(0, 10)}...` : '❌ MISSING');
console.log('✓ Password:', password ? `${'*'.repeat(password.length)} (${password.length} chars)` : '❌ MISSING');
console.log('✓ Security Token:', securityToken ? `${'*'.repeat(securityToken.length)} (${securityToken.length} chars)` : '⚠️  NOT SET');
console.log('✓ Instance URL:', instanceUrl || '❌ MISSING');

if (!username || !password) {
  console.error('\n❌ Missing required credentials. Please check your .env.local file.');
  process.exit(1);
}

// Step 2: Determine correct login URL
console.log('\n🔗 Step 2: Login URL Detection');
console.log('-'.repeat(50));

// Developer Edition (.develop.my.salesforce.com) uses login.salesforce.com
// Sandboxes (.sandbox.my.salesforce.com) use test.salesforce.com
const isActualSandbox = instanceUrl?.toLowerCase().includes('.sandbox.') ||
                        instanceUrl?.toLowerCase().includes('--') || // Scratch orgs
                        instanceUrl?.toLowerCase().match(/\.cs\d+\.my\.salesforce/); // Test instances

const isDeveloperEdition = instanceUrl?.toLowerCase().includes('.develop.');

const loginUrl = isActualSandbox ? 'https://test.salesforce.com' : 'https://login.salesforce.com';

let orgType = 'Production';
if (isDeveloperEdition) orgType = 'Developer Edition';
if (isActualSandbox) orgType = 'Sandbox/Test';

console.log('Instance type:', orgType);
console.log('Login URL:', loginUrl);

// Step 3: Test connection configurations
async function testConnection() {
  console.log('\n🧪 Step 3: Testing Connection Configurations');
  console.log('-'.repeat(50));

  const configurations = [
    {
      name: 'Config 1: Password + Security Token (concatenated)',
      password: password + (securityToken || ''),
      loginUrl: loginUrl
    },
    {
      name: 'Config 2: Password only (no token)',
      password: password,
      loginUrl: loginUrl
    },
    {
      name: 'Config 3: test.salesforce.com (forced)',
      password: password + (securityToken || ''),
      loginUrl: 'https://test.salesforce.com'
    },
    {
      name: 'Config 4: login.salesforce.com (forced)',
      password: password + (securityToken || ''),
      loginUrl: 'https://login.salesforce.com'
    }
  ];

  for (const config of configurations) {
    console.log(`\n🔄 Testing: ${config.name}`);
    console.log(`   Login URL: ${config.loginUrl}`);
    console.log(`   Password length: ${config.password.length} chars`);
    
    try {
      const conn = new jsforce.Connection({ loginUrl: config.loginUrl });
      const userInfo = await conn.login(username, config.password);
      
      console.log('   ✅ SUCCESS!');
      console.log('   User ID:', userInfo.id);
      console.log('   Org ID:', userInfo.organizationId);
      console.log('   Instance URL:', conn.instanceUrl);
      
      console.log('\n✨ WORKING CONFIGURATION FOUND!');
      console.log('='.repeat(50));
      console.log('Use these settings in your .env.local:');
      console.log(`SALESFORCE_USERNAME=${username}`);
      console.log(`SALESFORCE_PASSWORD=${password}`);
      if (securityToken) {
        console.log(`SALESFORCE_SECURITY_TOKEN=${securityToken}`);
      }
      console.log(`SALESFORCE_INSTANCE_URL=${instanceUrl}`);
      console.log('\nAnd ensure your connection code uses:');
      console.log(`loginUrl: '${config.loginUrl}'`);
      
      return true;
    } catch (error) {
      console.log('   ❌ FAILED:', error.message);
      if (error.errorCode) {
        console.log('   Error code:', error.errorCode);
      }
    }
  }

  return false;
}

// Step 4: Common issues check
async function checkCommonIssues() {
  console.log('\n🩺 Step 4: Common Issues Check');
  console.log('-'.repeat(50));

  const issues = [];

  // Check if password contains special characters
  if (/[^a-zA-Z0-9!@#$%^&*()_+=\-]/.test(password)) {
    issues.push('⚠️  Password contains unusual special characters - ensure they\'re escaped correctly');
  }

  // Check if username is an email
  if (!username.includes('@')) {
    issues.push('❌ Username should be a full email address (e.g., user@example.com)');
  }

  // Check if security token looks valid (usually alphanumeric)
  if (securityToken && !/^[a-zA-Z0-9]+$/.test(securityToken)) {
    issues.push('⚠️  Security token contains non-alphanumeric characters - this is unusual');
  }

  // Check instance URL format
  if (instanceUrl && !instanceUrl.startsWith('https://')) {
    issues.push('❌ Instance URL should start with https://');
  }

  if (issues.length > 0) {
    console.log('\nPotential issues found:');
    issues.forEach(issue => console.log(issue));
  } else {
    console.log('✓ No obvious configuration issues detected');
  }
}

// Run diagnostic
(async () => {
  try {
    await checkCommonIssues();
    const success = await testConnection();
    
    if (!success) {
      console.log('\n❌ All configurations failed');
      console.log('='.repeat(50));
      console.log('\n💡 Next steps:');
      console.log('1. Verify you can log into Salesforce web interface with these credentials');
      console.log('2. Reset your security token:');
      console.log('   - Log into Salesforce');
      console.log('   - Click profile → Settings');
      console.log('   - Personal → Reset My Security Token');
      console.log('   - Check your email for the new token');
      console.log('3. If using a sandbox/developer org, ensure you\'re using the sandbox login');
      console.log('4. Check if your account is locked (too many failed login attempts)');
      console.log('5. Verify IP restrictions on your Salesforce profile');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n❌ Diagnostic failed:', error.message);
    process.exit(1);
  }
})();
