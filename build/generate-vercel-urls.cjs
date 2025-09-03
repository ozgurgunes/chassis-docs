#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Determine environment from Vercel environment variables
// Preview deployments from staging branch should use staging URLs
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

// Define URL mappings
const urlMappings = {
  production: {
    assets: 'https://chassis-assets.vercel.app',
    css: 'https://chassis-css.vercel.app', 
    tokens: 'https://chassis-tokens.vercel.app',
    figma: 'https://chassis-figma.vercel.app',
    icons: 'https://chassis-icons.vercel.app'
  },
  staging: {
    assets: 'https://chassis-assets-staging.vercel.app',
    css: 'https://chassis-css-staging.vercel.app',
    tokens: 'https://chassis-tokens-staging.vercel.app', 
    figma: 'https://chassis-figma-staging.vercel.app',
    icons: 'https://chassis-icons-staging.vercel.app'
  }
};

// Choose the right URL set
const urls = isStaging ? urlMappings.staging : urlMappings.production;

console.log(`📍 Using URLs:`, urls);

// Generate environment-specific vercel.json
const vercelConfig = {
  version: 2,
  buildCommand: "node build/generate-vercel-urls.cjs && pnpm build",
  outputDirectory: "_site",
  rewrites: [
    {
      source: "/docs/assets/:path*",
      destination: `${urls.assets}/:path*`
    },
    {
      source: "/docs/css/:path*", 
      destination: `${urls.css}/:path*`
    },
    {
      source: "/docs/tokens/:path*",
      destination: `${urls.tokens}/:path*`
    },
    {
      source: "/docs/figma/:path*",
      destination: `${urls.figma}/:path*`
    },
    {
      source: "/docs/icons/:path*",
      destination: `${urls.icons}/docs/icons/:path*`
    },
    {
      source: "/assets/icons/:path*", 
      destination: `${urls.icons}/assets/:path*`
    }
  ]
};

// Write the generated config
const configPath = path.join(__dirname, '..', 'vercel.json');
fs.writeFileSync(configPath, JSON.stringify(vercelConfig, null, 2));

console.log(`✅ Generated vercel.json with ${isStaging ? 'staging' : 'production'} URLs`);
