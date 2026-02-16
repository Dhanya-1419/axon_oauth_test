#!/usr/bin/env node

/**
 * Confluence User-Confirmed Scopes - Final Fix
 * 
 * Uses the exact Confluence OAuth scopes that user confirmed work
 */

console.log('🔧 Confluence User-Confirmed Scopes - Final Fix');
console.log('==============================================\n');

console.log('✅ Perfect! Using your confirmed working Confluence scopes');
console.log('These are the exact scopes you provided that work.\n');

console.log('📋 Confirmed Confluence OAuth Scopes:');
console.log('===================================');

const confirmedScopes = [
  { scope: 'read:content:confluence', description: 'View content details' },
  { scope: 'read:content-details:confluence', description: 'View details regarding content and its associated properties' },
  { scope: 'read:page:confluence', description: 'View pages' },
  { scope: 'read:user:confluence', description: 'View user details' },
  { scope: 'read:content.permission:confluence', description: 'Check if a user or a group can perform an operation to the specified content' },
  { scope: 'read:app-data:confluence', description: 'Read connect app properties data' }
];

confirmedScopes.forEach(item => {
  console.log(`✅ ${item.scope}`);
  console.log(`   ${item.description}\n`);
});

console.log('🔧 Fix Applied:');
console.log('==============');
console.log('Updated Confluence route with your confirmed scopes:');
console.log('const scopes = "read:content:confluence read:content-details:confluence read:page:confluence read:user:confluence read:content.permission:confluence read:app-data:confluence";');
console.log('');
console.log('These are all valid, working Confluence OAuth scopes.\n');

console.log('🌐 Generated OAuth URL:');
console.log('======================');
console.log('https://auth.atlassian.com/authorize?');
console.log('audience=api.atlassian.com&');
console.log('client_id=PUTzd570Tp3796s65wEfzwAGhCu85elj&');
console.log('scope=read:content:confluence read:content-details:confluence read:page:confluence read:user:confluence read:content.permission:confluence read:app-data:confluence&');
console.log('redirect_uri=http://localhost:3000/api/oauth/callback/confluence&');
console.log('response_type=code&prompt=consent&state=[random]');

console.log('\n🧪 Test Now:');
console.log('============');
console.log('1. Restart dev server: npm run dev');
console.log('2. Test: http://localhost:3000/api/oauth/start/confluence');
console.log('3. Should redirect to Atlassian WITHOUT any scope errors');
console.log('4. Authorize and check callback works');

console.log('\n🎯 Alternative Minimal Scopes:');
console.log('=============================');
console.log('If you want to start with minimum, try:');
console.log('const scopes = "read:content:confluence read:user:confluence";');
console.log('');
console.log('This covers basic content and user access.');

console.log('\n✅ Expected Result:');
console.log('==================');
console.log('• No "This app has not requested any supported Atlassian scopes" error');
console.log('• Atlassian authorization page loads successfully');
console.log('• Shows Confluence permission request with your confirmed scopes');
console.log('• After approval, redirects to callback successfully');
console.log('• Token exchange works perfectly');
console.log('• Final redirect: http://localhost:3000?oauth_success=true&provider=confluence');

console.log('\n🚀 Confluence OAuth should now work perfectly!');
console.log('Using your confirmed working scopes was the key.');
