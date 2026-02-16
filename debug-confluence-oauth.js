#!/usr/bin/env node

/**
 * Debug Confluence OAuth Callback Issue
 * 
 * This script helps identify the callback URL mismatch issue
 */

console.log('🔍 Debugging Confluence OAuth Callback Issue');
console.log('==========================================\n');

console.log('🚨 Error Analysis:');
console.log('Error Message: "The app\'s callback URL is invalid"');
console.log('App ID from error: c3e3e0bc-6916-4def-990d-f4bcb005d4fb');
console.log('Your New Client ID: PUTzd570Tp3796s65wEfzwAGhCu85elj\n');

console.log('🔍 Possible Issues:');
console.log('1. OLD APP: You might be testing with an old Atlassian app');
console.log('2. MISMATCH: Callback URL in Atlassian app doesn\'t match our redirect URI');
console.log('3. CACHE: Browser or app might be using cached credentials');
console.log('4. DOMAIN: Production domain vs localhost mismatch\n');

console.log('🔧 Solutions:\n');

console.log('SOLUTION 1: Check Atlassian App Configuration');
console.log('-------------------------------------------');
console.log('Go to: https://developer.atlassian.com/console');
console.log('Find your app and check:');
console.log('- App ID should be: PUTzd570Tp3796s65wEfzwAGhCu85elj');
console.log('- Callback URL should be: https://yourdomain.com/api/oauth/callback/confluence');
console.log('- Make sure there are NO trailing slashes or protocol mismatches\n');

console.log('\nSOLUTION 2: Clear Browser Cache');
console.log('----------------------------');
console.log('- Clear browser cookies and cache');
console.log('- Use incognito/private browsing mode');
console.log('- Restart your development server\n');

console.log('\nSOLUTION 3: Verify Current Configuration');
console.log('------------------------------------');
console.log('Check what URL we\'re actually sending:');

const https = require('https');
const querystring = require('querystring');

// Test what OAuth URL we're generating
const CLIENT_ID = 'PUTzd570Tp3796s65wEfzwAGhCu85elj';
const REDIRECT_URI = 'https://yourdomain.com/api/oauth/callback/confluence';
const scopes = [
  'read:confluence-content.summary',
  'read:confluence-space:confluence',
  'read:confluence-user:confluence',
  'offline_access'
].join(' ');

const authUrl = `https://auth.atlassian.com/authorize?` + querystring.stringify({
  audience: 'api.atlassian.com',
  client_id: CLIENT_ID,
  scope: scopes,
  redirect_uri: REDIRECT_URI,
  response_type: 'code',
  prompt: 'consent',
  state: Math.random().toString(36).substring(7),
});

console.log('Current OAuth URL:');
console.log(authUrl);
console.log('\nExpected redirect_uri in URL:');
console.log(REDIRECT_URI);

console.log('\nSOLUTION 4: Test with Correct App');
console.log('----------------------------------');
console.log('1. Make sure you\'re using the right Atlassian app');
console.log('2. The app ID in error (c3e3e0bc-6916-4def-990d-f4bcb005d4fb)');
console.log('   should match your new app ID');
console.log('3. If not, create a new app or update the existing one\n');

console.log('\n📋 Quick Test Commands:');
console.log('---------------------------');
console.log('# Test our OAuth start endpoint:');
console.log('curl -w "HTTP Code: %{http_code}\n" -o nul http://localhost:3000/api/oauth/start/confluence');
console.log('');
console.log('# Check what redirect URI we\'re sending:');
console.log('curl -s "http://localhost:3000/api/oauth/start/confluence" | grep -o "redirect_uri="');
console.log('');
console.log('# Test with new credentials directly:');
console.log('node test-confluence-credentials.js');

console.log('\n✅ Expected Working Configuration:');
console.log('--------------------------------');
console.log('App ID: PUTzd570Tp3796s65wEfzwAGhCu85elj');
console.log('Redirect URI: https://yourdomain.com/api/oauth/callback/confluence');
console.log('Status: Should redirect to Atlassian authorization');

console.log('\n❌ Current Problem:');
console.log('-------------------');
console.log('App ID in error: c3e3e0bc-6916-4def-990d-f4bcb005d4fb');
console.log('This suggests you\'re using an OLD app configuration!');
