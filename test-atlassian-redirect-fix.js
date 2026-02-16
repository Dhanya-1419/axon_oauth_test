#!/usr/bin/env node

/**
 * Atlassian Redirect URI Diagnostic Tool
 * 
 * Helps fix redirect URI issues for Atlassian OAuth
 */

const https = require('https');
const querystring = require('querystring');

console.log('🔧 Atlassian Redirect URI Diagnostic');
console.log('===================================\n');

// Your credentials
const ATLASSIAN_CLIENT_ID = process.env.ATLASSIAN_CLIENT_ID || 'YOUR_ATLASSIAN_CLIENT_ID';
const ATLASSIAN_CLIENT_SECRET = process.env.ATLASSIAN_CLIENT_SECRET || 'YOUR_ATLASSIAN_CLIENT_SECRET';

// Current redirect URIs
const CURRENT_REDIRECTS = {
  jira: 'http://localhost:3000/api/oauth/callback/jira',
  confluence: 'http://localhost:3000/api/oauth/callback/confluence',
};

// Alternative redirect URIs to try
const ALTERNATIVE_REDIRECTS = [
  'http://localhost:3000/api/oauth/callback/atlassian',
  'http://localhost:3000/oauth/callback',
  'http://localhost:3000/auth/callback',
  'https://localhost:3000/api/oauth/callback/jira',
  'http://127.0.0.1:3000/api/oauth/callback/jira',
];

console.log('📋 Current Redirect URIs:');
console.log(`   Jira: ${CURRENT_REDIRECTS.jira}`);
console.log(`   Confluence: ${CURRENT_REDIRECTS.confluence}\n`);

async function testRedirectURI(redirectUri, serviceName) {
  console.log(`🧪 Testing: ${redirectUri}`);
  
  try {
    // Generate OAuth URL with this redirect URI
    const scopes = serviceName === 'jira' 
      ? 'read:jira-work read:jira-user read:account offline_access'
      : 'read:confluence-content.summary read:confluence-space:confluence read:confluence-user:confluence offline_access';
    
    const authUrl = `https://auth.atlassian.com/authorize?` + querystring.stringify({
      audience: 'api.atlassian.com',
      client_id: ATLASSIAN_CLIENT_ID,
      scope: scopes,
      redirect_uri: redirectUri,
      response_type: 'code',
      prompt: 'consent',
      state: 'test_' + Math.random().toString(36).substring(7),
    });
    
    console.log(`   🔗 URL: ${authUrl.substring(0, 100)}...`);
    
    // Test if the URL is valid by making a request to Atlassian
    const response = await makeRequest(authUrl, { method: 'HEAD', timeout: 5000 });
    
    if (response.statusCode === 302 || response.statusCode === 200) {
      console.log('   ✅ Redirect URI appears valid');
      return { success: true, redirectUri, authUrl };
    } else {
      console.log(`   ❌ Invalid response: ${response.statusCode}`);
      return { success: false, redirectUri, error: `HTTP ${response.statusCode}` };
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return { success: false, redirectUri, error: error.message };
  }
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, {
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

function generateFixInstructions() {
  console.log('\n🔧 Fix Instructions:');
  console.log('====================');
  
  console.log('\n1️⃣ Update Atlassian App Configuration:');
  console.log('   Go to: https://developer.atlassian.com/console');
  console.log(`   Find your app: ${ATLASSIAN_CLIENT_ID}`);
  console.log('   Navigate to: Settings → Callback URLs');
  
  console.log('\n2️⃣ Add These Callback URLs:');
  console.log('   ✅ http://localhost:3000/api/oauth/callback/jira');
  console.log('   ✅ http://localhost:3000/api/oauth/callback/confluence');
  console.log('   ✅ http://localhost:3000/api/oauth/callback/atlassian');
  
  console.log('\n3️⃣ Alternative Solutions:');
  console.log('   If above doesn\'t work, try:');
  ALTERNATIVE_REDIRECTS.forEach(uri => {
    console.log(`   ✅ ${uri}`);
  });
  
  console.log('\n4️⃣ Check Your App Routes:');
  console.log('   Make sure these routes exist in your Next.js app:');
  console.log('   ✅ /api/oauth/callback/jira');
  console.log('   ✅ /api/oauth/callback/confluence');
  console.log('   ✅ /api/oauth/start/jira');
  console.log('   ✅ /api/oauth/start/confluence');
  
  console.log('\n5️⃣ Update .env.local if needed:');
  console.log('   Make sure NEXTAUTH_URL is correct:');
  console.log('   NEXTAUTH_URL=http://localhost:3000');
  console.log('   NEXTAUTH_URL=https://localhost:3000 (if using HTTPS)');
}

async function checkLocalServer() {
  console.log('\n🌐 Checking Local Server:');
  console.log('==========================');
  
  const endpoints = [
    '/api/oauth/callback/jira',
    '/api/oauth/callback/confluence',
    '/api/oauth/start/jira',
    '/api/oauth/start/confluence',
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await makeRequest(`http://localhost:3000${endpoint}`, { timeout: 3000 });
      console.log(`   ✅ ${endpoint} - ${response.statusCode}`);
    } catch (error) {
      console.log(`   ❌ ${endpoint} - ${error.message}`);
    }
  }
}

async function main() {
  console.log('🚀 Starting Redirect URI Diagnosis...\n');
  
  // Test current redirect URIs
  console.log('📋 Testing Current Redirect URIs:');
  console.log('===================================');
  
  const jiraResult = await testRedirectURI(CURRENT_REDIRECTS.jira, 'jira');
  const confluenceResult = await testRedirectURI(CURRENT_REDIRECTS.confluence, 'confluence');
  
  // Test alternative redirect URIs
  console.log('\n🔄 Testing Alternative Redirect URIs:');
  console.log('======================================');
  
  const alternativeResults = [];
  for (const redirectUri of ALTERNATIVE_REDIRECTS) {
    const result = await testRedirectURI(redirectUri, 'jira');
    alternativeResults.push(result);
  }
  
  // Check local server
  await checkLocalServer();
  
  // Generate fix instructions
  generateFixInstructions();
  
  // Summary
  console.log('\n🎯 Diagnosis Summary:');
  console.log('======================');
  console.log(`   Current Jira Redirect: ${jiraResult.success ? '✅ Valid' : '❌ Invalid'}`);
  console.log(`   Current Confluence Redirect: ${confluenceResult.success ? '✅ Valid' : '❌ Invalid'}`);
  
  const workingAlternatives = alternativeResults.filter(r => r.success);
  if (workingAlternatives.length > 0) {
    console.log(`   Working Alternatives: ${workingAlternatives.length} found`);
    console.log('   💡 Use one of these working alternatives');
  } else {
    console.log('   Working Alternatives: ❌ None found');
    console.log('   💡 Fix Atlassian app configuration');
  }
  
  if (!jiraResult.success || !confluenceResult.success) {
    console.log('\n❌ Redirect URI Issues Detected!');
    console.log('🔧 Follow the fix instructions above');
  } else {
    console.log('\n✅ Redirect URIs appear to be working!');
    console.log('🚀 Issue might be elsewhere (check server logs)');
  }
}

main().catch(console.error);
