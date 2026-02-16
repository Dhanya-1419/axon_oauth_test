#!/usr/bin/env node

/**
 * Quick Fix for Atlassian OAuth Redirect Issues
 * 
 * The main issue is that the token exchange is using JSON content-type
 * but Atlassian expects form-urlencoded
 */

console.log('🔧 Atlassian OAuth Quick Fix');
console.log('============================\n');

console.log('🐛 Issue Identified:');
console.log('==================');
console.log('The token exchange in /app/api/oauth/callback/jira/route.js');
console.log('is using "Content-Type: application/json" but Atlassian');
console.log('expects "Content-Type: application/x-www-form-urlencoded"');

console.log('\n🔧 Fix Required:');
console.log('===============');
console.log('File: /app/api/oauth/callback/jira/route.js');
console.log('Line 35-37: Change Content-Type header');
console.log('Line 38: Change body to use URLSearchParams instead of JSON');

console.log('\n📝 Before (Broken):');
console.log('```javascript');
console.log('headers: {');
console.log('  "Content-Type": "application/json",');
console.log('},');
console.log('body: JSON.stringify({');
console.log('  grant_type: "authorization_code",');
console.log('  client_id: clientId,');
console.log('  client_secret: clientSecret,');
console.log('  code: code,');
console.log('  redirect_uri: redirectUri,');
console.log('}),');

console.log('\n📝 After (Fixed):');
console.log('```javascript');
console.log('headers: {');
console.log('  "Content-Type": "application/x-www-form-urlencoded",');
console.log('},');
console.log('body: new URLSearchParams({');
console.log('  grant_type: "authorization_code",');
console.log('  client_id: clientId,');
console.log('  client_secret: clientSecret,');
console.log('  code: code,');
console.log('  redirect_uri: redirectUri,');
console.log('}).toString(),');

console.log('\n🚀 Testing Instructions:');
console.log('========================');
console.log('1. Start dev server: npm run dev');
console.log('2. Open: http://localhost:3000/api/oauth/start/jira');
console.log('3. This should redirect to Atlassian');
console.log('4. Login and authorize');
console.log('5. Should redirect back successfully');

console.log('\n🔗 Direct Test URLs:');
console.log('====================');
console.log('Jira OAuth Start:');
console.log('http://localhost:3000/api/oauth/start/jira');
console.log('');
console.log('Confluence OAuth Start:');
console.log('http://localhost:3000/api/oauth/start/confluence');

console.log('\n✅ Expected Result:');
console.log('==================');
console.log('After authorization, you should be redirected to:');
console.log('http://localhost:3000?oauth_success=jira');
console.log('');
console.log('If there\'s an error, you\'ll see:');
console.log('http://localhost:3000?error=jira_oauth_failed');

console.log('\n🎯 Quick Test:');
console.log('=============');
console.log('1. Make sure your .env.local has:');
console.log('   ATLASSIAN_CLIENT_ID=moaag7PRx59wIYavF1ABt2ZSuZtHzjz3');
console.log('   ATLASSIAN_CLIENT_SECRET=ATOAeoO2AhQDZwbClCroutY4F8W75qo1soB_iyv89XhJQFSgQBdLIQFmFjMPOARBwrkS29E04622');
console.log('   NEXTAUTH_URL=http://localhost:3000');
console.log('');
console.log('2. Apply the fix to the callback route');
console.log('3. Test the OAuth flow');

console.log('\n🔍 Debugging Tips:');
console.log('================');
console.log('- Check browser console for errors');
console.log('- Check server terminal for error logs');
console.log('- Make sure Atlassian app has correct callback URLs');
console.log('- Verify NEXTAUTH_URL matches your dev server URL');
