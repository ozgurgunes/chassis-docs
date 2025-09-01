#!/usr/bin/env node

/**
 * Pre-commit script to generate the correct vercel.json for the current branch
 * Usage: node scripts/prepare-deploy.js
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { execSync } from 'node:child_process'
import process from 'node:process'

// Get current branch
function getCurrentBranch() {
  try {
    const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim()
    return branch
  } catch (error) {
    console.error('❌ Error getting current branch:', error.message)
    process.exit(1)
  }
}

// Determine environment based on branch
function getEnvironment(branch) {
  if (branch === 'staging') {
    return 'staging'
  }
  if (branch === 'main' || branch === 'master') {
    return 'production'
  }
  console.log(`🔧 Unknown branch "${branch}", defaulting to production environment`)
  return 'production'
}

// Get URLs for environment
function getUrls(environment) {
  return environment === 'staging' 
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
}

function main() {
  console.log('🚀 Preparing deployment configuration...')
  
  const branch = getCurrentBranch()
  const environment = getEnvironment(branch)
  
  console.log(`📋 Current branch: ${branch}`)
  console.log(`🌍 Environment: ${environment.toUpperCase()}`)
  
  // Check if template exists
  const templatePath = 'vercel.template.json'
  if (!existsSync(templatePath)) {
    console.error(`❌ Template file ${templatePath} not found`)
    process.exit(1)
  }
  
  // Read template
  const template = readFileSync(templatePath, 'utf8')
  
  // Get URLs for environment
  const urls = getUrls(environment)
  
  // Replace placeholders
  let config = template
  Object.entries(urls).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`
    config = config.replace(new RegExp(placeholder, 'g'), value)
    console.log(`✅ ${key}: ${value}`)
  })
  
  // Write vercel.json
  writeFileSync('vercel.json', config)
  console.log('🎉 Generated vercel.json successfully!')
  
  // Show a reminder about committing
  console.log('')
  console.log('💡 Remember to commit the updated vercel.json:')
  console.log('   git add vercel.json')
  console.log(`   git commit -m "Update vercel.json for ${environment} deployment"`)
}

main()
