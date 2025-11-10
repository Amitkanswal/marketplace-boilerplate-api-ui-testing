/* eslint-env node */
const { execSync } = require('child_process');
const path = require('path');

// Load .env file if it exists (dotenv will not override existing env vars)
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

// Get environment from NODE_ENV or APP_ENV, default to 'production'
const env = (process.env.NODE_ENV || process.env.APP_ENV || 'production').toLowerCase();

// Map environment to GitHub branch
const branchMap = {
  'development': 'develop',
  'dev': 'develop',
  'staging': 'staging',
  'stag': 'staging',
  'production': 'main',
  'prod': 'main'
};

const branch = branchMap[env] || 'main';
const githubUrl = `github:contentstack/app-sdk#${branch}`;

console.log(`\n📦 Installing @contentstack/app-sdk from ${branch} branch (env: ${env})...`);

try {
  // Install the specific branch from GitHub
  execSync(`npm install @contentstack/app-sdk@${githubUrl} --save --no-package-lock-update`, { 
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..')
  });
  console.log(`✅ Successfully installed @contentstack/app-sdk from ${branch} branch\n`);
} catch (error) {
  console.error(`❌ Failed to install @contentstack/app-sdk from ${branch} branch:`, error.message);
  console.log(`⚠️  Falling back to default installation...\n`);
  // Don't throw error to prevent breaking the install process
  process.exit(0);
}

