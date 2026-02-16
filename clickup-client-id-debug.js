#!/usr/bin/env node

/**
 * ClickUp OAuth Invalid Client ID Debug
 * 
 * Debugs why ClickUp OAuth shows "Invalid client_id parameter"
 */

console.log('🔧 ClickUp OAuth Invalid Client ID Debug');
console.log('====================================\n');

console.log('❌ Error: "Invalid client_id parameter" for ClickUp');
console.log('From logs, you\'re trying:');
console.log('• /api/oauth/start/clickup_oauth - 404 error');
console.log('• /api/oauth/start/clickup - 307 redirect');
console.log('');
console.log('Let\'s debug the ClickUp OAuth setup.\n');

console.log('🔍 ClickUp Credentials from .env.local:');
console.log('=====================================');
console.log('CLICKUP_CLIENT_ID=9G02IAUIF4GWO0OO9BO69IJ3F01K08NU');
console.log('CLICKUP_CLIENT_SECRET=Y7F10AMM277T8B1UU6CR0WSMJOZ5ESL6BFNL9TYJ8S8I706WEF88AJ7O6G9XLHHM\n');

console.log('🔍 ClickUp Route Analysis:');
console.log('==========================');
console.log('File: /api/oauth/start/clickup/route.js');
console.log('Route: /api/oauth/start/clickup/');
console.log('Client ID source: process.env.CLICKUP_CLIENT_ID\n');

console.log('🔧 Potential Issues:');
console.log('====================');

const issues = [
  {
    issue: 'Wrong ClickUp App',
    description: 'Client ID doesn\'t match any app in ClickUp developer portal',
    solution: 'Verify ClickUp app has Client ID: 9G02IAUIF4GWO0OO9BO69IJ3F01K08NU'
  },
  {
    issue: 'App Not Published',
    description: 'ClickUp app is in draft/development mode',
    solution: 'Publish app in ClickUp developer portal'
  },
  {
    issue: 'Environment Variable Not Loading',
    description: 'CLICKUP_CLIENT_ID not being read correctly',
    solution: 'Restart dev server and check .env.local'
  },
  {
    issue: 'Client ID Format',
    description: 'Client ID might be corrupted or have extra characters',
    solution: 'Re-copy Client ID from ClickUp developer portal'
  }
];

issues.forEach((item, index) => {
  console.log(`${index + 1}. ${item.issue}`);
  console.log(`   Description: ${item.description}`);
  console.log(`   Solution: ${item.solution}\n`);
});

console.log('🔍 Debug Steps:');
console.log('===============');

console.log('\n📍 Step 1: Verify ClickUp App in Developer Portal');
console.log('1. Go to: https://developer.clickup.com');
console.log('2. Find your app with Client ID: 9G02IAUIF4GWO0OO9BO69IJ3F01K08NU');
console.log('3. Check app status: Should be "Published"');
console.log('4. Check redirect URI: Should be http://localhost:3000/api/oauth/callback/clickup');

console.log('\n📍 Step 2: Test Client ID Directly');
console.log('Test this URL directly in browser:');
console.log('https://app.clickup.com/authorize?client_id=9G02IAUIF4GWO0OO9BO69IJ3F01K08NU&redirect_uri=http://localhost:3000/api/oauth/callback/clickup&response_type=code&scope=team:read task:read');
console.log('');
console.log('If this shows "Invalid client_id", the issue is in ClickUp app.');
console.log('If this works, the issue is in your code.');

console.log('\n📍 Step 3: Check Environment Variables');
console.log('Add debug logging to ClickUp route:');
console.log('console.log("CLICKUP_CLIENT_ID:", process.env.CLICKUP_CLIENT_ID);');
console.log('console.log("CLICKUP_CLIENT_SECRET exists:", !!process.env.CLICKUP_CLIENT_SECRET);');
console.log('');
console.log('Restart dev server and check console output.');

console.log('\n📍 Step 4: Verify Route Structure');
console.log('Ensure file structure is correct:');
console.log('✅ /app/api/oauth/start/clickup/route.js');
console.log('✅ Route: /api/oauth/start/clickup/');
console.log('❌ NOT: /app/api/oauth/start/clickup_oauth/route.js');

console.log('\n🌐 Expected Working OAuth URL:');
console.log('=================================');
console.log('http://localhost:3000/api/oauth/start/clickup/');
console.log('Should redirect to:');
console.log('https://app.clickup.com/authorize?');
console.log('client_id=9G02IAUIF4GWO0OO9BO69IJ3F01K08NU&');
console.log('redirect_uri=http://localhost:3000/api/oauth/callback/clickup&');
console.log('response_type=code&');
console.log('scope=team:read task:read');

console.log('\n✅ Expected Result:');
console.log('==================');
console.log('• No "Invalid client_id parameter" error');
console.log('• ClickUp authorization page loads');
console.log('• Shows your app name and permissions');
console.log('• After approval, redirects to callback successfully');

console.log('\n🎯 Most Likely Issue:');
console.log('====================');
console.log('ClickUp app configuration doesn\'t match your Client ID.');
console.log('Or the app is not published/active.');

console.log('\n🚀 Check ClickUp developer portal and fix app configuration!');
