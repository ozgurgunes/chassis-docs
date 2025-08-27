# Multi-Environment Deployment Setup

This repository supports automatic deployment to multiple environments based on branch.

## 🌐 **Deployment Environments**

### **Production Environment**
- **Branch**: `main`
- **URL**: `chassis-ui.com`
- **Trigger**: Push to `main` branch

### **Staging Environment**
- **Branch**: `staging`
- **URL**: `staging.chassis-ui.com`
- **Trigger**: Push to `staging` branch

## 🚀 **How it Works**

1. **Single Workflow**: `.github/workflows/deploy.yml` handles both environments
2. **Branch Detection**: Workflow automatically detects which branch is being deployed
3. **Vercel Integration**: Uses Vercel for hosting with automatic domain mapping
4. **Environment Flags**: 
   - `main` branch → `--prod` flag (production deployment)
   - `staging` branch → preview deployment

## 📋 **Setup Requirements**

### **GitHub Secrets**
The following secrets need to be configured in your GitHub repository:

```
VERCEL_TOKEN         # Vercel API token
VERCEL_ORG_ID        # Vercel organization ID  
VERCEL_PROJECT_ID    # Vercel project ID
```

### **Vercel Configuration**
1. Connect your GitHub repository to Vercel
2. Configure custom domains in Vercel dashboard:
   - Production: `chassis-ui.com` → `main` branch
   - Staging: `staging.chassis-ui.com` → `staging` branch

### **DNS Configuration**
Point both domains to Vercel:

```dns
# For chassis-ui.com
CNAME   @   your-vercel-domain.vercel.app

# For staging.chassis-ui.com  
CNAME   staging   your-vercel-domain.vercel.app
```

## 🔄 **Workflow**

### **For Production Releases**
```bash
git checkout main
git merge staging  # or your feature branch
git push origin main
# → Automatically deploys to chassis-ui.com
```

### **For Staging Deployments**
```bash
git checkout staging
git merge feature-branch
git push origin staging  
# → Automatically deploys to staging.chassis-ui.com
```

## 🛠 **Local Development**

```bash
# Install dependencies
cd apps/website
npm install

# Start development server
npm run dev
```

## 📝 **Notes**

- Both environments use the same build process
- Submodules are automatically synced during deployment
- Each environment maintains independent deployment history
- Failed deployments don't affect the other environment
