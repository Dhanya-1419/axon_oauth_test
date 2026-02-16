#!/usr/bin/env node

/**
 * Confluence "Something went wrong" - Deep Debug
 * 
 * Complete diagnosis of Confluence OAuth issues
 */

console.log('🔍 Confluence "Something went wrong" - Deep Debug');
console.log('==============================================\n');

console.log('❌ Issue: Confluence still shows "Something went wrong"');
console.log('🔍 Let\'s debug step by step...\n');

console.log('📋 Current Confluence Configuration:');
console.log('==================================');

console.log('\n📄 Confluence Start Route:');
console.log('Client ID: CONFLUENCE_CLIENT_ID');
console.log('Value: PUTzd570Tp3796s65wEfzwAGhCu85elj');
console.log('Redirect URI: http://localhost:3000/api/oauth/callback/confluence');
console.log('Scopes: read:confluence-content.summary read:confluence-space:confluence read:confluence-user:confluence offline_access');

console.log('\n🔄 Confluence Callback Route:');
console.log('Client ID: CONFLUENCE_CLIENT_ID');
console.log('Client Secret: CONFLUENCE_CLIENT_SECRET');
console.log('Redirect URI: http://localhost:3000/api/oauth/callback/confluence');

console.log('\n🔍 Potential Issues:');
console.log('===================');

const issues = [
  {
    issue: 'Environment variables not loaded',
    check: 'CONFLUENCE_CLIENT_ID might be undefined',
    solution: 'Check if .env.local changes were applied'
  },
  {
    issue: 'Invalid Confluence scopes',
    check: 'Confluence scopes might be different from Jira',
    solution: 'Use basic Confluence scopes for testing'
  },
  {
    issue: 'Confluence app not configured',
    check: 'Confluence app callback URL mismatch',
    solution: 'Verify Confluence app in Atlassian console'
  },
  {
    issue: 'App permissions insufficient',
    check: 'Confluence app might not allow requested scopes',
    solution: 'Use minimal scopes for testing'
  },
  {
    issue: 'Confluence app disabled',
    check: 'Confluence app might be inactive',
    solution: 'Activate Confluence app in developer console'
  }
];

issues.forEach((item, index) => {
  console.log(`${index + 1}. ${item.issue}`);
  console.log(`   Check: ${item.check}`);
  console.log(`   Solution: ${item.solution}\n`);
});

console.log('🔧 Step-by-Step Debug:');
console.log('========================');

console.log('\n📍 STEP 1: Verify Environment Variables');
console.log('====================================');
console.log('Check if CONFLUENCE_CLIENT_ID is loaded:');
console.log('1. Add debug log to Confluence start route');
console.log('2. Add debug log to Confluence callback route');
console.log('3. Restart server and check logs');

console.log('\n📍 STEP 2: Test with Minimal Scopes');
console.log('===================================');
console.log('Update Confluence start route to use basic scopes:');
console.log('const scopes = "read:confluence-user:confluence";');
console.log('');
console.log('This is the most basic Confluence scope.');

console.log('\n📍 STEP 3: Check Confluence App Configuration');
console.log('==========================================');
console.log('In Atlassian Developer Console:');
console.log('1. Find app with Client ID: PUTzd570Tp3796s65wEfzwAGhCu85elj');
console.log('2. Check app status: Should be "Active"');
console.log('3. Check callback URLs: Should include http://localhost:3000/api/oauth/callback/confluence');
console.log('4. Check permissions: Should allow Confluence API access');

console.log('\n📍 STEP 4: Manual URL Test');
console.log('=============================');
console.log('Construct OAuth URL manually:');
console.log('');
console.log('https://auth.atlassian.com/authorize?');
console.log('audience=api.atlassian.com&');
console.log('client_id=PUTzd570Tp3796s65wEfzwAGhCu85elj&');
console.log('scope=read:confluence-user:confluence&');
console.log('redirect_uri=http://localhost:3000/api/oauth/callback/confluence&');
console.log('response_type=code&prompt=consent&state=test123');
console.log('');
console.log('Test this URL directly in browser.');

console.log('\n🔍 Debug Information to Collect:');
console.log('================================');

const debugInfo = [
  'Final browser URL after clicking Confluence OAuth',
  'Any error parameters in URL',
  'Server console logs during Confluence OAuth',
  'Network requests in browser DevTools',
  'Confluence app status in Atlassian console'
];

debugInfo.forEach((item, index) => {
  console.log(`${index + 1}. ${item}`);
});

console.log('\n🚀 Quick Fix - Minimal Confluence OAuth:');
console.log('====================================');

console.log('\n1️⃣ Update Confluence start route:');
console.log('Replace scopes with minimal ones:');
console.log('const scopes = "read:confluence-user:confluence";');

console.log('\n2️⃣ Add debug logging:');
console.log('Add to start route:');
console.log('console.log("Confluence Client ID:", clientId);');
console.log('console.log("Confluence Redirect URI:", redirectUri);');

console.log('\n3️⃣ Add debug logging to callback:');
console.log('Add to callback route:');
console.log('console.log("Confluence Client ID:", clientId);');
console.log('console.log("Confluence Code:", code);');

console.log('\n4️⃣ Test with debug logs:');
console.log('1. Restart server');
console.log('2. Try Confluence OAuth');
console.log('3. Check console logs');
console.log('4. Identify where it fails');

console.log('\n✅ Expected Working Result:');
console.log('============================');
console.log('• Confluence authorization page loads');
console.log('• No "Something went wrong" error');
console.log('• Shows Confluence permission request');
console.log('• After approval, redirects to callback');
console.log('• Token exchange succeeds');
console.log('• Final redirect: http://localhost:3000?oauth_success=true&provider=confluence');

console.log('\n🎯 Most Likely Issues:');
console.log('======================');
console.log('1. CONFLUENCE_CLIENT_ID not loaded from .env.local');
console.log('2. Confluence app callback URL not configured');
console.log('3. Confluence scopes too broad or invalid');
console.log('4. Confluence app permissions insufficient');

console.log('\n🚀 This debug process will identify the exact issue!');
