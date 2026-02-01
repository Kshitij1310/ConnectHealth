# Deployment Guide - GitHub Pages

## Quick Start

### Prerequisites
- Node.js 16+ and npm installed
- GitHub account
- Repository created on GitHub

### Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Test locally
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

## GitHub Pages Deployment

### Option 1: Manual Deployment (Recommended for Learning)

```bash
# 1. Build the project
npm run build

# 2. The build creates a /dist folder

# 3. Push the /dist folder to GitHub Pages
# Create a new branch 'gh-pages' and push dist contents there
git checkout -b gh-pages
git add dist -f
git commit -m "Build for GitHub Pages"
git push origin gh-pages

# 4. Return to main branch
git checkout main
```

### Option 2: Automated Deployment with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### GitHub Settings

1. Go to **Settings > Pages**
2. Set **Source** to "Deploy from a branch"
3. Select branch: **gh-pages**
4. Select folder: **/ (root)**
5. Click **Save**

## Verify Deployment

After deployment:

1. Visit: `https://YOUR_USERNAME.github.io/ConnectHealth/`
2. Click "Connect TikTok Account"
3. Complete the OAuth flow with your TikTok account
4. Create an ad campaign

## Troubleshooting

### Issue: OAuth callback URL shows error

**Solution:** Verify redirect URI is whitelisted in TikTok Developer Portal:
- Expected: `https://YOUR_USERNAME.github.io/ConnectHealth/oauth/callback`
- No trailing slash
- Exact match required

### Issue: Assets not loading (404 errors)

**Solution:** Check `vite.config.js` has correct base path:
```javascript
base: '/ConnectHealth/',  // must match your repository name
```

### Issue: "Cannot GET /ConnectHealth/"

**Solution:** Make sure gh-pages branch has the dist folder contents at root level

### Issue: OAuth state validation fails

**Solution:** 
- Clear browser cache and cookies
- Try in incognito/private window
- Check that sessionStorage isn't being cleared

## Production Deployment

### For AWS S3 + CloudFront

```bash
# 1. Build
npm run build

# 2. Upload dist folder to S3 bucket
aws s3 sync dist/ s3://your-bucket/

# 3. Invalidate CloudFront cache (if using CDN)
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

### For Vercel

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Link to GitHub repository (optional)
vercel --prod
```

### For Netlify

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Login
netlify login

# 3. Deploy
netlify deploy --prod --dir=dist
```

## Environment Considerations

### Important: OAuth Credentials in Frontend

⚠️ **This project stores OAuth credentials in the frontend code:**

```javascript
export const TIKTOK_CONFIG = {
  clientKey: 'awxuo5vfx4akdo2i',
  clientSecret: '83pxgybdCCHFX6J06VHxSsaKGAluGEre', // ← Exposed
};
```

**This is acceptable for this assignment because:**
- Educational/demonstration purpose
- TikTok app is limited to specific redirect URIs
- Client secret can only be used with valid redirect_uri

**For production applications:**
- Never expose client secret to frontend
- Always use backend for token exchange
- Implement server-side session management

## Testing the Deployment

### Test Checklist

- [ ] Home page loads at `https://YOUR_USERNAME.github.io/ConnectHealth/`
- [ ] "Connect TikTok Account" button redirects to TikTok OAuth
- [ ] OAuth callback works and redirects to ad form
- [ ] Token is stored in localStorage
- [ ] Ad form validation works
- [ ] Music selection logic enforces conditions
- [ ] Campaign creation shows success message
- [ ] Logout clears token and returns to home
- [ ] All styles load correctly (no 404s in dev tools)

## Monitoring & Maintenance

### Check Build Status
```bash
# Test build locally before pushing
npm run build
npm run preview
```

### Monitor Token Exchange
Open browser DevTools → Network tab during OAuth flow:
1. Check `authorize/` redirect (302)
2. Check `token/` POST (200 with token)
3. Verify no sensitive data in console logs

### Regular Updates
```bash
# Check for dependency updates
npm outdated

# Update packages
npm update
```

## Rollback

If deployment breaks:

```bash
# Option 1: Revert to previous commit
git revert <commit-hash>
git push origin main

# GitHub Pages will redeploy automatically

# Option 2: Delete gh-pages branch and redeploy
git push origin --delete gh-pages
npm run build
git checkout -b gh-pages
git add dist -f
git commit -m "Rebuild after fix"
git push origin gh-pages
```

## Performance Optimization

### Pre-Deployment Checklist

```bash
# 1. Check bundle size
npm run build
# Look at dist folder size

# 2. Optimize images (if adding images)
# Use tools like ImageOptim or TinyPNG

# 3. Enable compression
# GitHub Pages automatically gzips static assets

# 4. Test on slow network
# DevTools → Network → Throttle to "Slow 3G"
```

### Vite Build Optimization

Already configured in `vite.config.js`:
- Source maps disabled in production
- CSS and JS minified
- Asset optimization

---

**Successfully deployed to GitHub Pages! 🚀**
