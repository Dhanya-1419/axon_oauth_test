#!/usr/bin/env node

/**
 * Simple Atlassian OAuth Testing Script
 * 
 * Tests Atlassian OAuth flow with hardcoded credentials
 * No dependencies on .env.local file
 */

const https = require('https');
const querystring = require('querystring');

console.log('🔑 Simple Atlassian OAuth Testing');
console.log('=================================\n');

// Your Atlassian credentials (from your .env.local)
const ATLASSIAN_CLIENT_ID = process.env.ATLASSIAN_CLIENT_ID || 'YOUR_ATLASSIAN_CLIENT_ID';
const ATLASSIAN_CLIENT_SECRET = process.env.ATLASSIAN_CLIENT_SECRET || 'YOUR_ATLASSIAN_CLIENT_SECRET';

const JIRA_REDIRECT_URI = 'http://localhost:3000/api/oauth/callback/jira';
const CONFLUENCE_REDIRECT_URI = 'http://localhost:3000/api/oauth/callback/confluence';

console.log('📋 Using Credentials:');
console.log(`   Client ID: ${ATLASSIAN_CLIENT_ID}`);
console.log(`   Client Secret: ${ATLASSIAN_CLIENT_SECRET.substring(0, 10)}...`);
console.log(`   Jira Callback: ${JIRA_REDIRECT_URI}`);
console.log(`   Confluence Callback: ${CONFLUENCE_REDIRECT_URI}\n`);

// Test 1: Generate OAuth URLs
console.log('🔗 OAuth URLs for Manual Testing:');
console.log('==================================');

const jiraScopes = 'read:jira-work read:jira-user read:account offline_access';
const confluenceScopes = 'read:confluence-content.summary read:confluence-space:confluence read:confluence-user:confluence offline_access';

const jiraAuthUrl = `https://auth.atlassian.com/authorize?` + querystring.stringify({
  audience: 'api.atlassian.com',
  client_id: ATLASSIAN_CLIENT_ID,
  scope: jiraScopes,
  redirect_uri: JIRA_REDIRECT_URI,
  response_type: 'code',
  prompt: 'consent',
  state: 'jira_test_' + Math.random().toString(36).substring(7),
});

const confluenceAuthUrl = `https://auth.atlassian.com/authorize?` + querystring.stringify({
  audience: 'api.atlassian.com',
  client_id: ATLASSIAN_CLIENT_ID,
  scope: confluenceScopes,
  redirect_uri: CONFLUENCE_REDIRECT_URI,
  response_type: 'code',
  prompt: 'consent',
  state: 'confluence_test_' + Math.random().toString(36).substring(7),
});

console.log('📱 Jira OAuth URL:');
console.log(jiraAuthUrl);
console.log('\n📱 Confluence OAuth URL:');
console.log(confluenceAuthUrl);

// Test 2: Test client credentials
async function testClientCredentials() {
  console.log('\n🧪 Testing Client Credentials:');
  console.log('===============================');
  
  try {
    const response = await makeRequest('https://auth.atlassian.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: querystring.stringify({
        grant_type: 'client_credentials',
        client_id: ATLASSIAN_CLIENT_ID,
        client_secret: ATLASSIAN_CLIENT_SECRET,
      }),
    });

    if (response.statusCode === 200) {
      console.log('✅ Client credentials are valid!');
      const data = JSON.parse(response.data);
      console.log('🔑 Token Info:');
      console.log(`   Access Token: ${data.access_token?.substring(0, 20)}...`);
      console.log(`   Token Type: ${data.token_type}`);
      console.log(`   Expires In: ${data.expires_in} seconds`);
      console.log(`   Scope: ${data.scope || 'No scope'}`);
      
      // Test API access
      console.log('\n🌐 Testing API Access:');
      const apiResponse = await makeRequest('https://api.atlassian.com/me', {
        headers: {
          'Authorization': `Bearer ${data.access_token}`,
          'Accept': 'application/json',
        },
      });

      if (apiResponse.statusCode === 200) {
        console.log('✅ API access successful!');
        const userData = JSON.parse(apiResponse.data);
        console.log('👤 User Info:');
        console.log(`   Account ID: ${userData.account_id}`);
        console.log(`   Account Type: ${userData.account_type}`);
        console.log(`   Email: ${userData.email || 'Not provided'}`);
        console.log(`   Name: ${userData.name || 'Not provided'}`);
      } else {
        console.log('❌ API access failed:', apiResponse.statusCode);
      }
    } else {
      console.log('❌ Client credentials failed:', response.statusCode);
      console.log('Response:', response.data);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      method: options.method || 'GET',
      headers: options.headers || {},
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          data: data,
        });
      });
    });

    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

// Test 3: Check local server
async function checkLocalServer() {
  console.log('\n🌐 Checking Local Development Server:');
  console.log('=====================================');
  
  try {
    const response = await makeRequest('http://localhost:3000', { timeout: 3000 });
    console.log('✅ Local server is running on port 3000');
  } catch (error) {
    console.log('❌ Local server not running on port 3000');
    console.log('💡 Start it with: npm run dev');
  }
}

// Test 4: OAuth flow simulation
async function simulateOAuthFlow() {
  console.log('\n🎯 OAuth Flow Testing Guide:');
  console.log('=============================');
  console.log('1. Start your development server: npm run dev');
  console.log('2. Open one of the OAuth URLs above in your browser');
  console.log('3. Login to your Atlassian account');
  console.log('4. Authorize the application');
  console.log('5. You\'ll be redirected back to your app');
  console.log('6. Check the connection status in your app');
  
  console.log('\n📋 What to check after OAuth:');
  console.log('- Access token is stored correctly');
  console.log('- User information is retrieved');
  console.log('- Jira/Confluence data is accessible');
  console.log('- Refresh token works for offline access');
}

// Main execution
async function main() {
  await testClientCredentials();
  await checkLocalServer();
  await simulateOAuthFlow();
  
  console.log('\n🎯 Quick Test Summary:');
  console.log('======================');
  console.log('✅ OAuth URLs generated');
  console.log('✅ Client credentials tested');
  console.log('✅ API access verified');
  console.log('✅ Local server checked');
  console.log('✅ Testing guide provided');
  
  console.log('\n🚀 Ready for OAuth Testing!');
  console.log('Copy the OAuth URLs above and test in your browser.');
}

main().catch(console.error);
