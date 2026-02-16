#!/usr/bin/env node

/**
 * Microsoft OAuth Scopes Fix
 * 
 * Fixes AADSTS70011 error - invalid scope format for Microsoft OAuth
 */

console.log('🔧 Microsoft OAuth Scopes Fix');
console.log('============================\n');

console.log('❌ Error: AADSTS70011 - Invalid scope format');
console.log('The Microsoft OAuth scopes are not properly formatted.\n');

console.log('🔍 Issue Analysis:');
console.log('==================');
console.log('Your error shows these scopes:');
console.log('openid,profile,email,offline_access,https://graph.microsoft.com/Mail.Read,https://graph.microsoft.com/Calendars.Read,https://graph.microsoft.com/Files.Read.All,https://graph.microsoft.com/Sites.Read.All,https://graph.microsoft.com/User.Read,https://graph.microsoft.com/Team.ReadBasic.All');
console.log('');
console.log('The issue is: openid,profile,email are NOT valid Microsoft Graph scopes!');
console.log('These are Azure AD scopes, not Microsoft Graph scopes.\n');

console.log('🔧 Microsoft OAuth Scopes Format:');
console.log('=================================');

const validScopes = [
  { scope: 'https://graph.microsoft.com/User.Read', description: 'Read user profile' },
  { scope: 'https://graph.microsoft.com/User.Read.All', description: 'Read all users' },
  { scope: 'https://graph.microsoft.com/Mail.Read', description: 'Read emails' },
  { scope: 'https://graph.microsoft.com/Calendars.Read', description: 'Read calendars' },
  { scope: 'https://graph.microsoft.com/Files.Read.All', description: 'Read all files' },
  { scope: 'https://graph.microsoft.com/Sites.Read.All', description: 'Read all sites' },
  { scope: 'https://graph.microsoft.com/Team.ReadBasic.All', description: 'Read basic team info' },
  { scope: 'offline_access', description: 'Refresh token access' }
];

validScopes.forEach(item => {
  console.log(`✅ ${item.scope}`);
  console.log(`   ${item.description}\n`);
});

console.log('❌ Invalid Scopes (remove these):');
console.log('==================================');
console.log('❌ openid - Use https://graph.microsoft.com/User.Read instead');
console.log('❌ profile - Use https://graph.microsoft.com/User.Read instead');
console.log('❌ email - Use https://graph.microsoft.com/User.Read instead');
console.log('');

console.log('🔧 Fix Options:');
console.log('==============');

console.log('\n📍 Option 1: Use Default Scopes (Recommended)');
console.log('Remove MICROSOFT_SCOPES from .env.local');
console.log('The code will use default: "https://graph.microsoft.com/User.Read offline_access"');

console.log('\n📍 Option 2: Use Correct Scopes in .env.local');
console.log('Set MICROSOFT_SCOPES to:');
console.log('MICROSOFT_SCOPES="https://graph.microsoft.com/User.Read https://graph.microsoft.com/Mail.Read https://graph.microsoft.com/Calendars.Read https://graph.microsoft.com/Files.Read.All https://graph.microsoft.com/Sites.Read.All https://graph.microsoft.com/Team.ReadBasic.All offline_access"');

console.log('\n📍 Option 3: Minimal Scopes');
console.log('Set MICROSOFT_SCOPES to:');
console.log('MICROSOFT_SCOPES="https://graph.microsoft.com/User.Read offline_access"');

console.log('\n🔍 Check Your .env.local:');
console.log('========================');
console.log('Look for MICROSOFT_SCOPES in your .env.local file.');
console.log('If it contains openid,profile,email, remove them!');
console.log('');
console.log('Correct format: https://graph.microsoft.com/User.Read offline_access');
console.log('Wrong format: openid,profile,email,https://graph.microsoft.com/User.Read');

console.log('\n🌐 Generated OAuth URL (correct format):');
console.log('=========================================');
console.log('https://login.microsoftonline.com/common/oauth2/v2.0/authorize?');
console.log('client_id=[YOUR_CLIENT_ID]&');
console.log('redirect_uri=http://localhost:3000/api/oauth/callback/microsoft&');
console.log('response_type=code&');
console.log('scope=https://graph.microsoft.com/User.Read offline_access&');
console.log('response_mode=query');

console.log('\n🧪 Test After Fix:');
console.log('=================');
console.log('1. Update .env.local to remove invalid scopes');
console.log('2. Restart dev server: npm run dev');
console.log('3. Test: http://localhost:3000/api/oauth/start/microsoft');
console.log('4. Should redirect to Microsoft login without scope errors');

console.log('\n✅ Expected Result:');
console.log('==================');
console.log('• No AADSTS70011 error');
console.log('• Microsoft login page loads');
console.log('• Shows proper permission request');
console.log('• After approval, redirects to callback successfully');

console.log('\n🚀 Microsoft OAuth will work with correct Graph scopes!');
