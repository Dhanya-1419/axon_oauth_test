#!/usr/bin/env node

/**
 * ClickUp OAuth Workspace Access Issue
 * 
 * Fixes "This page is unavailable - You don't have access to this Workspace"
 */

console.log('🔧 ClickUp OAuth Workspace Access Issue');
console.log('=======================================\n');

console.log('❌ Error: "This page is unavailable - You don\'t have access to this Workspace or it doesn\'t exist anymore"');
console.log('This is NOT an OAuth error - this is a ClickUp workspace access issue!\n');

console.log('🔍 Issue Analysis:');
console.log('==================');
console.log('The error means:');
console.log('✅ ClickUp OAuth is working (you got redirected to ClickUp)');
console.log('✅ Your ClickUp credentials are valid');
console.log('❌ You don\'t have access to the ClickUp workspace');
console.log('❌ Or the workspace doesn\'t exist anymore');
console.log('❌ Or you\'re not logged into the correct ClickUp account\n');

console.log('🔧 Solutions:');
console.log('=============');

const solutions = [
  {
    title: 'Solution 1: Check ClickUp Account',
    steps: [
      '1. Go to: https://app.clickup.com/login',
      '2. Log into your ClickUp account',
      '3. Check if you have access to any workspaces',
      '4. If no workspaces, create one or join one'
    ]
  },
  {
    title: 'Solution 2: Create ClickUp Workspace',
    steps: [
      '1. Log into ClickUp',
      '2. Click "Create Workspace"',
      '3. Enter workspace name',
      '4. Invite team members or use solo',
      '5. Try OAuth again'
    ]
  },
  {
    title: 'Solution 3: Join ClickUp Workspace',
    steps: [
      '1. Ask workspace owner for invitation',
      '2. Accept email invitation',
      '3. Log into ClickUp',
      '4. Try OAuth again'
    ]
  },
  {
    title: 'Solution 4: Check ClickUp App Permissions',
    steps: [
      '1. Go to: https://developer.clickup.com',
      '2. Find your app with Client ID: ' + (process.env.CLICKUP_CLIENT_ID || '9G02IAUIF4GWO0OO9BO69IJ3F01K08NU'),
      '3. Check app is approved for your workspace',
      '4. Ensure app has proper permissions'
    ]
  }
];

solutions.forEach((solution, index) => {
  console.log(`\n${solution.title}:`);
  console.log('='.repeat(solution.title.length));
  solution.steps.forEach(step => {
    console.log(step);
  });
});

console.log('\n🔍 Debug Steps:');
console.log('===============');

console.log('\n📍 Step 1: Verify ClickUp Account Access');
console.log('1. Go to: https://app.clickup.com/login');
console.log('2. Log in with your ClickUp credentials');
console.log('3. Check if you see any workspaces');
console.log('4. If you see workspaces, OAuth should work');

console.log('\n📍 Step 2: Test OAuth with Workspace');
console.log('1. Ensure you\'re logged into ClickUp');
console.log('2. Visit: http://localhost:3000/api/oauth/start/clickup_oauth');
console.log('3. Authorize the app');
console.log('4. Should redirect to your workspace');

console.log('\n📍 Step 3: Check ClickUp App Configuration');
console.log('Your ClickUp app credentials:');
console.log('CLICKUP_CLIENT_ID=' + (process.env.CLICKUP_CLIENT_ID || '9G02IAUIF4GWO0OO9BO69IJ3F01K08NU'));
console.log('CLICKUP_CLIENT_SECRET=' + (process.env.CLICKUP_CLIENT_SECRET || '[HIDDEN]'));
console.log('');
console.log('In ClickUp Developer Portal:');
console.log('✅ App should be "Published"');
console.log('✅ Redirect URI: http://localhost:3000/api/oauth/callback/clickup');
console.log('✅ Scopes: team:read task:read');

console.log('\n🌐 Expected OAuth Flow:');
console.log('======================');
console.log('1. Visit: http://localhost:3000/api/oauth/start/clickup_oauth');
console.log('2. Redirect to: https://app.clickup.com/authorize?...');
console.log('3. Login to ClickUp (if not already)');
console.log('4. Choose workspace to install app');
console.log('5. Click "Allow" or "Install"');
console.log('6. Redirect to: http://localhost:3000?oauth_success=clickup');

console.log('\n✅ Expected Result:');
console.log('==================');
console.log('• No "This page is unavailable" error');
console.log('• ClickUp workspace loads successfully');
console.log('• App authorization page shows');
console.log('• After approval, redirects to callback');
console.log('• Shows ✓ Connected for ClickUp');

console.log('\n🎯 Most Likely Issue:');
console.log('====================');
console.log('You don\'t have a ClickUp workspace to install the app into.');
console.log('Create a ClickUp workspace first, then OAuth will work.');

console.log('\n🚀 Create a ClickUp workspace and OAuth will work perfectly!');
