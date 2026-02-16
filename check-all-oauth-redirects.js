#!/usr/bin/env node

/**
 * Universal OAuth Redirect URL Diagnostic
 * 
 * Checks all OAuth apps for redirect URL issues
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

console.log('🔍 Universal OAuth Redirect URL Diagnostic');
console.log('========================================\n');

// Load environment variables
function loadEnvVars() {
  const envPath = path.join(__dirname, '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^#][^=]+)=(.+)$/);
      if (match) {
        envVars[match[1].trim()] = match[2].trim();
      }
    });
    return envVars;
  }
  return {};
}

const env = loadEnvVars();

// OAuth configurations
const oauthConfigs = [
  {
    name: 'Google',
    clientId: env.GOOGLE_CLIENT_ID,
    baseUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    callbackPath: '/api/oauth/callback/google',
    scopes: 'email profile'
  },
  {
    name: 'Microsoft',
    clientId: env.MICROSOFT_CLIENT_ID,
    baseUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    callbackPath: '/api/oauth/callback/microsoft',
    scopes: 'openid profile email'
  },
  {
    name: 'GitHub',
    clientId: env.GITHUB_ID,
    baseUrl: 'https://github.com/login/oauth/authorize',
    callbackPath: '/api/oauth/callback/github',
    scopes: 'user:email'
  },
  {
    name: 'Slack',
    clientId: env.SLACK_CLIENT_ID,
    baseUrl: 'https://slack.com/oauth/v2/authorize',
    callbackPath: '/api/oauth/callback/slack',
    scopes: 'users:read'
  },
  {
    name: 'Atlassian (Jira)',
    clientId: env.ATLASSIAN_CLIENT_ID,
    baseUrl: 'https://auth.atlassian.com/authorize',
    callbackPath: '/api/oauth/callback/jira',
    scopes: 'read:jira-work read:jira-user read:account'
  },
  {
    name: 'Atlassian (Confluence)',
    clientId: env.ATLASSIAN_CLIENT_ID,
    baseUrl: 'https://auth.atlassian.com/authorize',
    callbackPath: '/api/oauth/callback/confluence',
    scopes: 'read:confluence-content.summary read:confluence-space:confluence'
  },
  {
    name: 'Figma',
    clientId: env.FIGMA_CLIENT_ID,
    baseUrl: 'https://www.figma.com/oauth',
    callbackPath: '/api/oauth/callback/figma',
    scopes: 'current_user:read file_content:read'
  },
  {
    name: 'Notion',
    clientId: env.NOTION_CLIENT_ID,
    baseUrl: 'https://api.notion.com/v1/oauth/authorize',
    callbackPath: '/api/oauth/callback/notion',
    scopes: 'user.info:read'
  },
  {
    name: 'Asana',
    clientId: env.ASANA_CLIENT_ID,
    baseUrl: 'https://app.asana.com/-/oauth_authorize',
    callbackPath: '/api/oauth/callback/asana',
    scopes: 'default'
  },
  {
    name: 'ClickUp',
    clientId: env.CLICKUP_CLIENT_ID,
    baseUrl: 'https://app.clickup.com/api/v2/oauth/authorize',
    callbackPath: '/api/oauth/callback/clickup',
    scopes: 'tasks:read'
  },
  {
    name: 'Dropbox',
    clientId: env.DROPBOX_CLIENT_ID,
    baseUrl: 'https://www.dropbox.com/oauth2/authorize',
    callbackPath: '/api/oauth/callback/dropbox',
    scopes: 'files.metadata.read'
  },
  {
    name: 'Box',
    clientId: env.BOX_CLIENT_ID,
    baseUrl: 'https://account.box.com/api/oauth2/authorize',
    callbackPath: '/api/oauth/callback/box',
    scopes: 'root_readonly'
  },
  {
    name: 'Calendly',
    clientId: env.CALENDLY_CLIENT_ID,
    baseUrl: 'https://auth.calendly.com/oauth/authorize',
    callbackPath: '/api/oauth/callback/calendly',
    scopes: 'default'
  },
  {
    name: 'Eventbrite',
    clientId: env.EVENTBRITE_CLIENT_ID,
    baseUrl: 'https://www.eventbrite.com/oauth/authorize',
    callbackPath: '/api/oauth/callback/eventbrite',
    scopes: 'read_user'
  },
  {
    name: 'Jotform',
    clientId: env.JOTFORM_API_KEY,
    baseUrl: 'https://api.jotform.com/oauth/authorize',
    callbackPath: '/api/oauth/callback/jotform',
    scopes: 'READ_FORMS'
  },
  {
    name: 'Airtable',
    clientId: env.AIRTABLE_API_KEY,
    baseUrl: 'https://airtable.com/oauth2/v1/authorize',
    callbackPath: '/api/oauth/callback/airtable',
    scopes: 'data.records:read'
  }
];

function generateOAuthUrl(config) {
  const baseUrl = env.NEXTAUTH_URL || 'http://localhost:3000';
  const redirectUri = `${baseUrl}${config.callbackPath}`;
  
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: config.scopes
  });

  return `${config.baseUrl}?${params.toString()}`;
}

function checkRouteExists(callbackPath) {
  const routePath = path.join(__dirname, 'app', 'api', 'oauth', 'callback', callbackPath.split('/').pop(), 'route.js');
  return fs.existsSync(routePath);
}

async function testOAuthStart(config) {
  const baseUrl = env.NEXTAUTH_URL || 'http://localhost:3000';
  const startPath = `/api/oauth/start/${config.name.toLowerCase().replace(/\s+/g, '').replace('atlassian(jira)', 'jira').replace('atlassian(confluence)', 'confluence')}`;
  
  try {
    const response = await makeRequest(`${baseUrl}${startPath}`, { timeout: 3000 });
    return {
      success: response.statusCode === 307 || response.statusCode === 200,
      status: response.statusCode,
      error: null
    };
  } catch (error) {
    return {
      success: false,
      status: null,
      error: error.message
    };
  }
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https://');
    const req = (isHttps ? https : require('http')).request(url, {
      method: options.method || 'GET',
      headers: options.headers || {},
      timeout: options.timeout || 5000,
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          data: data,
          headers: res.headers,
        });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function main() {
  console.log('📋 Environment Configuration:');
  console.log('=============================');
  console.log(`NEXTAUTH_URL: ${env.NEXTAUTH_URL || 'http://localhost:3000'}`);
  console.log(`Server should run on: ${env.NEXTAUTH_URL || 'http://localhost:3000'}\n`);

  console.log('🔍 OAuth App Analysis:');
  console.log('=======================');

  for (const config of oauthConfigs) {
    console.log(`\n📱 ${config.name}:`);
    console.log(`   Client ID: ${config.clientId ? config.clientId.substring(0, 10) + '...' : '❌ Missing'}`);
    
    if (!config.clientId) {
      console.log('   Status: ❌ No credentials configured');
      continue;
    }

    const baseUrl = env.NEXTAUTH_URL || 'http://localhost:3000';
    const redirectUri = `${baseUrl}${config.callbackPath}`;
    console.log(`   Callback URL: ${redirectUri}`);
    
    const routeExists = checkRouteExists(config.callbackPath);
    console.log(`   Route exists: ${routeExists ? '✅' : '❌'}`);
    
    const oauthUrl = generateOAuthUrl(config);
    console.log(`   OAuth URL: ${oauthUrl.substring(0, 80)}...`);
    
    // Test OAuth start endpoint
    const startTest = await testOAuthStart(config);
    console.log(`   Start endpoint: ${startTest.success ? '✅ Working' : '❌ Failed'} ${startTest.status || startTest.error}`);
    
    if (!startTest.success) {
      console.log(`   ⚠️  Issue: ${startTest.error || `HTTP ${startTest.status}`}`);
    }
  }

  console.log('\n🔧 Common Redirect URL Issues & Fixes:');
  console.log('=====================================');
  
  const commonIssues = [
    {
      issue: 'Missing callback routes',
      fix: 'Create missing /api/oauth/callback/{service}/route.js files'
    },
    {
      issue: 'Wrong NEXTAUTH_URL',
      fix: 'Set NEXTAUTH_URL=http://localhost:3000 in .env.local'
    },
    {
      issue: 'Port mismatch',
      fix: 'Ensure dev server runs on port 3000'
    },
    {
      issue: 'HTTPS/HTTP mismatch',
      fix: 'Use HTTP for local development'
    },
    {
      issue: 'Trailing slashes',
      fix: 'Remove trailing slashes from callback URLs'
    }
  ];

  commonIssues.forEach((item, index) => {
    console.log(`${index + 1}. ${item.issue}`);
    console.log(`   Fix: ${item.fix}`);
  });

  console.log('\n🚀 Quick Fixes:');
  console.log('===============');
  console.log('1. Restart dev server: npm run dev');
  console.log('2. Check NEXTAUTH_URL=http://localhost:3000');
  console.log('3. Verify all callback routes exist');
  console.log('4. Test each OAuth start endpoint');
  console.log('5. Check developer consoles for callback URL configuration');

  console.log('\n📋 Required Callback URLs (copy these to developer consoles):');
  console.log('=======================================================');
  
  const baseUrl = env.NEXTAUTH_URL || 'http://localhost:3000';
  oauthConfigs.forEach(config => {
    if (config.clientId) {
      console.log(`${config.name}: ${baseUrl}${config.callbackPath}`);
    }
  });
}

main().catch(console.error);
