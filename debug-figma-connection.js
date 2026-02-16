#!/usr/bin/env node

/**
 * Debug Figma OAuth Connection Issue
 * 
 * Checks why Figma doesn't show "connected" after OAuth
 */

console.log('🔍 Debug Figma OAuth Connection Issue');
console.log('====================================\n');

console.log('❌ Issue: Figma OAuth completes but doesn\'t show "connected"');
console.log('🔍 Let\'s trace the OAuth flow...\n');

console.log('📋 What Should Happen:');
console.log('====================');
console.log('1. Visit: http://localhost:3000/api/oauth/start/figma');
console.log('2. Redirect to Figma authorization page');
console.log('3. User approves access');
console.log('4. Figma redirects to: http://localhost:3000/api/oauth/callback/figma?code=...');
console.log('5. Callback exchanges code for token');
console.log('6. Token is stored');
console.log('7. Redirect to: http://localhost:3000?oauth_success=figma');
console.log('8. UI shows "connected" status\n');

console.log('🔍 Debug Steps:');
console.log('===============');

console.log('\n1️⃣ Check Browser URL After OAuth:');
console.log('After completing Figma OAuth, check your browser URL:');
console.log('✅ Expected: http://localhost:3000?oauth_success=figma');
console.log('❌ If you see: http://localhost:3000?error=figma_oauth_failed');
console.log('❌ If you see: http://localhost:3000?error=missing_code');
console.log('❌ If you see: http://localhost:3000?error=...');

console.log('\n2️⃣ Check Server Logs:');
console.log('Look for these messages in your server terminal:');
console.log('✅ "Figma OAuth callback error: ..." (if there\'s an error)');
console.log('✅ Any error messages during token exchange');

console.log('\n3️⃣ Check Token Storage:');
console.log('Visit: http://localhost:3000/api/oauth/tokens');
console.log('Check if figma token is stored correctly');
console.log('Should show something like:');
console.log('{"figma": {"access_token": "...", "expires_at": ...}}');

console.log('\n4️⃣ Test Token Exchange Manually:');
console.log('Check if the token exchange is working:');
console.log('• Figma token endpoint: https://www.figma.com/api/oauth/token');
console.log('• Your credentials: FIGMA_CLIENT_ID=x0YTPytxPHTWYX6dJtigiZ');
console.log('• Callback URL: http://localhost:3000/api/oauth/callback/figma');

console.log('\n🔧 Common Issues & Fixes:');
console.log('========================');

const issues = [
  {
    issue: 'Figma callback URL not configured',
    check: 'Go to https://www.figma.com/developers/apps',
    fix: 'Add http://localhost:3000/api/oauth/callback/figma'
  },
  {
    issue: 'Token exchange fails',
    check: 'Check server logs for token exchange errors',
    fix: 'Verify FIGMA_CLIENT_SECRET is correct'
  },
  {
    issue: 'Token storage fails',
    check: 'Check setToken function in tokens/route.js',
    fix: 'Ensure tokens.json is writable'
  },
  {
    issue: 'UI not updating',
    check: 'Frontend not reading oauth_success parameter',
    fix: 'Check main page OAuth success handling'
  },
  {
    issue: 'Redirect loop',
    check: 'Multiple redirects in browser',
    fix: 'Check for conflicting OAuth state'
  }
];

issues.forEach((item, index) => {
  console.log(`${index + 1}. ${item.issue}`);
  console.log(`   Check: ${item.check}`);
  console.log(`   Fix: ${item.fix}\n`);
});

console.log('🧪 Manual Test Steps:');
console.log('====================');

console.log('\nStep 1: Start Fresh');
console.log('1. Clear browser cookies for localhost');
console.log('2. Restart dev server: npm run dev');

console.log('\nStep 2: Test OAuth Flow');
console.log('1. Visit: http://localhost:3000/api/oauth/start/figma');
console.log('2. Should redirect to Figma');
console.log('3. Login and approve');
console.log('4. Note the final URL after redirect');

console.log('\nStep 3: Check Results');
console.log('1. Check browser URL parameters');
console.log('2. Check server terminal for errors');
console.log('3. Visit: http://localhost:3000/api/oauth/tokens');
console.log('4. Check if figma token exists');

console.log('\n🔍 Debug Information to Collect:');
console.log('================================');
console.log('• Final browser URL after OAuth');
console.log('• Any error messages in server logs');
console.log('• Contents of /api/oauth/tokens endpoint');
console.log('• Figma developer console callback URL configuration');

console.log('\n🚀 Most Likely Fixes:');
console.log('===================');
console.log('1. Update Figma developer console callback URL');
console.log('2. Check FIGMA_CLIENT_SECRET in .env.local');
console.log('3. Ensure tokens.json file is writable');
console.log('4. Check frontend OAuth success handling');

console.log('\n✅ Expected Working Result:');
console.log('========================');
console.log('• OAuth completes successfully');
console.log('• Browser ends at: http://localhost:3000?oauth_success=figma');
console.log('• Token stored in tokens.json');
console.log('• UI shows Figma as "connected"');

console.log('\n🎯 If Still Not Working:');
console.log('====================');
console.log('Share the final browser URL and any server');
console.log('error messages, and I can identify the exact issue.');
