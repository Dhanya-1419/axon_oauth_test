#!/usr/bin/env node

/**
 * Find Your Correct Atlassian App
 * 
 * Helps identify which Atlassian app matches your credentials
 */

console.log('🔍 Find Your Correct Atlassian App');
console.log('==================================\n');

console.log('❌ Issue: App ID c3e3e0bc-6916-4def-990d-f4bcb005d4fb doesn\'t match your credentials');
console.log('🔍 Let\'s find your correct app...\n');

console.log('📋 Your Current Credentials:');
console.log('===========================');
console.log('Client ID: <from .env ATLASSIAN_CLIENT_ID>');
console.log('Client Secret: <from .env ATLASSIAN_CLIENT_SECRET>');

console.log('\n🌐 Atlassian Developer Console Steps:');
console.log('=====================================');
console.log('1. Go to: https://developer.atlassian.com/console');
console.log('2. Look for apps with Client ID: (your ATLASSIAN_CLIENT_ID from .env)');
console.log('3. The App ID will be different from c3e3e0bc-6916-4def-990d-f4bcb005d4fb');

console.log('\n🎯 How to Identify Your App:');
console.log('=============================');
console.log('• Look for "Client ID" field in app details');
console.log('• It should match your ATLASSIAN_CLIENT_ID from .env');
console.log('• The App ID is different - it\'s a UUID format');
console.log('• You may have multiple apps - find the right one');

console.log('\n🔧 Required Callback URLs for YOUR App:');
console.log('======================================');
const callbackUrls = [
  'http://localhost:3000/api/oauth/callback/jira',
  'http://localhost:3000/api/oauth/callback/confluence',
  'http://localhost:3000/api/oauth/callback/atlassian'
];

callbackUrls.forEach((url, index) => {
  console.log(`${index + 1}. ${url}`);
});

console.log('\n🔄 Alternative: Create New App');
console.log('===============================');
console.log('If you can\'t find the right app:');
console.log('1. Go to: https://developer.atlassian.com/console');
console.log('2. Click "Create app"');
console.log('3. Choose "OAuth 2.0"');
console.log('4. App name: "Integration Tester"');
console.log('5. Use your current credentials:');
console.log('   • Client ID: (from .env ATLASSIAN_CLIENT_ID)');
console.log('   • Client Secret: (from .env ATLASSIAN_CLIENT_SECRET)');
console.log('6. Add callback URLs (listed above)');
console.log('7. Add required scopes:');
console.log('   • read:jira-work');
console.log('   • read:jira-user');
console.log('   • read:account');
console.log('   • read:me');
console.log('   • read:confluence-content.summary');
console.log('   • read:confluence-space:confluence');
console.log('   • read:confluence-user:confluence');
console.log('   • offline_access');

console.log('\n🧪 Test OAuth Flow:');
console.log('==================');
console.log('Once configured, test:');
console.log('• Jira: http://localhost:3000/api/oauth/start/jira');
console.log('• Confluence: http://localhost:3000/api/oauth/start/confluence');

console.log('\n📱 Manual OAuth URLs (for testing):');
console.log('===================================');
const jiraScopes = 'read:jira-work read:jira-user read:account read:me offline_access';
const confluenceScopes = 'read:confluence-content.summary read:confluence-space:confluence read:confluence-user:confluence read:me offline_access';

console.log('Jira:');
console.log(`https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=moaag7PRx59wIYavF1ABt2ZSuZtHzjz3&scope=${encodeURIComponent(jiraScopes)}&redirect_uri=${encodeURIComponent('http://localhost:3000/api/oauth/callback/jira')}&response_type=code&prompt=consent`);

console.log('\nConfluence:');
console.log(`https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=moaag7PRx59wIYavF1ABt2ZSuZtHzjz3&scope=${encodeURIComponent(confluenceScopes)}&redirect_uri=${encodeURIComponent('http://localhost:3000/api/oauth/callback/confluence')}&response_type=code&prompt=consent`);

console.log('\n✅ Next Steps:');
console.log('==============');
console.log('1. Find your app with Client ID: moaag7PRx59wIYavF1ABt2ZSuZtHzjz3');
console.log('2. Or create a new app with these credentials');
console.log('3. Configure callback URLs exactly as shown');
console.log('4. Test OAuth flow');
