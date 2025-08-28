#!/usr/bin/env node

import { execSync } from 'child_process'
import { copyFileSync, mkdirSync, rmSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
// Try both submodule and parent directory
const ICONS_PATH = join(ROOT, '../chassis-icons')
const FALLBACK_ICONS_PATH = join(ROOT, 'vendor/icons')
const OUTPUT_PATH = join(ROOT, 'apps/website/public/icons')

console.log('🔄 Syncing icons from chassis-icons...')

try {
  // Try to use the working parent directory first
  let iconsPath = ICONS_PATH
  let sourceIcons = join(ICONS_PATH, '_site/icons')
  
  console.log(`Checking for icons at ${sourceIcons}`)
  try {
    execSync(`ls ${sourceIcons}`, { stdio: 'pipe' })
    console.log('Using pre-built icons from parent directory')
  } catch (e) {
    console.log('No pre-built icons found, trying submodule...')
    iconsPath = FALLBACK_ICONS_PATH
    
    // Install dependencies and build
    console.log('Installing chassis-icons dependencies...')
    execSync('npm install --silent', { cwd: iconsPath })
    
    console.log('Building chassis-icons...')
    execSync('npm run build:site', { cwd: iconsPath })
    
    // Update source path for submodule
    sourceIcons = join(iconsPath, '_site/icons')
  }
  
  // Remove existing icons
  try {
    rmSync(OUTPUT_PATH, { recursive: true, force: true })
  } catch (e) {
    // Directory might not exist
  }
  
  // Copy built icons
  console.log(`Copying from ${sourceIcons} to ${OUTPUT_PATH}`)
  
  execSync(`cp -r "${sourceIcons}" "${dirname(OUTPUT_PATH)}"`, { stdio: 'inherit' })
  
  console.log('✅ Icons synced successfully!')
  
} catch (error) {
  console.error('❌ Error syncing icons:', error.message)
  process.exit(1)
}
