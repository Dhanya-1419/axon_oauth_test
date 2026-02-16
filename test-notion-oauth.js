#!/usr/bin/env node

const http = require('http');

console.log('🔍 Testing Notion OAuth Flow...\n');

// Test 1: Check if OAuth start works
console.log('1️⃣ Testing OAuth start endpoint...');
const options1 = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/oauth/start/notion',
  method: 'GET',
  timeout: 5000,
};

const req1 = http.request(options1, (res) => {
  console.log(`   Status: ${res.statusCode}`);
  if (res.statusCode === 302) {
    console.log('   ✅ OAuth start working (redirecting)');
    const location = res.headers.location;
    console.log(`   Redirect URL: ${location}`);
  } else {
    console.log('   ❌ OAuth start failed');
  }
  
  // Test 2: Check debug endpoint
  console.log('\n2️⃣ Testing debug endpoint...');
  const options2 = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/debug/notion',
    method: 'GET',
  };

  const req2 = http.request(options2, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      try {
        const debug = JSON.parse(data);
        console.log('   ✅ Debug endpoint working');
        console.log(`   Redirect URI: ${debug.redirect_uri}`);
        console.log(`   OAuth URL: ${debug.oauth_url}`);
        
        if (debug.issues.length > 0) {
          console.log('   ⚠️  Issues found:');
          debug.issues.forEach(issue => console.log(`     - ${issue}`));
        } else {
          console.log('   ✅ No configuration issues');
        }
        
        console.log('\n3️⃣ Next steps:');
        console.log('   a) Open this URL in browser:');
        console.log(`      ${debug.oauth_url}`);
        console.log('\n b) Make sure your Notion app has this redirect URI:');
        console.log(`      ${debug.redirect_uri}`);
        console.log('\n c) After authentication, check tokens:');
        console.log('      curl -X GET http://localhost:3000/api/oauth/tokens');
        
      } catch (error) {
        console.log('   ❌ Debug endpoint error:', error.message);
      }
    });
  });

  req2.on('error', (error) => {
    console.log('   ❌ Debug endpoint error:', error.message);
  });

  req2.end();
});

req1.on('error', (error) => {
  console.log('   ❌ OAuth start error:', error.message);
  console.log('\n💡 Make sure your dev server is running: npm run dev');
});

req1.end();
