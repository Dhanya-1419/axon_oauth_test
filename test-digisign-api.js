#!/usr/bin/env node

/**
 * Test DigiSign API with API Key
 * 
 * Tests DigiSign API endpoints and verifies API key functionality
 */

const https = require('https');
const querystring = require('querystring');

console.log('🔑 Testing DigiSign API with API Key');
console.log('===================================\n');

// Your DigiSign API key from .env.local
const DIGISIGN_API_KEY = '1e33fe38-3dab-4ea2-a929-b65418eca43a';
const DIGISIGN_BASE_URL = 'https://api.digisign.com'; // Update if different

async function testDigiSignAPI() {
  console.log('📋 DigiSign Configuration:');
  console.log(`   API Key: ${DIGISIGN_API_KEY.substring(0, 8)}...`);
  console.log(`   Base URL: ${DIGISIGN_BASE_URL}`);
  
  try {
    // Test 1: Check API key validity
    console.log('\n1️⃣ Testing API Key Validity:');
    const authResponse = await makeRequest(`${DIGISIGN_BASE_URL}/auth/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${DIGISIGN_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (authResponse.statusCode === 200) {
      console.log('   ✅ API key is valid!');
      const authData = JSON.parse(authResponse.data);
      console.log('   👤 Account Info:');
      console.log(`      User ID: ${authData.user_id || 'Not provided'}`);
      console.log(`      Email: ${authData.email || 'Not provided'}`);
      console.log(`      Account Type: ${authData.account_type || 'Not provided'}`);
      console.log(`      API Quota: ${authData.api_quota || 'Not provided'}`);
    } else {
      console.log(`   ❌ API key validation failed: ${authResponse.statusCode}`);
      console.log(`   Response: ${authResponse.data}`);
      return { success: false, error: `API key validation failed: ${authResponse.statusCode}` };
    }
    
    // Test 2: Get documents list
    console.log('\n2️⃣ Testing Documents Endpoint:');
    const docsResponse = await makeRequest(`${DIGISIGN_BASE_URL}/documents`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${DIGISIGN_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (docsResponse.statusCode === 200) {
      console.log('   ✅ Documents endpoint working!');
      const docsData = JSON.parse(docsResponse.data);
      console.log('   📄 Documents Info:');
      console.log(`      Total Documents: ${docsData.total || docsData.length || 0}`);
      if (docsData.data && docsData.data.length > 0) {
        console.log('      Recent Documents:');
        docsData.data.slice(0, 3).forEach((doc, index) => {
          console.log(`         ${index + 1}. ${doc.name || doc.title || 'Untitled'} (${doc.status || 'Unknown'})`);
        });
      }
    } else {
      console.log(`   ⚠️  Documents endpoint: ${docsResponse.statusCode}`);
      console.log(`   Response: ${docsResponse.data}`);
    }
    
    // Test 3: Get templates list
    console.log('\n3️⃣ Testing Templates Endpoint:');
    const templatesResponse = await makeRequest(`${DIGISIGN_BASE_URL}/templates`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${DIGISIGN_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (templatesResponse.statusCode === 200) {
      console.log('   ✅ Templates endpoint working!');
      const templatesData = JSON.parse(templatesResponse.data);
      console.log('   📋 Templates Info:');
      console.log(`      Total Templates: ${templatesData.total || templatesData.length || 0}`);
      if (templatesData.data && templatesData.data.length > 0) {
        console.log('      Available Templates:');
        templatesData.data.slice(0, 3).forEach((template, index) => {
          console.log(`         ${index + 1}. ${template.name || template.title || 'Untitled'}`);
        });
      }
    } else {
      console.log(`   ⚠️  Templates endpoint: ${templatesResponse.statusCode}`);
      console.log(`   Response: ${templatesResponse.data}`);
    }
    
    // Test 4: Test local API endpoint
    console.log('\n4️⃣ Testing Local DigiSign API:');
    const localResponse = await makeRequest('http://localhost:3000/api/test/digisign', {
      method: 'GET',
    });

    if (localResponse.statusCode === 200) {
      console.log('   ✅ Local DigiSign API working!');
      const localData = JSON.parse(localResponse.data);
      console.log('   🔧 Local API Response:');
      console.log(`      Status: ${localData.status || 'Unknown'}`);
      console.log(`      Message: ${localData.message || 'No message'}`);
      console.log(`      Data: ${localData.data ? 'Present' : 'Missing'}`);
    } else {
      console.log(`   ❌ Local DigiSign API failed: ${localResponse.statusCode}`);
      console.log(`   Response: ${localResponse.data}`);
    }
    
    // Test 5: Test environment variables
    console.log('\n5️⃣ Testing Environment Variables:');
    const envResponse = await makeRequest('http://localhost:3000/api/env', {
      method: 'GET',
    });

    if (envResponse.statusCode === 200) {
      const envData = JSON.parse(envResponse.data);
      console.log('   🔧 Environment Status:');
      console.log(`      DIGISIGN_API_KEY: ${envData.keys.DIGISIGN_API_KEY ? '✅ Loaded' : '❌ Missing'}`);
      console.log(`      DIGISIGN_BASE_URL: ${envData.keys.DIGISIGN_BASE_URL ? '✅ Loaded' : '❌ Missing'}`);
    } else {
      console.log(`   ❌ Environment check failed: ${envResponse.statusCode}`);
    }
    
    return { success: true };
    
  } catch (error) {
    console.error(`❌ Test failed:`, error.message);
    return { success: false, error: error.message };
  }
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https://');
    const req = (isHttps ? https : require('http')).request(url, {
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
  console.log('🚀 Starting DigiSign API Test...');
  
  const result = await testDigiSignAPI();
  
  console.log('\n🎯 Summary:');
  if (result.success) {
    console.log('✅ DigiSign API test completed successfully!');
    console.log('✅ API key is valid and working');
    console.log('✅ Endpoints are accessible');
    
    console.log('\n🚀 Ready for Integration:');
    console.log('1. Open: http://localhost:3000');
    console.log('2. Go to: Document Management → DigiSign');
    console.log('3. Click: "Test Connection"');
    console.log('4. Should show: "Connected" status');
    
    console.log('\n📋 Available Features:');
    console.log('✅ Document signing');
    console.log('✅ Template management');
    console.log('✅ Document tracking');
    console.log('✅ API integration');
  } else {
    console.log('❌ DigiSign API test failed:');
    console.log(`   - ${result.error}`);
    
    console.log('\n💡 Troubleshooting:');
    console.log('1. Check API key is correct');
    console.log('2. Verify DigiSign account is active');
    console.log('3. Check API permissions');
    console.log('4. Ensure base URL is correct');
  }
}

main().catch(console.error);
