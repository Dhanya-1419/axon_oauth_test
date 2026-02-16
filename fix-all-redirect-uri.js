#!/usr/bin/env node

/**
 * Fix ALL OAuth Redirect URI Issues
 * 
 * The main problem is NEXTAUTH_URL mismatch
 */

console.log('🔧 Fix ALL OAuth Redirect URI Issues');
console.log('===================================\n');

console.log('❌ ROOT CAUSE IDENTIFIED:');
console.log('========================');
console.log('Your server logs show:');
console.log('NEXTAUTH_URL: "https://localhost:3000"');
console.log('But your dev server runs on: http://localhost:3000');
console.log('');
console.log('This HTTPS/HTTP mismatch breaks ALL OAuth redirects!\n');

console.log('🔧 IMMEDIATE FIX:');
console.log('================');

console.log('\n1️⃣ Update your .env.local file:');
console.log('Find this line:');
console.log('NEXTAUTH_URL=https://localhost:3000');
console.log('');
console.log('Change it to:');
console.log('NEXTAUTH_URL=http://localhost:3000');

console.log('\n2️⃣ Restart your development server:');
console.log('npm run dev');

console.log('\n3️⃣ Test OAuth flows:');
console.log('All OAuth apps should now work!');

console.log('\n📋 Why This Fixes Everything:');
console.log('==============================');

const explanations = [
  {
    service: 'Google OAuth',
    issue: 'Requires exact redirect URI match',
    fix: 'http://localhost:3000/api/oauth/callback/google'
  },
  {
    service: 'Microsoft OAuth', 
    issue: 'HTTPS/HTTP mismatch causes rejection',
    fix: 'http://localhost:3000/api/oauth/callback/microsoft'
  },
  {
    service: 'GitHub OAuth',
    issue: 'Strict URI validation',
    fix: 'http://localhost:3000/api/oauth/callback/github'
  },
  {
    service: 'Figma OAuth',
    issue: 'Redirect URI must match exactly',
    fix: 'http://localhost:3000/api/oauth/callback/figma'
  },
  {
    service: 'All Other Services',
    issue: 'Same HTTPS/HTTP mismatch',
    fix: 'http://localhost:3000/api/oauth/callback/{service}'
  }
];

explanations.forEach((item, index) => {
  console.log(`${index + 1}. ${item.service}:`);
  console.log(`   Issue: ${item.issue}`);
  console.log(`   Fix: ${item.fix}\n`);
});

console.log('🌐 Required Callback URLs (After Fix):');
console.log('=======================================');

const callbackUrls = [
  'Google: http://localhost:3000/api/oauth/callback/google',
  'Microsoft: http://localhost:3000/api/oauth/callback/microsoft',
  'GitHub: http://localhost:3000/api/oauth/callback/github',
  'Slack: http://localhost:3000/api/oauth/callback/slack',
  'Atlassian: http://localhost:3000/api/oauth/callback/jira',
  'Figma: http://localhost:3000/api/oauth/callback/figma',
  'Notion: http://localhost:3000/api/oauth/callback/notion',
  'Asana: http://localhost:3000/api/oauth/callback/asana',
  'ClickUp: http://localhost:3000/api/oauth/callback/clickup',
  'Dropbox: http://localhost:3000/api/oauth/callback/dropbox',
  'Box: http://localhost:3000/api/oauth/callback/box',
  'Calendly: http://localhost:3000/api/oauth/callback/calendly',
  'Eventbrite: http://localhost:3000/api/oauth/callback/eventbrite'
];

callbackUrls.forEach(url => console.log(`✅ ${url}`));

console.log('\n🔄 Alternative: HTTPS Development Server');
console.log('=======================================');
console.log('If you prefer HTTPS, you can:');
console.log('1. Use mkcert for local HTTPS');
console.log('2. Or use ngrok for HTTPS tunneling');
console.log('3. Update all callback URLs to HTTPS');
console.log('');
console.log('But easiest is HTTP for local development!');

console.log('\n🧪 Verification Steps:');
console.log('====================');
console.log('1. Update .env.local: NEXTAUTH_URL=http://localhost:3000');
console.log('2. Restart: npm run dev');
console.log('3. Check logs show: NEXTAUTH_URL=http://localhost:3000');
console.log('4. Test any OAuth: http://localhost:3000/api/oauth/start/google');
console.log('5. Should redirect to provider successfully');

console.log('\n✅ Expected Results:');
console.log('==================');
console.log('• No more "invalid redirect URI" errors');
console.log('• All OAuth start endpoints work');
console.log('• Providers show authorization pages');
console.log('• Callbacks work correctly');

console.log('\n🚀 This ONE FIX will solve ALL OAuth issues!');
