#!/usr/bin/env node

/**
 * OAuth HTTPS/HTTP Configuration Fix
 * 
 * Handles services that require HTTPS vs HTTP for local development
 */

console.log('🔧 OAuth HTTPS/HTTP Configuration Fix');
console.log('====================================\n');

console.log('📋 OAuth Services Protocol Requirements:');
console.log('======================================');

const services = [
  {
    name: 'Google',
    protocol: 'HTTP',
    reason: 'Works with HTTP for local development'
  },
  {
    name: 'Microsoft',
    protocol: 'HTTP',
    reason: 'Works with HTTP for local development'
  },
  {
    name: 'GitHub',
    protocol: 'HTTP',
    reason: 'Works with HTTP for local development'
  },
  {
    name: 'Slack',
    protocol: 'HTTP',
    reason: 'Works with HTTP for local development'
  },
  {
    name: 'Atlassian',
    protocol: 'HTTP',
    reason: 'Works with HTTP for local development'
  },
  {
    name: 'Figma',
    protocol: 'HTTP',
    reason: 'Works with HTTP for local development'
  },
  {
    name: 'Notion',
    protocol: 'HTTP',
    reason: 'Works with HTTP for local development'
  },
  {
    name: 'Asana',
    protocol: 'HTTP',
    reason: 'Works with HTTP for local development'
  },
  {
    name: 'ClickUp',
    protocol: 'HTTP',
    reason: 'Works with HTTP for local development'
  },
  {
    name: 'Dropbox',
    protocol: 'HTTP',
    reason: 'Works with HTTP for local development'
  },
  {
    name: 'Box',
    protocol: 'HTTP',
    reason: 'Works with HTTP for local development'
  },
  {
    name: 'Calendly',
    protocol: 'HTTPS',
    reason: 'REQUIRES HTTPS even for local development'
  },
  {
    name: 'Eventbrite',
    protocol: 'HTTP',
    reason: 'Works with HTTP for local development'
  },
  {
    name: 'Jotform',
    protocol: 'HTTP',
    reason: 'Works with HTTP for local development'
  },
  {
    name: 'Airtable',
    protocol: 'HTTP',
    reason: 'Works with HTTP for local development'
  }
];

services.forEach(service => {
  const icon = service.protocol === 'HTTPS' ? '🔒' : '🌐';
  console.log(`${icon} ${service.name}: ${service.protocol}`);
  console.log(`   Reason: ${service.reason}\n`);
});

console.log('🔧 Calendly HTTPS Fix Applied:');
console.log('=============================');
console.log('✅ Updated /api/oauth/start/calendly/route.js');
console.log('✅ Updated /api/oauth/callback/calendly/route.js');
console.log('✅ Both now use: https://localhost:3000/api/oauth/callback/calendly');

console.log('\n🌐 Required Callback URLs:');
console.log('==========================');

console.log('\nHTTP Services (use http://localhost:3000):');
const httpServices = services.filter(s => s.protocol === 'HTTP');
httpServices.forEach(service => {
  console.log(`✅ ${service.name}: http://localhost:3000/api/oauth/callback/${service.name.toLowerCase()}`);
});

console.log('\nHTTPS Services (use https://localhost:3000):');
const httpsServices = services.filter(s => s.protocol === 'HTTPS');
httpsServices.forEach(service => {
  console.log(`🔒 ${service.name}: https://localhost:3000/api/oauth/callback/${service.name.toLowerCase()}`);
});

console.log('\n🚀 Setup Instructions:');
console.log('======================');

console.log('\nOption 1: Use HTTP for Most Services');
console.log('1. Keep NEXTAUTH_URL=http://localhost:3000');
console.log('2. Configure most services with HTTP callback URLs');
console.log('3. Configure Calendly with HTTPS callback URL');
console.log('4. For HTTPS services, use ngrok or similar tunnel');

console.log('\nOption 2: Use HTTPS for All Services');
console.log('1. Set NEXTAUTH_URL=https://localhost:3000');
console.log('2. Generate local SSL certificate (mkcert)');
console.log('3. Or use ngrok: ngrok http 3000');
console.log('4. Configure all services with HTTPS callback URLs');

console.log('\n🔍 Current Figma Issue:');
console.log('====================');
console.log('Your logs show: GET /?error=figma_oauth_failed');
console.log('This means the token exchange is failing.');
console.log('Check:');
console.log('1. FIGMA_CLIENT_SECRET in .env.local');
console.log('2. Figma developer console callback URL');
console.log('3. Server logs for detailed error messages');

console.log('\n🧪 Test Calendly OAuth:');
console.log('====================');
console.log('1. Configure Calendly developer console:');
console.log('   Callback URL: https://localhost:3000/api/oauth/callback/calendly');
console.log('2. Use HTTPS tunnel (ngrok) for local testing:');
console.log('   ngrok http 3000');
console.log('3. Update callback URL to ngrok HTTPS URL');
console.log('4. Test: http://localhost:3000/api/oauth/start/calendly');

console.log('\n✅ Expected Results:');
console.log('==================');
console.log('• Most OAuth services work with HTTP');
console.log('• Calendly requires HTTPS configuration');
console.log('• Figma token exchange issue needs debugging');
console.log('• Each service has specific protocol requirements');

console.log('\n🎯 For Figma Debug:');
console.log('=================');
console.log('The error ?error=figma_oauth_failed suggests:');
console.log('1. Token exchange failing at Figma API');
console.log('2. Check FIGMA_CLIENT_SECRET is correct');
console.log('3. Check server logs for detailed error');
console.log('4. Verify Figma app permissions');
