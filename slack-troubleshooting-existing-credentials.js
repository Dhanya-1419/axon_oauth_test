#!/usr/bin/env node

/**
 * Slack OAuth Troubleshooting with Existing Credentials
 * 
 * Troubleshoots Slack OAuth when credentials exist in .env.local
 */

console.log('🔧 Slack OAuth Troubleshooting with Existing Credentials');
console.log('================================================\n');

console.log('✅ Good News: Slack credentials found in .env.local');
console.log('SLACK_CLIENT_ID=9285424988600');
console.log('SLACK_CLIENT_SECRET=0041899fac0d4c311deaf013e7304869\n');

console.log('❌ But you\'re still getting "Invalid client_id parameter"');
console.log('This means the Slack app configuration doesn\'t match these credentials.\n');

console.log('🔍 Possible Issues:');
console.log('===================');

const issues = [
  {
    issue: 'Wrong Slack App',
    description: 'You might be looking at a different Slack app in the Slack dashboard',
    solution: 'Find the app with Client ID: 9285424988600'
  },
  {
    issue: 'App Not Active',
    description: 'The Slack app might be disabled or in development mode',
    solution: 'Ensure app status is "Active" in Slack dashboard'
  },
  {
    issue: 'Redirect URI Mismatch',
    description: 'Redirect URI in Slack app doesn\'t match your code',
    solution: 'Set redirect URI to: http://localhost:3000/api/oauth/callback/slack'
  },
  {
    issue: 'App Permissions',
    description: 'App might not have OAuth permissions enabled',
    solution: 'Enable "OAuth Permissions & Redirect URLs" in Slack app'
  },
  {
    issue: 'Environment Variable Not Loading',
    description: '.env.local changes not loaded by Next.js',
    solution: 'Restart dev server after .env.local changes'
  }
];

issues.forEach((item, index) => {
  console.log(`${index + 1}. ${item.issue}`);
  console.log(`   Description: ${item.description}`);
  console.log(`   Solution: ${item.solution}\n`);
});

console.log('🔧 Step-by-Step Fix:');
console.log('========================');

console.log('\n📍 Step 1: Verify Slack App');
console.log('1. Go to: https://api.slack.com/apps');
console.log('2. Find the app with Client ID: 9285424988600');
console.log('3. Click on the app to open its settings');

console.log('\n📍 Step 2: Check OAuth Settings');
console.log('In the Slack app, go to "OAuth & Permissions":');
console.log('✅ Status: Should be "Active"');
console.log('✅ Redirect URLs: Should include http://localhost:3000/api/oauth/callback/slack');
console.log('✅ Scopes: Should include users:read');

console.log('\n📍 Step 3: Add Redirect URI');
console.log('If redirect URI is missing, add:');
console.log('http://localhost:3000/api/oauth/callback/slack');
console.log('');
console.log('IMPORTANT:');
console.log('• Use HTTP (not HTTPS) for local development');
console.log('• No trailing slash');
console.log('• Exact match with your code');

console.log('\n📍 Step 4: Check App Status');
console.log('Ensure:');
console.log('✅ App is not "Disabled" or "Archived"');
console.log('✅ "Distribute App" is enabled');
console.log('✅ "Install to Workspace" permissions are set');

console.log('\n📍 Step 5: Restart and Test');
console.log('1. Restart dev server: npm run dev');
console.log('2. Clear browser cache');
console.log('3. Test: http://localhost:3000/api/oauth/start/slack');
console.log('4. Check browser URL for client_id parameter');

console.log('\n🔍 Debug URL Check:');
console.log('===================');
console.log('Visit: http://localhost:3000/api/oauth/start/slack');
console.log('Check the URL you\'re redirected to.');
console.log('Look for "client_id=9285424988600" in the URL.');
console.log('');
console.log('If you see a different client_id, the env var isn\'t loading.');
console.log('If you see the correct client_id but still get error, the app config is wrong.');

console.log('\n🌐 Expected Working OAuth URL:');
console.log('=================================');
console.log('https://slack.com/oauth/v2/authorize?');
console.log('client_id=9285424988600&');
console.log('redirect_uri=http://localhost:3000/api/oauth/callback/slack&');
console.log('scope=users:read&');
console.log('response_type=code');

console.log('\n✅ Expected Result:');
console.log('==================');
console.log('• No "Invalid client_id parameter" error');
console.log('• Slack authorization page loads');
console.log('• Shows "Allow" button with your app name');
console.log('• After approval, redirects to callback successfully');
console.log('• Shows 🔗 Connected icon for Slack');

console.log('\n🎯 Most Likely Issue:');
console.log('====================');
console.log('The Slack app redirect URI doesn\'t match:');
console.log('http://localhost:3000/api/oauth/callback/slack');
console.log('');
console.log('Or the app is not active/enabled properly.');

console.log('\n🚀 Fix the Slack app configuration and OAuth will work!');
