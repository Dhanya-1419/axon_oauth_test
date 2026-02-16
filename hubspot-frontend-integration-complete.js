#!/usr/bin/env node

/**
 * HubSpot Frontend Integration - Complete Setup
 * 
 * Complete HubSpot integration with frontend and OAuth setup
 */

console.log('🔧 HubSpot Frontend Integration - Complete Setup');
console.log('============================================\n');

console.log('✅ HubSpot Added to Frontend:');
console.log('• HubSpot (OAuth) - OAuth 2.0 flow');
console.log('• HubSpot (Access Token) - Direct token access');
console.log('• Added to CRM & Sales category');
console.log('• Added to required environment variables\n');

console.log('🔧 Frontend Features:');
console.log('=====================');

const frontendFeatures = [
  {
    feature: 'HubSpot (OAuth)',
    description: 'OAuth 2.0 flow for HubSpot CRM',
    fields: [],
    category: 'CRM & Sales',
    hint: 'Uses OAuth 2.0 with HubSpot CRM API'
  },
  {
    feature: 'HubSpot (Access Token)',
    description: 'Direct access token for HubSpot API',
    fields: [{ key: 'accessToken', label: 'Access Token', placeholder: 'pat.na1...' }],
    category: 'CRM & Sales',
    hint: 'Uses GET https://api.hubapi.com/crm/v3/objects/contacts'
  }
];

frontendFeatures.forEach((feature, index) => {
  console.log(`${index + 1}. ${feature.feature}`);
  console.log(`   Description: ${feature.description}`);
  console.log(`   Category: ${feature.category}`);
  console.log(`   Hint: ${feature.hint}`);
  if (feature.fields && feature.fields.length > 0) {
    console.log(`   Fields: ${feature.fields.map(f => f.label + ' (' + f.placeholder + ')').join(', ')}`);
  } else {
    console.log('   Fields: None (OAuth flow)');
  }
  console.log('');
});

console.log('🔧 Environment Variables Added:');
console.log('==============================');
console.log('✅ hubspot: ["HUBSPOT_ACCESS_TOKEN"]');
console.log('✅ hubspot_oauth: ["HUBSPOT_CLIENT_ID", "HUBSPOT_CLIENT_SECRET"]');
console.log('');
console.log('These will be checked for missing environment variables.');

console.log('🔧 OAuth Routes Created:');
console.log('========================');
console.log('✅ Start route: /api/oauth/start/hubspot');
console.log('✅ Callback route: /api/oauth/callback/hubspot');
console.log('✅ Token storage and management');
console.log('✅ Error handling and redirects');

console.log('\n🔍 HubSpot API Capabilities:');
console.log('==============================');

const apiCapabilities = [
  {
    category: 'CRM Objects',
    endpoints: [
      'GET /crm/v3/objects/contacts',
      'POST /crm/v3/objects/contacts',
      'PATCH /crm/v3/objects/contacts/{id}',
      'DELETE /crm/v3/objects/contacts/{id}',
      'GET /crm/v3/objects/companies',
      'POST /crm/v3/objects/companies',
      'GET /crm/v3/objects/deals',
      'POST /crm/v3/objects/deals',
      'GET /crm/v3/objects/tickets',
      'POST /crm/v3/objects/tickets'
    ],
    description: 'Full CRUD operations on CRM objects'
  },
  {
    category: 'Search & Filter',
    endpoints: [
      'POST /crm/v3/objects/contacts/search',
      'POST /crm/v3/objects/companies/search',
      'POST /crm/v3/objects/deals/search',
      'GET /crm/v3/objects/contacts/search',
      'GET /crm/v3/objects/companies/search'
    ],
    description: 'Advanced search and filtering capabilities'
  },
  {
    category: 'Associations',
    endpoints: [
      'GET /crm/v3/objects/contacts/{id}/associations',
      'POST /crm/v3/objects/contacts/{id}/associations',
      'DELETE /crm/v3/objects/contacts/{id}/associations/{toObjectId}'
    ],
    description: 'Manage relationships between CRM objects'
  },
  {
    category: 'Lists & Segments',
    endpoints: [
      'GET /crm/v3/lists',
      'POST /crm/v3/lists',
      'GET /crm/v3/lists/{id}',
      'POST /crm/v3/lists/{id}/memberships'
    ],
    description: 'Manage contact lists and segments'
  },
  {
    category: 'Imports & Exports',
    endpoints: [
      'POST /crm/v3/imports',
      'GET /crm/v3/imports/{id}',
      'POST /crm/v3/exports',
      'GET /crm/v3/exports/{id}'
    ],
    description: 'Bulk import and export operations'
  },
  {
    category: 'Marketing',
    endpoints: [
      'GET /marketing/v3/forms',
      'POST /marketing/v3/forms',
      'GET /marketing/v3/emails',
      'POST /marketing/v3/emails'
    ],
    description: 'Marketing forms and email campaigns'
  },
  {
    category: 'Files & Documents',
    endpoints: [
      'GET /files/v3/files',
      'POST /files/v3/files/upload',
      'GET /files/v3/files/{id}',
      'DELETE /files/v3/files/{id}'
    ],
    description: 'File management and document storage'
  }
];

