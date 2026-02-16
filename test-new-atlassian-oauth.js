#!/usr/bin/env node

/**
 * Comprehensive OAuth Test for New Atlassian Credentials
 * 
 * Tests both Jira and Confluence OAuth with new credentials
 */

const https = require('https');
const querystring = require('querystring');

console.log('🔑 Testing New Atlassian OAuth Credentials');
console.log('========================================\n');

// Your NEW Atlassian credentials
const NEW_ATLASSIAN_CLIENT_ID = process.env.ATLASSIAN_CLIENT_ID || 'YOUR_ATLASSIAN_CLIENT_ID';
const NEW_ATLASSIAN_CLIENT_SECRET = process.env.ATLASSIAN_CLIENT_SECRET || 'YOUR_ATLASSIAN_CLIENT_SECRET';

const JIRA_REDIRECT_URI = 'http://localhost:3000/api/oauth/callback/jira';
const CONFLUENCE_REDIRECT_URI = 'http://localhost:3000/api/oauth/callback/confluence';

async function testOAuthFlow(clientId, clientSecret, redirectUri, serviceName, scopes) {
  console.log(`\n🧪 Testing ${serviceName} OAuth Flow:`);
  console.log(`   Client ID: ${clientId}`);
  console.log(`   Client Secret: ${clientSecret.substring(0, 10)}...`);
  console.log(`   Redirect URI: ${redirectUri}`);
  console.log(`   Scopes: ${scopes}`);
  
  try {
    // Test 1: Generate OAuth URL
    console.log(`\n1️⃣ OAuth URL Generation:`);
    const authUrl = `https://auth.atlassian.com/authorize?` + querystring.stringify({
      audience: 'api.atlassian.com',
      client_id: clientId,
      scope: scopes,
      redirect_uri: redirectUri,
      response_type: 'code',
      prompt: 'consent',
      state: Math.random().toString(36).substring(7),
    });
    
    console.log(`   ✅ OAuth URL: ${authUrl.substring(0, 100)}...`);
    
    // Test 2: Test OAuth start endpoint
    console.log(`\n2️⃣ Testing OAuth Start Endpoint:`);
    const startResponse = await makeRequest(`http://localhost:3000/api/oauth/start/${serviceName.toLowerCase()}`, {
      method: 'GET',
    });
    
    if (startResponse.statusCode === 307) {
      console.log('   ✅ OAuth start working (redirecting to Atlassian)');
    } else {
      console.log(`   ❌ OAuth start failed: ${startResponse.statusCode}`);
      return { success: false, error: `OAuth start failed: ${startResponse.statusCode}` };
    }
    
    // Test 3: Simulate OAuth callback with mock code
    console.log(`\n3️⃣ Testing OAuth Callback (with mock code):`);
    const callbackResponse = await makeRequest(`http://localhost:3000/api/oauth/callback/${serviceName.toLowerCase()}?code=test123&state=test`, {
      method: 'GET',
    });
    
    if (callbackResponse.statusCode === 307) {
      console.log('   ⚠️  Callback redirecting (checking redirect reason)...');
      // Parse redirect URL to see error
      const locationMatch = callbackResponse.data.match(/Location:\s*(.+)/i);
      if (locationMatch) {
        const redirectUrl = locationMatch[1].trim();
        console.log(`   Redirect URL: ${redirectUrl}`);
        
        if (redirectUrl.includes('error=')) {
          const url = new URL(redirectUrl);
          const error = url.searchParams.get('error');
          console.log(`   ❌ OAuth Error: ${error}`);
          
          if (error === 'invalid_request') {
            console.log('   💡 Possible causes:');
            console.log('      - Invalid client ID or secret');
            console.log('      - Redirect URI mismatch');
            console.log('      - App not configured properly');
          }
        }
      }
    } else if (callbackResponse.statusCode === 200) {
      console.log('   ✅ OAuth callback processed successfully');
    } else {
      console.log(`   ❌ Unexpected callback status: ${callbackResponse.statusCode}`);
    }
    
    // Test 4: Test client credentials flow
    console.log(`\n4️⃣ Testing Client Credentials Flow:`);
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
      console.log('   ✅ Client credentials valid!');
      const data = JSON.parse(tokenResponse.data);
      console.log('   🔑 Token Info:');
      console.log(`      Access Token: ${data.access_token?.substring(0, 20)}...`);
      console.log(`      Token Type: ${data.token_type}`);
      console.log(`      Expires In: ${data.expires_in} seconds`);
      console.log(`      Scopes: ${data.scope?.substring(0, 100)}...`);
      
      // Test 5: Test API access with token
      console.log(`\n5️⃣ Testing API Access:`);
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
        if (apiResponse.data) {
          const errorData = JSON.parse(apiResponse.data);
          console.log(`      Error: ${errorData.error || 'Unknown'}`);
          console.log(`      Message: ${errorData.message || 'No message'}`);
        }
        return { success: false, error: `API access failed: ${apiResponse.statusCode}` };
      }
    } else {
      console.log('   ❌ Client credentials failed:');
      console.log(`      Status: ${tokenResponse.statusCode}`);
      console.log(`      Response: ${tokenResponse.data}`);
      return { success: false, error: `Client credentials failed: ${tokenResponse.statusCode}` };
    }
  } catch (error) {
    console.error(`   ❌ Test failed:`, error.message);
    return { success: false, error: error.message };
  }
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https://');
    const req = (isHttps ? https : require('http')).request(url, {
      method: options.method || 'GET',
      headers: options.headers || {},
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
    
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

// Main execution
async function main() {
  console.log('📋 New Atlassian Credentials:');
  console.log(`   Client ID: ${NEW_ATLASSIAN_CLIENT_ID}`);
  console.log(`   Client Secret: ${NEW_ATLASSIAN_CLIENT_SECRET.substring(0, 10)}...`);
  
  // Test Jira OAuth flow
  const jiraScopes = 'read:jira-work read:jira-user read:account offline_access';
  const jiraResult = await testOAuthFlow(NEW_ATLASSIAN_CLIENT_ID, NEW_ATLASSIAN_CLIENT_SECRET, JIRA_REDIRECT_URI, 'Jira', jiraScopes);
  
  // Test Confluence OAuth flow
  const confluenceScopes = 'read:confluence-content.summary read:confluence-space:confluence read:confluence-user:confluence offline_access';
  const confluenceResult = await testOAuthFlow(NEW_ATLASSIAN_CLIENT_ID, NEW_ATLASSIAN_CLIENT_SECRET, CONFLUENCE_REDIRECT_URI, 'Confluence', confluenceScopes);
  
  console.log('\n🎯 Summary:');
  console.log(`   Jira OAuth: ${jiraResult.success ? '✅ Working' : '❌ Issues'}`);
  console.log(`   Confluence OAuth: ${confluenceResult.success ? '✅ Working' : '❌ Issues'}`);
  
  if (jiraResult.success && confluenceResult.success) {
    console.log('\n✅ Both OAuth flows are working!');
    console.log('\n🚀 Ready for Production:');
    console.log('   1. Update .env.local with new credentials');
    console.log('   2. Restart development server');
    console.log('   3. Open: http://localhost:3000');
    console.log('   4. Test OAuth flow in browser');
    console.log('   5. Verify connection status');
  } else {
    console.log('\n❌ Issues found:');
    if (!jiraResult.success) console.log(`   - Jira: ${jiraResult.error}`);
    if (!confluenceResult.success) console.log(`   - Confluence: ${confluenceResult.error}`);
    
    console.log('\n💡 Recommendations:');
    console.log('   1. Check Atlassian app configuration');
    console.log('   2. Verify callback URLs');
    console.log('   3. Ensure proper scopes are set');
    console.log('   4. Test with real authorization code');
  }
}

main().catch(console.error);
