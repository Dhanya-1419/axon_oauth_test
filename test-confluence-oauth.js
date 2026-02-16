#!/usr/bin/env node

/**
 * Confluence OAuth Testing Script
 * 
 * Usage:
 * 1. Update your .env.local file with your Atlassian credentials:
 *    ATLASSIAN_CLIENT_ID=your_atlassian_client_id
 *    ATLASSIAN_CLIENT_SECRET=your_atlassian_client_secret
 * 
 * 2. Run this script: node test-confluence-oauth.js
 * 
 * 3. Test different Confluence OAuth endpoints
 */

const http = require('http');
const url = require('url');

const BASE_URL = 'http://localhost:3000';

console.log('📄 Confluence OAuth Testing Script');
console.log('=================================\n');

// Test functions
async function testConfluenceOAuth() {
  console.log('📄 Testing Confluence OAuth...\n');

  // Step 1: OAuth Flow
  console.log('1️⃣ OAuth Flow:');
  console.log('   a) Start OAuth:');
  console.log(`      GET ${BASE_URL}/api/oauth/start/confluence`);
  console.log('      This will redirect you to Atlassian for authorization\n');

  console.log('   b) Callback URL:');
  console.log(`      ${BASE_URL}/api/oauth/callback/confluence`);
  console.log('      This handles the OAuth callback from Atlassian\n');

  console.log('2️⃣ Test different Confluence endpoints:');
  console.log('   a) Basic user info test:');
  console.log(`      POST ${BASE_URL}/api/test/confluence_oauth`);
  console.log('      Body: {"testType": "basic"}\n');

  console.log('   b) Spaces test:');
  console.log(`      POST ${BASE_URL}/api/test/confluence_oauth`);
  console.log('      Body: {"testType": "spaces"}\n');

  console.log('   c) Content test:');
  console.log(`      POST ${BASE_URL}/api/test/confluence_oauth`);
  console.log('      Body: {"testType": "content"}\n');

  console.log('   d) Token info test:');
  console.log(`      POST ${BASE_URL}/api/test/confluence_oauth`);
  console.log('      Body: {"testType": "token_info"}\n');

  console.log('3️⃣ Example curl commands:\n');

  console.log('   # Start OAuth flow:');
  console.log(`   curl "${BASE_URL}/api/oauth/start/confluence"\n`);

  console.log('   # Test basic user info (after OAuth):');
  console.log(`   curl -X POST ${BASE_URL}/api/test/confluence_oauth \\`);
  console.log('        -H "Content-Type: application/json" \\');
  console.log('        -d \'{"testType": "basic"}\'\n');

  console.log('   # Test spaces:');
  console.log(`   curl -X POST ${BASE_URL}/api/test/confluence_oauth \\`);
  console.log('        -H "Content-Type: application/json" \\');
  console.log('        -d \'{"testType": "spaces"}\'\n');

  console.log('   # Test content:');
  console.log(`   curl -X POST ${BASE_URL}/api/test/confluence_oauth \\`);
  console.log('        -H "Content-Type: application/json" \\');
  console.log('        -d \'{"testType": "content"}\'\n');
}

// Manual test function
async function runManualTest(testType) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ testType });
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/test/confluence_oauth',
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
      if (['basic', 'spaces', 'content', 'token_info'].includes(testType)) {
        await runManualTest(testType);
      } else {
        console.error('❌ Invalid test type. Use: basic, spaces, content, or token_info');
        process.exit(1);
      }
    } else {
      await testConfluenceOAuth();
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Make sure:');
    console.log('   1. Your Next.js dev server is running (npm run dev)');
    console.log('   2. You have set your Atlassian credentials in .env.local');
    console.log('   3. You have completed the OAuth flow first');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { testConfluenceOAuth, runManualTest, checkServer };
