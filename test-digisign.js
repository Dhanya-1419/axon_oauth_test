#!/usr/bin/env node

/**
 * Digisign API Testing Script
 * 
 * Usage:
 * 1. Update your .env.local file with your Digisign credentials:
 *    DIGISIGN_API_KEY=your_digisign_api_key
 *    DIGISIGN_BASE_URL=https://api.digisign.com (optional)
 * 
 * 2. Run this script: node test-digisign.js
 * 
 * 3. Test different Digisign API endpoints
 */

const http = require('http');
const url = require('url');

const BASE_URL = 'http://localhost:3000';

console.log('📄 Digisign API Testing Script');
console.log('==============================\n');

// Test functions
async function testDigisignConnection() {
  console.log('📄 Testing Digisign Connection...\n');

  // Step 1: Test different endpoints
  console.log('1️⃣ Test different Digisign endpoints:');
  console.log('   a) Basic health check:');
  console.log(`      POST ${BASE_URL}/api/test/digisign`);
  console.log('      Body: {"testType": "basic"}\n');

  console.log('   b) User info test:');
  console.log(`      POST ${BASE_URL}/api/test/digisign`);
  console.log('      Body: {"testType": "user"}\n');

  console.log('   c) Documents test:');
  console.log(`      POST ${BASE_URL}/api/test/digisign`);
  console.log('      Body: {"testType": "documents"}\n');

  console.log('   d) Custom base URL test:');
  console.log(`      POST ${BASE_URL}/api/test/digisign`);
  console.log('      Body: {"testType": "basic", "baseUrl": "https://your-custom-api.com"}\n');

  console.log('2️⃣ Example curl commands:\n');

  console.log('   # Test basic health check:');
  console.log(`   curl -X POST ${BASE_URL}/api/test/digisign \\`);
  console.log('        -H "Content-Type: application/json" \\');
  console.log('        -d \'{"testType": "basic"}\'\n');

  console.log('   # Test user info:');
  console.log(`   curl -X POST ${BASE_URL}/api/test/digisign \\`);
  console.log('        -H "Content-Type: application/json" \\');
  console.log('        -d \'{"testType": "user"}\'\n');

  console.log('   # Test documents:');
  console.log(`   curl -X POST ${BASE_URL}/api/test/digisign \\`);
  console.log('        -H "Content-Type: application/json" \\');
  console.log('        -d \'{"testType": "documents"}\'\n');
}

// Manual test function
async function runManualTest(testType, baseUrl) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ testType, baseUrl });
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/test/digisign',
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
      const baseUrl = args[1];
      
      if (['basic', 'user', 'documents'].includes(testType)) {
        await runManualTest(testType, baseUrl);
      } else {
        console.error('❌ Invalid test type. Use: basic, user, or documents');
        console.log('   Optional: Provide custom base URL as second argument');
        process.exit(1);
      }
    } else {
      await testDigisignConnection();
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Make sure:');
    console.log('   1. Your Next.js dev server is running (npm run dev)');
    console.log('   2. You have set your Digisign API key in .env.local');
    console.log('   3. Optionally set DIGISIGN_BASE_URL for custom endpoint');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { testDigisignConnection, runManualTest, checkServer };
