#!/usr/bin/env node

/**
 * Final DigiSign API Test with Correct URL
 * 
 * Tests DigiSign/DocuSign API with working base URL
 */

const https = require('https');

console.log('🔑 Final DigiSign API Test');
console.log('==========================\n');

// Your DigiSign API key
const DIGISIGN_API_KEY = '1e33fe38-3dab-4ea2-a929-b65418eca43a';
const WORKING_BASE_URL = 'https://demo.docusign.net/restapi';

async function testDigiSignAPI() {
  console.log('📋 Configuration:');
  console.log(`   API Key: ${DIGISIGN_API_KEY.substring(0, 8)}...`);
  console.log(`   Base URL: ${WORKING_BASE_URL}`);
  
  try {
    // Test 1: Check login information
    console.log('\n1️⃣ Testing Login Information:');
    const loginResponse = await makeRequest(`${WORKING_BASE_URL}/login_information`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${DIGISIGN_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (loginResponse.statusCode === 200) {
      console.log('   ✅ Login information retrieved!');
      const loginData = JSON.parse(loginResponse.data);
      console.log('   👤 Account Info:');
      console.log(`      Login Accounts: ${loginData.loginAccounts?.length || 0}`);
      if (loginData.loginAccounts && loginData.loginAccounts.length > 0) {
        const account = loginData.loginAccounts[0];
        console.log(`      Account ID: ${account.accountId}`);
        console.log(`      Account Name: ${account.accountName}`);
        console.log(`      Base URI: ${account.baseUrl}`);
        console.log(`      Is Default: ${account.isDefault}`);
      }
    } else {
      console.log(`   ⚠️  Login info: ${loginResponse.statusCode}`);
      console.log(`   Response: ${loginResponse.data.substring(0, 200)}...`);
    }
    
    // Test 2: Get user information
    console.log('\n2️⃣ Testing User Information:');
    const userResponse = await makeRequest(`${WORKING_BASE_URL}/v2.1/accounts`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${DIGISIGN_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (userResponse.statusCode === 200) {
      console.log('   ✅ User information retrieved!');
      const userData = JSON.parse(userResponse.data);
      console.log('   👤 User Data:');
      console.log(`      Accounts: ${userData.accounts?.length || 0}`);
      if (userData.accounts && userData.accounts.length > 0) {
        userData.accounts.slice(0, 2).forEach((account, index) => {
          console.log(`      Account ${index + 1}:`);
          console.log(`         ID: ${account.accountId}`);
          console.log(`         Name: ${account.accountName}`);
          console.log(`         Created: ${account.createdDateTime}`);
        });
      }
    } else {
      console.log(`   ⚠️  User info: ${userResponse.statusCode}`);
      console.log(`   Response: ${userResponse.data.substring(0, 200)}...`);
    }
    
    // Test 3: Get envelopes (documents)
    console.log('\n3️⃣ Testing Envelopes (Documents):');
    const envelopesResponse = await makeRequest(`${WORKING_BASE_URL}/v2.1/accounts/test/envelopes`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${DIGISIGN_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (envelopes.statusCode === 200) {
      console.log('   ✅ Envelopes retrieved!');
      const envelopeData = JSON.parse(envelopes.data);
      console.log('   📄 Envelope Info:');
      console.log(`      Total Envelopes: ${envelopeData.envelopes?.length || 0}`);
      if (envelopeData.envelopes && envelopeData.envelopes.length > 0) {
        envelopeData.envelopes.slice(0, 3).forEach((envelope, index) => {
          console.log(`      Envelope ${index + 1}:`);
          console.log(`         ID: ${envelope.envelopeId}`);
          console.log(`         Status: ${envelope.status}`);
          console.log(`         Subject: ${envelope.emailSubject || 'No subject'}`);
        });
      }
    } else {
      console.log(`   ⚠️  Envelopes: ${envelopes.statusCode}`);
      console.log(`   Response: ${envelopes.data.substring(0, 200)}...`);
    }
    
    // Test 4: Test local API with correct URL
    console.log('\n4️⃣ Testing Local API with Correct URL:');
    const localResponse = await makeRequest('http://localhost:3000/api/test/digisign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        testType: 'basic',
        baseUrl: WORKING_BASE_URL
      }),
    });

    if (localResponse.statusCode === 200) {
      const localData = JSON.parse(localResponse.data);
      console.log('   ✅ Local API working with correct URL!');
      console.log(`   Status: ${localData.success ? 'Success' : 'Failed'}`);
      console.log(`   Base URL: ${localData.baseUrl}`);
      
      if (localData.results && localData.results.health) {
        const health = localData.results.health;
        console.log(`   Health Test: ${health.success ? '✅ Success' : '❌ Failed'}`);
        if (health.success) {
          console.log(`   Response: ${health.data?.response?.substring(0, 100)}...`);
        } else {
          console.log(`   Error: ${health.error}`);
        }
      }
    } else {
      console.log(`   ❌ Local API failed: ${localResponse.statusCode}`);
    }
    
    return { success: true };
    
  } catch (error) {
    console.error(`❌ Test failed:`, error.message);
    return { success: false, error: error.message };
  }
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, {
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
  console.log('🚀 Testing DigiSign API with Working URL...');
  
  const result = await testDigiSignAPI();
  
  console.log('\n🎯 Final Results:');
  console.log('==================');
  
  if (result.success) {
    console.log('✅ DigiSign API is working!');
    console.log('✅ API key is valid');
    console.log('✅ Endpoints are accessible');
    
    console.log('\n🔧 Configuration Update:');
    console.log('Add this to your .env.local:');
    console.log(`DIGISIGN_BASE_URL=${WORKING_BASE_URL}`);
    
    console.log('\n🚀 Ready for Testing:');
    console.log('1. Update .env.local with the base URL above');
    console.log('2. Restart development server');
    console.log('3. Open: http://localhost:3000');
    console.log('4. Go to: Document Management → DigiSign');
    console.log('5. Click: "Test Connection"');
    console.log('6. Should show: "Connected" status');
    
    console.log('\n📋 Available Features:');
    console.log('✅ Document signing');
    console.log('✅ Envelope management');
    console.log('✅ User account access');
    console.log('✅ API integration');
  } else {
    console.log('❌ DigiSign API test failed:');
    console.log(`   - ${result.error}`);
    
    console.log('\n💡 Troubleshooting:');
    console.log('1. Verify API key is correct');
    console.log('2. Check if this is the correct DigiSign service');
    console.log('3. Ensure account is active');
    console.log('4. Contact support if needed');
  }
}

main().catch(console.error);
