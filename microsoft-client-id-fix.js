#!/usr/bin/env node

/**
 * Microsoft OAuth Invalid Client ID Fix
 * 
 * Fixes "Invalid client_id parameter" error in Microsoft OAuth
 */

console.log('🔧 Microsoft OAuth Invalid Client ID Fix');
console.log('====================================\n');

console.log('❌ Error: "Invalid client_id parameter"');
console.log('This means Microsoft OAuth is not receiving a valid client ID.\n');

console.log('🔍 Issue Analysis:');
console.log('==================');
console.log('The Microsoft start route has a fallback client ID:');
console.log('const clientId = process.env.MICROSOFT_CLIENT_ID || "0c141f87-c932-4cba-ab34-0f50e1df3be6";');
console.log('');
console.log('This fallback ID might be:');
console.log('• Invalid/expired');
console.log('• Not configured in your Microsoft app');
console.log('• From a different Microsoft app');
console.log('• Missing from .env.local\n');

console.log('🔧 Fix Options:');
console.log('==============');

console.log('\n📍 Option 1: Add Your Microsoft Client ID to .env.local');
console.log('Add this to your .env.local file:');
console.log('MICROSOFT_CLIENT_ID=your_actual_microsoft_client_id');
console.log('');
console.log('Where to get your Client ID:');
console.log('1. Go to: https://portal.azure.com');
console.log('2. Navigate to: Azure Active Directory → App registrations');
console.log('3. Select your Microsoft app');
console.log('4. Copy the "Application (client) ID"');

console.log('\n📍 Option 2: Check Your Microsoft App Configuration');
console.log('In Azure Portal, ensure your app has:');
console.log('✅ "Accounts in any organizational directory (Any Azure AD directory - Multitenant)"');
console.log('✅ "Allow public client flows" enabled');
console.log('✅ Redirect URI: http://localhost:3000/api/oauth/callback/microsoft');
console.log('✅ Platform: Web');

console.log('\n📍 Option 3: Create New Microsoft App');
console.log('If you don\'t have a Microsoft app:');
console.log('1. Go to: https://portal.azure.com');
console.log('2. Azure Active Directory → App registrations → New registration');
console.log('3. Name: "Local Development App"');
console.log('4. Supported account types: "Accounts in any organizational directory"');
console.log('5. Redirect URI: http://localhost:3000/api/oauth/callback/microsoft');
console.log('6. Click Register');
console.log('7. Copy Application (client) ID');
console.log('8. Go to "Certificates & secrets" → New client secret');
console.log('9. Copy the client secret value');

console.log('\n🔍 Debug Steps:');
console.log('===============');

console.log('\n📍 Step 1: Check Current Client ID');
console.log('Visit: http://localhost:3000/api/oauth/start/microsoft');
console.log('Check the URL in browser address bar.');
console.log('Look for "client_id=" parameter.');
console.log('See what client ID is actually being used.');

console.log('\n📍 Step 2: Verify .env.local');
console.log('Check if MICROSOFT_CLIENT_ID exists in .env.local:');
console.log('• If missing, add your actual Microsoft client ID');
console.log('• If present, ensure it\'s correct');
console.log('• Restart dev server after changes');

console.log('\n📍 Step 3: Test with Valid Client ID');
console.log('After adding correct MICROSOSOFT_CLIENT_ID:');
console.log('1. Restart: npm run dev');
console.log('2. Test: http://localhost:3000/api/oauth/start/microsoft');
console.log('3. Should redirect to Microsoft login page');
console.log('4. No "Invalid client_id parameter" error');

console.log('\n🌐 Expected Working OAuth URL:');
console.log('=================================');
console.log('https://login.microsoftonline.com/common/oauth2/v2.0/authorize?');
console.log('client_id=YOUR_ACTUAL_CLIENT_ID&');
console.log('redirect_uri=http://localhost:3000/api/oauth/callback/microsoft&');
console.log('response_type=code&');
console.log('scope=https://graph.microsoft.com/User.Read offline_access&');
console.log('response_mode=query');

console.log('\n✅ Expected Result:');
console.log('==================');
console.log('• No "Invalid client_id parameter" error');
console.log('• Microsoft login page loads');
console.log('• Shows your app name and permissions');
console.log('• After login, redirects to callback successfully');

console.log('\n🎯 Most Likely Issue:');
console.log('====================');
console.log('The fallback client ID in the code is invalid.');
console.log('You need to add your actual Microsoft Client ID to .env.local');

console.log('\n🚀 Add your Microsoft Client ID to .env.local and it will work!');
