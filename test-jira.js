#!/usr/bin/env node

/**
 * Jira OAuth Testing Script
 * 
 * This script helps you test Jira integration with your client ID and secret.
 * 
 * Usage:
 * 1. Update your .env.local file with your Jira credentials:
 *    ATLASSIAN_CLIENT_ID=your_client_id_here
 *    ATLASSIAN_CLIENT_SECRET=your_client_secret_here
 * 
 * 2. Run this script: node test-jira.js
 * 
 * 3. Follow the authentication flow in your browser
 * 
 * 4. Test different Jira API endpoints
 */

const http = require('http');
const url = require('url');

const BASE_URL = 'http://localhost:3000';

console.log('🚀 Jira OAuth Testing Script');
console.log('================================\n');

// Test functions
async function testJiraConnection() {
  console.log('📋 Testing Jira Connection...\n');

  // Step 1: Start OAuth flow
  console.log('1️⃣ Starting OAuth flow...');
  console.log(`   Open this URL in your browser: ${BASE_URL}/api/oauth/start/jira\n`);

  // Step 2: Check tokens
  console.log('2️⃣ After authentication, check tokens:');
  console.log(`   GET ${BASE_URL}/api/oauth/tokens\n`);

  // Step 3: Test different endpoints
  console.log('3️⃣ Test different Jira endpoints:');
  console.log('   a) Basic user info test:');
  console.log(`      POST ${BASE_URL}/api/test/jira`);
  console.log('      Body: {"testType": "basic"}\n');

  console.log('   b) Projects test:');
  console.log(`      POST ${BASE_URL}/api/test/jira`);
  console.log('      Body: {"testType": "projects"}\n');

  console.log('   c) Issues test:');
  console.log(`      POST ${BASE_URL}/api/test/jira`);
  console.log('      Body: {"testType": "issues"}\n');

  console.log('4️⃣ Example curl commands:\n');

  console.log('   # Check tokens:');
  console.log(`   curl -X GET ${BASE_URL}/api/oauth/tokens\n`);

  console.log('   # Test basic user info:');
  console.log(`   curl -X POST ${BASE_URL}/api/test/jira \\`);
  console.log('        -H "Content-Type: application/json" \\');
  console.log('        -d \'{"testType": "basic"}\'\n');

  console.log('   # Test projects:');
  console.log(`   curl -X POST ${BASE_URL}/api/test/jira \\`);
  console.log('        -H "Content-Type: application/json" \\');
  console.log('        -d \'{"testType": "projects"}\'\n');

  console.log('   # Test issues:');
  console.log(`   curl -X POST ${BASE_URL}/api/test/jira \\`);
  console.log('        -H "Content-Type: application/json" \\');
  console.log('        -d \'{"testType": "issues"}\'\n');
}

// Manual test function
async function runManualTest(testType) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ testType });
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/test/jira',
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
      if (['basic', 'projects', 'issues'].includes(testType)) {
        await runManualTest(testType);
      } else {
        console.error('❌ Invalid test type. Use: basic, projects, or issues');
        process.exit(1);
      }
    } else {
      await testJiraConnection();
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Make sure:');
    console.log('   1. Your Next.js dev server is running (npm run dev)');
    console.log('   2. You have set your Jira credentials in .env.local');
    console.log('   3. You have completed the OAuth flow in your browser');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { testJiraConnection, runManualTest, checkServer };
