#!/usr/bin/env node

/**
 * Test Atlassian Scope Propagation
 * 
 * Checks if the new scopes have been applied to your app
 */

const https = require('https');
const querystring = require('querystring');

console.log('🔍 Testing Atlassian Scope Propagation');
console.log('=====================================\n');

// Your Atlassian credentials
const NEW_ATLASSIAN_CLIENT_ID = process.env.ATLASSIAN_CLIENT_ID || 'YOUR_ATLASSIAN_CLIENT_ID';
const NEW_ATLASSIAN_CLIENT_SECRET = process.env.ATLASSIAN_CLIENT_SECRET || 'YOUR_ATLASSIAN_CLIENT_SECRET';

async function testCurrentScopes() {
  console.log('🧪 Testing Current Token Scopes:');
  console.log(`   Client ID: ${NEW_ATLASSIAN_CLIENT_ID}`);
  
  try {
    // Get new access token
    const tokenResponse = await makeRequest('https://auth.atlassian.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: querystring.stringify({
        grant_type: 'client_credentials',
        client_id: NEW_ATLASSIAN_CLIENT_ID,
        client_secret: NEW_ATLASSIAN_CLIENT_SECRET,
        redirect_uri: 'http://localhost:3000/api/oauth/callback/jira',
      }),
    });

    if (tokenResponse.statusCode === 200) {
      const data = JSON.parse(tokenResponse.data);
      console.log('\n🔑 Current Token Information:');
      console.log(`   Access Token: ${data.access_token?.substring(0, 20)}...`);
      console.log(`   Token Type: ${data.token_type}`);
      console.log(`   Expires In: ${data.expires_in} seconds`);
      
      console.log('\n📋 Current Scopes:');
      const scopes = data.scope ? data.scope.split(' ') : [];
      
      // Check for required scopes
      const requiredScopes = [
        'read:jira-work',
        'read:jira-user',
        'read:account',
        'read:me',           // This is the critical one!
        'offline_access',
        'read:confluence-content.summary',
        'read:confluence-space:confluence',
        'read:confluence-user:confluence'
      ];
      
      console.log('\n🎯 Scope Analysis:');
      requiredScopes.forEach(scope => {
        const hasScope = scopes.includes(scope);
        const status = hasScope ? '✅' : '❌';
        console.log(`   ${status} ${scope}`);
      });
      
      console.log('\n📊 All Current Scopes:');
      scopes.forEach((scope, index) => {
        console.log(`   ${index + 1}. ${scope}`);
      });
      
      // Test API access with current token
      console.log('\n🧪 Testing /me Endpoint:');
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
        
        return { success: true, scopes, userData };
      } else {
        console.log(`   ❌ API access failed: ${apiResponse.statusCode}`);
        if (apiResponse.data) {
          try {
            const errorData = JSON.parse(apiResponse.data);
            console.log(`   Error: ${errorData.error || 'Unknown'}`);
            console.log(`   Message: ${errorData.message || 'No message'}`);
            
            if (errorData.error === 'forbidden.insufficientScope') {
              console.log('\n🔍 Insufficient Scope Analysis:');
              console.log('   The token does not have the required "read:me" scope');
              console.log('   This means the scope changes have not propagated yet');
            }
          } catch (e) {
            console.log(`   Raw Response: ${apiResponse.data}`);
          }
        }
        
        return { success: false, scopes, error: `API access failed: ${apiResponse.statusCode}` };
      }
    } else {
      console.log(`❌ Token request failed: ${tokenResponse.statusCode}`);
      console.log(`Response: ${tokenResponse.data}`);
      return { success: false, error: `Token request failed: ${tokenResponse.statusCode}` };
    }
  } catch (error) {
    console.error(`❌ Test failed:`, error.message);
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

// Main execution
async function main() {
  console.log('📋 Checking Scope Propagation Status:');
  console.log('=====================================');
  
  const result = await testCurrentScopes();
  
  console.log('\n🎯 Summary:');
  if (result.success) {
    console.log('✅ All scopes are working correctly!');
    console.log('✅ API access is successful!');
    console.log('✅ Your Atlassian app is ready for OAuth testing!');
    
    console.log('\n🚀 Next Steps:');
    console.log('1. Update .env.local with new credentials');
    console.log('2. Restart development server');
    console.log('3. Test OAuth flow in browser');
    console.log('4. Verify connection status shows "Connected"');
  } else {
    console.log('❌ Issues still present:');
    console.log(`   - ${result.error}`);
    
    if (result.scopes && !result.scopes.includes('read:me')) {
      console.log('\n🔍 Scope Propagation Issue:');
      console.log('The "read:me" scope is still missing from the token');
      console.log('This means the changes have not propagated yet');
      
      console.log('\n⏰ Wait and Retry:');
      console.log('1. Wait 2-5 minutes for Atlassian to propagate changes');
      console.log('2. Re-run this test to check if scopes are updated');
      console.log('3. If still missing, check Atlassian app configuration');
      console.log('4. Ensure "read:me" is checked in both Jira and Confluence apps');
      
      console.log('\n🔧 Alternative Solutions:');
      console.log('1. Use the old working credentials temporarily');
      console.log('2. Create a new Atlassian app with correct scopes');
      console.log('3. Contact Atlassian support if issue persists');
    }
  }
}

main().catch(console.error);
