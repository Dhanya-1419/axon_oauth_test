#!/usr/bin/env node

/**
 * HubSpot OAuth Setup - Complete Solution
 * 
 * Complete OAuth setup for HubSpot CRM integration
 */

console.log('🔧 HubSpot OAuth Setup - Complete Solution');
console.log('======================================\n');

console.log('✅ Created HubSpot OAuth Routes:');
console.log('• Start route: /api/oauth/start/hubspot');
console.log('• Callback route: /api/oauth/callback/hubspot');
console.log('• Default scopes for CRM objects access\n');

console.log('🔧 Environment Variables Required:');
console.log('=================================');

const envVars = [
  {
    name: 'HUBSPOT_CLIENT_ID',
    description: 'HubSpot App Client ID',
    example: 'HUBSPOT_CLIENT_ID=your_hubspot_client_id'
  },
  {
    name: 'HUBSPOT_CLIENT_SECRET',
    description: 'HubSpot App Client Secret',
    example: 'HUBSPOT_CLIENT_SECRET=your_hubspot_client_secret'
  },
  {
    name: 'HUBSPOT_SCOPES',
    description: 'HubSpot API scopes (optional)',
    example: 'HUBSPOT_SCOPES=crm.objects.contacts.read crm.objects.companies.read crm.objects.deals.read crm.objects.tickets.read'
  }
];

envVars.forEach((envVar, index) => {
  console.log(`${index + 1}. ${envVar.name}`);
  console.log(`   Description: ${envVar.description}`);
  console.log(`   Example: ${envVar.example}\n`);
});

console.log('🔍 HubSpot OAuth Scopes:');
console.log('=========================');

const hubspotScopes = [
  {
    category: 'CRM Objects - Read',
    scopes: ['crm.objects.contacts.read', 'crm.objects.companies.read', 'crm.objects.deals.read', 'crm.objects.tickets.read'],
    description: 'Read access to contacts, companies, deals, and tickets'
  },
  {
    category: 'CRM Objects - Write',
    scopes: ['crm.objects.contacts.write', 'crm.objects.companies.write', 'crm.objects.deals.write', 'crm.objects.tickets.write'],
    description: 'Write access to contacts, companies, deals, and tickets'
  },
  {
    category: 'CRM Lists',
    scopes: ['crm.lists.read', 'crm.lists.write'],
    description: 'Read and write access to CRM lists'
  },
  {
    category: 'CRM Schemas',
    scopes: ['crm.schemas.custom.read', 'crm.schemas.custom.write'],
    description: 'Read and write custom object schemas'
  },
  {
    category: 'CRM Associations',
    scopes: ['crm.associations.read', 'crm.associations.write'],
    description: 'Read and write object associations'
  },
  {
    category: 'CRM Imports',
    scopes: ['crm.imports.read', 'crm.imports.write'],
    description: 'Read and write import operations'
  },
  {
    category: 'CRM Exports',
    scopes: ['crm.exports.read', 'crm.exports.write'],
    description: 'Read and write export operations'
  },
  {
    category: 'Marketing',
    scopes: ['marketing.forms.read', 'marketing.forms.write'],
    description: 'Read and write marketing forms'
  },
  {
    category: 'Sales',
    scopes: ['sales.objects.read', 'sales.objects.write'],
    description: 'Read and write sales objects'
  },
  {
    category: 'Service',
    scopes: ['service.objects.read', 'service.objects.write'],
    description: 'Read and write service objects'
  },
  {
    category: 'Timeline',
    scopes: ['timeline.read', 'timeline.write'],
    description: 'Read and write timeline events'
  },
  {
    category: 'Settings',
    scopes: ['settings.users.read', 'settings.users.write'],
    description: 'Read and write user settings'
  },
  {
    category: 'Files',
    scopes: ['files.files.read', 'files.files.write'],
    description: 'Read and write files'
  },
  {
    category: 'Account',
    scopes: ['accounting.read', 'accounting.write'],
    description: 'Read and write accounting data'
  }
];

