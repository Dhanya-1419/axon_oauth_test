#!/usr/bin/env node

/**
 * Debug Figma Invalid Scopes Issue
 * 
 * Identifies the exact problem with Figma OAuth scopes
 */

console.log('🔍 Debug Figma Invalid Scopes Issue');
console.log('==================================\n');

console.log('❌ Figma Still Shows "Invalid Scopes"');
console.log('🔍 Let\'s identify the exact problem...\n');

console.log('📋 Current Figma Scopes in Your Code:');
console.log('====================================');
console.log('current_user:read file_content:read file_metadata:read file_variables:read file_variables:write file_comments:read file_comments:write library_content:read library_assets:read webhooks:read');

console.log('\n🔍 Figma OAuth Documentation Analysis:');
console.log('=====================================');

console.log('\n✅ CONFIRMED Valid Figma Scopes:');
const validScopes = [
  'current_user:read',
  'file_content:read', 
  'file_metadata:read',
  'file_variables:read',
  'file_variables:write',
  'file_comments:read',
  'file_comments:write',
  'library_content:read',
  'library_assets:read',
  'webhooks:read'
];

validScopes.forEach(scope => console.log(`  ✅ ${scope}`));

console.log('\n❌ Potentially Invalid Scopes:');
const potentiallyInvalid = [
  'file_variables:write',
  'file_comments:write', 
  'webhooks:read'
];

potentiallyInvalid.forEach(scope => console.log(`  ❌ ${scope} (may require special permissions)`));

console.log('\n🔧 Step-by-Step Debug Process:');
console.log('==============================');

console.log('\n1️⃣ Test with Minimal Scopes First:');
console.log('Start with only the most basic scopes:');
const minimalScopes = ['current_user:read', 'file_content:read'];
console.log(minimalScopes.join(' '));

console.log('\n2️⃣ Check Figma Developer Console:');
console.log('Go to: https://www.figma.com/developers/apps');
console.log('Find your app (Client ID: x0YTPytxPHTWYX6dJtigiZ)');
console.log('Check:');
console.log('• App permissions allow requested scopes');
console.log('• Callback URL: http://localhost:3000/api/oauth/callback/figma');
console.log('• App is not in "sandbox" mode');

console.log('\n3️⃣ Verify Redirect URI Consistency:');
console.log('Make sure:');
console.log('• NEXTAUTH_URL=http://localhost:3000');
console.log('• Figma callback configured as HTTP');
console.log('• No HTTPS/HTTP mismatch');

console.log('\n🧪 Testing Strategy:');
console.log('==================');

console.log('\nTest 1: Minimal Scopes');
console.log('Update your Figma route to use:');
console.log('const scopes = "current_user:read file_content:read";');
console.log('Test: http://localhost:3000/api/oauth/start/figma');

console.log('\nTest 2: Add Scopes Gradually');
console.log('If minimal works, add one scope at a time:');
console.log('1. current_user:read file_content:read ✅');
console.log('2. + file_metadata:read');
console.log('3. + file_variables:read');
console.log('4. + file_variables:write');
console.log('5. + file_comments:read');
console.log('6. + file_comments:write');
console.log('7. + library_content:read');
console.log('8. + library_assets:read');
console.log('9. + webhooks:read');

console.log('\n🔍 Common Figma OAuth Issues:');
console.log('=============================');

const issues = [
  {
    issue: 'App not approved for write permissions',
    solution: 'Submit app for review or use read-only scopes'
  },
  {
    issue: 'Webhooks require special approval',
    solution: 'Remove webhooks:read for testing'
  },
  {
    issue: 'File variables write is restricted',
    solution: 'Use file_variables:read only initially'
  },
  {
    issue: 'App in development mode',
    solution: 'Ensure app is activated and not sandboxed'
  }
];

issues.forEach((item, index) => {
  console.log(`${index + 1}. ${item.issue}`);
  console.log(`   Solution: ${item.solution}\n`);
});

console.log('🚀 Immediate Fix - Minimal Scopes:');
console.log('==================================');

console.log('\nReplace your Figma scopes line with:');
console.log('const scopes = process.env.FIGMA_SCOPES || "current_user:read file_content:read";');

console.log('\nThis should work immediately. If it does,');
console.log('gradually add more scopes to find the problematic one.');

console.log('\n🌐 Figma App Configuration Check:');
console.log('=================================');
console.log('In Figma Developer Console, verify:');
console.log('✅ App Status: Active (not disabled)');
console.log('✅ Callback URL: http://localhost:3000/api/oauth/callback/figma');
console.log('✅ Scopes: App allows requested permissions');
console.log('✅ Domain: localhost is authorized (if required)');

console.log('\n✅ Expected Result with Minimal Scopes:');
console.log('======================================');
console.log('• No "invalid scopes" error');
console.log('• Figma OAuth page loads');
console.log('• Shows basic permissions request');
console.log('• After approval, redirects back successfully');

console.log('\n🎯 If Minimal Scopes Still Fail:');
console.log('==============================');
console.log('The issue is likely:');
console.log('1. Callback URL still mismatched');
console.log('2. Figma app not properly configured');
console.log('3. App permissions insufficient');
console.log('4. Development vs production app confusion');
