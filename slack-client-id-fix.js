#!/usr/bin/env node

/**
 * Slack OAuth Invalid Client ID Fix
 * 
 * Fixes "Invalid client_id parameter" error in Slack OAuth
 */

console.log('🔧 Slack OAuth Invalid Client ID Fix');
console.log('==================================\n');

console.log('❌ Error: "Invalid client_id parameter" for Slack');
console.log('This means Slack OAuth is not receiving a valid client ID.\n');

console.log('🔍 Issue Analysis:');
console.log('==================');
console.log('The Slack start route reads:');
console.log('const clientId = process.env.SLACK_CLIENT_ID;');
console.log('');
console.log('This means SLACK_CLIENT_ID is:');
console.log('• Missing from .env.local');
console.log('• Empty/undefined');
console.log('• Invalid/expired\n');

console.log('🔧 Fix: Add Slack Client ID to .env.local');
console.log('========================================');

console.log('\n📍 Step 1: Get Your Slack App Credentials');
console.log('1. Go to: https://api.slack.com/apps');
console.log('2. Select your Slack app or create new one');
console.log('3. Go to "OAuth & Permissions"');
console.log('4. Copy the "Client ID"');
console.log('5. Copy the "Client Secret"');

console.log('\n📍 Step 2: Add to .env.local');
console.log('Add these lines to your .env.local file:');
console.log('');
console.log('SLACK_CLIENT_ID=your_slack_client_id');
console.log('SLACK_CLIENT_SECRET=your_slack_client_secret');
console.log('');
console.log('Replace with your actual Slack credentials.');

console.log('\n📍 Step 3: Configure Slack App Redirect URI');
console.log('In your Slack app settings, ensure:');
console.log('✅ Redirect URL: http://localhost:3000/api/oauth/callback/slack');
console.log('✅ No trailing slash');
console.log('✅ HTTP (not HTTPS) for local development');

console.log('\n📍 Step 4: Configure Slack App Scopes');
console.log('Add these scopes to your Slack app:');
console.log('✅ users:read - Read user information');
console.log('✅ channels:read - Read channel information');
console.log('✅ chat:write - Send messages');
console.log('');
console.log('Or use minimal: users:read');

console.log('\n🔍 Debug Steps:');
console.log('===============');

console.log('\n📍 Step 1: Check Current Status');
console.log('Visit: http://localhost:3000/api/oauth/start/slack');
console.log('If you see "Missing SLACK_CLIENT_ID" error, the env var is missing.');

console.log('\n📍 Step 2: Add Credentials');
console.log('Add SLACK_CLIENT_ID and SLACK_CLIENT_SECRET to .env.local');
console.log('Restart dev server: npm run dev');

console.log('\n📍 Step 3: Test OAuth');
console.log('Visit: http://localhost:3000/api/oauth/start/slack');
console.log('Should redirect to Slack authorization page');
console.log('No "Invalid client_id parameter" error');

console.log('\n🌐 Expected Working OAuth URL:');
console.log('=================================');
console.log('https://slack.com/oauth/v2/authorize?');
console.log('client_id=YOUR_SLACK_CLIENT_ID&');
console.log('redirect_uri=http://localhost:3000/api/oauth/callback/slack&');
console.log('scope=users:read&');
console.log('response_type=code');

console.log('\n✅ Expected Result:');
console.log('==================');
console.log('• No "Invalid client_id parameter" error');
console.log('• Slack authorization page loads');
console.log('• Shows your app name and permissions');
console.log('• After approval, redirects to callback successfully');
console.log('• Shows 🔗 Connected icon for Slack');

console.log('\n🎯 Most Likely Issue:');
console.log('====================');
console.log('SLACK_CLIENT_ID is missing from .env.local file.');
console.log('Add your Slack Client ID to .env.local and restart server.');

console.log('\n🚀 Add SLACK_CLIENT_ID to .env.local and Slack OAuth will work!');
