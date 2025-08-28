#!/usr/bin/env node

/**
 * Sync All Submodules
 * Updates all git submodules to their latest versions
 */

import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔄 Syncing all Chassis submodules...\n');

const submodules = [
  { name: 'chassis-tokens', path: 'vendor/tokens' },
  { name: 'chassis-css', path: 'vendor/css' },
  // { name: 'chassis-figma', path: 'vendor/figma' }, // Temporarily disabled for Vercel deployment
  { name: 'chassis-assets', path: 'vendor/assets' }
];

function runCommand(command, cwd = process.cwd(), silent = false) {
  try {
    if (!silent) {
      console.log(`Running: ${command}`);
    }
    const result = execSync(command, { 
      cwd, 
      encoding: 'utf8',
      stdio: silent ? 'pipe' : 'inherit'
    });
    return result;
  } catch (error) {
    if (!silent) {
      console.error(`Error running command: ${command}`);
      console.error(error.message);
    }
    throw error;
  }
}

function syncSubmodule(submodule) {
  console.log(`\n📦 Syncing ${submodule.name}...`);
  
  const submodulePath = path.join(process.cwd(), submodule.path);
  
  if (!fs.existsSync(submodulePath)) {
    console.log(`⚠️  ${submodule.name} not found at ${submodule.path}`);
    return;
  }
  
  try {
    // Try to update submodule, but don't fail if it has local changes
    runCommand(`git submodule update --remote --merge ${submodule.path}`, process.cwd(), true);
    console.log(`✅ ${submodule.name} synced successfully`);
  } catch (error) {
    console.log(`⚠️  ${submodule.name} has local changes or conflicts, keeping current version`);
  }
}

function main() {
  // Check if submodules exist, if not initialize them
  try {
    runCommand('git submodule status', process.cwd(), true);
  } catch (error) {
    console.log('📦 Initializing submodules...');
    try {
      runCommand('git submodule update --init --recursive');
    } catch (initError) {
      console.log('⚠️  Some submodules may not be available or have uncommitted changes');
      console.log('Continuing with existing submodules...');
    }
  }
  
  // Sync each submodule individually with error handling
  submodules.forEach(submodule => {
    try {
      syncSubmodule(submodule);
    } catch (error) {
      console.log(`⚠️  Failed to sync ${submodule.name}: ${error.message}`);
      console.log(`Continuing with existing version...`);
    }
  });
  
  // Check if there are any changes
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    if (status.trim()) {
      console.log('\n📝 Changes detected in submodules');
      console.log('Run `git add . && git commit -m "chore: update submodules"` to commit changes');
    } else {
      console.log('\n✨ All submodules are up to date');
    }
  } catch (error) {
    console.log('ℹ️  Git status check skipped');
  }
  
  console.log('\n🎉 Submodule sync completed!');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { syncSubmodule, runCommand };
