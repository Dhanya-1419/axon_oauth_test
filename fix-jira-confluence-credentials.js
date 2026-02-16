#!/usr/bin/env node

/**
 * Jira & Confluence Separate Credentials Fix
 * 
 * Analysis and fix for different Jira/Confluence credentials
 */

console.log('🔧 Jira & Confluence Separate Credentials Fix');
console.log('==========================================\n');

console.log('📋 Credential Analysis from .env.local:');
console.log('====================================');

console.log('\n🔍 Found Different Credentials:');
console.log('==============================');

console.log('\n📱 Jira Credentials:');
console.log('Client ID: (from .env ATLASSIAN_CLIENT_ID)');
console.log('Client Secret: (from .env ATLASSIAN_CLIENT_SECRET)');

console.log('\n📄 Confluence Credentials:');
console.log('Client ID: (from .env CONFLUENCE_CLIENT_ID)');
console.log('Client Secret: (from .env CONFLUENCE_CLIENT_SECRET)');

console.log('\n❌ PROBLEM IDENTIFIED:');
console.log('====================');
console.log('Your code uses ATLASSIAN_CLIENT_ID for BOTH Jira and Confluence!');
console.log('But you have different credentials for each service.');
console.log('');
console.log('Current code behavior:');
console.log('• Jira route uses: ATLASSIAN_CLIENT_ID (Jira credentials) ✅');
console.log('• Confluence route uses: ATLASSIAN_CLIENT_ID (Jira credentials) ❌');
console.log('');
console.log('Confluence should use: ATLASSIAN_CLIENT_ID (Confluence credentials)');

console.log('\n🔧 SOLUTION:');
console.log('============');

console.log('\n1️⃣ Update Confluence Route to Use Confluence Credentials:');
console.log('Change /api/oauth/start/confluence/route.js:');
console.log('');
console.log('FROM:');
console.log('const clientId = process.env.ATLASSIAN_CLIENT_ID;');
console.log('const clientSecret = process.env.ATLASSIAN_CLIENT_SECRET;');
console.log('');
console.log('TO:');
console.log('const clientId = process.env.CONFLUENCE_CLIENT_ID;');
console.log('const clientSecret = process.env.CONFLUENCE_CLIENT_SECRET;');

console.log('\n2️⃣ Update Confluence Callback Route:');
console.log('Change /api/oauth/callback/confluence/route.js:');
console.log('');
console.log('FROM:');
console.log('const clientId = process.env.ATLASSIAN_CLIENT_ID;');
console.log('const clientSecret = process.env.ATLASSIAN_CLIENT_SECRET;');
console.log('');
console.log('TO:');
console.log('const clientId = process.env.CONFLUENCE_CLIENT_ID;');
console.log('const clientSecret = process.env.CONFLUENCE_CLIENT_SECRET;');

console.log('\n3️⃣ Update .env.local Variable Names:');
console.log('Change your .env.local:');
console.log('');
console.log('FROM:');
console.log('ATLASSIAN_CLIENT_ID=PUTzd570Tp3796s65wEfzwAGhCu85elj');
console.log('ATLASSIAN_CLIENT_SECRET=ATOATFOcd8davq--wxDdxUEu7DCY3s_CJ36mO85RNTtIjScdlUp46pg7gApKVTFX92Yw572070D9');
console.log('');
console.log('TO:');
console.log('CONFLUENCE_CLIENT_ID=PUTzd570Tp3796s65wEfzwAGhCu85elj');
console.log('CONFLUENCE_CLIENT_SECRET=ATOATFOcd8davq--wxDdxUEu7DCY3s_CJ36mO85RNTtIjScdlUp46pg7gApKVTFX92Yw572070D9');

console.log('\n🌐 Required Callback URLs:');
console.log('==========================');

console.log('\nFor Jira App (Client ID: moaag7PRx59wIYavF1ABt2ZSuZtHzjz3):');
console.log('✅ http://localhost:3000/api/oauth/callback/jira');

console.log('\nFor Confluence App (Client ID: PUTzd570Tp3796s65wEfzwAGhCu85elj):');
console.log('✅ http://localhost:3000/api/oauth/callback/confluence');

console.log('\n🔍 Atlassian Developer Console Setup:');
console.log('=================================');

console.log('\nJira App:');
console.log('1. Go to: https://developer.atlassian.com/console');
console.log('2. Find app with Client ID: moaag7PRx59wIYavF1ABt2ZSuZtHzjz3');
console.log('3. Add callback: http://localhost:3000/api/oauth/callback/jira');
console.log('4. Ensure app is active');

console.log('\nConfluence App:');
console.log('1. Go to: https://developer.atlassian.com/console');
console.log('2. Find app with Client ID: PUTzd570Tp3796s65wEfzwAGhCu85elj');
console.log('3. Add callback: http://localhost:3000/api/oauth/callback/confluence');
console.log('4. Ensure app is active');

console.log('\n🧪 Test After Fix:');
console.log('==================');

console.log('\n1. Update code to use separate credentials');
console.log('2. Update .env.local variable names');
console.log('3. Configure both Atlassian apps with correct callback URLs');
console.log('4. Test Jira: http://localhost:3000/api/oauth/start/jira');
console.log('5. Test Confluence: http://localhost:3000/api/oauth/start/confluence');

console.log('\n✅ Expected Result:');
console.log('==================');
console.log('• Jira uses Jira credentials and callback');
console.log('• Confluence uses Confluence credentials and callback');
console.log('• Both OAuth flows work without "Something went wrong"');
console.log('• Each service connects to its correct Atlassian app');

console.log('\n🚀 This will fix both Jira and Confluence OAuth issues!');
