#!/usr/bin/env node

/**
 * Box OAuth Testing Script
 * 
 * Usage:
 * 1. Update your .env.local file with your Box credentials:
 *    BOX_CLIENT_ID=your_box_client_id
 *    BOX_CLIENT_SECRET=your_box_client_secret
 * 
 * 2. Run this script: node test-box.js
 * 
 * 3. Follow authentication flow in your browser
 * 
 * 4. Test different Box API endpoints
 */

const http = require('http');
const url = require('url');

const BASE_URL = 'http://localhost:3000';

console.log('📦 Box OAuth Testing Script');
console.log('=============================\n');

// Test functions
async function testBoxConnection() {
  console.log('📦 Testing Box Connection...\n');

  // Step 1: Start OAuth flow
  console.log('1️⃣ Starting OAuth flow...');
  console.log(`   Open this URL in your browser: ${BASE_URL}/api/oauth/start/box\n`);

  // Step 2: Check tokens
  console.log('2️⃣ After authentication, check tokens:');
  console.log(`   GET ${BASE_URL}/api/oauth/tokens\n`);

  // Step 3: Test different endpoints
  console.log('3️⃣ Test different Box endpoints:');
  console.log('   a) Basic user info test:');
  console.log(`      POST ${BASE_URL}/api/test/box`);
  console.log('      Body: {"testType": "basic"}\n`);

  console.log('   b) Folders test:');
  console.log(`      POST ${BASE_URL}/api/test/box`);
  console.log('      Body: {"testType": "folders"}\n`);

  console.log('4️⃣ Example curl commands:\n');

  console.log('   # Check tokens:');
  console.log(`   curl -X GET ${BASE_URL}/api/oauth/tokens\n`);

  console.log('   # Test basic user info:');
  console.log(`   curl -X POST ${BASE_URL}/api/test/box \\`);
  console.log('        -H "Content-Type: application/json" \\`);
  console.log('        -d \'{"testType": "basic"}\'\n');

  console.log('   # Test folders:');
  console.log(`   curl -X POST ${BASE_URL}/api/test/box \\`);
  console.log('        -H "Content-Type: application/json" \\');
  console.log('        -d \'{"testType": "folders"}\'\n');
}

// Manual test function
async function runManualTest(testType) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ testType });
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/test/box',
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
      if (['basic', 'folders'].includes(testType)) {
        await runManualTest(testType);
      } else {
        console.error('❌ Invalid test type. Use: basic or folders');
        process.exit(1);
      }
    } else {
      await testBoxConnection();
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Make sure:');
    console.log('   1. Your Next.js dev server is running (npm run dev)');
    console.log('   2. You have set your Box credentials in .env.local');
    console.log('   3. You have completed OAuth flow in your browser');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { testBoxConnection, runManualTest, checkServer };
