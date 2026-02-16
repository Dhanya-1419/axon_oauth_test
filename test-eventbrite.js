#!/usr/bin/env node

/**
 * Eventbrite API Testing Script
 * 
 * Usage:
 * 1. Update your .env.local file with your Eventbrite credentials:
 *    EVENTBRITE_CLIENT_ID=ONZXHHOUM7O5PD4EJ4
 *    EVENTBRITE_CLIENT_SECRET=2KQOJDWK2V5HNHJGE5G7E2CC4UET7IWVUO2U6KIA5CLHK7UGI6
 *    EVENTBRITE_PRIVATE_TOKEN=AASGIN34GRB3DFVRPJ4A (optional)
 *    EVENTBRITE_PUBLIC_TOKEN=TXC46VGD466V7Y7CUVMA (optional)
 * 
 * 2. Run this script: node test-eventbrite.js
 * 
 * 3. Test different Eventbrite API endpoints
 */

const http = require('http');
const url = require('url');

const BASE_URL = 'http://localhost:3000';

console.log('🎫 Eventbrite API Testing Script');
console.log('================================\n');

// Test functions
async function testEventbriteConnection() {
  console.log('🎫 Testing Eventbrite Connection...\n');

  // Step 1: Test different endpoints
  console.log('1️⃣ Test different Eventbrite endpoints:');
  console.log('   a) Basic user info test:');
  console.log(`      POST ${BASE_URL}/api/test/eventbrite`);
  console.log('      Body: {"testType": "basic"}\n');

  console.log('   b) Events test:');
  console.log(`      POST ${BASE_URL}/api/test/eventbrite`);
  console.log('      Body: {"testType": "events"}\n');

  console.log('   c) Venues test:');
  console.log(`      POST ${BASE_URL}/api/test/eventbrite`);
  console.log('      Body: {"testType": "venues"}\n');

  console.log('   d) OAuth credentials test:');
  console.log(`      POST ${BASE_URL}/api/test/eventbrite`);
  console.log('      Body: {"testType": "oauth_test"}\n');

  console.log('2️⃣ Example curl commands:\n');

  console.log('   # Test basic user info:');
  console.log(`   curl -X POST ${BASE_URL}/api/test/eventbrite \\`);
  console.log('        -H "Content-Type: application/json" \\');
  console.log('        -d \'{"testType": "basic"}\'\n');

  console.log('   # Test events:');
  console.log(`   curl -X POST ${BASE_URL}/api/test/eventbrite \\`);
  console.log('        -H "Content-Type: application/json" \\');
  console.log('        -d \'{"testType": "events"}\'\n');

  console.log('   # Test OAuth credentials:');
  console.log(`   curl -X POST ${BASE_URL}/api/test/eventbrite \\`);
  console.log('        -H "Content-Type: application/json" \\');
  console.log('        -d \'{"testType": "oauth_test"}\'\n');
}

// Manual test function
async function runManualTest(testType) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ testType });
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/test/eventbrite',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log(`✅ ${testType.toUpperCase()} Test Result:`);
          console.log(JSON.stringify(result, null, 2));
          resolve(result);
        } catch (error) {
          console.error(`❌ Error parsing ${testType} test result:`, error.message);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error(`❌ Error running ${testType} test:`, error.message);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
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
  const args = process.argv.slice(2);
  
  try {
    await checkServer();
    console.log('✅ Server is running on localhost:3000\n');

    if (args.length > 0) {
      const testType = args[0];
      if (['basic', 'events', 'venues', 'oauth_test'].includes(testType)) {
        await runManualTest(testType);
      } else {
        console.error('❌ Invalid test type. Use: basic, events, venues, or oauth_test');
        process.exit(1);
      }
    } else {
      await testEventbriteConnection();
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Make sure:');
    console.log('   1. Your Next.js dev server is running (npm run dev)');
    console.log('   2. You have set your Eventbrite credentials in .env.local');
    console.log('   3. Your API tokens have the correct permissions');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { testEventbriteConnection, runManualTest, checkServer };
