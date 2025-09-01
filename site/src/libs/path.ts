import path from 'node:path'
import { getConfig } from './config'

// The docs directory path relative to the root of the project.
export const docsDirectory = getConfig().docsDir

export function getDocsRelativePath(docsPath: string) {
  return path.join(docsDirectory, docsPath)
}

export function getChassisAssetsFsPath() {
  return path.join(process.cwd(), 'vendor/assets/dist/web/chassis-docs/')
}

export function getChassisTokensFsPath() {
  return path.join(process.cwd(), 'node_modules/@ozgurgunes/chassis-tokens/dist/tokens/web/chassis-docs')
}

export function getChassisCSSFsPath() {
  return path.join(process.cwd(), 'node_modules/@ozgurgunes/chassis-css/dist')
}

export function getChassisIconsFsPath() {
  return path.join(process.cwd(), 'node_modules/@ozgurgunes/chassis-icons/dist')
}

export function getDocsStaticFsPath() {
  return path.join(getDocsFsPath(), 'src/assets')
}

export function getDocsPublicFsPath() {
  return path.join(getDocsFsPath(), 'public')
}

export function getDocsFsPath() {
  return path.join(process.cwd(), docsDirectory)
}
