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
const urls = isStaging
  ? {
      ASSETS_URL: 'https://chassis-assets-staging.vercel.app',
      CSS_URL: 'https://chassis-css-staging.vercel.app',
      TOKENS_URL: 'https://chassis-tokens-staging.vercel.app',
      FIGMA_URL: 'https://chassis-figma-staging.vercel.app',
      ICONS_URL: 'https://chassis-icons-staging.vercel.app'
    }
  : {
      ASSETS_URL: 'https://chassis-assets.vercel.app',
      CSS_URL: 'https://chassis-css.vercel.app',
      TOKENS_URL: 'https://chassis-tokens.vercel.app',
      FIGMA_URL: 'https://chassis-figma.vercel.app',
      ICONS_URL: 'https://chassis-icons.vercel.app'
    }

// Read template
const templatePath = path.join(path.dirname(__dirname), 'vercel.template.json')
let template = fs.readFileSync(templatePath, 'utf8')

// Replace placeholders
for (const [key, value] of Object.entries(urls)) {
  const placeholder = `{{${key}}}`
  template = template.replace(new RegExp(placeholder, 'g'), value)
  console.log(`✅ ${key}: ${value}`)
}

// Write vercel.json
const outputPath = path.join(path.dirname(__dirname), 'vercel.json')
fs.writeFileSync(outputPath, template)

console.log('🎉 Generated vercel.json successfully!')
