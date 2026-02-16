#!/usr/bin/env node

/**
 * Verify Atlassian OAuth Credentials
 * 
 * Tests both Jira and Confluence OAuth credentials
 */

const https = require('https');
const querystring = require('querystring');

console.log('🔑 Verifying Atlassian OAuth Credentials');
console.log('====================================\n');

// Your Atlassian credentials from .env.local
const JIRA_CLIENT_ID = process.env.ATLASSIAN_CLIENT_ID || 'YOUR_JIRA_CLIENT_ID';
const JIRA_CLIENT_SECRET = process.env.ATLASSIAN_CLIENT_SECRET || 'YOUR_JIRA_CLIENT_SECRET';
const CONFLUENCE_CLIENT_ID = process.env.CONFLUENCE_CLIENT_ID || 'YOUR_CONFLUENCE_CLIENT_ID';
const CONFLUENCE_CLIENT_SECRET = process.env.CONFLUENCE_CLIENT_SECRET || 'YOUR_CONFLUENCE_CLIENT_SECRET';

const NEW_ATLASSIAN_CLIENT_ID = process.env.ATLASSIAN_CLIENT_ID || 'YOUR_ATLASSIAN_CLIENT_ID';
const NEW_ATLASSIAN_CLIENT_SECRET = process.env.ATLASSIAN_CLIENT_SECRET || 'YOUR_ATLASSIAN_CLIENT_SECRET';

const JIRA_REDIRECT_URI = 'http://localhost:3000/api/oauth/callback/jira';
const CONFLUENCE_REDIRECT_URI = 'http://localhost:3000/api/oauth/callback/confluence';

