#!/usr/bin/env node

/**
 * Diagnose Why OAuth Stopped Working
 * 
 * Helps identify why OAuth worked before but now shows errors
 */

console.log('🔍 Diagnose OAuth Issues');
console.log('========================\n');

console.log('❌ Issue: OAuth worked before, now shows callback URL error');
console.log('🔍 Let\'s identify what changed...\n');

console.log('📋 Common Reasons OAuth Stops Working:');
console.log('=====================================');

const reasons = [
  {
    reason: 'Atlassian App Configuration Changed',
    symptoms: 'Callback URL error appears suddenly',
    solution: 'Check Atlassian developer console for changes'
  },
  {
    reason: 'Environment Variables Changed',
    symptoms: 'Credentials or URLs different',
    solution: 'Verify .env.local file contents'
  },
  {
    reason: 'Development Server Port Changed',
    symptoms: 'Redirect URI mismatch',
    solution: 'Ensure server runs on port 3000'
  },
  {
    reason: 'Network/Proxy Issues',
    symptoms: 'Intermittent failures',
    solution: 'Check network configuration'
  },
  {
    reason: 'Atlassian Service Changes',
    symptoms: 'API endpoints or requirements changed',
    solution: 'Check Atlassian developer announcements'
  }
];

reasons.forEach((item, index) => {
  console.log(`${index + 1}. ${item.reason}`);
  console.log(`   Symptoms: ${item.symptoms}`);
  console.log(`   Solution: ${item.solution}\n`);
});

console.log('🔧 Quick Diagnostic Steps:');
console.log('==========================');

console.log('\n1️⃣ Check Current Configuration:');
console.log('   • Client ID: moaag7PRx59wIYavF1ABt2ZSuZtHzjz3');
console.log('   • NEXTAUTH_URL should be: http://localhost:3000');
console.log('   • Server should run on: localhost:3000');

console.log('\n2️⃣ Verify Atlassian App:');
console.log('   • Go to: https://developer.atlassian.com/console');
console.log('   • Find app with Client ID: moaag7PRx59wIYavF1ABt2ZSuZtHzjz3');
console.log('   • Check callback URLs are still configured');

console.log('\n3️⃣ Check Recent Changes:');
console.log('   • Did you modify .env.local recently?');
console.log('   • Did you change the port?');
console.log('   • Did you modify OAuth routes?');
console.log('   • Did Atlassian send any notifications?');

console.log('\n🧪 Immediate Tests:');
console.log('==================');

console.log('\nTest 1: Check Server Status');
console.log('   curl http://localhost:3000/api/oauth/start/jira');
console.log('   Should redirect to Atlassian');

console.log('\nTest 2: Verify Callback Routes');
console.log('   curl http://localhost:3000/api/oauth/callback/jira');
console.log('   Should return error about missing code (normal)');

console.log('\nTest 3: Check Environment');
console.log('   In your app, check:');
console.log('   process.env.ATLASSIAN_CLIENT_ID');
console.log('   process.env.NEXTAUTH_URL');

console.log('\n🔄 Quick Fixes to Try:');
console.log('======================');

const fixes = [
  'Restart development server: npm run dev',
  'Clear browser cookies and cache',
  'Use incognito/private browser window',
  'Check if multiple apps with same Client ID exist',
  'Verify callback URLs have no typos',
  'Ensure no trailing slashes in callback URLs'
];

fixes.forEach((fix, index) => {
  console.log(`${index + 1}. ${fix}`);
});

console.log('\n🎯 Most Likely Cause:');
console.log('====================');
console.log('The callback URL error usually means:');
console.log('• Callback URL was removed/changed in Atlassian app');
console.log('• Multiple apps with same Client ID causing conflicts');
console.log('• Atlassian app permissions were revoked');

console.log('\n✅ Immediate Action Plan:');
console.log('========================');
console.log('1. Go to Atlassian developer console');
console.log('2. Find your app (Client ID: moaag7PRx59wIYavF1ABt2ZSuZtHzjz3)');
console.log('3. Re-add callback URLs:');
console.log('   - http://localhost:3000/api/oauth/callback/jira');
console.log('   - http://localhost:3000/api/oauth/callback/confluence');
console.log('4. Save and wait 2-5 minutes');
console.log('5. Test OAuth again');

console.log('\n📱 Manual Test URLs:');
console.log('===================');
console.log('If OAuth start fails, try direct URLs:');
console.log('Jira: http://localhost:3000/api/oauth/start/jira');
console.log('Confluence: http://localhost:3000/api/oauth/start/confluence');

console.log('\n🔍 Debug Information to Collect:');
console.log('================================');
console.log('• Exact error message');
console.log('• Browser network tab requests');
console.log('• Server terminal logs');
console.log('• Atlassian app configuration screenshot');
