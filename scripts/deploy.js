#!/usr/bin/env node

/**
 * Deploy Coordination
 * Coordinates deployment across all Chassis repositories
 */

import { execSync } from 'child_process';
import https from 'https';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Coordinating Chassis deployment...\n');

const config = {
  repositories: [
    'chassis-tokens',
    'chassis-css', 
    'chassis-react',
    'chassis-figma'
  ],
  deploymentTargets: {
    'chassis-docs': {
      platform: 'vercel',
      branch: 'main'
    }
  }
};

function runCommand(command, cwd = process.cwd()) {
  try {
    console.log(`Running: ${command}`);
    return execSync(command, { 
      cwd, 
      encoding: 'utf8',
      stdio: 'inherit'
    });
  } catch (error) {
    console.error(`Error running command: ${command}`);
    console.error(error.message);
    throw error;
  }
}

async function checkRepositoryStatus(repo) {
  console.log(`📋 Checking status of ${repo}...`);
  
  // This would normally check GitHub API or deployment status
  // For now, we'll simulate the check
  return {
    repo,
    status: 'healthy',
    lastDeploy: new Date().toISOString(),
    version: '1.0.0'
  };
}

async function triggerDeployment() {
  console.log('🔄 Syncing submodules...');
  runCommand('npm run sync:all');
  
  console.log('🏗️  Building examples...');
  runCommand('npm run build:examples');
  
  console.log('🌐 Building website...');
  runCommand('npm run build', './apps/website');
  
  console.log('✅ Deployment preparation complete');
}

async function validateDeployment() {
  console.log('🔍 Validating deployment...');
  
  // Check if all required files exist
  const requiredFiles = [
    './apps/website/dist/index.html',
    './vendor/tokens',
    './vendor/css'
  ];
  
  const fs = await import('fs');
  for (const file of requiredFiles) {
    if (!fs.existsSync(file)) {
      throw new Error(`Required file missing: ${file}`);
    }
  }
  
  console.log('✅ Deployment validation passed');
}

async function main() {
  try {
    // Check repository statuses
    console.log('📊 Checking repository statuses...\n');
    const statuses = await Promise.all(
      config.repositories.map(checkRepositoryStatus)
    );
    
    statuses.forEach(status => {
      console.log(`${status.repo}: ${status.status} (v${status.version})`);
    });
    
    // Trigger deployment
    console.log('\n🚀 Starting deployment process...\n');
    await triggerDeployment();
    
    // Validate deployment
    await validateDeployment();
    
    console.log('\n🎉 Deployment coordination completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { 
  checkRepositoryStatus, 
  triggerDeployment, 
  validateDeployment 
};