apiCapabilities.forEach((capability, index) => {
  console.log(`${index + 1}. ${capability.category}`);
  console.log(`   Description: ${capability.description}`);
  console.log(`   Endpoints: ${capability.endpoints.slice(0, 3).join(', ')}${capability.endpoints.length > 3 ? '...' : ''}`);
  console.log('');
});

console.log('🔧 Step-by-Step Setup:');
console.log('=========================');

console.log('\n📍 Step 1: Create HubSpot App');
console.log('1. Go to: https://app.hubspot.com/developers');
console.log('2. Click "Create app"');
console.log('3. Choose "Private app"');
console.log('4. Enter app name: "Local Development App"');
console.log('5. Click "Create app"');

console.log('\n📍 Step 2: Configure OAuth');
console.log('In app settings:');
console.log('1. Go to "Auth" tab');
console.log('2. Copy "Client ID" and "Client Secret"');
console.log('3. Add redirect URI:');
console.log('   http://localhost:3000/api/oauth/callback/hubspot');
console.log('4. Select scopes:');
console.log('   ✅ crm.objects.contacts.read');
console.log('   ✅ crm.objects.companies.read');
console.log('   ✅ crm.objects.deals.read');
console.log('   ✅ crm.objects.tickets.read');
console.log('5. Click "Save"');

console.log('\n📍 Step 3: Add Environment Variables');
console.log('Add to your .env.local file:');
console.log('');
console.log('# HubSpot OAuth');
console.log('HUBSPOT_CLIENT_ID=your_hubspot_client_id');
console.log('HUBSPOT_CLIENT_SECRET=your_hubspot_client_secret');
console.log('');
console.log('# HubSpot Access Token (optional)');
console.log('HUBSPOT_ACCESS_TOKEN=your_hubspot_access_token');
console.log('');
console.log('Replace with your actual HubSpot credentials.');

console.log('\n📍 Step 4: Test OAuth Flow');
console.log('1. Restart dev server: npm run dev');
console.log('2. Open: http://localhost:3000');
console.log('3. Find HubSpot in "CRM & Sales" category');
console.log('4. Click "Connect" for "HubSpot (OAuth)"');
console.log('5. Should redirect to HubSpot authorization');
console.log('6. Authorize the app');
console.log('7. Should redirect to: http://localhost:3000?oauth_success=hubspot');
console.log('8. Should show ✓ Connected icon for HubSpot');

console.log('\n📍 Step 5: Test Access Token Flow');
console.log('1. Get HubSpot access token from HubSpot developer portal');
console.log('2. Add to .env.local: HUBSPOT_ACCESS_TOKEN=your_token');
console.log('3. Restart dev server');
console.log('4. Select "HubSpot (Access Token)" from dropdown');
console.log('5. Enter your access token');
console.log('6. Should show ✓ Connected icon for HubSpot');

console.log('\n🌐 OAuth Flow URL:');
console.log('==================');
console.log('https://app.hubspot.com/oauth/authorize?');
console.log('client_id=your_hubspot_client_id&');
console.log('redirect_uri=http://localhost:3000/api/oauth/callback/hubspot&');
console.log('scope=crm.objects.contacts.read%20crm.objects.companies.read%20crm.objects.deals.read%20crm.objects.tickets.read&');
console.log('response_type=code&');
console.log('user_type=hapikey');

console.log('\n✅ Expected Results:');
console.log('===================');
console.log('• HubSpot appears in CRM & Sales category');
console.log('• OAuth flow works with proper redirect');
console.log('• Access token flow works for direct API access');
console.log('• Shows ✓ Connected icon for HubSpot');
console.log('• Full HubSpot CRM API access');
console.log('• Can read contacts, companies, deals, and tickets');

console.log('\n🎯 Testing Scenarios:');
console.log('====================');

const testScenarios = [
  {
    scenario: 'OAuth Connection Test',
    steps: [
      'Click "Connect" on HubSpot (OAuth)',
      'Redirect to HubSpot authorization',
      'Grant permissions',
      'Redirect back with success',
      'Check for ✓ Connected status'
    ]
  },
  {
    scenario: 'Access Token Test',
    steps: [
      'Select HubSpot (Access Token)',
      'Enter valid HubSpot access token',
      'Click "Connect"',
      'Check for ✓ Connected status',
      'Test API call to /crm/v3/objects/contacts'
    ]
  },
  {
    scenario: 'API Integration Test',
    steps: [
      'Use HubSpot connection in tester',
      'Call GET /crm/v3/objects/contacts',
      'Verify contact data returned',
      'Test POST /crm/v3/objects/contacts',
      'Verify contact creation works'
    ]
  }
];

testScenarios.forEach((scenario, index) => {
  console.log(`${index + 1}. ${scenario.scenario}`);
  scenario.steps.forEach((step, stepIndex) => {
    console.log(`   ${stepIndex + 1}. ${step}`);
  });
  console.log('');
});

console.log('\n🔍 Default Scopes Explained:');
console.log('============================');
console.log('• crm.objects.contacts.read - Read contact information');
console.log('• crm.objects.companies.read - Read company information');
console.log('• crm.objects.deals.read - Read deal information');
console.log('• crm.objects.tickets.read - Read ticket information');
console.log('');
console.log('These provide read-only access to core CRM objects.');
console.log('For full access, add write scopes: crm.objects.contacts.write, etc.');

console.log('\n🚀 HubSpot frontend integration is complete!');
console.log('Test both OAuth and access token flows for full functionality.');
