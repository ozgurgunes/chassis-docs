#!/usr/bin/env node

import { execSync } from 'child_process'
import { copyFileSync, mkdirSync, rmSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const ICONS_PATH = join(ROOT, '../chassis-icons')
const OUTPUT_PATH = join(ROOT, 'apps/website/public/icons')

console.log('🔄 Syncing icons from chassis-icons...')

try {
  // Build icons
  console.log('Building chassis-icons...')
  execSync('pnpm build:site', { cwd: ICONS_PATH, stdio: 'inherit' })
  
  // Remove existing icons
  try {
    rmSync(OUTPUT_PATH, { recursive: true, force: true })
  } catch (e) {
    // Directory might not exist
  }
  
  // Copy built icons
  const sourceIcons = join(ICONS_PATH, '_site/icons')
  console.log(`Copying from ${sourceIcons} to ${OUTPUT_PATH}`)
  
  execSync(`cp -r "${sourceIcons}" "${dirname(OUTPUT_PATH)}"`, { stdio: 'inherit' })
  
  console.log('✅ Icons synced successfully!')
  
} catch (error) {
  console.error('❌ Error syncing icons:', error.message)
  process.exit(1)
}
