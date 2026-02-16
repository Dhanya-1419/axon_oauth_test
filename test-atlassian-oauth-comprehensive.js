#!/usr/bin/env node

/**
 * Comprehensive Atlassian OAuth Testing Script
 * 
 * Uses credentials from .env.local to test both Jira and Confluence OAuth flows
 * Tests client credentials, authorization flow, and API access
 */

const https = require('https');
const querystring = require('querystring');
const fs = require('fs');
const path = require('path');

console.log('🔑 Atlassian OAuth Testing with .env.local Credentials');
console.log('====================================================\n');

// Load credentials from .env.local
function loadEnvCredentials() {
  const envPath = path.join(__dirname, '.env.local');
  
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.local file not found!');
    process.exit(1);
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#][^=]+)=(.+)$/);
    if (match) {
      envVars[match[1].trim()] = match[2].trim();
    }
  });
  
  return envVars;
}

const env = loadEnvCredentials();

// Atlassian credentials from .env.local
const ATLASSIAN_CLIENT_ID = env.ATLASSIAN_CLIENT_ID;
const ATLASSIAN_CLIENT_SECRET = env.ATLASSIAN_CLIENT_SECRET;

if (!ATLASSIAN_CLIENT_ID || !ATLASSIAN_CLIENT_SECRET) {
  console.error('❌ ATLASSIAN_CLIENT_ID or ATLASSIAN_CLIENT_SECRET not found in .env.local');
  process.exit(1);
}

const JIRA_REDIRECT_URI = 'http://localhost:3000/api/oauth/callback/jira';
const CONFLUENCE_REDIRECT_URI = 'http://localhost:3000/api/oauth/callback/confluence';

console.log('📋 Credentials Loaded:');
console.log(`   Client ID: ${ATLASSIAN_CLIENT_ID}`);
console.log(`   Client Secret: ${ATLASSIAN_CLIENT_SECRET.substring(0, 10)}...`);
console.log(`   Jira Redirect URI: ${JIRA_REDIRECT_URI}`);
console.log(`   Confluence Redirect URI: ${CONFLUENCE_REDIRECT_URI}\n`);

async function testClientCredentials(clientId, clientSecret, serviceName) {
  console.log(`🧪 Testing ${serviceName} Client Credentials:`);
  
  try {
    const tokenResponse = await makeRequest('https://auth.atlassian.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: querystring.stringify({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (tokenResponse.statusCode === 200) {
      console.log('   ✅ Client credentials are valid!');
      const data = JSON.parse(tokenResponse.data);
      console.log('   🔑 Token Response:');
      console.log(`      Access Token: ${data.access_token?.substring(0, 20)}...`);
      console.log(`      Token Type: ${data.token_type}`);
      console.log(`      Expires In: ${data.expires_in} seconds`);
      console.log(`      Scope: ${data.scope || 'No scope specified'}`);
      
      return { success: true, token: data.access_token };
    } else {
      console.log('   ❌ Client credentials test failed:');
      console.log(`      Status: ${tokenResponse.statusCode}`);
      console.log(`      Response: ${tokenResponse.data}`);
      
      if (tokenResponse.statusCode === 400) {
        console.log('   💡 Possible issues:');
        console.log('      - Client ID or Secret is incorrect');
        console.log('      - App doesn\'t support client_credentials flow');
        console.log('      - App not properly configured in Atlassian');
      }
      return { success: false, error: `Client credentials failed: ${tokenResponse.statusCode}` };
    }
  } catch (error) {
    console.error(`   ❌ Test failed:`, error.message);
    return { success: false, error: error.message };
  }
}

