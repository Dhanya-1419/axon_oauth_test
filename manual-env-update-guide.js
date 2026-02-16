#!/usr/bin/env node

/**
 * Manual .env.local Update Guide
 * 
 * Instructions to update .env.local with correct variable names
 */

console.log('📝 Manual .env.local Update Guide');
console.log('===============================\n');

console.log('🔧 You need to manually update your .env.local file');
console.log('===============================================\n');

console.log('📍 Find these lines in your .env.local:');
console.log('====================================');

console.log('\n🔍 CURRENT (WRONG):');
console.log('====================');
console.log('# Confluence (Atlassian)');
console.log('ATLASSIAN_CLIENT_ID=PUTzd570Tp3796s65wEfzwAGhCu85elj');
console.log('ATLASSIAN_CLIENT_SECRET=ATOATFOcd8davq--wxDdxUEu7DCY3s_CJ36mO85RNTtIjScdlUp46pg7gApKVTFX92Yw572070D9');

console.log('\n✅ CHANGE TO (CORRECT):');
console.log('=======================');
console.log('# Confluence (Atlassian)');
console.log('CONFLUENCE_CLIENT_ID=PUTzd570Tp3796s65wEfzwAGhCu85elj');
console.log('CONFLUENCE_CLIENT_SECRET=ATOATFOcd8davq--wxDdxUEu7DCY3s_CJ36mO85RNTtIjScdlUp46pg7gApKVTFX92Yw572070D9');

console.log('\n📋 Summary of Changes Made:');
console.log('========================');

console.log('\n✅ Code Updates:');
console.log('1. /api/oauth/start/confluence/route.js');
console.log('   - Changed ATLASSIAN_CLIENT_ID → CONFLUENCE_CLIENT_ID');
console.log('   - Updated error message');
console.log('');
console.log('2. /api/oauth/callback/confluence/route.js');
console.log('   - Changed ATLASSIAN_CLIENT_ID → CONFLUENCE_CLIENT_ID');
console.log('   - Changed ATLASSIAN_CLIENT_SECRET → CONFLUENCE_CLIENT_SECRET');
console.log('   - Updated error message');

console.log('\n🔧 Manual Steps for You:');
console.log('========================');

console.log('\n1️⃣ Open .env.local file');
console.log('2️⃣ Find the Confluence section');
console.log('3️⃣ Replace ATLASSIAN_CLIENT_ID with CONFLUENCE_CLIENT_ID');
console.log('4️⃣ Replace ATLASSIAN_CLIENT_SECRET with CONFLUENCE_CLIENT_SECRET');
console.log('5️⃣ Save the file');
console.log('6️⃣ Restart dev server: npm run dev');

console.log('\n🌐 Atlassian Developer Console Setup:');
console.log('=================================');

console.log('\n📱 Jira App:');
console.log('Client ID: moaag7PRx59wIYavF1ABt2ZSuZtHzjz3');
console.log('Callback URL: http://localhost:3000/api/oauth/callback/jira');
console.log('Console: https://developer.atlassian.com/console');

console.log('\n📄 Confluence App:');
console.log('Client ID: PUTzd570Tp3796s65wEfzwAGhCu85elj');
console.log('Callback URL: http://localhost:3000/api/oauth/callback/confluence');
console.log('Console: https://developer.atlassian.com/console');

console.log('\n🧪 Test After Manual Update:');
console.log('============================');

console.log('\n1. Update .env.local with correct variable names');
console.log('2. Restart dev server: npm run dev');
console.log('3. Test Jira: http://localhost:3000/api/oauth/start/jira');
console.log('4. Test Confluence: http://localhost:3000/api/oauth/start/confluence');

console.log('\n✅ Expected Results:');
console.log('===================');
console.log('• Jira uses Jira credentials (moaag7PRx59wIYavF1ABt2ZSuZtHzjz3)');
console.log('• Confluence uses Confluence credentials (PUTzd570Tp3796s65wEfzwAGhCu85elj)');
console.log('• Both apps show correct authorization pages');
console.log('• No more "Something went wrong" errors');
console.log('• Both OAuth flows complete successfully');

console.log('\n🚀 After these changes, both Jira and Confluence OAuth will work!');
