#!/usr/bin/env node

/**
 * Test Confluence OAuth with Debug Logs
 * 
 * Step-by-step testing instructions
 */

console.log('🧪 Test Confluence OAuth with Debug Logs');
console.log('======================================\n');

console.log('🔧 I\'ve added debug logging to Confluence routes');
console.log('Now let\'s test and identify the exact issue...\n');

console.log('📋 Test Steps:');
console.log('==============');

console.log('\n1️⃣ Restart Development Server:');
console.log('================================');
console.log('Stop current server (Ctrl+C)');
console.log('Start again: npm run dev');
console.log('Watch for debug logs in console');

console.log('\n2️⃣ Test Confluence OAuth Start:');
console.log('=================================');
console.log('Visit: http://localhost:3000/api/oauth/start/confluence');
console.log('');
console.log('Check console for these debug logs:');
console.log('🔍 Confluence OAuth Debug:');
console.log('Client ID: [should show PUTzd570Tp3796s65wEfzwAGhCu85elj]');
console.log('Redirect URI: http://localhost:3000/api/oauth/callback/confluence');
console.log('NEXTAUTH_URL: http://localhost:3000');

console.log('\n3️⃣ Check What Happens:');
console.log('========================');
console.log('Case A: If you see "Something went wrong" immediately:');
console.log('• Problem: OAuth URL generation or redirect');
console.log('• Check: Client ID is undefined or wrong');
console.log('• Check: Redirect URI mismatch');
console.log('');
console.log('Case B: If Atlassian page loads then shows error:');
console.log('• Problem: Atlassian app configuration');
console.log('• Check: Confluence app callback URL');
console.log('• Check: Confluence app permissions');
console.log('');
console.log('Case C: If Atlassian page loads correctly:');
console.log('• Problem: None in OAuth start');
console.log('• Proceed to authorize and check callback');

console.log('\n4️⃣ Test Callback (if authorization works):');
console.log('=======================================');
console.log('After authorizing, check console for:');
console.log('🔍 Confluence Callback Debug:');
console.log('Code: [should show authorization code]');
console.log('Error: [should be null/undefined]');
console.log('');
console.log('🔍 Confluence Token Exchange Debug:');
console.log('Client ID: [should show PUTzd570Tp3796s65wEfzwAGhCu85elj]');
console.log('Client Secret exists: true');
console.log('Redirect URI: http://localhost:3000/api/oauth/callback/confluence');

console.log('\n🔍 Debug Information to Share:');
console.log('==============================');

const debugInfo = [
  'Console output from step 2 (OAuth start)',
  'What happens when you visit Confluence OAuth URL',
  'Console output from step 4 (callback)',
  'Final browser URL after OAuth attempt',
  'Any error messages in browser console'
];

debugInfo.forEach((item, index) => {
  console.log(`${index + 1}. ${item}`);
});

console.log('\n🎯 Expected Working Flow:');
console.log('========================');

console.log('\n✅ Step 1 - OAuth Start:');
console.log('• Debug logs show correct Client ID');
console.log('• Debug logs show correct Redirect URI');
console.log('• Browser redirects to Atlassian');
console.log('• Atlassian authorization page loads');

console.log('\n✅ Step 2 - Authorization:');
console.log('• You see Confluence permission request');
console.log('• You click "Allow"');
console.log('• Atlassian redirects to your callback');

console.log('\n✅ Step 3 - Callback:');
console.log('• Debug logs show authorization code');
console.log('• Token exchange succeeds');
console.log('• Browser redirects to: http://localhost:3000?oauth_success=true&provider=confluence');

console.log('\n❌ Common Issues & Solutions:');
console.log('==============================');

const issues = [
  {
    symptom: 'Client ID shows undefined',
    cause: '.env.local not updated correctly',
    solution: 'Verify CONFLUENCE_CLIENT_ID in .env.local'
  },
  {
    symptom: 'Something went wrong on Atlassian page',
    cause: 'Confluence app callback URL mismatch',
    solution: 'Update Confluence app in Atlassian console'
  },
  {
    symptom: 'Callback shows missing code',
    cause: 'Authorization denied or redirect issue',
    solution: 'Check Confluence app permissions and callback URL'
  },
  {
    symptom: 'Token exchange fails',
    cause: 'Wrong credentials or redirect URI',
    solution: 'Verify CONFLUENCE_CLIENT_SECRET and callback URL'
  }
];

issues.forEach((item, index) => {
  console.log(`${index + 1}. Symptom: ${item.symptom}`);
  console.log(`   Cause: ${item.cause}`);
  console.log(`   Solution: ${item.solution}\n`);
});

console.log('🚀 Ready to Test!');
console.log('================');
console.log('1. Restart: npm run dev');
console.log('2. Test: http://localhost:3000/api/oauth/start/confluence');
console.log('3. Share console output if still not working');

console.log('\n✅ This debug process will identify the exact issue!');