async function testAPIAccess(accessToken, serviceName) {
  console.log(`\n🌐 Testing ${serviceName} API Access:`);
  
  try {
    // Test user info endpoint
    const userResponse = await makeRequest('https://api.atlassian.com/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    });

    if (userResponse.statusCode === 200) {
      console.log('   ✅ User API access successful!');
      const userData = JSON.parse(userResponse.data);
      console.log('   👤 User Info:');
      console.log(`      Account ID: ${userData.account_id}`);
      console.log(`      Account Type: ${userData.account_type}`);
      console.log(`      Email: ${userData.email || 'Not provided'}`);
      console.log(`      Name: ${userData.name || 'Not provided'}`);
      
      // Test accessible resources
      console.log('\n   🔍 Testing Accessible Resources:');
      const resourcesResponse = await makeRequest('https://api.atlassian.com/oauth/token/accessible-resources', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      });

      if (resourcesResponse.statusCode === 200) {
        const resources = JSON.parse(resourcesResponse.data);
        console.log(`   ✅ Found ${resources.length} accessible resources:`);
        resources.forEach((resource, index) => {
          console.log(`      ${index + 1}. ${resource.name} (${resource.type}) - ID: ${resource.id}`);
        });
      } else {
        console.log(`   ⚠️  Could not fetch accessible resources: ${resourcesResponse.statusCode}`);
      }
      
      return { success: true, userData, resources };
    } else {
      console.log('   ❌ User API access failed:');
      console.log(`      Status: ${userResponse.statusCode}`);
      console.log(`      Response: ${userResponse.data}`);
      return { success: false, error: `User API failed: ${userResponse.statusCode}` };
    }
  } catch (error) {
    console.error(`   ❌ API test failed:`, error.message);
    return { success: false, error: error.message };
  }
}

function generateOAuthUrl(clientId, redirectUri, serviceName, scopes) {
  console.log(`\n🔗 Generating OAuth URL for ${serviceName}:`);
  
  const authUrl = `https://auth.atlassian.com/authorize?` + querystring.stringify({
    audience: 'api.atlassian.com',
    client_id: clientId,
    scope: scopes,
    redirect_uri: redirectUri,
    response_type: 'code',
    prompt: 'consent',
    state: Math.random().toString(36).substring(7),
  });
  
  console.log(`   📱 OAuth URL: ${authUrl}`);
  console.log(`   🎯 Scopes: ${scopes}`);
  return authUrl;
}

