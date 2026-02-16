#!/usr/bin/env node

/**
 * Atlassian "Something went wrong" - Step-by-Step Fix
 * 
 * Complete guide to fix Atlassian OAuth redirect URI mismatch
 */

console.log('🔧 Atlassian "Something went wrong" - Complete Fix');
console.log('================================================\n');

console.log('❌ Error: "Something went wrong. Close this page and try again, or raise a support request."');
console.log('🎯 This is 100% a redirect URI mismatch issue!\n');

console.log('📋 What\'s Happening:');
console.log('====================');
console.log('1. Your code generates: http://localhost:3000/api/oauth/callback/jira');
console.log('2. Atlassian app expects: https://localhost:3000/api/oauth/callback/jira');
console.log('3. Result: ❌ MISMATCH = "Something went wrong" error\n');

console.log('🔧 STEP-BY-STEP FIX:');
console.log('=====================');

console.log('\n📍 STEP 1: Go to Atlassian Developer Console');
console.log('=====================================');
console.log('URL: https://developer.atlassian.com/console');
console.log('');
console.log('Login with your Atlassian account.');

console.log('\n📍 STEP 2: Find Your App');
console.log('========================');
console.log('Look for app with:');
console.log('Client ID: moaag7PRx59wIYavF1ABt2ZSuZtHzjz3');
console.log('');
console.log('If you can\'t find it, create a new app:');
console.log('1. Click "Create new app"');
console.log('2. Choose "OAuth 2.0"');
console.log('3. Enter app name');
console.log('4. Use the same Client ID and Secret from your .env.local');

console.log('\n📍 STEP 3: Update Callback URLs');
console.log('===============================');
console.log('In your app settings, find "Callback URLs" or "Redirect URIs"');
console.log('');
console.log('DELETE ALL existing URLs (especially HTTPS ones)');
console.log('');
console.log('ADD these EXACT URLs:');
console.log('✅ http://localhost:3000/api/oauth/callback/jira');
console.log('✅ http://localhost:3000/api/oauth/callback/confluence');
console.log('');
console.log('IMPORTANT: Use HTTP, not HTTPS!');
console.log('Copy these URLs EXACTLY - no trailing slashes!');

console.log('\n📍 STEP 4: Check App Settings');
console.log('============================');
console.log('Ensure:');
console.log('✅ App Status: Active (not disabled)');
console.log('✅ App Type: OAuth 2.0');
console.log('✅ Scopes: Allow requested permissions');
console.log('✅ Domain: localhost is authorized');

console.log('\n📍 STEP 5: Save and Wait');
console.log('======================');
console.log('1. Click "Save" or "Update"');
console.log('2. Wait 2-5 minutes for changes to propagate');
console.log('3. Atlassian needs time to update their systems');

console.log('\n📍 STEP 6: Test the Fix');
console.log('======================');
console.log('1. Restart your dev server: npm run dev');
console.log('2. Clear browser cache/cookies for localhost');
console.log('3. Test: http://localhost:3000/api/oauth/start/jira');
console.log('4. Should redirect to Atlassian WITHOUT error');

console.log('\n🔍 Alternative: Create New App');
console.log('=============================');
console.log('If you can\'t fix the existing app:');
console.log('');
console.log('1. Go to: https://developer.atlassian.com/console');
console.log('2. Click "Create new app"');
console.log('3. Choose "OAuth 2.0 integration"');
console.log('4. App name: "My Local Development App"');
console.log('5. Description: "Local development testing"');
console.log('6. Callback URLs:');
console.log('   http://localhost:3000/api/oauth/callback/jira');
console.log('   http://localhost:3000/api/oauth/callback/confluence');
console.log('7. Get new Client ID and Secret');
console.log('8. Update your .env.local with new credentials');

console.log('\n🧪 Verification Steps:');
console.log('====================');
console.log('After fixing, the OAuth URL should be:');
console.log('');
console.log('https://auth.atlassian.com/authorize?');
console.log('audience=api.atlassian.com&');
console.log('client_id=moaag7PRx59wIYavF1ABt2ZSuZtHzjz3&');
console.log('scope=read:jira-work read:jira-user read:account read:me&');
console.log('redirect_uri=http://localhost:3000/api/oauth/callback/jira&');
console.log('response_type=code&prompt=consent');
console.log('');
console.log('The redirect_uri parameter MUST match exactly');
console.log('what\'s configured in your Atlassian app.');

console.log('\n✅ Expected Working Result:');
console.log('============================');
console.log('• Atlassian authorization page loads');
console.log('• No "Something went wrong" error');
console.log('• Shows login/consent screen');
console.log('• After approval, redirects to your callback');
console.log('• Final URL: http://localhost:3000?oauth_success=jira');

console.log('\n🎯 If Still Not Working:');
console.log('========================');
console.log('1. Double-check callback URLs (copy-paste to avoid typos)');
console.log('2. Ensure no trailing slashes in URLs');
console.log('3. Wait longer for Atlassian propagation');
console.log('4. Try creating a new app with HTTP URLs from start');
console.log('5. Check if your network blocks Atlassian');

console.log('\n🚀 This fix will resolve the "Something went wrong" error!');
