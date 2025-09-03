#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Determine environment from Vercel environment variables
const isProduction = process.env.VERCEL_ENV === 'production';
const isPreview = process.env.VERCEL_ENV === 'preview';
const branchName = process.env.VERCEL_GIT_COMMIT_REF || '';
const isStaging = branchName.includes('staging') || 
                 process.env.VERCEL_URL?.includes('staging') ||
                 (isPreview && branchName === 'staging');

console.log(`🔧 Setting up URLs for environment:`);
console.log(`   VERCEL_ENV: ${process.env.VERCEL_ENV}`);
console.log(`   VERCEL_GIT_COMMIT_REF: ${process.env.VERCEL_GIT_COMMIT_REF}`);
console.log(`   VERCEL_URL: ${process.env.VERCEL_URL}`);
console.log(`   Is Production: ${isProduction}`);
console.log(`   Is Staging: ${isStaging}`);

// Choose the right config file
const configFile = isStaging ? 'vercel.staging.json' : 'vercel.production.json';
const sourcePath = path.join(__dirname, '..', configFile);
const targetPath = path.join(__dirname, '..', 'vercel.json');

console.log(`📋 Copying ${configFile} to vercel.json`);

// Copy the appropriate config file
fs.copyFileSync(sourcePath, targetPath);

console.log(`✅ Successfully configured for ${isStaging ? 'staging' : 'production'} environment`);
