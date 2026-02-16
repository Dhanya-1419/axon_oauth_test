#!/usr/bin/env node

/**
 * Test Connected Icons for API Key-based Apps
 * 
 * This script tests if the environment variables are properly detected
 * and connected icons should appear in the frontend.
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';

console.log('🔗 Testing Connected Icons');
console.log('==========================\n');

async function testConnectedIcons() {
  console.log('📋 Checking environment variables...\n');

  // Test if environment variables are set
  const services = [
    { name: 'Airtable', envVar: 'AIRTABLE_API_KEY', appId: 'airtable' },
    { name: 'Jotform', envVar: 'JOTFORM_API_KEY', appId: 'jotform' },
    { name: 'Digisign', envVar: 'DIGISIGN_API_KEY', appId: 'digisign' },
  ];

  for (const service of services) {
    console.log(`🔍 Testing ${service.name}...`);
    
    try {
      // Test the API endpoint to see if it works
      const response = await fetch(`${BASE_URL}/api/test/${service.appId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testType: 'basic' }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.results?.user?.success) {
          console.log(`  ✅ ${service.name}: Connected (API key working)`);
          console.log(`  📝 ${service.envVar} is properly configured`);
        } else {
          console.log(`  ❌ ${service.name}: Not connected (API test failed)`);
        }
      } else {
        console.log(`  ❌ ${service.name}: Not connected (HTTP ${response.status})`);
      }
    } catch (error) {
      console.log(`  ❌ ${service.name}: Error - ${error.message}`);
    }
    console.log();
  }

  console.log('🎨 Frontend Connected Icons:');
  console.log('  - If API keys are configured, you should see green "Connected" badges');
  console.log('  - Icons appear in both Dashboard and Tester views');
  console.log('  - OAuth status shows "✓ Connected" for configured services');
  console.log();

  console.log('🌐 To check visually:');
  console.log(`  1. Open ${BASE_URL} in your browser`);
  console.log('  2. Look for green "Connected" badges next to:');
  console.log('     - Airtable (in Data & Dev category)');
  console.log('     - Jotform (in Data & Dev category)');
  console.log('     - Digisign (in CRM & Sales category)');
  console.log('  3. Click on any service to see OAuth status');
}

// Check if server is running
async function checkServer() {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/',
      method: 'GET',
      timeout: 3000,
    }, (res) => {
      resolve(true);
    });

    req.on('error', () => {
      reject(new Error('Server is not running on localhost:3000'));
    });

    req.on('timeout', () => {
      reject(new Error('Server timeout - make sure the dev server is running'));
    });

    req.end();
  });
}

// Main execution
async function main() {
  try {
    await checkServer();
    console.log('✅ Server is running on localhost:3000\n');
    await testConnectedIcons();
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Make sure:');
    console.log('   1. Your Next.js dev server is running (npm run dev)');
    console.log('   2. Environment variables are set in .env.local');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { testConnectedIcons, checkServer };
