#!/usr/bin/env node

/**
 * Complete Atlassian OAuth Setup and Testing
 * 
 * Analyzes .env.local and provides comprehensive OAuth testing for Atlassian
 */

const https = require('https');
const querystring = require('querystring');

console.log('🔧 Complete Atlassian OAuth Setup');
console.log('================================\n');

// Extract Atlassian credentials from your .env.local
const ATLASIAN_CREDENTIALS = {
  old: {
    clientId: process.env.ATLASSIAN_CLIENT_ID || 'YOUR_ATLASSIAN_CLIENT_ID',
    clientSecret: process.env.ATLASSIAN_CLIENT_SECRET || 'YOUR_ATLASSIAN_CLIENT_SECRET',
  },
  new: {
    clientId: process.env.ATLASSIAN_CLIENT_ID || 'YOUR_ATLASSIAN_CLIENT_ID',
    clientSecret: process.env.ATLASSIAN_CLIENT_SECRET || 'YOUR_ATLASSIAN_CLIENT_SECRET',
  }
};

const REDIRECT_URIS = {
  jira: 'http://localhost:3000/api/oauth/callback/jira',
  confluence: 'http://localhost:3000/api/oauth/callback/confluence',
};

const SCOPES = {
  jira: 'read:jira-work read:jira-user read:account read:me offline_access',
  confluence: 'read:confluence-content.summary read:confluence-space:confluence read:confluence-user:confluence read:me offline_access',
};

function analyzeEnvironment() {
  console.log('📋 Environment Analysis:');
  console.log('======================');
  
  console.log('\n🔑 Atlassian Credentials Found:');
  console.log('\n📱 Old Credentials (Working):');
  console.log(`   Client ID: ${ATLASIAN_CREDENTIALS.old.clientId}`);
  console.log(`   Client Secret: ${ATLASIAN_CREDENTIALS.old.clientSecret.substring(0, 10)}...`);
  
  console.log('\n🆕 New Credentials (Needs Scope Fix):');
  console.log(`   Client ID: ${ATLASIAN_CREDENTIALS.new.clientId}`);
  console.log(`   Client Secret: ${ATLASIAN_CREDENTIALS.new.clientSecret.substring(0, 10)}...`);
  
  console.log('\n🔗 Redirect URIs:');
  console.log(`   Jira: ${REDIRECT_URIS.jira}`);
  console.log(`   Confluence: ${REDIRECT_URIS.confluence}`);
  
  console.log('\n📋 Required Scopes:');
  console.log(`   Jira: ${SCOPES.jira}`);
  console.log(`   Confluence: ${SCOPES.confluence}`);
  
  console.log('\n🌐 NextAuth Configuration:');
  console.log(`   NEXTAUTH_URL: https://localhost:3000`);
  console.log('   ✅ Correct for local testing');
}

