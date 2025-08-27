# Multi-Repo Chassis Deployment Architecture

## 🏗 Architecture Overview

The Chassis Design System uses a **multi-repository architecture** where each component has its own repository and Astro documentation site, but they're unified into a single website through Vercel's proxy routing.

## 🌐 Repository Structure

```
chassis-ui.com (Main Domain)
├── / → chassis-docs (Main hub)
├── /css → chassis-css.vercel.app
├── /assets → chassis-assets.vercel.app  
├── /icons → chassis-icons.vercel.app
├── /tokens → chassis-tokens.vercel.app
└── /figma → chassis-figma.vercel.app
```

## 🚀 Deployment Flow

### Individual Sites
Each repository deploys independently to Vercel:

1. **chassis-docs** → `chassis-docs.vercel.app` (main domain `chassis-ui.com`)
2. **chassis-css** → `chassis-css.vercel.app`
3. **chassis-assets** → `chassis-assets.vercel.app`
4. **chassis-icons** → `chassis-icons.vercel.app`
5. **chassis-tokens** → `chassis-tokens.vercel.app`
6. **chassis-figma** → `chassis-figma.vercel.app`

### Unified Experience
The main site (`chassis-docs`) proxies requests to appropriate subsites based on URL paths.

## 📦 Shared Assets Strategy

### CDN-Based Asset Sharing
```javascript
// Each site can reference shared assets
const SHARED_ASSETS_CDN = 'https://chassis-assets.vercel.app/dist/'

// In any Astro component
<link href=`${SHARED_ASSETS_CDN}chassis.css` rel="stylesheet">
<script src=`${SHARED_ASSETS_CDN}chassis.js`></script>
```

### Font and Icon Sharing
```css
/* Shared font imports */
@import url('https://chassis-assets.vercel.app/fonts/inter.css');
@import url('https://chassis-icons.vercel.app/dist/chassis-icons.css');
```

## 🔧 Configuration Files

### Main Site (chassis-docs/vercel.json)
Handles routing to all subsites via proxy routes.

### Subsite Configuration
Each subsite uses standard Astro build:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ]
}
```

## 🌟 Benefits

✅ **Independent Development**: Each team can work on their docs independently  
✅ **Unified Experience**: Users see one cohesive website  
✅ **Scalable**: Easy to add new subsites  
✅ **Performance**: Each site optimized independently  
✅ **Deployment**: No coordination needed between teams  
✅ **Asset Sharing**: Shared CSS/JS via CDN  

## 🔄 Development Workflow

1. **Local Development**: Each repo develops independently
2. **Staging**: Each repo has staging deployments  
3. **Production**: Automatic proxy routing creates unified experience
4. **Asset Updates**: Assets automatically available to all sites via CDN

## 🛠 Maintenance

- **DNS**: Single domain points to main site
- **SSL**: Managed by Vercel for all sites
- **Monitoring**: Each site monitored independently  
- **Analytics**: Can track across unified domain
