#!/usr/bin/env node

/**
 * Microsoft OAuth Scopes Update - Complete Solution
 * 
 * Updates Microsoft OAuth to use comprehensive scopes for Teams, OneDrive, SharePoint, OneNote, and Outlook
 */

console.log('🔧 Microsoft OAuth Scopes Update - Complete Solution');
console.log('===============================================\n');

console.log('✅ Updated Microsoft OAuth with comprehensive scopes');
console.log('Added all the Microsoft Graph scopes you requested.\n');

console.log('🔍 Updated Scopes by Service:');
console.log('=====================================');

const scopesByService = [
  {
    service: 'User Profile',
    scopes: ['https://graph.microsoft.com/User.Read'],
    description: 'Read user profile information'
  },
  {
    service: 'Outlook Mail',
    scopes: ['https://graph.microsoft.com/Mail.Read', 'https://graph.microsoft.com/Mail.ReadWrite', 'https://graph.microsoft.com/Mail.Send'],
    description: 'Read, write, and send emails'
  },
  {
    service: 'Outlook Contacts',
    scopes: ['https://graph.microsoft.com/Contacts.Read', 'https://graph.microsoft.com/Contacts.ReadWrite'],
    description: 'Read and write contacts'
  },
  {
    service: 'Outlook Calendar',
    scopes: ['https://graph.microsoft.com/Calendars.ReadWrite'],
    description: 'Read and write calendar events'
  },
  {
    service: 'OneDrive',
    scopes: ['https://graph.microsoft.com/Files.ReadWrite.All'],
    description: 'Read and write OneDrive files'
  },
  {
    service: 'SharePoint',
    scopes: ['https://graph.microsoft.com/Sites.ReadWrite.All'],
    description: 'Read and write SharePoint sites'
  },
  {
    service: 'OneNote',
    scopes: ['https://graph.microsoft.com/Notes.ReadWrite.All'],
    description: 'Read and write OneNote notebooks'
  },
  {
    service: 'Microsoft Teams',
    scopes: ['https://graph.microsoft.com/Chat.ReadWrite', 'https://graph.microsoft.com/Team.ReadBasic.All', 'https://graph.microsoft.com/Channel.ReadBasic.All'],
    description: 'Read and write Teams chats and channels'
  },
  {
    service: 'Offline Access',
    scopes: ['offline_access'],
    description: 'Refresh token access'
  }
];

scopesByService.forEach((service, index) => {
  console.log(`\n${index + 1}. ${service.service}`);
  console.log('   Scopes: ' + service.scopes.join(', '));
  console.log('   Description: ' + service.description);
});

console.log('\n🔧 Changes Made:');
console.log('===============');
console.log('File: /api/oauth/start/microsoft/route.js');
console.log('Updated MICROSOFT_SCOPES environment variable support.');
console.log('Added comprehensive Microsoft Graph scopes for all services.');

console.log('\n🌐 Generated OAuth URL:');
console.log('========================');
console.log('https://login.microsoftonline.com/common/oauth2/v2.0/authorize?');
console.log('client_id=0c141f87-c932-4cba-ab34-0f50e1df3be6&');
console.log('redirect_uri=http://localhost:3000/api/oauth/callback/microsoft&');
console.log('response_type=code&');
console.log('scope=' + encodeURIComponent('https://graph.microsoft.com/User.Read https://graph.microsoft.com/Mail.Read https://graph.microsoft.com/Mail.ReadWrite https://graph.microsoft.com/Mail.Send https://graph.microsoft.com/Contacts.Read https://graph.microsoft.com/Contacts.ReadWrite https://graph.microsoft.com/Calendars.ReadWrite https://graph.microsoft.com/Files.ReadWrite.All https://graph.microsoft.com/Sites.ReadWrite.All https://graph.microsoft.com/Notes.ReadWrite.All https://graph.microsoft.com/Chat.ReadWrite https://graph.microsoft.com/Team.ReadBasic.All https://graph.microsoft.com/Channel.ReadBasic.All offline_access'));

console.log('\n🔍 How to Customize:');
console.log('========================');
console.log('You can customize scopes by setting MICROSOFT_SCOPES in .env.local:');
console.log('');
console.log('# For Teams only:');
console.log('MICROSOFT_SCOPES="https://graph.microsoft.com/Chat.ReadWrite https://graph.microsoft.com/Team.ReadBasic.All https://graph.microsoft.com/Channel.ReadBasic.All offline_access"');
console.log('');
console.log('# For OneDrive only:');
console.log('MICROSOFT_SCOPES="https://graph.microsoft.com/Files.ReadWrite.All offline_access"');
console.log('');
console.log('# For Outlook only:');
console.log('MICROSOFT_SCOPES="https://graph.microsoft.com/User.Read https://graph.microsoft.com/Mail.Read https://graph.microsoft.com/Mail.ReadWrite https://graph.microsoft.com/Mail.Send https://graph.microsoft.com/Contacts.Read https://graph.microsoft.com/Contacts.ReadWrite https://graph.microsoft.com/Calendars.ReadWrite offline_access"');

console.log('\n✅ Expected Result:');
console.log('==================');
console.log('• Microsoft authorization page shows all requested permissions');
console.log('• User can grant access to multiple Microsoft services');
console.log('• After approval, full access to Teams, OneDrive, SharePoint, OneNote, and Outlook');
console.log('• Token exchange works with comprehensive scopes');

console.log('\n🎯 Benefits:');
console.log('============');
console.log('• Single OAuth flow covers all Microsoft 365 services');
console.log('• Users can access Teams chats, OneDrive files, SharePoint sites, OneNote notebooks, and Outlook emails');
console.log('• Comprehensive API access for enterprise integration');

console.log('\n🚀 Microsoft OAuth now supports all Microsoft 365 services!');
