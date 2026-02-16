#!/usr/bin/env node

/**
 * HubSpot Connect Button Fix - Complete Solution
 * 
 * Fixes the missing Connect button for HubSpot OAuth
 */

console.log('🔧 HubSpot Connect Button Fix - Complete Solution');
console.log('===================================================\n');

console.log('✅ Build Issue Fixed:');
console.log('===================');
console.log('• Fixed import path in /app/api/test/confluence_oauth/route.js');
console.log('• Changed: "../oauth/tokens/route.js" → "../../oauth/tokens/route.js"');
console.log('• Build now compiles successfully');
console.log('• Dev server running on http://localhost:3001\n');

console.log('🔍 HubSpot Connect Button Issue:');
console.log('=================================');
console.log('The Connect button should appear when:');
console.log('1. HubSpot is selected from the dropdown');
console.log('2. Environment variables are properly configured');
console.log('3. authType === "oauth"');
console.log('4. useEnvOnly is true (default state)\n');

console.log('🔧 Environment Variables Check:');
console.log('==============================');
console.log('HubSpot needs these variables in .env.local:');
console.log('');
console.log('✅ HUBSPOT_CLIENT_ID=89f76ad8-2836-4721-9330-49805f8f1c9f');
console.log('✅ HUBSPOT_CLIENT_SECRET=7122ee3d-6342-4c9c-8275-22f9a95afc7f');
console.log('✅ HUBSPOT_ACCESS_TOKEN=your_hubspot_access_token (optional)');
console.log('');
console.log('From your .env.local file, I can see:');
console.log('• HUBSPOT_CLIENT_ID is present');
console.log('• HUBSPOT_CLIENT is present (should be HUBSPOT_CLIENT_SECRET)');
console.log('• Variable name needs to be fixed\n');

console.log('🔧 Required Fix:');
console.log('================');
console.log('Change line 112 in .env.local:');
console.log('FROM: HUBSPOT_CLIENT=7122ee3d-6342-4c9c-8275-22f9a95afc7f');
console.log('TO:   HUBSPOT_CLIENT_SECRET=7122ee3d-6342-4c9c-8275-22f9a95afc7f');
console.log('');
console.log('This will make the app recognize the HubSpot credentials properly.\n');

console.log('🌐 Test Steps:');
console.log('==============');
console.log('1. Fix the environment variable name in .env.local');
console.log('2. Restart dev server: npm run dev');
console.log('3. Open: http://localhost:3001');
console.log('4. Select "HubSpot (OAuth)" from the dropdown');
console.log('5. Should see "Connect" button appear');
console.log('6. Click "Connect" to test OAuth flow');
console.log('7. Should redirect to HubSpot authorization');
console.log('8. After approval, redirect back with success\n');

console.log('🔍 Alternative Test - Access Token:');
console.log('====================================');
console.log('If OAuth is not working, test with access token:');
console.log('1. Select "HubSpot (Access Token)" from dropdown');
console.log('2. Enter your HubSpot access token');
console.log('3. Click "Connect"');
console.log('4. Should show Connected status immediately\n');

console.log('🎯 Expected Working State:');
console.log('========================');
console.log('• HubSpot appears in "CRM & Sales" category');
console.log('• Both "HubSpot (OAuth)" and "HubSpot (Access Token)" available');
console.log('• "Connect" button visible for OAuth option');
console.log('• Token input visible for access token option');
console.log('• OAuth flow redirects to HubSpot authorization');
console.log('• Shows ✓ Connected icon after successful connection');
console.log('• Full HubSpot CRM API access available\n');

console.log('🔧 Debug Steps if Still Not Working:');
console.log('====================================');
console.log('1. Check browser console for JavaScript errors');
console.log('2. Verify HubSpot appears in the dropdown list');
console.log('3. Check if environment variables are loaded correctly');
console.log('4. Verify the Connect button appears in the UI');
console.log('5. Test the OAuth flow by clicking Connect');
console.log('6. Check for redirect to HubSpot authorization page\n');

console.log('🌐 HubSpot OAuth Flow URL:');
console.log('==========================');
console.log('https://app.hubspot.com/oauth/authorize?');
console.log('client_id=89f76ad8-2836-4721-9330-49805f8f1c9f&');
console.log('redirect_uri=http://localhost:3001/api/oauth/callback/hubspot&');
console.log('scope=crm.objects.contacts.read%20crm.objects.companies.read%20crm.objects.deals.read%20crm.objects.tickets.read&');
console.log('response_type=code&');
console.log('user_type=hapikey\n');

console.log('✅ Summary:');
console.log('============');
console.log('• Build issue fixed (import path corrected)');
console.log('• Dev server running on http://localhost:3001');
console.log('• Environment variable name needs fixing');
console.log('• Connect button should appear after fix');
console.log('• OAuth flow ready for testing\n');

console.log('🚀 Fix the HUBSPOT_CLIENT → HUBSPOT_CLIENT_SECRET in .env.local and Connect button will appear!');
