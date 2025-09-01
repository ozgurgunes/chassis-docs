#!/usr/bin/env node

/**
 * Chassis Build Tools
 * Utility functions for building and managing Chassis projects
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ChassisBuilder {
  constructor(rootDir = process.cwd()) {
    this.rootDir = rootDir;
    this.vendorDir = path.join(rootDir, 'vendor');
    this.siteDir = path.join(rootDir, 'site');
    this.outputDir = path.join(rootDir, '_site');
  }

  log(message, type = 'info') {
    const icons = {
      info: '📋',
      success: '✅',
      error: '❌',
      warning: '⚠️',
      build: '🏗️'
    };
    console.log(`${icons[type]} ${message}`);
  }

  runCommand(command, cwd = this.rootDir, silent = false) {
    try {
      if (!silent) {
        this.log(`Running: ${command}`, 'info');
      }
      const result = execSync(command, {
        cwd,
        encoding: 'utf8',
        stdio: silent ? 'pipe' : 'inherit'
      });
      return result;
    } catch (error) {
      this.log(`Command failed: ${command}`, 'error');
      this.log(`Error: ${error.message}`, 'error');
      throw error;
    }
  }

  checkDependencies() {
    this.log('Checking project dependencies...', 'info');
    
    const requiredDirs = [
      { path: this.vendorDir, name: 'vendor (submodules)' },
      { path: this.siteDir, name: 'site (Astro project)' }
    ];

    for (const dir of requiredDirs) {
      if (!fs.existsSync(dir.path)) {
        this.log(`Missing directory: ${dir.name}`, 'warning');
      } else {
        this.log(`Found: ${dir.name}`, 'success');
      }
    }
  }

  buildSite() {
    this.log('Building Astro documentation site...', 'build');
    
    if (!fs.existsSync(this.siteDir)) {
      throw new Error('Site directory not found');
    }

    // Install dependencies using pnpm
    this.log('Installing dependencies...', 'info');
    this.runCommand('pnpm install');

    // Build Astro site
    this.log('Building Astro site...', 'info');
    this.runCommand('pnpm build:site');
    
    this.log('Astro site built successfully', 'success');
  }

  updateVendorAssets() {
    this.log('Updating vendor/assets submodule...', 'info');
    
    try {
      // Update specifically the vendor/assets submodule
      this.runCommand('git submodule update --init --remote vendor/assets');
      this.log('Vendor assets updated', 'success');
    } catch (error) {
      this.log('Vendor assets update failed, trying sync script...', 'warning');
      
      try {
        this.runCommand('npm run sync:all');
        this.log('Vendor assets synced via sync script', 'success');
      } catch (syncError) {
        this.log('Both vendor update and sync failed', 'error');
        throw syncError;
      }
    }
  }

  validateBuild() {
    this.log('Validating build...', 'info');
    
    const validationChecks = [
      {
        path: this.outputDir,
        name: 'Astro build output (_site)'
      },
      {
        path: this.vendorDir,
        name: 'Vendor submodules'
      }
    ];

    for (const check of validationChecks) {
      if (fs.existsSync(check.path)) {
        this.log(`✓ ${check.name}`, 'success');
      } else {
        this.log(`✗ ${check.name}`, 'error');
      }
    }
  }

  clean() {
    this.log('Cleaning build artifacts...', 'info');
    
    const cleanPaths = [
      this.outputDir,
      path.join(this.rootDir, 'node_modules'),
      path.join(this.siteDir, 'node_modules')
    ];

    for (const cleanPath of cleanPaths) {
      if (fs.existsSync(cleanPath)) {
        fs.rmSync(cleanPath, { recursive: true, force: true });
        this.log(`Cleaned: ${path.relative(this.rootDir, cleanPath)}`, 'info');
      }
    }
  }

  buildAll() {
    this.log('Starting complete build process...', 'build');
    
    try {
      this.checkDependencies();
      this.updateVendorAssets();
      this.buildSite();
      this.validateBuild();
      
      this.log('🎉 Build completed successfully!', 'success');
    } catch (error) {
      this.log(`Build failed: ${error.message}`, 'error');
      process.exit(1);
    }
  }
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];
  const builder = new ChassisBuilder();

  switch (command) {
    case 'site': {
      builder.buildSite();
      break;
    }
    case 'vendor': {
      builder.updateVendorAssets();
      break;
    }
    case 'clean': {
      builder.clean();
      break;
    }
    case 'validate': {
      builder.validateBuild();
      break;
    }
    case 'all':
    default: {
      builder.buildAll();
      break;
    }
  }
}

export default ChassisBuilder;
