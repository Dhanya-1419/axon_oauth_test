#!/usr/bin/env node

/**
 * Ultimate Confluence Debug - Find the Exact Issue
 * 
 * Comprehensive diagnostic when all fixes fail
 */

console.log('🔍 Ultimate Confluence Debug - Find the Exact Issue');
console.log('================================================\n');

console.log('❌ Still "Something went wrong" after all fixes');
console.log('🔍 Let\'s do a complete diagnostic...\n');

console.log('📋 Complete Diagnostic Checklist:');
console.log('=================================');

const diagnosticSteps = [
  {
    step: '1. Verify Correct App',
    check: 'Are you looking at the right Confluence app?',
    details: 'Client ID should be: PUTzd570Tp3796s65wEfzwAGhCu85elj',
    action: 'Find this exact app in Atlassian console'
  },
  {
    step: '2. Check App Type',
    check: 'Is it an OAuth 2.0 app?',
    details: 'Should be "OAuth 2.0 integration", not "JWT" or other type',
    action: 'Verify app type in developer console'
  },
  {
    step: '3. Check App Status',
    check: 'Is the app active?',
    details: 'Should show "Active" status, not "Disabled" or "Sandbox"',
    action: 'Activate app if disabled'
  },
  {
    step: '4. Check Callback URL Format',
    check: 'Is callback URL exactly correct?',
    details: 'Must be: http://localhost:3000/api/oauth/callback/confluence',
    action: 'Copy-paste to avoid typos, no trailing slash'
  },
  {
    step: '5. Check Scopes in Console',
    check: 'Does app allow requested scopes?',
    details: 'App should allow: read:me read:account read:confluence-content.all',
    action: 'Update app permissions if needed'
  },
  {
    step: '6. Check Domain Authorization',
    check: 'Is localhost authorized?',
    details: 'Some apps require authorized domains',
    action: 'Add localhost to authorized domains'
  },
  {
    step: '7. Check for Multiple Apps',
    check: 'Do you have duplicate apps?',
    details: 'Multiple apps with similar names can cause confusion',
    action: 'Delete unused apps, keep only the correct one'
  }
];

diagnosticSteps.forEach(item => {
  console.log(`\n${item.step}. ${item.check}`);
  console.log(`   Details: ${item.details}`);
  console.log(`   Action: ${item.action}`);
});

console.log('\n🔧 Manual URL Test - Copy Paste This:');
console.log('=======================================');
console.log('Test this exact URL in your browser:');
console.log('');
console.log('https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=PUTzd570Tp3796s65wEfzwAGhCu85elj&scope=read:me read:account read:confluence-content.all&redirect_uri=http://localhost:3000/api/oauth/callback/confluence&response_type=code&prompt=consent&state=test123');
console.log('');
console.log('If this URL shows "Something went wrong", the issue is in Atlassian console.');
console.log('If this URL works, the issue is in your code generation.');

console.log('\n🎯 Alternative Solution - Create Fresh App:');
console.log('=======================================');

console.log('\nIf you can\'t fix the existing app, create a new one:');
console.log('');
console.log('1. Go to: https://developer.atlassian.com/console');
console.log('2. Click "Create new app"');
console.log('3. Choose "OAuth 2.0 integration"');
console.log('4. App details:');
console.log('   Name: Confluence Local Dev');
console.log('   Description: Local development testing');
console.log('   Callback URL: http://localhost:3000/api/oauth/callback/confluence');
console.log('   Scopes: read:me read:account read:confluence-content.all');
console.log('5. Save and get new credentials');
console.log('6. Update .env.local with new CONFLUENCE_CLIENT_ID and CONFLUENCE_CLIENT_SECRET');

console.log('\n🔍 Debug Information to Collect:');
console.log('================================');

const debugInfo = [
  'Screenshot of Atlassian developer console showing Confluence app',
  'Screenshot of callback URLs configuration',
  'Screenshot of app permissions/scopes',
  'Screenshot of app status',
  'Exact error message from Atlassian page',
  'Browser URL when error occurs'
];

debugInfo.forEach((item, index) => {
  console.log(`${index + 1}. ${item}`);
});

console.log('\n🚀 Quick Test - Minimal Everything:');
console.log('==================================');

console.log('\nTest with absolute minimum:');
console.log('1. Create new app with only "read:me" scope');
console.log('2. Callback: http://localhost:3000/api/oauth/callback/confluence');
console.log('3. Test if basic OAuth works');
console.log('4. If this works, gradually add more scopes');

console.log('\n✅ Working vs Not Working Indicators:');
console.log('===================================');

console.log('\n✅ WORKING - You should see:');
console.log('• Atlassian authorization page with "Allow" button');
console.log('• List of requested permissions');
console.log('• Your app name and logo');
console.log('• No error messages');

console.log('\n❌ NOT WORKING - You might see:');
console.log('• "Something went wrong" error');
console.log('• "Invalid client_id" error');
console.log('• "Invalid redirect_uri" error');
console.log('• "This app has not requested any supported scopes" error');

console.log('\n🎯 Most Likely Issues (in order):');
console.log('===================================');

const likelyIssues = [
  'Looking at wrong app (Jira instead of Confluence)',
  'App has HTTPS callback URL instead of HTTP',
  'App is disabled or in sandbox mode',
  'App doesn\'t allow requested scopes',
  'Multiple apps causing confusion',
  'Domain not authorized'
];

likelyIssues.forEach((issue, index) => {
  console.log(`${index + 1}. ${issue}`);
});

console.log('\n🚀 This comprehensive diagnostic will find the exact issue!');
console.log('Go through each step systematically and the problem will be revealed.');