hubspotScopes.forEach((category, index) => {
  console.log(`${index + 1}. ${category.category}`);
  console.log(`   Scopes: ${category.scopes.join(', ')}`);
  console.log(`   Description: ${category.description}\n`);
});

console.log('🔧 Step-by-Step Setup:');
console.log('=========================');

console.log('\n📍 Step 1: Create HubSpot App');
console.log('1. Go to: https://app.hubspot.com/developers');
console.log('2. Click "Create app"');
console.log('3. Choose "Private app"');
console.log('4. Enter app name (e.g., "Local Development App")');
console.log('5. Click "Create app"');

console.log('\n📍 Step 2: Configure OAuth');
console.log('In app settings:');
console.log('1. Go to "Auth" tab');
console.log('2. Copy "Client ID" and "Client Secret"');
console.log('3. Add redirect URI:');
console.log('   http://localhost:3000/api/oauth/callback/hubspot');
console.log('4. Select required scopes');
console.log('5. Click "Save"');

console.log('\n📍 Step 3: Add Environment Variables');
console.log('Add to your .env.local file:');
console.log('');
console.log('# HubSpot');
console.log('HUBSPOT_CLIENT_ID=your_hubspot_client_id');
console.log('HUBSPOT_CLIENT_SECRET=your_hubspot_client_secret');
console.log('# Optional: Customize scopes');
console.log('HUBSPOT_SCOPES=crm.objects.contacts.read crm.objects.companies.read crm.objects.deals.read crm.objects.tickets.read');
console.log('');
console.log('Replace with your actual HubSpot credentials.');

console.log('\n📍 Step 4: Test OAuth');
console.log('1. Restart dev server: npm run dev');
console.log('2. Test: http://localhost:3000/api/oauth/start/hubspot');
console.log('3. Should redirect to HubSpot authorization');
console.log('4. Authorize the app');
console.log('5. Should redirect to: http://localhost:3000?oauth_success=hubspot');

console.log('\n🌐 Generated OAuth URL:');
console.log('========================');
console.log('https://app.hubspot.com/oauth/authorize?');
console.log('client_id=your_hubspot_client_id&');
console.log('redirect_uri=http://localhost:3000/api/oauth/callback/hubspot&');
console.log('scope=crm.objects.contacts.read%20crm.objects.companies.read%20crm.objects.deals.read%20crm.objects.tickets.read&');
console.log('response_type=code&');
console.log('user_type=hapikey');

console.log('\n✅ Expected Result:');
console.log('==================');
console.log('• HubSpot authorization page loads');
console.log('• User can grant access to CRM objects');
console.log('• After approval, redirects to callback successfully');
console.log('• Token exchange works');
console.log('• Shows ✓ Connected icon for HubSpot');

console.log('\n🎯 Default Scopes Included:');
console.log('============================');
console.log('• crm.objects.contacts.read - Read contacts');
console.log('• crm.objects.companies.read - Read companies');
console.log('• crm.objects.deals.read - Read deals');
console.log('• crm.objects.tickets.read - Read tickets');

console.log('\n🔍 Custom Scopes Example:');
console.log('===========================');
console.log('# For full CRM access:');
console.log('HUBSPOT_SCOPES=crm.objects.contacts.read crm.objects.contacts.write crm.objects.companies.read crm.objects.companies.write crm.objects.deals.read crm.objects.deals.write crm.objects.tickets.read crm.objects.tickets.write');
console.log('');
console.log('# For marketing access:');
console.log('HUBSPOT_SCOPES=marketing.forms.read marketing.forms.write crm.objects.contacts.read');
console.log('');
console.log('# For minimal access:');
console.log('HUBSPOT_SCOPES=crm.objects.contacts.read');

console.log('\n🚀 HubSpot OAuth setup is complete! Add credentials to .env.local and test!');
