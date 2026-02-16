#!/usr/bin/env node

/**
 * Atlassian Callback URL Configuration Fix
 * 
 * Generates the exact callback URLs needed for your Atlassian app
 */

console.log('🔧 Atlassian Callback URL Configuration Fix');
console.log('============================================\n');

console.log('❌ Error: "The app\'s callback URL is invalid"');
console.log('App ID: c3e3e0bc-6916-4def-990d-f4bcb005d4fb\n');

console.log('🔧 Required Callback URLs:');
console.log('==========================');

// Exact callback URLs that must be configured
const requiredCallbacks = [
  'http://localhost:3000/api/oauth/callback/jira',
  'http://localhost:3000/api/oauth/callback/confluence',
  'http://localhost:3000/api/oauth/callback/atlassian'
];

requiredCallbacks.forEach((url, index) => {
  console.log(`${index + 1}. ${url}`);
});

console.log('\n🌐 Atlassian Developer Console Setup:');
console.log('=====================================');
console.log('1. Go to: https://developer.atlassian.com/console');
console.log('2. Find your app with ID: c3e3e0bc-6916-4def-990d-f4bcb005d4fb');
console.log('3. Navigate to: Settings → Callback URLs');
console.log('4. Add these EXACT URLs:');

requiredCallbacks.forEach((url, index) => {
  console.log(`   ✅ ${url}`);
});

console.log('\n⚠️  Important Notes:');
console.log('====================');
console.log('• Use HTTP (not HTTPS) for local development');
console.log('• Use localhost:3000 (not 127.0.0.1)');
console.log('• No trailing slashes at the end');
console.log('• Copy URLs EXACTLY as shown above');

console.log('\n🔄 Alternative Solutions:');
console.log('========================');
console.log('If the above doesn\'t work, try these alternatives:');

const alternativeCallbacks = [
  'https://localhost:3000/api/oauth/callback/jira',
  'https://localhost:3000/api/oauth/callback/confluence',
  'http://127.0.0.1:3000/api/oauth/callback/jira',
  'http://127.0.0.1:3000/api/oauth/callback/confluence'
];

alternativeCallbacks.forEach((url, index) => {
  console.log(`   🔄 ${url}`);
});

console.log('\n🧪 Test After Configuration:');
console.log('==============================');
console.log('1. Save the callback URLs in Atlassian console');
console.log('2. Wait 2-5 minutes for changes to propagate');
console.log('3. Test OAuth again:');
console.log('   • Jira: http://localhost:3000/api/oauth/start/jira');
console.log('   • Confluence: http://localhost:3000/api/oauth/start/confluence');

console.log('\n🔍 Verification:');
console.log('===============');
console.log('✅ Callback URLs must match EXACTLY');
console.log('✅ No typos or extra characters');
console.log('✅ Correct protocol (http vs https)');
console.log('✅ Correct hostname (localhost vs 127.0.0.1)');
console.log('✅ Correct port (3000)');
console.log('✅ Correct path (/api/oauth/callback/...)');

console.log('\n🎯 Current App Configuration:');
console.log('============================');
console.log('Client ID: moaag7PRx59wIYavF1ABt2ZSuZtHzjz3');
console.log('App ID: c3e3e0bc-6916-4def-990d-f4bcb005d4fb');
console.log('Expected Callbacks: 3 URLs listed above');

console.log('\n🚀 Once Configured:');
console.log('===================');
console.log('Your OAuth flow should work perfectly!');
console.log('The redirect URI error will be resolved.');
