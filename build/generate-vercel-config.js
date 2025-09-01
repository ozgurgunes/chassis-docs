#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Determine if we're in staging or production
const isStaging = process.env.VERCEL_GIT_COMMIT_REF === 'staging' ||
  process.env.NODE_ENV === 'staging' ||
  process.env.VERCEL_ENV === 'preview'

console.log(`🔧 Generating vercel.json for ${isStaging ? 'STAGING' : 'PRODUCTION'} environment`)

// Define URLs based on environment
const urls = isStaging ?
  {
    ASSETS_URL: 'https://chassis-assets-staging.vercel.app',
    CSS_URL: 'https://chassis-css-staging.vercel.app',
    TOKENS_URL: 'https://chassis-tokens-staging.vercel.app',
    FIGMA_URL: 'https://chassis-figma-staging.vercel.app',
    ICONS_URL: 'https://chassis-icons-staging.vercel.app'
  } :
  {
    ASSETS_URL: 'https://chassis-assets.vercel.app',
    CSS_URL: 'https://chassis-css.vercel.app',
    TOKENS_URL: 'https://chassis-tokens.vercel.app',
    FIGMA_URL: 'https://chassis-figma.vercel.app',
    ICONS_URL: 'https://chassis-icons.vercel.app'
  }

// Read current vercel.json
const configPath = path.join(path.dirname(__dirname), 'vercel.json')
let config = fs.readFileSync(configPath, 'utf8')

// First restore all placeholders by reversing any existing URLs
const allUrls = {
  'https://chassis-assets-staging.vercel.app': '{{ASSETS_URL}}',
  'https://chassis-assets.vercel.app': '{{ASSETS_URL}}',
  'https://chassis-css-staging.vercel.app': '{{CSS_URL}}',
  'https://chassis-css.vercel.app': '{{CSS_URL}}',
  'https://chassis-tokens-staging.vercel.app': '{{TOKENS_URL}}',
  'https://chassis-tokens.vercel.app': '{{TOKENS_URL}}',
  'https://chassis-figma-staging.vercel.app': '{{FIGMA_URL}}',
  'https://chassis-figma.vercel.app': '{{FIGMA_URL}}',
  'https://chassis-icons-staging.vercel.app': '{{ICONS_URL}}',
  'https://chassis-icons.vercel.app': '{{ICONS_URL}}'
}

// Restore placeholders
for (const [url, placeholder] of Object.entries(allUrls)) {
  config = config.replace(new RegExp(url.replace(/[$()*+.?[\\\]^{|}]/g, '\\$&'), 'g'), placeholder)
}

// Replace placeholders with environment-specific URLs
for (const [key, value] of Object.entries(urls)) {
  const placeholder = `{{${key}}}`
  config = config.replace(new RegExp(placeholder, 'g'), value)
  console.log(`✅ ${key}: ${value}`)
}

// Write back to vercel.json
fs.writeFileSync(configPath, config)

console.log('🎉 Generated vercel.json successfully!')