async function testOAuthEndpoints(serviceName) {
  console.log(`\n🌐 Testing ${serviceName} OAuth Endpoints (requires dev server):`);
  
  try {
    // Test OAuth start endpoint
    const startResponse = await makeRequest(`http://localhost:3000/api/oauth/start/${serviceName.toLowerCase()}`, {
      method: 'GET',
      timeout: 5000,
    });
    
    if (startResponse.statusCode === 307) {
      console.log('   ✅ OAuth start endpoint working (redirecting to Atlassian)');
    } else if (startResponse.statusCode === 404) {
      console.log('   ⚠️  OAuth start endpoint not found (dev server may not be running)');
    } else {
      console.log(`   ❌ OAuth start endpoint failed: ${startResponse.statusCode}`);
    }
  } catch (error) {
    console.log('   ⚠️  Could not test OAuth endpoints (dev server not running?)');
  }
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https://');
    const req = (isHttps ? https : require('http')).request(url, {
      method: options.method || 'GET',
      headers: options.headers || {},
      timeout: options.timeout || 10000,
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          data: data,
          headers: res.headers,
        });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

// Main execution
async function main() {
  console.log('🚀 Starting Comprehensive Atlassian OAuth Tests\n');
  
  // Test 1: Client credentials for Jira
  const jiraCredsResult = await testClientCredentials(ATLASSIAN_CLIENT_ID, ATLASSIAN_CLIENT_SECRET, 'Jira');
  
  // Test 2: Client credentials for Confluence (same credentials, different context)
  const confluenceCredsResult = await testClientCredentials(ATLASSIAN_CLIENT_ID, ATLASSIAN_CLIENT_SECRET, 'Confluence');
  
  let jiraApiResult = { success: false };
  let confluenceApiResult = { success: false };
  
  // Test 3: API access if credentials are valid
  if (jiraCredsResult.success) {
    jiraApiResult = await testAPIAccess(jiraCredsResult.token, 'Jira');
  }
  
  if (confluenceCredsResult.success) {
    confluenceApiResult = await testAPIAccess(confluenceCredsResult.token, 'Confluence');
  }
  
  // Test 4: Generate OAuth URLs
  const jiraScopes = 'read:jira-work read:jira-user read:account offline_access';
  const confluenceScopes = 'read:confluence-content.summary read:confluence-space:confluence read:confluence-user:confluence offline_access';
  
  generateOAuthUrl(ATLASSIAN_CLIENT_ID, JIRA_REDIRECT_URI, 'Jira', jiraScopes);
  generateOAuthUrl(ATLASSIAN_CLIENT_ID, CONFLUENCE_REDIRECT_URI, 'Confluence', confluenceScopes);
  
  // Test 5: Test local OAuth endpoints
  await testOAuthEndpoints('Jira');
  await testOAuthEndpoints('Confluence');
  
  // Summary
  console.log('\n🎯 Test Results Summary:');
  console.log('=====================================');
  console.log(`   Jira Client Credentials: ${jiraCredsResult.success ? '✅ Valid' : '❌ Invalid'}`);
  console.log(`   Confluence Client Credentials: ${confluenceCredsResult.success ? '✅ Valid' : '❌ Invalid'}`);
  console.log(`   Jira API Access: ${jiraApiResult.success ? '✅ Working' : '❌ Failed'}`);
  console.log(`   Confluence API Access: ${confluenceApiResult.success ? '✅ Working' : '❌ Failed'}`);
  
  if (jiraCredsResult.success && confluenceCredsResult.success) {
    console.log('\n✅ Atlassian OAuth Setup is Working!');
    console.log('\n🚀 Next Steps for OAuth Testing:');
    console.log('   1. Start development server: npm run dev');
    console.log('   2. Open browser: http://localhost:3000');
    console.log('   3. Navigate to Jira or Confluence integration');
    console.log('   4. Click "Connect" to test full OAuth flow');
    console.log('   5. Complete authorization in Atlassian');
    console.log('   6. Verify connection status and permissions');
    
    console.log('\n📋 Manual OAuth Testing URLs:');
    console.log(`   Jira: https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=${ATLASSIAN_CLIENT_ID}&scope=${encodeURIComponent(jiraScopes)}&redirect_uri=${encodeURIComponent(JIRA_REDIRECT_URI)}&response_type=code&prompt=consent`);
    console.log(`   Confluence: https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=${ATLASSIAN_CLIENT_ID}&scope=${encodeURIComponent(confluenceScopes)}&redirect_uri=${encodeURIComponent(CONFLUENCE_REDIRECT_URI)}&response_type=code&prompt=consent`);
  } else {
    console.log('\n❌ Issues Found:');
    if (!jiraCredsResult.success) console.log(`   - Jira Credentials: ${jiraCredsResult.error}`);
    if (!confluenceCredsResult.success) console.log(`   - Confluence Credentials: ${confluenceCredsResult.error}`);
    if (!jiraApiResult.success) console.log(`   - Jira API: ${jiraApiResult.error}`);
    if (!confluenceApiResult.success) console.log(`   - Confluence API: ${confluenceApiResult.error}`);
    
    console.log('\n💡 Troubleshooting Steps:');
    console.log('   1. Verify ATLASSIAN_CLIENT_ID and ATLASSIAN_CLIENT_SECRET in .env.local');
    console.log('   2. Check Atlassian app configuration at https://developer.atlassian.com');
    console.log('   3. Ensure callback URLs are properly configured');
    console.log('   4. Verify app has required scopes and permissions');
    console.log('   5. Check if app is activated and not expired');
  }
}

main().catch(console.error);
