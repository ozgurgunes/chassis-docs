// scripts/sync-tokens.js
// Resolves the circular dependency at build time

const fs = require('fs');
const path = require('path');

async function syncTokens() {
  console.log('🔄 Syncing tokens to CSS framework...');
  
  const tokenSource = 'vendor/tokens/dist';
  const cssTarget = 'vendor/css/node_modules/@chassis/tokens/dist';
  
  // Create target directory if it doesn't exist
  fs.mkdirSync(cssTarget, { recursive: true });
  
  // Copy token files
  const copyRecursive = (src, dest) => {
    const stats = fs.statSync(src);
    if (stats.isDirectory()) {
      fs.mkdirSync(dest, { recursive: true });
      fs.readdirSync(src).forEach(file => {
        copyRecursive(path.join(src, file), path.join(dest, file));
      });
    } else {
      fs.copyFileSync(src, dest);
    }
  };
  
  copyRecursive(tokenSource, cssTarget);
  console.log('✅ Tokens synced successfully');
}

if (require.main === module) {
  syncTokens().catch(console.error);
}

module.exports = syncTokens;
