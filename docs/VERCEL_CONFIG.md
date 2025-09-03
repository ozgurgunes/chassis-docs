# Vercel Environment Configuration

This project uses **branch-specific configuration** for environment-based URL rewriting to external resources like assets, CSS, tokens, and icons.

## How it Works

The solution uses **different `vercel.json` files committed to each git branch**:

1. **Staging Branch**: `vercel.json` contains staging URLs (e.g., `chassis-icons-staging.vercel.app`)
2. **Main Branch**: `vercel.json` contains production URLs (e.g., `chassis-icons.vercel.app`)
3. **Vercel Deployment**: Reads the appropriate `vercel.json` directly from each branch

## Branch Configuration

### Staging Branch (`staging`)
- Uses `-staging` suffixed URLs for all external services
- `staging.chassis-ui.com/docs/icons` → `chassis-icons-staging.vercel.app/docs/icons`
- Similar mapping for assets, css, tokens, and figma with `-staging` suffix

### Production Branch (`main`)
- Uses production URLs for all external services
- `chassis-ui.com/docs/icons` → `chassis-icons.vercel.app/docs/icons`
- Similar mapping for all other resources without suffix

## URL Mapping

| Path | Staging Destination | Production Destination |
|------|-------------------|----------------------|
| `/docs/assets/:path*` | `chassis-assets-staging.vercel.app/:path*` | `chassis-assets.vercel.app/:path*` |
| `/docs/css/:path*` | `chassis-css-staging.vercel.app/:path*` | `chassis-css.vercel.app/:path*` |
| `/docs/tokens/:path*` | `chassis-tokens-staging.vercel.app/:path*` | `chassis-tokens.vercel.app/:path*` |
| `/docs/figma/:path*` | `chassis-figma-staging.vercel.app/:path*` | `chassis-figma.vercel.app/:path*` |
| `/docs/icons/:path*` | `chassis-icons-staging.vercel.app/docs/icons/:path*` | `chassis-icons.vercel.app/docs/icons/:path*` |
| `/assets/icons/:path*` | `chassis-icons-staging.vercel.app/assets/:path*` | `chassis-icons.vercel.app/assets/:path*` |

## Development Workflow

### For Staging Changes
1. Work on the `staging` branch
2. Push changes → Automatically deploys with staging URLs
3. Test on `staging.chassis-ui.com`

### For Production Release
1. Merge `staging` branch to `main` 
2. **Important**: Update `vercel.json` on `main` branch to use production URLs
3. Push to `main` → Automatically deploys with production URLs
4. Test on `chassis-ui.com`

## Configuration Files

- `vercel.json` - The active configuration (different per branch)
- `vercel.staging.json` - Template for staging configuration  
- `vercel.production.json` - Template for production configuration
- `build/generate-vercel-urls.cjs` - Helper script (not used in current solution)

## Branch Switching Command

When switching from staging to production (or vice versa), you can use:

```bash
# Switch to staging URLs
cp vercel.staging.json vercel.json

# Switch to production URLs  
cp vercel.production.json vercel.json
```

## Verification

To verify the configuration is working:

```bash
# Test staging routing (should return 401 - means routing works)
curl -I "https://staging.chassis-ui.com/docs/icons"

# Test production routing (should return 401 - means routing works)  
curl -I "https://chassis-ui.com/docs/icons"

# Test direct staging service access
curl -I "https://chassis-icons-staging.vercel.app/docs/icons"

# Test direct production service access
curl -I "https://chassis-icons.vercel.app/docs/icons"
```

## Troubleshooting

If the wrong URLs are being used:

1. **Check Current Branch**: Ensure you're on the correct branch (`staging` vs `main`)
2. **Verify vercel.json**: Check that `vercel.json` contains the expected URLs for your branch
3. **Compare with Templates**: Ensure `vercel.json` matches `vercel.staging.json` or `vercel.production.json`
4. **Test Direct URLs**: Verify the target services are accessible
5. **Check Deployment**: Ensure the latest commit is deployed on Vercel

## Migration Notes

This solution replaced a previous approach that attempted to generate `vercel.json` during build time. The current branch-based approach is more reliable because:

- ✅ Vercel reads `vercel.json` directly from git (no build-time dependencies)
- ✅ Simple and predictable behavior per branch
- ✅ No environment variable detection issues
- ✅ Works consistently across all deployment types