async function testOAuthFlow(credentials, service, serviceName) {
  console.log(`\n🧪 Testing ${serviceName} OAuth Flow:`);
  console.log(`   Client ID: ${credentials.clientId}`);
  console.log(`   Service: ${service}`);
  
  try {
    // Test 1: Generate OAuth URL
    console.log('\n1️⃣ OAuth URL Generation:');
    const authUrl = `https://auth.atlassian.com/authorize?` + querystring.stringify({
      audience: 'api.atlassian.com',
      client_id: credentials.clientId,
      scope: SCOPES[service],
      redirect_uri: REDIRECT_URIS[service],
      response_type: 'code',
      prompt: 'consent',
      state: Math.random().toString(36).substring(7),
    });
    
    console.log(`   ✅ OAuth URL: ${authUrl.substring(0, 100)}...`);
    
    // Test 2: OAuth start endpoint
    console.log('\n2️⃣ Testing OAuth Start Endpoint:');
    const startResponse = await makeRequest(`http://localhost:3000/api/oauth/start/${service}`, {
      method: 'GET',
    });
    
    if (startResponse.statusCode === 307) {
      console.log('   ✅ OAuth start working (redirecting to Atlassian)');
    } else {
      console.log(`   ❌ OAuth start failed: ${startResponse.statusCode}`);
      return { success: false, error: `OAuth start failed: ${startResponse.statusCode}` };
    }
    
    // Test 3: Client credentials flow
    console.log('\n3️⃣ Testing Client Credentials:');
    const tokenResponse = await makeRequest('https://auth.atlassian.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: querystring.stringify({
        grant_type: 'client_credentials',
        client_id: credentials.clientId,
        client_secret: credentials.clientSecret,
        redirect_uri: REDIRECT_URIS[service],
      }),
    });

    if (tokenResponse.statusCode === 200) {
      console.log('   ✅ Client credentials valid!');
      const data = JSON.parse(tokenResponse.data);
      console.log('   🔑 Token Info:');
      console.log(`      Access Token: ${data.access_token?.substring(0, 20)}...`);
      console.log(`      Token Type: ${data.token_type}`);
      console.log(`      Expires In: ${data.expires_in} seconds`);
      
      // Check scopes in token
      const tokenScopes = data.scope ? data.scope.split(' ') : [];
      const hasReadMe = tokenScopes.includes('read:me');
      console.log(`      Has read:me scope: ${hasReadMe ? '✅' : '❌'}`);
      
      if (!hasReadMe) {
        console.log('      ⚠️  Missing critical "read:me" scope');
      }
      
      // Test 4: API access
      console.log('\n4️⃣ Testing API Access:');
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
        
        return { success: true, hasReadMe: true, userData };
      } else {
        console.log(`   ❌ API access failed: ${apiResponse.statusCode}`);
        if (apiResponse.data) {
          try {
            const errorData = JSON.parse(apiResponse.data);
            console.log(`      Error: ${errorData.error || 'Unknown'}`);
            if (errorData.error === 'forbidden.insufficientScope') {
              console.log('      Cause: Missing "read:me" scope');
            }
          } catch (e) {
            console.log(`      Raw: ${apiResponse.data.substring(0, 100)}...`);
          }
        }
        return { success: false, hasReadMe: false, error: `API access failed: ${apiResponse.statusCode}` };
      }
    } else {
      console.log(`   ❌ Client credentials failed: ${tokenResponse.statusCode}`);
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
  analyzeEnvironment();
  
  console.log('\n🚀 Starting OAuth Tests...');
  console.log('==========================');
  
  // Test old credentials
  console.log('\n📱 Testing Old Credentials (Jira):');
  const oldJiraResult = await testOAuthFlow(ATLASIAN_CREDENTIALS.old, 'jira', 'Old Jira');
  
  console.log('\n📄 Testing Old Credentials (Confluence):');
  const oldConfluenceResult = await testOAuthFlow(ATLASIAN_CREDENTIALS.old, 'confluence', 'Old Confluence');
  
  // Test new credentials
  console.log('\n🆕 Testing New Credentials (Jira):');
  const newJiraResult = await testOAuthFlow(ATLASIAN_CREDENTIALS.new, 'jira', 'New Jira');
  
  console.log('\n🆕 Testing New Credentials (Confluence):');
  const newConfluenceResult = await testOAuthFlow(ATLASIAN_CREDENTIALS.new, 'confluence', 'New Confluence');
  
  console.log('\n🎯 Complete Results Summary:');
  console.log('=============================');
  
  console.log('\n📱 Old Credentials:');
  console.log(`   Jira: ${oldJiraResult.success ? '✅ Working' : '❌ Issues'}`);
  console.log(`   Confluence: ${oldConfluenceResult.success ? '✅ Working' : '❌ Issues'}`);
  
  console.log('\n🆕 New Credentials:');
  console.log(`   Jira: ${newJiraResult.success ? '✅ Working' : '❌ Issues'}`);
  console.log(`   Confluence: ${newConfluenceResult.success ? '✅ Working' : '❌ Issues'}`);
  
  // Recommendations
  console.log('\n💡 Recommendations:');
  
  if (oldJiraResult.success && oldConfluenceResult.success) {
    console.log('✅ Use old credentials - they are working perfectly!');
    console.log('\n🔧 Update .env.local:');
    console.log('ATLASSIAN_CLIENT_ID=moaag7PRx59wIYavF1ABt2ZSuZtHzjz3');
    console.log('ATLASSIAN_CLIENT_SECRET=ATOAeoO2AhQDZwbClCroutY4F8W75qo1soB_iyv89XhJQFSgQBdLIQFmFjMPOARBwrkS29E04622');
  }
  
  if (newJiraResult.success && newConfluenceResult.success) {
    console.log('✅ New credentials are working - use them!');
    console.log('\n🔧 Update .env.local:');
    console.log('ATLASSIAN_CLIENT_ID=WVVp82PmqH6LIBFUZrB4gqRyMJStFDXU');
    console.log('ATLASSIAN_CLIENT_SECRET=ATOAhMNUr7sOyAnRLhWGTlV8H3xTNCSx3yUk01MHLRC2Pp_lLOGO6u1H1_ovYNh6Gjbe343866CA');
  }
  
  if (!newJiraResult.success || !newConfluenceResult.success) {
    console.log('❌ New credentials need scope fixes');
    console.log('\n🔧 Atlassian Developer Console Steps:');
    console.log('1. Go to: https://developer.atlassian.com/console');
    console.log(`2. Find app: ${ATLASIAN_CREDENTIALS.new.clientId}`);
    console.log('3. Navigate to: Settings → Permissions');
    console.log('4. Add missing scopes:');
    console.log('   ✅ read:me (CRITICAL)');
    console.log('   ✅ read:account');
    console.log('   ✅ offline_access');
    console.log('5. Save and wait 2-5 minutes for propagation');
  }
  
  console.log('\n🚀 OAuth Testing in Browser:');
  console.log('1. Restart development server: npm run dev');
  console.log('2. Open: http://localhost:3000');
  console.log('3. Go to: Collaboration → Jira (OAuth) or Confluence (OAuth)');
  console.log('4. Click: "Connect" button');
  console.log('5. Authorize in Atlassian');
  console.log('6. Check: Should show "Connected" status');
}

main().catch(console.error);
