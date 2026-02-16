#!/usr/bin/env node

/**
 * Debug Jira OAuth Issue
 */

const http = require('http');
const https = require('https');

console.log('🔍 Debugging Jira OAuth Issue');
console.log('===============================\n');

// Test 1: Check Jira OAuth start
console.log('1️⃣ Testing Jira OAuth Start:');
function testJiraStart() {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/oauth/start/jira',
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      console.log(`   Status: ${res.statusCode}`);
      if (res.statusCode === 307) {
        console.log('   ✅ Redirect working (expected)');
      } else {
        console.log('   ❌ Unexpected status');
      }
      resolve();
    });

    req.on('error', (err) => {
      console.error('   Error:', err.message);
      resolve();
    });

    req.end();
  });
}

// Test 2: Check Jira callback with mock code
console.log('\n2️⃣ Testing Jira Callback (mock code):');
function testJiraCallback() {
  return new Promise((resolve) => {
    const url = 'http://localhost:3000/api/oauth/callback/jira?code=test123&state=test';
    console.log(`   Testing: ${url}`);
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/oauth/callback/jira?code=test123&state=test',
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      console.log(`   Status: ${res.statusCode}`);
      if (res.statusCode === 307) {
        console.log('   ⚠️  Redirecting (likely due to error)');
        // Check redirect location
        const location = res.headers.location;
        if (location) {
          console.log(`   Redirect to: ${location}`);
          if (location.includes('error=')) {
            const error = new URL(location).searchParams.get('error');
            console.log(`   Error: ${error}`);
          }
        }
      } else if (res.statusCode === 200) {
        console.log('   ✅ Processing authorization code');
      } else {
        console.log('   ❌ Unexpected status');
      }
      resolve();
    });

    req.on('error', (err) => {
      console.error('   Error:', err.message);
      resolve();
    });

    req.end();
  });
}

// Test 3: Check environment variables
console.log('\n3️⃣ Checking Environment Variables:');
function checkEnvVars() {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/env',
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const env = JSON.parse(data);
        console.log('   ATLASSIAN_CLIENT_ID:', env.keys.ATLASSIAN_CLIENT_ID ? '✅' : '❌');
        console.log('   ATLASSIAN_CLIENT_SECRET:', env.keys.ATLASSIAN_CLIENT_SECRET ? '✅' : '❌');
        console.log('   ATLASSIAN_SITE_URL:', env.keys.ATLASSIAN_SITE_URL ? '✅' : '❌');
        console.log('   ATLASSIAN_EMAIL:', env.keys.ATLASSIAN_EMAIL ? '✅' : '❌');
        console.log('   ATLASSIAN_API_TOKEN:', env.keys.ATLASSIAN_API_TOKEN ? '✅' : '❌');
        resolve();
      });
    });

    req.on('error', (err) => {
      console.error('   Error:', err.message);
      resolve();
    });

    req.end();
  });
}

// Test 4: Check current tokens
console.log('\n4️⃣ Checking Current OAuth Tokens:');
function checkCurrentTokens() {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/oauth/tokens',
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const tokens = JSON.parse(data);
        console.log('   Current providers:', tokens.providers);
        console.log('   Jira connected:', tokens.providers.includes('jira') ? '✅' : '❌');
        resolve();
      });
    });

    req.on('error', (err) => {
      console.error('   Error:', err.message);
      resolve();
    });

    req.end();
  });
}

// Main execution
async function main() {
  await testJiraStart();
  await testJiraCallback();
  await checkEnvVars();
  await checkCurrentTokens();
  
  console.log('\n🎯 Analysis:');
  console.log('   If callback redirects with 307, it means:');
  console.log('   1. Missing authorization code');
  console.log('   2. Token exchange failed');
  console.log('   3. Environment variable issue');
  console.log('   4. Redirect URI mismatch');
  
  console.log('\n💡 Solutions:');
  console.log('   1. Use real authorization code (not test123)');
  console.log('   2. Complete OAuth flow in browser');
  console.log('   3. Check Atlassian app callback URL');
  console.log('   4. Verify environment variables');
}

main().catch(console.error);
