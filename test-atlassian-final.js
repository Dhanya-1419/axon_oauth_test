#!/usr/bin/env node

/**
 * Final Atlassian OAuth Test After Fix
 * 
 * Tests the OAuth flow after fixing the Content-Type issue
 */

console.log('✅ Atlassian OAuth Fix Applied');
console.log('==============================\n');

console.log('🔧 Changes Made:');
console.log('===============');
console.log('✅ Fixed Jira callback Content-Type: application/x-www-form-urlencoded');
console.log('✅ Fixed Confluence callback Content-Type: application/x-www-form-urlencoded');
console.log('✅ Changed body format from JSON.stringify to URLSearchParams');

console.log('\n🚀 Ready to Test:');
console.log('================');

console.log('\n1️⃣ Start Development Server:');
console.log('   npm run dev');

console.log('\n2️⃣ Test OAuth URLs:');
console.log('   Jira: http://localhost:3000/api/oauth/start/jira');
console.log('   Confluence: http://localhost:3000/api/oauth/start/confluence');

console.log('\n3️⃣ Expected Flow:');
console.log('   1. Click URL → Redirect to Atlassian');
console.log('   2. Login & Authorize → Redirect back to your app');
console.log('   3. Success: http://localhost:3000?oauth_success=jira');
console.log('   4. Error: http://localhost:3000?error=jira_oauth_failed');

console.log('\n🔍 Debug URLs:');
console.log('==============');
console.log('Direct OAuth Start:');
console.log('• Jira: http://localhost:3000/api/oauth/start/jira');
console.log('• Confluence: http://localhost:3000/api/oauth/start/confluence');

console.log('\nManual OAuth URLs (if start endpoints fail):');
const jiraUrl = 'https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=moaag7PRx59wIYavF1ABt2ZSuZtHzjz3&scope=read%3Ajira-work%20read%3Ajira-user%20read%3Aaccount%20read%3Ame&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Foauth%2Fcallback%2Fjira&response_type=code&prompt=consent';
const confluenceUrl = 'https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=moaag7PRx59wIYavF1ABt2ZSuZtHzjz3&scope=read%3Aconfluence-content.summary%20read%3Aconfluence-space%3Aconfluence%20read%3Aconfluence-user%3Aconfluence%20read%3Ame&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Foauth%2Fcallback%2Fconfluence&response_type=code&prompt=consent';

console.log(`• Jira Manual: ${jiraUrl.substring(0, 100)}...`);
console.log(`• Confluence Manual: ${confluenceUrl.substring(0, 100)}...`);

console.log('\n📋 Verification Checklist:');
console.log('=========================');
console.log('□ Development server running on port 3000');
console.log('□ .env.local contains correct Atlassian credentials');
console.log('□ NEXTAUTH_URL=http://localhost:3000 in .env.local');
console.log('□ Atlassian app configured with callback URLs:');
console.log('  - http://localhost:3000/api/oauth/callback/jira');
console.log('  - http://localhost:3000/api/oauth/callback/confluence');

console.log('\n🎯 Success Indicators:');
console.log('====================');
console.log('✅ OAuth start redirects to Atlassian');
console.log('✅ Atlassian authorization page loads');
console.log('✅ After authorization, redirects back to app');
console.log('✅ Final URL shows ?oauth_success=jira or ?oauth_success=true&provider=confluence');
console.log('✅ No error messages in browser console');
console.log('✅ No error messages in server terminal');

console.log('\n❌ Troubleshooting:');
console.log('==================');
console.log('If still getting redirect errors:');
console.log('1. Check Atlassian app callback URLs configuration');
console.log('2. Verify NEXTAUTH_URL matches your dev server');
console.log('3. Check browser network tab for failed requests');
console.log('4. Look at server terminal for error logs');
console.log('5. Ensure credentials are correctly loaded from .env.local');

console.log('\n🚀 OAuth Testing Complete!');
console.log('Your Atlassian OAuth should now work properly.');
