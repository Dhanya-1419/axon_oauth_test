#!/usr/bin/env node

/**
 * Test ClickUp Connection Status
 * 
 * This script demonstrates how ClickUp connection status should work
 */

const https = require('https');

console.log('🔗 Testing ClickUp Connection Status');
console.log('===================================\n');

// Test 1: Check current OAuth tokens
console.log('1️⃣ Current OAuth Tokens:');
function checkTokens() {
  return new Promise((resolve) => {
    const req = https.get('http://localhost:3000/api/oauth/tokens', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const tokens = JSON.parse(data);
        console.log('   Current providers:', tokens.providers);
        console.log('   ClickUp connected:', tokens.providers.includes('clickup') ? '✅ YES' : '❌ NO');
        resolve(tokens);
      });
    });
    req.on('error', reject);
  });
}

// Test 2: Manually add ClickUp token (for testing)
function addClickUpToken() {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      provider: 'clickup',
      token: {
        access_token: 'test_token_' + Date.now(),
        refresh_token: 'test_refresh_' + Date.now(),
        expires_at: Date.now() + (3600 * 1000), // 1 hour
        scope: 'team:read task:read',
        team_id: 'test_team_id'
      }
    });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/oauth/tokens/add',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('   Add token response:', res.statusCode);
        resolve(res.statusCode === 200);
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Test 3: Check connection status after adding token
async function testConnectionFlow() {
  console.log('\n2️⃣ Adding ClickUp Token (for testing):');
  const added = await addClickUpToken();
  
  if (added) {
    console.log('   ✅ ClickUp token added successfully');
    
    // Wait a moment for token to be stored
    setTimeout(async () => {
      console.log('\n3️⃣ Checking Connection Status After Adding Token:');
      const tokens = await checkTokens();
      
      console.log('\n4️⃣ Expected Frontend Behavior:');
      console.log('   - ClickUp should show: ✅ Connected');
      console.log('   - Button should show: "Reconnect ClickUp"');
      console.log('   - Disconnect button should be visible');
      console.log('   - OAuth status should show: "clickup: connected"');
      
      console.log('\n5️⃣ How to Test Real OAuth Flow:');
      console.log('   1. Open: http://localhost:3000');
      console.log('   2. Go to: Collaboration → ClickUp (OAuth)');
      console.log('   3. Click: "Connect ClickUp" button');
      console.log('   4. Authorize in ClickUp');
      console.log('   5. Redirect back to app');
      console.log('   6. Check connection status');
      
      console.log('\n🎯 Expected Result:');
      console.log('   After real OAuth flow, ClickUp will automatically:');
      console.log('   - Exchange authorization code for access token');
      console.log('   - Store tokens in token storage');
      console.log('   - Show as "Connected" in frontend');
      console.log('   - Allow API testing');
      
    }, 1000);
  } else {
    console.log('   ❌ Failed to add ClickUp token');
  }
}

// Main execution
testConnectionFlow().catch(console.error);