async function testCredentials(clientId, clientSecret, redirectUri, serviceName) {
  console.log(`\n🧪 Testing ${serviceName} Credentials:`);
  console.log(`   Client ID: ${clientId}`);
  console.log(`   Client Secret: ${clientSecret.substring(0, 10)}...`);
  console.log(`   Redirect URI: ${redirectUri}`);
  
  try {
    // Test 1: Check if we can reach Atlassian OAuth endpoint
    console.log(`\n1️⃣ Testing Atlassian OAuth endpoint for ${serviceName}...`);
    
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
        redirect_uri: redirectUri,
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
      
      // Test 2: Use token to call API
      console.log(`\n2️⃣ Testing API access for ${serviceName}...`);
      const apiResponse = await makeRequest('https://api.atlassian.com/me', {
        headers: {
          'Authorization': `Bearer ${data.access_token}`,
          'Accept': 'application/json',
        },
      });

      if (apiResponse.statusCode === 200) {
        console.log('   ✅ API access successful!');
        const userData = JSON.parse(apiResponse.data);
        console.log('   👤 User Info:');
        console.log(`      Account ID: ${userData.account_id}`);
        console.log(`      Account Type: ${userData.account_type}`);
        console.log(`      Email: ${userData.email || 'Not provided'}`);
        console.log(`      Name: ${userData.name || 'Not provided'}`);
        
        return { success: true, data: userData };
      } else {
        console.log('   ❌ API access failed:');
        console.log(`      Status: ${apiResponse.statusCode}`);
        console.log(`      Response: ${apiResponse.data}`);
        return { success: false, error: `API access failed: ${apiResponse.statusCode}` };
      }
    } else {
      console.log('   ❌ Client credentials test failed:');
      console.log(`      Status: ${tokenResponse.statusCode}`);
      console.log(`      Response: ${tokenResponse.data}`);
      
      if (tokenResponse.statusCode === 400) {
        console.log('   💡 Possible issues:');
        console.log('      - Client ID or Secret is incorrect');
        console.log('      - Redirect URI not configured in Atlassian app');
        console.log('      - App doesn\'t support client_credentials flow');
      }
      return { success: false, error: `Client credentials failed: ${tokenResponse.statusCode}` };
    }
  } catch (error) {
    console.error(`   ❌ Test failed:`, error.message);
    return { success: false, error: error.message };
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

// Test 3: Generate OAuth URLs
function generateOAuthUrl(clientId, redirectUri, serviceName, scopes) {
  console.log(`\n3️⃣ Generating OAuth URL for ${serviceName}:`);
  
  const authUrl = `https://auth.atlassian.com/authorize?` + querystring.stringify({
    audience: 'api.atlassian.com',
    client_id: clientId,
    scope: scopes,
    redirect_uri: redirectUri,
    response_type: 'code',
    prompt: 'consent',
    state: Math.random().toString(36).substring(7),
  });
  
  console.log(`   🔗 OAuth URL: ${authUrl}`);
  return authUrl;
}

// Main execution
async function main() {
  console.log('📋 Credential Summary:');
  console.log(`   Old Jira Client ID: ${JIRA_CLIENT_ID}`);
  console.log(`   Old Jira Client Secret: ${JIRA_CLIENT_SECRET.substring(0, 10)}...`);
  console.log(`   Old Confluence Client ID: ${CONFLUENCE_CLIENT_ID}`);
  console.log(`   Old Confluence Client Secret: ${CONFLUENCE_CLIENT_SECRET.substring(0, 10)}...`);
  console.log(`   New Atlassian Client ID: ${NEW_ATLASSIAN_CLIENT_ID}`);
  console.log(`   New Atlassian Client Secret: ${NEW_ATLASSIAN_CLIENT_SECRET.substring(0, 10)}...`);
  
  // Test old Jira credentials
  const oldJiraResult = await testCredentials(JIRA_CLIENT_ID, JIRA_CLIENT_SECRET, JIRA_REDIRECT_URI, 'Old Jira');
  
  // Test old Confluence credentials
  const oldConfluenceResult = await testCredentials(CONFLUENCE_CLIENT_ID, CONFLUENCE_CLIENT_SECRET, CONFLUENCE_REDIRECT_URI, 'Old Confluence');
  
  // Test new Atlassian credentials (for both Jira and Confluence)
  const newAtlassianResult = await testCredentials(NEW_ATLASSIAN_CLIENT_ID, NEW_ATLASSIAN_CLIENT_SECRET, JIRA_REDIRECT_URI, 'New Atlassian (Jira)');
  
  // Generate OAuth URLs
  const jiraScopes = 'read:jira-work read:jira-user read:account offline_access';
  const confluenceScopes = 'read:confluence-content.summary read:confluence-space:confluence read:confluence-user:confluence offline_access';
  
  generateOAuthUrl(JIRA_CLIENT_ID, JIRA_REDIRECT_URI, 'Old Jira', jiraScopes);
  generateOAuthUrl(CONFLUENCE_CLIENT_ID, CONFLUENCE_REDIRECT_URI, 'Old Confluence', confluenceScopes);
  generateOAuthUrl(NEW_ATLASSIAN_CLIENT_ID, JIRA_REDIRECT_URI, 'New Atlassian (Jira)', jiraScopes);
  generateOAuthUrl(NEW_ATLASSIAN_CLIENT_ID, CONFLUENCE_REDIRECT_URI, 'New Atlassian (Confluence)', confluenceScopes);
  
  console.log('\n🎯 Summary:');
  console.log(`   Old Jira Credentials: ${oldJiraResult.success ? '✅ Valid' : '❌ Invalid'}`);
  console.log(`   Old Confluence Credentials: ${oldConfluenceResult.success ? '✅ Valid' : '❌ Invalid'}`);
  console.log(`   New Atlassian Credentials: ${newAtlassianResult.success ? '✅ Valid' : '❌ Invalid'}`);
  
  if (newAtlassianResult.success) {
    console.log('\n✅ New Atlassian credentials are working!');
    console.log('\n🚀 Ready for OAuth Testing:');
    console.log('   1. Update .env.local with new credentials');
    console.log('   2. Restart development server');
    console.log('   3. Open: http://localhost:3000');
    console.log('   4. Go to: Collaboration → Jira (OAuth) or Confluence (OAuth)');
    console.log('   5. Click: "Connect" button');
    console.log('   6. Authorize in Atlassian');
    console.log('   7. Check connection status');
  } else {
    console.log('\n❌ New Atlassian credentials are not working:');
    console.log(`   - Error: ${newAtlassianResult.error}`);
  }
}

main().catch(console.error);
