#!/usr/bin/env node

/**
 * Test Confluence OAuth Credentials
 * 
 * This script tests your Atlassian Client ID and Secret
 * by attempting to get an access token using client credentials flow
 */

const https = require('https');
const querystring = require('querystring');

console.log('🔑 Testing Confluence OAuth Credentials');
console.log('====================================\n');

// Your credentials from .env.local
const CLIENT_ID = process.env.CONFLUENCE_CLIENT_ID || 'YOUR_CONFLUENCE_CLIENT_ID';
const CLIENT_SECRET = process.env.CONFLUENCE_CLIENT_SECRET || 'YOUR_CONFLUENCE_CLIENT_SECRET';
const REDIRECT_URI = 'https://yourdomain.com/api/oauth/callback/confluence';

async function testCredentials() {
  console.log('📋 Testing Client Credentials:\n');
  console.log(`Client ID: ${CLIENT_ID}`);
  console.log(`Client Secret: ${CLIENT_SECRET.substring(0, 10)}...`);
  console.log(`Redirect URI: ${REDIRECT_URI}\n`);

  try {
    // Test 1: Check if we can reach Atlassian auth
    console.log('1️⃣ Testing Atlassian OAuth endpoint...');
    const testResponse = await makeRequest('https://auth.atlassian.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: querystring.stringify({
        grant_type: 'client_credentials',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
      }),
    });

    if (testResponse.statusCode === 200) {
      console.log('✅ Client credentials are valid!\n');
      const data = JSON.parse(testResponse.data);
      console.log('🔑 Token Response:');
      console.log(`  Access Token: ${data.access_token?.substring(0, 20)}...`);
      console.log(`  Token Type: ${data.token_type}`);
      console.log(`  Expires In: ${data.expires_in} seconds`);
      console.log(`  Scope: ${data.scope || 'No scope specified'}\n`);
      
      // Test 2: Use token to call API
      console.log('2️⃣ Testing API access with token...');
      const apiResponse = await makeRequest('https://api.atlassian.com/me', {
        headers: {
          'Authorization': `Bearer ${data.access_token}`,
          'Accept': 'application/json',
        },
      });

      if (apiResponse.statusCode === 200) {
        console.log('✅ API access successful!\n');
        const userData = JSON.parse(apiResponse.data);
        console.log('👤 User Info:');
        console.log(`  Account ID: ${userData.account_id}`);
        console.log(`  Account Type: ${userData.account_type}`);
        console.log(`  Email: ${userData.email || 'Not provided'}`);
        console.log(`  Name: ${userData.name || 'Not provided'}\n`);
      } else {
        console.log('❌ API access failed:');
        console.log(`  Status: ${apiResponse.statusCode}`);
        console.log(`  Response: ${apiResponse.data}\n`);
      }
    } else {
      console.log('❌ Client credentials test failed:');
      console.log(`  Status: ${testResponse.statusCode}`);
      console.log(`  Response: ${testResponse.data}\n`);
      
      if (testResponse.statusCode === 400) {
        console.log('💡 Possible issues:');
        console.log('   - Client ID or Secret is incorrect');
        console.log('   - Redirect URI not configured in Atlassian app');
        console.log('   - App doesn\'t support client_credentials flow\n');
      }
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

// Test 3: Show OAuth URL for manual testing
function showOAuthUrl() {
  console.log('3️⃣ OAuth Flow URL (for manual testing):');
  const scopes = [
    'read:confluence-content.summary',
    'read:confluence-space:confluence',
    'read:confluence-user:confluence',
    'offline_access'
  ].join(' ');
  
  const authUrl = `https://auth.atlassian.com/authorize?` + querystring.stringify({
    audience: 'api.atlassian.com',
    client_id: CLIENT_ID,
    scope: scopes,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    prompt: 'consent',
    state: Math.random().toString(36).substring(7),
  });
  
  console.log(authUrl);
  console.log('\n📝 Copy this URL and open in browser to test OAuth flow manually\n');
}

// Main execution
async function main() {
  await testCredentials();
  showOAuthUrl();
}

if (require.main === module) {
  main();
}

module.exports = { testCredentials, showOAuthUrl };
