#!/usr/bin/env node

/**
 * Sync Assets Script
 * 
 * This script copies assets from the vendor/tokens/dist/assets/web/chassis-docs
 * directory to the Astro public directory, making them available for the website.
 */

import { copyFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ASSETS_SOURCE = join(__dirname, '../../vendor/tokens/dist/assets/web/chassis-docs');
const ASSETS_TARGET = join(__dirname, '../public');

/**
 * Recursively copy directory contents
 */
function copyDirectory(source, target) {
  if (!existsSync(source)) {
    console.error(`Source directory does not exist: ${source}`);
    return;
  }

  if (!existsSync(target)) {
    mkdirSync(target, { recursive: true });
  }

  const items = readdirSync(source);
  
  for (const item of items) {
    const sourcePath = join(source, item);
    const targetPath = join(target, item);
    
    if (statSync(sourcePath).isDirectory()) {
      copyDirectory(sourcePath, targetPath);
    } else {
      // Only copy if source is newer or target doesn't exist
      if (!existsSync(targetPath) || statSync(sourcePath).mtime > statSync(targetPath).mtime) {
        copyFileSync(sourcePath, targetPath);
        console.log(`Copied: ${item}`);
      }
    }
  }
}

/**
 * Main sync function
 */
function syncAssets() {
  console.log('🔄 Syncing Chassis assets...');
  console.log(`📁 Source: ${ASSETS_SOURCE}`);
  console.log(`📁 Target: ${ASSETS_TARGET}`);
  
  try {
    copyDirectory(ASSETS_SOURCE, ASSETS_TARGET);
    console.log('✅ Assets synced successfully!');
    
    // List what was synced
    console.log('\n📋 Available assets:');
    const items = readdirSync(ASSETS_TARGET);
    for (const item of items) {
      const itemPath = join(ASSETS_TARGET, item);
      if (statSync(itemPath).isDirectory() && ['fonts', 'icons', 'images'].includes(item)) {
        const subItems = readdirSync(itemPath);
        console.log(`  📂 ${item}/ (${subItems.length} items)`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error syncing assets:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  syncAssets();
}

export { syncAssets };
