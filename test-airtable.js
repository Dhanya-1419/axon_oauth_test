#!/usr/bin/env node

/**
 * Airtable API Testing Script
 * 
 * Usage:
 * 1. Update your .env.local file with your Airtable API key:
 *    AIRTABLE_API_KEY=pat_your_personal_access_token
 * 
 * 2. Run this script: node test-airtable.js
 * 
 * 3. Test different Airtable API endpoints
 */

const http = require('http');
const url = require('url');

const BASE_URL = 'http://localhost:3000';

console.log('🗂️ Airtable API Testing Script');
console.log('===============================\n');

// Test functions
async function testAirtableConnection() {
  console.log('🗂️ Testing Airtable Connection...\n');

  // Step 1: Test different endpoints
  console.log('1️⃣ Test different Airtable endpoints:');
  console.log('   a) Basic user info test:');
  console.log(`      POST ${BASE_URL}/api/test/airtable`);
  console.log('      Body: {"testType": "basic"}\n');

  console.log('   b) Bases test:');
  console.log(`      POST ${BASE_URL}/api/test/airtable`);
  console.log('      Body: {"testType": "bases"}\n');

  console.log('   c) Tables test:');
  console.log(`      POST ${BASE_URL}/api/test/airtable`);
  console.log('      Body: {"testType": "tables"}\n');

  console.log('2️⃣ Example curl commands:\n');

  console.log('   # Test basic user info:');
  console.log(`   curl -X POST ${BASE_URL}/api/test/airtable \\`);
  console.log('        -H "Content-Type: application/json" \\');
  console.log('        -d \'{"testType": "basic"}\'\n');

  console.log('   # Test bases:');
  console.log(`   curl -X POST ${BASE_URL}/api/test/airtable \\`);
  console.log('        -H "Content-Type: application/json" \\');
  console.log('        -d \'{"testType": "bases"}\'\n');

  console.log('   # Test tables:');
  console.log(`   curl -X POST ${BASE_URL}/api/test/airtable \\`);
  console.log('        -H "Content-Type: application/json" \\');
  console.log('        -d \'{"testType": "tables"}\'\n');
}

// Manual test function
async function runManualTest(testType) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ testType });
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/test/airtable',
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
      if (['basic', 'bases', 'tables'].includes(testType)) {
        await runManualTest(testType);
      } else {
        console.error('❌ Invalid test type. Use: basic, bases, or tables');
        process.exit(1);
      }
    } else {
      await testAirtableConnection();
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Make sure:');
    console.log('   1. Your Next.js dev server is running (npm run dev)');
    console.log('   2. You have set your Airtable API key in .env.local');
    console.log('   3. Your API key starts with "pat" (Personal Access Token)');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { testAirtableConnection, runManualTest, checkServer };
