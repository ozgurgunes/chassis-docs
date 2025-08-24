#!/usr/bin/env node

/**
 * Build Examples
 * Builds live examples using different Chassis integrations
 */

import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🏗️  Building Chassis examples...\n');

const examples = [
  {
    name: 'vanilla-html',
    description: 'Pure HTML/CSS example',
    buildCommand: 'npm run build',
    hasPackageJson: true
  },
  {
    name: 'react-app',
    description: 'React integration example',
    buildCommand: 'npm run build',
    hasPackageJson: true
  },
  {
    name: 'vue-app',
    description: 'Vue integration example',
    buildCommand: 'npm run build',
    hasPackageJson: true
  }
];

function runCommand(command, cwd = process.cwd()) {
  try {
    console.log(`Running: ${command} in ${cwd}`);
    execSync(command, { 
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

function buildExample(example) {
  console.log(`\n📦 Building ${example.name} - ${example.description}`);
  
  const examplePath = path.join(process.cwd(), 'examples', example.name);
  
  if (!fs.existsSync(examplePath)) {
    console.log(`⚠️  Example ${example.name} not found at ${examplePath}`);
    return false;
  }
  
  try {
    // Install dependencies if package.json exists
    if (example.hasPackageJson && fs.existsSync(path.join(examplePath, 'package.json'))) {
      console.log(`Installing dependencies for ${example.name}...`);
      runCommand('npm install', examplePath);
    }
    
    // Build the example
    console.log(`Building ${example.name}...`);
    runCommand(example.buildCommand, examplePath);
    
    console.log(`✅ ${example.name} built successfully`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to build ${example.name}:`, error.message);
    return false;
  }
}

function main() {
  const results = {
    successful: [],
    failed: []
  };
  
  // Ensure examples directory exists
  const examplesDir = path.join(process.cwd(), 'examples');
  if (!fs.existsSync(examplesDir)) {
    fs.mkdirSync(examplesDir, { recursive: true });
    console.log('📁 Created examples directory');
  }
  
  // Build each example
  examples.forEach(example => {
    const success = buildExample(example);
    if (success) {
      results.successful.push(example.name);
    } else {
      results.failed.push(example.name);
    }
  });
  
  // Summary
  console.log('\n📊 Build Summary:');
  console.log(`✅ Successful: ${results.successful.length} (${results.successful.join(', ')})`);
  if (results.failed.length > 0) {
    console.log(`❌ Failed: ${results.failed.length} (${results.failed.join(', ')})`);
    process.exit(1);
  }
  
  console.log('\n🎉 All examples built successfully!');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { buildExample, runCommand };
