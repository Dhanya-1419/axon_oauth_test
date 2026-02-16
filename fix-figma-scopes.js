#!/usr/bin/env node

/**
 * Figma OAuth Scopes Debug & Fix
 * 
 * Identifies and fixes the invalid scopes issue
 */

console.log('🔍 Figma OAuth Scopes Debug & Fix');
console.log('================================\n');

console.log('❌ Issue: App shows "invalid scopes" error');
console.log('🔍 Let\'s identify the problems...\n');

console.log('📋 Identified Issues:');
console.log('====================');

const issues = [
  {
    issue: 'NEXTAUTH_URL mismatch',
    problem: 'NEXTAUTH_URL is "https://localhost:3000" but fallback uses "http://localhost:3000"',
    impact: 'Redirect URI mismatch causing OAuth failures'
  },
  {
    issue: 'Too many scopes',
    problem: 'Very long scope string may exceed Figma limits',
    impact: 'Figma rejects the request due to invalid/unsupported scopes'
  },
  {
    issue: 'Scope format',
    problem: 'Some scopes might not be valid for Figma OAuth',
    impact: 'Figma returns "invalid scopes" error'
  }
];

issues.forEach((item, index) => {
  console.log(`${index + 1}. ${item.issue}`);
  console.log(`   Problem: ${item.problem}`);
  console.log(`   Impact: ${item.impact}\n`);
});

console.log('🔧 Fix 1: Update NEXTAUTH_URL');
console.log('=============================');
console.log('In your .env.local file, change:');
console.log('NEXTAUTH_URL=https://localhost:3000');
console.log('To:');
console.log('NEXTAUTH_URL=http://localhost:3000');
console.log('');
console.log('OR update the Figma route to use HTTPS consistently');

console.log('\n🔧 Fix 2: Reduce Scopes to Essential Ones');
console.log('======================================');
console.log('The current scope string is very long. Try these essential scopes:');

const essentialScopes = [
  'current_user:read',
  'file_content:read',
  'file_metadata:read',
  'file_variables:read'
];

console.log('Essential scopes:');
essentialScopes.forEach(scope => console.log(`  ✅ ${scope}`));

console.log('\n🔧 Fix 3: Valid Figma Scopes Only');
console.log('===============================');
console.log('According to Figma documentation, valid scopes include:');

const validFigmaScopes = [
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

validFigmaScopes.forEach(scope => console.log(`  ✅ ${scope}`));

console.log('\n❌ Potentially Invalid Scopes:');
console.log('============================');
const potentiallyInvalid = [
  'file_versions:read',
  'library_analytics:read',
  'team_library_content:read',
  'file_dev_resources:read',
  'file_dev_resources:write'
];

potentiallyInvalid.forEach(scope => console.log(`  ❌ ${scope} (may not exist)`));

console.log('\n🚀 Recommended Fix:');
console.log('==================');
console.log('1. Fix NEXTAUTH_URL to use HTTP for local development');
console.log('2. Use only valid Figma scopes');
console.log('3. Test with minimal scopes first');

console.log('\n📝 Updated Figma Route (Copy This):');
console.log('=====================================');
console.log(`const scopes = process.env.FIGMA_SCOPES || "current_user:read file_content:read file_metadata:read file_variables:read";`);

console.log('\n🧪 Test Steps:');
console.log('=============');
console.log('1. Update .env.local: NEXTAUTH_URL=http://localhost:3000');
console.log('2. Restart dev server: npm run dev');
console.log('3. Test Figma OAuth: http://localhost:3000/api/oauth/start/figma');
console.log('4. If works, gradually add more scopes');

console.log('\n🌐 Figma Developer Console Check:');
console.log('=================================');
console.log('1. Go to: https://www.figma.com/developers/apps');
console.log('2. Find your app (Client ID: x0YTPytxPHTWYX6dJtigiZ)');
console.log('3. Check callback URL: http://localhost:3000/api/oauth/callback/figma');
console.log('4. Ensure app has required permissions for the scopes you\'re requesting');

console.log('\n✅ Expected Result:');
console.log('==================');
console.log('After fixes:');
console.log('• No "invalid scopes" error');
console.log('• OAuth redirects to Figma successfully');
console.log('• Figma shows proper authorization page');
console.log('• Redirect back to your app works');
