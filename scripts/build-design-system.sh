#!/bin/bash
# build-design-system.sh
# Script to handle the circular dependency

echo "🏗️  Building Chassis Design System..."

# Step 1: Build tokens first (they don't depend on CSS)
echo "📦 Building tokens..."
cd vendor/tokens
npm run build
cd ../..

# Step 2: Copy tokens to CSS framework
echo "🔄 Syncing tokens to CSS framework..."
mkdir -p vendor/css/tokens/dist
cp -r vendor/tokens/dist/* vendor/css/tokens/dist/

# Step 3: Build CSS framework with tokens
echo "🎨 Building CSS framework..."
cd vendor/css  
npm run build
cd ../..

# Step 4: Copy built assets to public directory
echo "📋 Copying assets to public..."
cp vendor/css/dist/chassis.css apps/website/public/
cp vendor/tokens/dist/assets/web/chassis-docs/* apps/website/public/assets/

echo "✅ Design system build complete!"
