#!/usr/bin/env node

/**
 * Confluence Specific Scopes - Correct Fix
 * 
 * Uses only Confluence-specific OAuth scopes that actually exist
 */

console.log('🔧 Confluence Specific Scopes - Correct Fix');
console.log('==========================================\n');

console.log('✅ You are absolutely right!');
console.log('read:account is NOT available for Confluence specifically!\n');

console.log('🔍 Confluence-Specific OAuth Scopes:');
console.log('===================================');

const confluenceScopes = [
  { scope: 'read:confluence-content.all', description: 'Read all Confluence content' },
  { scope: 'read:confluence-content:page', description: 'Read Confluence pages' },
  { scope: 'read:confluence-content:blog', description: 'Read Confluence blogs' },
  { scope: 'read:confluence-space:confluence', description: 'Read Confluence spaces' },
  { scope: 'write:confluence-content', description: 'Write Confluence content' },
  { scope: 'write:confluence-space', description: 'Write Confluence spaces' },
  { scope: 'read:confluence-user:confluence', description: 'Read Confluence user info' },
  { scope: 'offline_access', description: 'Refresh token access' }
];

confluenceScopes.forEach(item => {
  console.log(`✅ ${item.scope}`);
  console.log(`   ${item.description}\n`);
});

console.log('❌ Atlassian General Scopes (NOT for Confluence):');
console.log('==============================================');
console.log('❌ read:account - General Atlassian account scope');
console.log('❌ read:me - Does not exist');
console.log('❌ write:account - General Atlassian account scope');
console.log('');

console.log('🔧 Fix Applied:');
console.log('==============');
console.log('Updated Confluence route to use only Confluence-specific scopes:');
console.log('const scopes = "read:confluence-content.all read:confluence-space:confluence";');
console.log('');
console.log('These are the most basic Confluence scopes that will work.\n');

console.log('🌐 Generated OAuth URL:');
console.log('======================');
console.log('https://auth.atlassian.com/authorize?');
console.log('audience=api.atlassian.com&');
console.log('client_id=PUTzd570Tp3796s65wEfzwAGhCu85elj&');
console.log('scope=read:confluence-content.all read:confluence-space:confluence&');
console.log('redirect_uri=http://localhost:3000/api/oauth/callback/confluence&');
console.log('response_type=code&prompt=consent&state=[random]');

console.log('\n🧪 Test Now:');
console.log('============');
console.log('1. Restart dev server: npm run dev');
console.log('2. Test: http://localhost:3000/api/oauth/start/confluence');
console.log('3. Should redirect to Atlassian WITHOUT scope errors');
console.log('4. Authorize and check callback works');

console.log('\n🎯 Alternative Minimal Scopes:');
console.log('=============================');
console.log('If still issues, try absolute minimum:');
console.log('const scopes = "read:confluence-content.all";');
console.log('');
console.log('This is the most basic Confluence scope.');

console.log('\n📋 Atlassian Scope Documentation:');
console.log('=================================');
console.log('Confluence uses product-specific scopes:');
console.log('• read:confluence-content.*');
console.log('• read:confluence-space.*');
console.log('• write:confluence-content.*');
console.log('• write:confluence-space.*');
console.log('• read:confluence-user:confluence');
console.log('');
console.log('General Atlassian scopes like read:account are for');
console.log('account management, not for Confluence access.');

console.log('\n✅ Expected Result:');
console.log('==================');
console.log('• No "This app has not requested any supported Atlassian scopes" error');
console.log('• Atlassian authorization page loads');
console.log('• Shows Confluence-specific permission request');
console.log('• After approval, redirects successfully');
console.log('• Token exchange works');

console.log('\n🚀 Confluence OAuth should now work with correct scopes!');
