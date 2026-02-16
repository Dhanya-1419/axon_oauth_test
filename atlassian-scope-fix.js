#!/usr/bin/env node

/**
 * Atlassian Scope Configuration Guide
 * 
 * Helps fix the missing 'read:me' scope issue
 */

console.log('🔧 Atlassian Scope Configuration Fix');
console.log('===================================\n');

// Your current Atlassian app info
const NEW_ATLASSIAN_CLIENT_ID = 'WVVp82PmqH6LIBFUZrB4gqRyMJStFDXU';
const NEW_ATLASSIAN_CLIENT_SECRET = 'ATOAhMNUr7sOyAnRLhWGTlV8H3xTNCSx3yUk01MHLRC2Pp_lOGO6u1H1_ovYNh6Gjbe343866CA';

console.log('📋 Current App Configuration:');
console.log(`   App ID: ${NEW_ATLASSIAN_CLIENT_ID}`);
console.log(`   Issue: Missing 'read:me' scope for /me endpoint`);

console.log('\n🎯 Required Scopes for Full Functionality:');
console.log('=====================================');

console.log('\n📱 For Jira App:');
const jiraScopes = [
  'read:jira-work',
  'read:jira-user', 
  'read:account',
  'read:me',           // ← MISSING - This is causing the 403 error!
  'offline_access'
];

console.log('Required Scopes:');
jiraScopes.forEach((scope, index) => {
  const status = scope === 'read:me' ? '❌ MISSING' : '✅';
  console.log(`   ${index + 1}. ${scope} ${status}`);
});

console.log('\n📄 For Confluence App:');
const confluenceScopes = [
  'read:confluence-content.summary',
  'read:confluence-space:confluence',
  'read:confluence-user:confluence',
  'read:me',           // ← MISSING - This will cause 403 error!
  'offline_access'
];

console.log('Required Scopes:');
confluenceScopes.forEach((scope, index) => {
  const status = scope === 'read:me' ? '❌ MISSING' : '✅';
  console.log(`   ${index + 1}. ${scope} ${status}`);
});

console.log('\n🔗 Atlassian Developer Console Steps:');
console.log('=====================================');

console.log('\n1️⃣ Open Atlassian Developer Console:');
console.log('   URL: https://developer.atlassian.com/console');

console.log('\n2️⃣ Find Your App:');
console.log(`   Search for App ID: ${NEW_ATLASSIAN_CLIENT_ID}`);

console.log('\n3️⃣ Navigate to App Settings:');
console.log('   Click on your app → "Settings" → "Permissions"');

console.log('\n4️⃣ Add Missing Scopes:');
console.log('   For Jira App:');
console.log('     ✅ Check: read:jira-work');
console.log('     ✅ Check: read:jira-user');
console.log('     ✅ Check: read:account');
console.log('     ✅ ADD: read:me ← CRITICAL!');
console.log('     ✅ Check: offline_access');
console.log('');
console.log('   For Confluence App:');
console.log('     ✅ Check: read:confluence-content.summary');
console.log('     ✅ Check: read:confluence-space:confluence');
console.log('     ✅ Check: read:confluence-user:confluence');
console.log('     ✅ ADD: read:me ← CRITICAL!');
console.log('     ✅ Check: offline_access');

console.log('\n5️⃣ Save Configuration:');
console.log('   Click "Save" or "Update"');

console.log('\n6️⃣ Wait for Propagation:');
console.log('   Changes may take 1-2 minutes to propagate');

console.log('\n7️⃣ Test OAuth Flow:');
console.log('   Use the OAuth URLs from previous test');
console.log('   Complete authorization in browser');

console.log('\n🎯 Expected Result After Fix:');
console.log('==============================');
console.log('✅ Client credentials: Will work');
console.log('✅ OAuth start: Will redirect to Atlassian');
console.log('✅ OAuth callback: Will process authorization code');
console.log('✅ Token exchange: Will succeed with proper scopes');
console.log('✅ API access: Will work (200 instead of 403)');
console.log('✅ Connection status: Will show "Connected"');

console.log('\n📋 Complete Scope List:');
console.log('======================');
console.log('');
console.log('📱 Jira App Scopes:');
console.log('   read:jira-work          - Read Jira work data');
console.log('   read:jira-user          - Read Jira user information');
console.log('   read:account           - Read account details');
console.log('   read:me                - Read current user profile ← CRITICAL!');
console.log('   offline_access         - Enable refresh tokens');
console.log('');
console.log('📄 Confluence App Scopes:');
console.log('   read:confluence-content.summary - Read page summaries');
console.log('   read:confluence-space:confluence  - Read space information');
console.log('   read:confluence-user:confluence  - Read user information');
console.log('   read:me                - Read current user profile ← CRITICAL!');
console.log('   offline_access         - Enable refresh tokens');

console.log('\n⚠️  Critical Note:');
console.log('The "read:me" scope is REQUIRED for the /me endpoint');
console.log('Without it, you will get 403 Forbidden errors');
console.log('Both Jira and Confluence apps need this scope!');
