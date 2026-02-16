#!/usr/bin/env node

/**
 * Atlassian Redirect URI Fix
 * 
 * Specific fix for Atlassian OAuth redirect URI issues
 */

console.log('🔧 Atlassian Redirect URI Fix');
console.log('============================\n');

console.log('❌ Atlassian Still Shows "Invalid Redirect URI"');
console.log('🔍 Even with HTTP URLs in code...\n');

console.log('📋 Root Cause:');
console.log('==============');
console.log('The problem is NOT in your code - it\'s in your');
console.log('Atlassian Developer Console configuration.');
console.log('');
console.log('Your Atlassian app still has HTTPS callback URLs');
console.log('configured, but your code generates HTTP URLs.\n');

console.log('🌐 Atlassian Developer Console Fix:');
console.log('==================================');

console.log('\n1️⃣ Go to Atlassian Developer Console:');
console.log('   URL: https://developer.atlassian.com/console');

console.log('\n2️⃣ Find Your App:');
console.log('   Look for Client ID: moaag7PRx59wIYavF1ABt2ZSuZtHzjz3');
console.log('   App Name: (whatever you named it)');

console.log('\n3️⃣ Navigate to Settings:');
console.log('   Go to: Settings → Callback URLs');

console.log('\n4️⃣ REMOVE All HTTPS URLs:');
console.log('   Delete any URLs that start with https://');

console.log('\n5️⃣ ADD These HTTP URLs:');
const callbackUrls = [
  'http://localhost:3000/api/oauth/callback/jira',
  'http://localhost:3000/api/oauth/callback/confluence',
  'http://localhost:3000/api/oauth/callback/atlassian'
];

callbackUrls.forEach((url, index) => {
  console.log(`   ✅ ${url}`);
});

console.log('\n6️⃣ Save Changes');
console.log('   Click "Save" or "Update"');

console.log('\n7️⃣ Wait 2-5 Minutes');
console.log('   Atlassian needs time to propagate changes');

console.log('\n🧪 Test After Configuration:');
console.log('============================');

console.log('\nStep 1: Verify Your Code');
console.log('Your current code should generate:');
console.log('Redirect URI: http://localhost:3000/api/oauth/callback/jira');
console.log('Check this by visiting: http://localhost:3000/api/oauth/start/jira');

console.log('\nStep 2: Test OAuth Flow');
console.log('1. Visit: http://localhost:3000/api/oauth/start/jira');
console.log('2. Should redirect to Atlassian (no error)');
console.log('3. Login and authorize');
console.log('4. Should redirect back to: http://localhost:3000?oauth_success=jira');

console.log('\n🔍 Debug Information:');
console.log('====================');

console.log('\nCurrent Atlassian Configuration:');
console.log('Client ID: moaag7PRx59wIYavF1ABt2ZSuZtHzjz3');
console.log('Expected Callback: http://localhost:3000/api/oauth/callback/jira');

console.log('\nWhat Atlassian Sees:');
console.log('If you still have HTTPS configured, Atlassian sees:');
console.log('Configured: https://localhost:3000/api/oauth/callback/jira');
console.log('Received: http://localhost:3000/api/oauth/callback/jira');
console.log('Result: ❌ MISMATCH = Invalid redirect URI');

console.log('\nAfter Fix:');
console.log('Configured: http://localhost:3000/api/oauth/callback/jira');
console.log('Received: http://localhost:3000/api/oauth/callback/jira');
console.log('Result: ✅ MATCH = OAuth works!');

console.log('\n🔄 Alternative Solutions:');
console.log('========================');

console.log('\nOption 1: Use HTTPS for Everything');
console.log('1. Set NEXTAUTH_URL=https://localhost:3000');
console.log('2. Use local HTTPS development (mkcert or ngrok)');
console.log('3. Update Atlassian callbacks to HTTPS');

console.log('\nOption 2: Create New Atlassian App');
console.log('1. Go to: https://developer.atlassian.com/console');
console.log('2. Create new OAuth 2.0 app');
console.log('3. Configure with HTTP URLs from start');
console.log('4. Use existing credentials');

console.log('\n✅ Most Likely Solution:');
console.log('======================');
console.log('Just update the callback URLs in your existing');
console.log('Atlassian app from HTTPS to HTTP. This is the');
console.log('simplest and most reliable fix.');

console.log('\n🎯 Expected Result After Fix:');
console.log('=============================');
console.log('✅ No more "invalid redirect URI" error');
console.log('✅ OAuth start redirects to Atlassian');
console.log('✅ Atlassian authorization page loads');
console.log('✅ After approval, redirects back successfully');
console.log('✅ Final URL: http://localhost:3000?oauth_success=jira');
