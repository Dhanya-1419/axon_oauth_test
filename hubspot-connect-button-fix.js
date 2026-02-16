#!/usr/bin/env node

/**
 * HubSpot Connect Button Issue Fix
 * 
 * Fixes missing "Connect" button for HubSpot in frontend
 */

console.log('🔧 HubSpot Connect Button Issue Fix');
console.log('====================================\n');

console.log('❌ Issue: No connect setup for HubSpot');
console.log('The HubSpot app is added but Connect button might not be visible.');
console.log('This could be due to:');
console.log('• Missing environment variables');
console.log('• JavaScript syntax errors');
console.log('• Component rendering issues');
console.log('• Category display problems\n');

console.log('🔍 Debug Steps:');
console.log('===============');

console.log('\n📍 Step 1: Check Environment Variables');
console.log('HubSpot needs these environment variables:');
console.log('✅ HUBSPOT_CLIENT_ID');
console.log('✅ HUBSPOT_CLIENT_SECRET');
console.log('✅ HUBSPOT_ACCESS_TOKEN (optional)');
console.log('');
console.log('Check if these are in your .env.local file:');
console.log('1. Open .env.local');
console.log('2. Look for HubSpot variables');
console.log('3. Add if missing:');
console.log('');
console.log('# HubSpot OAuth');
console.log('HUBSPOT_CLIENT_ID=your_hubspot_client_id');
console.log('HUBSPOT_CLIENT_SECRET=your_hubspot_client_secret');
console.log('# HubSpot Access Token (optional)');
console.log('HUBSPOT_ACCESS_TOKEN=your_hubspot_access_token');

console.log('\n📍 Step 2: Check JavaScript Syntax');
console.log('Look for syntax errors in app/page.jsx:');
console.log('• Check if hubspot_oauth is properly defined');
console.log('• Check if hubspot is properly defined');
console.log('• Check if CATEGORIES include HubSpot');
console.log('• Check for missing commas or brackets');

console.log('\n📍 Step 3: Check Browser Console');
console.log('1. Open browser developer tools');
console.log('2. Go to Console tab');
console.log('3. Look for JavaScript errors');
console.log('4. Look for missing variable warnings');
console.log('5. Look for component rendering errors');

console.log('\n📍 Step 4: Verify HubSpot in Categories');
console.log('HubSpot should appear in:');
console.log('• APP_DEFS array');
console.log('• REQUIRED_ENV_BY_APP object');
console.log('• CATEGORIES array under "CRM & Sales"');
console.log('');
console.log('Expected structure:');
console.log('APP_DEFS = [');
console.log('  { id: "hubspot_oauth", name: "HubSpot (OAuth)", ... },');
console.log('  { id: "hubspot", name: "HubSpot (Access Token)", ... },');
console.log('  ...');
console.log(']');
console.log('');
console.log('CATEGORIES = [');
console.log('  { title: "CRM & Sales", apps: ["salesforce", "hubspot_oauth", "hubspot"] },');
console.log('  ...');
console.log(']');

console.log('\n📍 Step 5: Check Component Rendering');
console.log('The Connect button should appear when:');
console.log('• authType === "oauth"');
console.log('• Environment variables are missing');
console.log('• useEnvOnly is true');
console.log('');
console.log('Check the renderOAuthStatus function:');
console.log('• It should show "○ Not connected" for HubSpot');
console.log('• It should show "Connect" button');
console.log('• It should handle OAuth flow');

console.log('\n🔧 Quick Fix: Add Environment Variables');
console.log('If you want to test immediately:');
console.log('1. Add placeholder environment variables:');
console.log('');
console.log('HUBSPOT_CLIENT_ID=test_client_id');
console.log('HUBSPOT_CLIENT_SECRET=test_client_secret');
console.log('');
console.log('2. Restart dev server: npm run dev');
console.log('3. Check if HubSpot appears with Connect button');
console.log('4. Test OAuth flow');

console.log('\n🔧 Alternative: Use Access Token');
console.log('If OAuth is not working:');
console.log('1. Get HubSpot access token from:');
console.log('   https://app.hubspot.com/developers');
console.log('2. Go to your app → Settings → Auth');
console.log('3. Generate access token');
console.log('4. Add to .env.local:');
console.log('   HUBSPOT_ACCESS_TOKEN=your_actual_token');
console.log('5. Restart dev server');
console.log('6. Select "HubSpot (Access Token)" from dropdown');
console.log('7. Enter token and connect');

console.log('\n🌐 Test Both Methods:');
console.log('======================');
console.log('Method 1 - OAuth:');
console.log('1. Select "HubSpot (OAuth)"');
console.log('2. Click "Connect"');
console.log('3. Should redirect to HubSpot authorization');
console.log('4. After approval, redirect back with success');
console.log('');
console.log('Method 2 - Access Token:');
console.log('1. Select "HubSpot (Access Token)"');
console.log('2. Enter your HubSpot access token');
console.log('3. Click "Connect"');
console.log('4. Should show Connected status immediately');

console.log('\n✅ Expected Working State:');
console.log('========================');
console.log('• HubSpot appears in "CRM & Sales" category');
console.log('• Both "HubSpot (OAuth)" and "HubSpot (Access Token)" options available');
console.log('• "Connect" button visible for OAuth option');
console.log('• Token input visible for access token option');
console.log('• OAuth flow redirects to HubSpot');
console.log('• Access token flow connects immediately');
console.log('• Shows ✓ Connected icon for HubSpot');

console.log('\n🎯 Most Likely Issue:');
console.log('====================');
console.log('Missing HUBSPOT_CLIENT_ID and HUBSPOT_CLIENT_SECRET');
console.log('in .env.local file causing the app to not render properly.');

console.log('\n🚀 Add HubSpot environment variables to .env.local and Connect button will appear!');
