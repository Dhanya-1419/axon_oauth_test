#!/usr/bin/env node

/**
 * Comprehensive DigiSign API Test
 * 
 * Tests multiple possible DigiSign API endpoints and configurations
 */

const https = require('https');
const http = require('http');

console.log('🔍 Comprehensive DigiSign API Test');
console.log('================================\n');

// Your DigiSign API key
const DIGISIGN_API_KEY = '1e33fe38-3dab-4ea2-a929-b65418eca43a';

// Possible DigiSign API base URLs
const possibleUrls = [
  'https://api.digisign.com',
  'https://api.digisign.io', 
  'https://digisign.com/api',
  'https://api.digisigner.com',
  'https://digisigner.com/api',
  'https://api.docusign.com', // Common alternative
  'https://demo.docusign.net/restapi', // Demo environment
];

async function testApiUrl(baseUrl) {
  console.log(`\n🧪 Testing: ${baseUrl}`);
  
  try {
    // Test 1: Basic health check
    const healthResponse = await makeRequest(`${baseUrl}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${DIGISIGN_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    console.log(`   Health Check: ${healthResponse.statusCode}`);
    if (healthResponse.statusCode === 200) {
      console.log('   ✅ Basic connection successful!');
      return { success: true, baseUrl, health: true };
    } else {
      console.log(`   Response: ${healthResponse.data.substring(0, 100)}...`);
    }
  } catch (error) {
    console.log(`   ❌ Connection failed: ${error.message}`);
  }
  
  try {
    // Test 2: Try common endpoints
    const endpoints = ['/health', '/status', '/api/v1/health', '/api/v2/health', '/user', '/api/v1/user'];
    
    for (const endpoint of endpoints) {
      const response = await makeRequest(`${baseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${DIGISIGN_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (response.statusCode === 200 || response.statusCode === 401) {
        console.log(`   ✅ Found working endpoint: ${endpoint} (${response.statusCode})`);
        return { success: true, baseUrl, endpoint, status: response.statusCode };
      }
    }
  } catch (error) {
    console.log(`   Endpoint tests failed: ${error.message}`);
  }
  
  return { success: false, baseUrl };
}

async function testLocalDigiSignAPI() {
  console.log('\n🔧 Testing Local DigiSign API:');
  
  try {
    // Test basic connection
    const basicResponse = await makeRequest('http://localhost:3000/api/test/digisign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        testType: 'basic'
      }),
    });

    if (basicResponse.statusCode === 200) {
      const data = JSON.parse(basicResponse.data);
      console.log('   ✅ Local API responding!');
      console.log(`   Status: ${data.success ? 'Success' : 'Failed'}`);
      console.log(`   Base URL: ${data.baseUrl}`);
      console.log(`   Test Type: ${data.testType}`);
      
      if (data.results && data.results.health) {
        const health = data.results.health;
        console.log(`   Health Test: ${health.success ? '✅ Success' : '❌ Failed'}`);
        if (!health.success) {
          console.log(`   Error: ${health.error}`);
        }
      }
      
      return { success: true, local: true, data };
    } else {
      console.log(`   ❌ Local API failed: ${basicResponse.statusCode}`);
      console.log(`   Response: ${basicResponse.data}`);
      return { success: false, error: `Local API failed: ${basicResponse.statusCode}` };
    }
  } catch (error) {
    console.error(`   ❌ Local API test failed:`, error.message);
    return { success: false, error: error.message };
  }
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https://');
    const req = (isHttps ? https : http).request(url, {
      method: options.method || 'GET',
      headers: options.headers || {},
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          data: data,
        });
      });
    });

    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

// Main execution
async function main() {
  console.log('📋 DigiSign API Key:');
  console.log(`   API Key: ${DIGISIGN_API_KEY.substring(0, 8)}...`);
  
  console.log('\n🌐 Testing Possible API URLs:');
  let workingUrl = null;
  
  for (const url of possibleUrls) {
    const result = await testApiUrl(url);
    if (result.success) {
      workingUrl = result;
      break;
    }
  }
  
  // Test local API
  const localResult = await testLocalDigiSignAPI();
  
  console.log('\n🎯 Results Summary:');
  console.log('=====================');
  
  if (workingUrl) {
    console.log('✅ Found Working DigiSign API:');
    console.log(`   URL: ${workingUrl.baseUrl}`);
    if (workingUrl.endpoint) {
      console.log(`   Endpoint: ${workingUrl.endpoint}`);
    }
    console.log(`   Status: ${workingUrl.status}`);
    
    console.log('\n💡 Recommendation:');
    console.log('Update your .env.local with:');
    console.log(`DIGISIGN_BASE_URL=${workingUrl.baseUrl}`);
    console.log('');
    console.log('Then restart the server and test again.');
  } else {
    console.log('❌ No Working DigiSign API Found:');
    console.log('   All tested URLs failed to connect');
    console.log('');
    console.log('💡 Possible Solutions:');
    console.log('1. Check DigiSign documentation for correct API URL');
    console.log('2. Verify API key is correct and active');
    console.log('3. Check if DigiSign service is available');
    console.log('4. Contact DigiSign support for API access');
  }
  
  if (localResult.success) {
    console.log('\n✅ Local DigiSign API:');
    console.log('   The local test endpoint is working');
    console.log('   Issue is with external DigiSign API URL');
  } else {
    console.log('\n❌ Local DigiSign API:');
    console.log(`   Error: ${localResult.error}`);
  }
  
  console.log('\n🔧 Next Steps:');
  console.log('1. Find correct DigiSign API base URL');
  console.log('2. Update DIGISIGN_BASE_URL in .env.local');
  console.log('3. Restart development server');
  console.log('4. Test DigiSign integration in frontend');
}

main().catch(console.error);
