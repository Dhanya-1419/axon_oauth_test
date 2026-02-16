#!/usr/bin/env node

/**
 * Slack Redirect URI Mismatch - Advanced Troubleshooting
 * 
 * Fixes persistent "redirect_uri did not match" errors
 */

console.log('🔧 Slack Redirect URI Mismatch - Advanced Troubleshooting');
console.log('====================================================\n');

console.log('❌ Still getting "redirect_uri did not match any configured URIs"');
console.log('Even after adding the redirect URI to Slack app.\n');

console.log('🔍 Advanced Debug Steps:');
console.log('==========================');

console.log('\n📍 Step 1: Verify Exact Redirect URI');
console.log('Your code uses:');
console.log('http://localhost:3000/api/oauth/callback/slack');
console.log('');
console.log('Check what you added in Slack app:');
console.log('• No trailing slash at the end');
console.log('• Use HTTP (not HTTPS)');
console.log('• No extra spaces or characters');
console.log('• Exact letter-for-letter match');

console.log('\n📍 Step 2: Check Multiple Redirect URIs');
console.log('Slack apps can have multiple redirect URIs.');
console.log('Make sure:');
console.log('✅ http://localhost:3000/api/oauth/callback/slack');
console.log('✅ NOT: https://localhost:3000/api/oauth/callback/slack');
console.log('✅ NOT: http://localhost:3000/api/oauth/callback/slack/');
console.log('✅ NOT: http://localhost:3000/api/oauth/callback/slack ');

console.log('\n📍 Step 3: Clear Slack App Cache');
console.log('Sometimes changes don\'t take effect immediately:');
console.log('1. Go to Slack app settings');
console.log('2. Make a small change (like add a space)');
console.log('3. Save the change');
console.log('4. Remove the space and save again');
console.log('5. Wait 2-3 minutes');

console.log('\n📍 Step 4: Check App Status');
console.log('In Slack app "OAuth & Permissions":');
console.log('✅ App Status: Should be "Active"');
console.log('✅ Distribution: Should be "Public"');
console.log('✅ Install to Workspace: Should be enabled');

console.log('\n📍 Step 5: Test with Debug URL');
console.log('Manually construct and test the OAuth URL:');
console.log('');
console.log('https://slack.com/oauth/v2/authorize?');
console.log('client_id=9285424988600&');
console.log('redirect_uri=http://localhost:3000/api/oauth/callback/slack&');
console.log('scope=users:read&');
console.log('response_type=code');
console.log('');
console.log('Copy this URL and paste directly in browser.');
console.log('If it works, the issue is in your app setup.');
console.log('If it fails, the redirect URI is still wrong.');

console.log('\n📍 Step 6: Alternative - Use HTTPS');
console.log('Some Slack apps require HTTPS even for local development:');
console.log('Try adding BOTH redirect URIs to Slack app:');
console.log('• http://localhost:3000/api/oauth/callback/slack');
console.log('• https://localhost:3000/api/oauth/callback/slack');
console.log('');
console.log('Then update your code to use HTTPS:');
console.log('const redirectUri = "https://localhost:3000/api/oauth/callback/slack";');

console.log('\n📍 Step 7: Check Environment Variables');
console.log('Add debug logging to confirm what\'s being sent:');
console.log('Add to /api/oauth/start/slack/route.js:');
console.log('console.log("Client ID:", clientId);');
console.log('console.log("Redirect URI:", redirectUri);');
console.log('console.log("Full URL:", authUrl.toString());');
console.log('');
console.log('Restart server and check console output.');

console.log('\n🔍 Common Mistakes:');
console.log('====================');

const mistakes = [
  {
    mistake: 'HTTPS vs HTTP',
    wrong: 'https://localhost:3000/api/oauth/callback/slack',
    correct: 'http://localhost:3000/api/oauth/callback/slack'
  },
  {
    mistake: 'Trailing Slash',
    wrong: 'http://localhost:3000/api/oauth/callback/slack/',
    correct: 'http://localhost:3000/api/oauth/callback/slack'
  },
  {
    mistake: 'Trailing Space',
    wrong: 'http://localhost:3000/api/oauth/callback/slack ',
    correct: 'http://localhost:3000/api/oauth/callback/slack'
  },
  {
    mistake: 'Wrong App',
    wrong: 'Different Slack app',
    correct: 'App with Client ID: 9285424988600'
  }
];

mistakes.forEach((item, index) => {
  console.log(`${index + 1}. ${item.mistake}`);
  console.log(`   Wrong: ${item.wrong}`);
  console.log(`   Correct: ${item.correct}\n`);
});

console.log('\n✅ Expected Working Result:');
console.log('============================');
console.log('• No redirect URI mismatch error');
console.log('• Slack authorization page loads');
console.log('• After approval, redirects to: http://localhost:3000?oauth_success=slack');
console.log('• Shows 🔗 Connected icon for Slack');

console.log('\n🎯 Most Likely Issues:');
console.log('========================');
console.log('1. Trailing slash or space in redirect URI');
console.log('2. Slack app expecting HTTPS instead of HTTP');
console.log('3. Changes not saved or not propagated');
console.log('4. Looking at wrong Slack app');

console.log('\n🚀 Go through each step systematically - the issue will be found!');
