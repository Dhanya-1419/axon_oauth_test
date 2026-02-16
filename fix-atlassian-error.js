#!/usr/bin/env node

/**
 * Atlassian "Something went wrong" Error Fix
 * 
 * Diagnoses and fixes Atlassian OAuth authorization issues
 */

console.log('🔧 Atlassian "Something went wrong" Error Fix');
console.log('============================================\n');

console.log('❌ Issue: Atlassian shows "Something went wrong" on authorization page');
console.log('🔍 This is a classic OAuth configuration issue...\n');

console.log('📋 Root Causes:');
console.log('===============');

const causes = [
  {
    cause: 'Redirect URI mismatch',
    explanation: 'Atlassian app config doesn\'t match your code',
    fix: 'Update Atlassian developer console callback URLs'
  },
  {
    cause: 'Invalid client credentials',
    explanation: 'ATLASSIAN_CLIENT_ID or CLIENT_SECRET wrong',
    fix: 'Verify credentials in .env.local'
  },
  {
    cause: 'Missing required parameters',
    explanation: 'OAuth URL missing audience or scope',
    fix: 'Check OAuth URL construction'
  },
  {
    cause: 'App not activated',
    explanation: 'Atlassian app is disabled or in sandbox',
    fix: 'Activate app in developer console'
  },
  {
    cause: 'Scope permissions issue',
    explanation: 'Requested scopes not allowed for app',
    fix: 'Use basic scopes or update app permissions'
  }
];

causes.forEach((item, index) => {
  console.log(`${index + 1}. ${item.cause}`);
  console.log(`   Explanation: ${item.explanation}`);
  console.log(`   Fix: ${item.fix}\n`);
});

console.log('🔍 Current Configuration Check:');
console.log('==============================');

console.log('\nJira OAuth Configuration:');
console.log('Client ID: moaag7PRx59wIYavF1ABt2ZSuZtHzjz3');
console.log('Redirect URI: http://localhost:3000/api/oauth/callback/jira');
console.log('Scopes: read:jira-work read:jira-user read:account read:me');
console.log('Auth URL: https://auth.atlassian.com/authorize');

console.log('\nConfluence OAuth Configuration:');
console.log('Client ID: moaag7PRx59wIYavF1ABt2ZSuZtHzjz3');
console.log('Redirect URI: http://localhost:3000/api/oauth/callback/confluence');
console.log('Scopes: read:confluence-content.summary read:confluence-space:confluence read:confluence-user:confluence offline_access');
console.log('Auth URL: https://auth.atlassian.com/authorize');

console.log('\n🔧 Immediate Fixes:');
console.log('==================');

console.log('\n1️⃣ Update Atlassian Developer Console:');
console.log('Go to: https://developer.atlassian.com/console');
console.log('Find your app (Client ID: moaag7PRx59wIYavF1ABt2ZSuZtHzjz3)');
console.log('');
console.log('In Settings → Callback URLs, ADD:');
console.log('✅ http://localhost:3000/api/oauth/callback/jira');
console.log('✅ http://localhost:3000/api/oauth/callback/confluence');
console.log('');
console.log('REMOVE any HTTPS URLs (starting with https://)');

console.log('\n2️⃣ Check App Status:');
console.log('Ensure app is:');
console.log('✅ Active (not disabled)');
console.log('✅ Not in sandbox mode');
console.log('✅ Has required permissions');

console.log('\n3️⃣ Verify Environment Variables:');
console.log('In .env.local, check:');
console.log('✅ ATLASSIAN_CLIENT_ID=moaag7PRx59wIYavF1ABt2ZSuZtHzjz3');
console.log('✅ ATLASSIAN_CLIENT_SECRET=ATOAeoO2AhQDZwbClCroutY4F8W75qo1soB_iyv89XhJQFSgQBdLIQFmFjMPOARBwrkS29E04622');

console.log('\n4️⃣ Test OAuth URLs Manually:');
console.log('Check the generated URLs:');
console.log('');
console.log('Jira:');
console.log('https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=moaag7PRx59wIYavF1ABt2ZSuZtHzjz3&scope=read:jira-work read:jira-user read:account read:me&redirect_uri=http://localhost:3000/api/oauth/callback/jira&response_type=code&prompt=consent');
console.log('');
console.log('Confluence:');
console.log('https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=moaag7PRx59wIYavF1ABt2ZSuZtHzjz3&scope=read:confluence-content.summary read:confluence-space:confluence read:confluence-user:confluence offline_access&redirect_uri=http://localhost:3000/api/oauth/callback/confluence&response_type=code&prompt=consent');

console.log('\n🧪 Debug Steps:');
console.log('===============');

console.log('\nStep 1: Check Browser Developer Tools');
console.log('1. Open browser DevTools (F12)');
console.log('2. Go to Network tab');
console.log('3. Try Atlassian OAuth');
console.log('4. Look for the authorize request');
console.log('5. Check the URL parameters');

console.log('\nStep 2: Test with Minimal Scopes');
console.log('Try reducing scopes to basic ones:');
console.log('Jira: read:me');
console.log('Confluence: read:confluence-user:confluence');

console.log('\nStep 3: Check Atlassian App Logs');
console.log('In Atlassian developer console:');
console.log('1. Go to your app');
console.log('2. Check "Logs" or "Activity"');
console.log('3. Look for error messages');

console.log('\n🚀 Most Likely Fix:');
console.log('===================');
console.log('The issue is probably the callback URL mismatch.');
console.log('Your Atlassian app likely has HTTPS URLs configured,');
console.log('but your code generates HTTP URLs.');
console.log('');
console.log('Fix: Update Atlassian developer console to use HTTP URLs');

console.log('\n✅ Expected Result After Fix:');
console.log('=============================');
console.log('• Atlassian authorization page loads successfully');
console.log('• No "Something went wrong" error');
console.log('• Shows proper authorization consent screen');
console.log('• After approval, redirects back to your app');

console.log('\n🎯 If Still Not Working:');
console.log('========================');
console.log('1. Try creating a new Atlassian app');
console.log('2. Use HTTP URLs from the start');
console.log('3. Use minimal scopes for testing');
console.log('4. Check if your IP is blocked by Atlassian');
