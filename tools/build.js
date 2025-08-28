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
    this.appsDir = path.join(rootDir, 'apps');
    this.examplesDir = path.join(rootDir, 'examples');
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
      { path: this.appsDir, name: 'apps' },
      { path: this.examplesDir, name: 'examples' }
    ];

    for (const dir of requiredDirs) {
      if (!fs.existsSync(dir.path)) {
        this.log(`Missing directory: ${dir.name}`, 'warning');
      } else {
        this.log(`Found: ${dir.name}`, 'success');
      }
    }
  }

  buildWebsite() {
    this.log('Building documentation website...', 'build');
    const websiteDir = path.join(this.appsDir, 'website');
    
    if (!fs.existsSync(websiteDir)) {
      throw new Error('Website directory not found');
    }

    // Install dependencies
    this.log('Installing website dependencies...', 'info');
    this.runCommand('npm install', websiteDir);

    // Build website
    this.log('Building website...', 'info');
    this.runCommand('npm run build', websiteDir);
    
    this.log('Website built successfully', 'success');
  }

  buildExamples() {
    this.log('Building all examples...', 'build');
    
    if (!fs.existsSync(this.examplesDir)) {
      this.log('Examples directory not found', 'warning');
      return;
    }

    const examples = fs.readdirSync(this.examplesDir)
      .filter(item => fs.statSync(path.join(this.examplesDir, item)).isDirectory());

    for (const example of examples) {
      this.buildExample(example);
    }
  }

  buildExample(exampleName) {
    this.log(`Building example: ${exampleName}`, 'info');
    const exampleDir = path.join(this.examplesDir, exampleName);
    
    if (!fs.existsSync(exampleDir)) {
      this.log(`Example not found: ${exampleName}`, 'error');
      return;
    }

    const packageJsonPath = path.join(exampleDir, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      // Install dependencies
      this.runCommand('npm install', exampleDir);
      
      // Build example
      this.runCommand('npm run build', exampleDir);
      this.log(`Example built: ${exampleName}`, 'success');
    } else {
      this.log(`No package.json found for: ${exampleName}`, 'warning');
    }
  }

  updateSubmodules() {
    this.log('Updating git submodules...', 'info');
    
    try {
      // First try to initialize submodules
      this.runCommand('git submodule init', '.', true);
      this.runCommand('git submodule update --remote --merge');
      this.log('Submodules updated', 'success');
    } catch (error) {
      this.log('Submodule update failed, trying alternative approach...', 'warning');
      
      // If submodule update fails, try to sync using the sync script
      try {
        this.runCommand('npm run sync:all');
        this.log('Submodules synced via sync script', 'success');
      } catch (syncError) {
        this.log('Both submodule update and sync failed', 'error');
        throw syncError;
      }
    }
  }

  validateBuild() {
    this.log('Validating build...', 'info');
    
    const validationChecks = [
      {
        path: path.join(this.appsDir, 'website', 'dist'),
        name: 'Website build output'
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
      path.join(this.appsDir, 'website', 'dist'),
      path.join(this.appsDir, 'website', 'node_modules'),
      ...this.getExampleBuildPaths()
    ];

    for (const cleanPath of cleanPaths) {
      if (fs.existsSync(cleanPath)) {
        fs.rmSync(cleanPath, { recursive: true, force: true });
        this.log(`Cleaned: ${path.relative(this.rootDir, cleanPath)}`, 'info');
      }
    }
  }

  getExampleBuildPaths() {
    if (!fs.existsSync(this.examplesDir)) return [];
    
    const examples = fs.readdirSync(this.examplesDir)
      .filter(item => fs.statSync(path.join(this.examplesDir, item)).isDirectory());

    const buildPaths = [];
    for (const example of examples) {
      buildPaths.push(
        path.join(this.examplesDir, example, 'dist'),
        path.join(this.examplesDir, example, 'node_modules')
      );
    }
    return buildPaths;
  }

  buildAll() {
    this.log('Starting complete build process...', 'build');
    
    try {
      this.checkDependencies();
      this.updateSubmodules();
      this.buildWebsite();
      this.buildExamples();
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
    case 'website':
      builder.buildWebsite();
      break;
    case 'examples':
      builder.buildExamples();
      break;
    case 'example':
      const exampleName = process.argv[3];
      if (!exampleName) {
        console.error('Please specify example name');
        process.exit(1);
      }
      builder.buildExample(exampleName);
      break;
    case 'clean':
      builder.clean();
      break;
    case 'sync':
      builder.updateSubmodules();
      break;
    case 'validate':
      builder.validateBuild();
      break;
    case 'all':
    default:
      builder.buildAll();
      break;
  }
}

export default ChassisBuilder;
