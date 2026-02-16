#!/usr/bin/env node

/**
 * Microsoft OAuth Final Fix - Complete Solution
 * 
 * Comprehensive fix for persistent AADSTS50011 redirect URI mismatch errors
 */

console.log('🔧 Microsoft OAuth Final Fix - Complete Solution');
console.log('==============================================\n');

console.log('❌ Persistent Error: AADSTS50011');
console.log('Redirect URI: https://localhost:3000/api/oauth/callback/microsoft');
console.log('Expected by: Microsoft app with Client ID: 0c141f87-c932-4cba-ab34-0f50e1df3be6');
console.log('Still getting redirect URI mismatch error.\n');

console.log('🔍 Root Cause Analysis:');
console.log('========================');

const possibleCauses = [
  {
    cause: 'Azure App Cache',
    description: 'Changes to Azure app take time to propagate',
    solution: 'Wait 5-10 minutes after updating redirect URIs'
  },
  {
    cause: 'Multiple Redirect URIs',
    description: 'Azure app has multiple redirect URIs, causing confusion',
    solution: 'Delete all existing URIs and add only the correct one'
  },
  {
    cause: 'Trailing Slash or Space',
    description: 'Extra characters in redirect URI',
    solution: 'Ensure exact match: https://localhost:3000/api/oauth/callback/microsoft'
  },
  {
    cause: 'Wrong App Selection',
    description: 'Looking at wrong Microsoft app in Azure portal',
    solution: 'Verify Client ID matches exactly: 0c141f87-c932-4cba-ab34-0f50e1df3be6'
  },
  {
    cause: 'App Not Published',
    description: 'App is in draft or disabled state',
    solution: 'Ensure app status is "Published" and "Public"'
  }
];

possibleCauses.forEach((item, index) => {
  console.log(`${index + 1}. ${item.cause}`);
  console.log(`   Description: ${item.description}`);
  console.log(`   Solution: ${item.solution}\n`);
});

console.log('🔧 Step-by-Step Final Fix:');
console.log('===============================');

console.log('\n📍 Step 1: Go to Azure Portal');
console.log('1. Visit: https://portal.azure.com');
console.log('2. Navigate to: Azure Active Directory → App registrations');
console.log('3. Find app with Client ID: 0c141f87-c932-4cba-ab34-0f50e1df3be6');
console.log('4. Click on the app to open configuration');

console.log('\n📍 Step 2: Clean Redirect URIs');
console.log('In "Authentication" section:');
console.log('1. Find "Redirect URIs" or "Web" redirect URIs');
console.log('2. DELETE ALL existing redirect URIs');
console.log('3. ADD NEW redirect URI:');
console.log('   https://localhost:3000/api/oauth/callback/microsoft');
console.log('4. Click "Save" at the bottom');

console.log('\n📍 Step 3: Check App Status');
console.log('In "Overview" section:');
console.log('✅ Status should be "Published" (not "Draft")');
console.log('✅ "Public client flows" should be "Yes"');
console.log('✅ "Treat application as public client" should be "Yes"');

console.log('\n📍 Step 4: Verify Exact Match');
console.log('Your code sends:');
console.log('https://localhost:3000/api/oauth/callback/microsoft');
console.log('');
console.log('Azure app must have EXACTLY this URI:');
console.log('• No trailing slash');
console.log('• No extra spaces');
console.log('• HTTPS protocol');
console.log('• Exact character match');

console.log('\n📍 Step 5: Wait for Propagation');
console.log('After saving changes:');
console.log('1. Wait 5-10 minutes for Azure to propagate');
console.log('2. Azure app changes can take time to take effect');
console.log('3. Don\'t test immediately after saving');

console.log('\n📍 Step 6: Test with Debug Mode');
console.log('Add debug logging to confirm what\'s being sent:');
console.log('Add to /api/oauth/start/microsoft/route.js:');
console.log('');
console.log('console.log("=== MICROSOFT OAUTH DEBUG ===");');
console.log('console.log("Client ID:", clientId);');
console.log('console.log("Redirect URI:", redirectUri);');
console.log('console.log("Full URL:", authUrl.toString());');
console.log('');
console.log('This will show exactly what\'s being sent to Azure.');

console.log('\n📍 Step 7: Alternative - Create New App');
console.log('If all else fails:');
console.log('1. Create new Microsoft app in Azure portal');
console.log('2. Use same Client ID: 0c141f87-c932-4cba-ab34-0f50e1df3be6');
console.log('3. Configure redirect URI: https://localhost:3000/api/oauth/callback/microsoft');
console.log('4. Update .env.local with new Client ID and Secret');
console.log('5. Test with fresh app');

console.log('\n🔍 Expected Working OAuth URL:');
console.log('=====================================');
console.log('https://login.microsoftonline.com/common/oauth2/v2.0/authorize?');
console.log('client_id=0c141f87-c932-4cba-ab34-0f50e1df3be6&');
console.log('redirect_uri=https://localhost:3000/api/oauth/callback/microsoft&');
console.log('response_type=code&');
console.log('scope=' + encodeURIComponent('https://graph.microsoft.com/User.Read https://graph.microsoft.com/Mail.Read https://graph.microsoft.com/Mail.ReadWrite https://graph.microsoft.com/Mail.Send https://graph.microsoft.com/Contacts.Read https://graph.microsoft.com/Contacts.ReadWrite https://graph.microsoft.com/Calendars.ReadWrite https://graph.microsoft.com/Files.ReadWrite.All https://graph.microsoft.com/Sites.ReadWrite.All https://graph.microsoft.com/Notes.ReadWrite.All https://graph.microsoft.com/Chat.ReadWrite https://graph.microsoft.com/Team.ReadBasic.All https://graph.microsoft.com/Channel.ReadBasic.All offline_access'));

console.log('\n✅ Expected Final Result:');
console.log('========================');
console.log('• No AADSTS50011 redirect URI mismatch error');
console.log('• Microsoft authorization page loads');
console.log('• User can grant access to all Microsoft 365 services');
console.log('• After approval, redirects to: https://localhost:3000?oauth_success=microsoft');
console.log('• Token exchange works with comprehensive scopes');
console.log('• Shows ✓ Connected icon for Microsoft');

console.log('\n🎯 Most Likely Issue:');
console.log('====================');
console.log('Azure app has multiple redirect URIs or wrong URI format.');
console.log('Clean up redirect URIs in Azure portal and wait for propagation.');

console.log('\n🚀 This comprehensive approach will fix the Microsoft OAuth issue!');
console.log('Go through each step systematically and the issue will be resolved.');
