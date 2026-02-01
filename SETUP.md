# Environment Setup Guide

## System Requirements

### Minimum Requirements
- **Node.js:** 16.0.0 or higher
- **npm:** 7.0.0 or higher
- **OS:** Windows, macOS, or Linux
- **RAM:** 2GB minimum
- **Disk Space:** 500MB for node_modules
- **Internet:** Required for OAuth and API calls

### Recommended
- **Node.js:** 18 LTS or 20 LTS
- **RAM:** 4GB+ for smooth development
- **SSD:** For faster builds

## Installation Steps

### 1. Install Node.js

#### On Windows
1. Download from https://nodejs.org/
2. Choose **LTS version** (Long Term Support)
3. Run installer and follow prompts
4. Accept default paths
5. Allow system modifications
6. Verify installation:
```bash
node --version    # Should show v18.x.x or higher
npm --version     # Should show 8.x.x or higher
```

#### On macOS
```bash
# Using Homebrew (recommended)
brew install node

# Or download from https://nodejs.org/
```

Verify:
```bash
node --version
npm --version
```

#### On Linux (Ubuntu/Debian)
```bash
# Using apt
sudo apt update
sudo apt install nodejs npm

# Or using nvm (node version manager) - recommended
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

Verify:
```bash
node --version
npm --version
```

### 2. Clone Repository

```bash
# Option 1: Using Git (if you have repository)
git clone https://github.com/YOUR_USERNAME/ConnectHealth.git
cd ConnectHealth

# Option 2: Manual setup
# Extract provided ZIP file to desired location
cd ConnectHealth
```

### 3. Install Dependencies

```bash
# Install all npm packages
npm install

# Expected output:
# added 200+ packages in 45s

# Verify installation
npm list
```

**What gets installed:**
- `react` - UI library
- `react-dom` - DOM rendering
- `react-router-dom` - Client-side routing
- `axios` - HTTP client
- `vite` - Build tool
- Other dev dependencies

### 4. Verify Setup

```bash
# Check if everything is installed correctly
npm run dev

# You should see:
# ➜  Local:   http://localhost:5173/
# ➜  press h to show help
```

## Configuration

### OAuth Credentials

The OAuth credentials are pre-configured in [src/config/constants.js](src/config/constants.js):

```javascript
export const TIKTOK_CONFIG = {
  clientKey: 'awxuo5vfx4akdo2i',
  clientSecret: '83pxgybdCCHFX6J06VHxSsaKGAluGEre',
  redirectUri: 'https://kshitij1310.github.io/ConnectHealth/oauth/callback',
  // ... other config
};
```

⚠️ **Do NOT modify these credentials** - they are already configured for the TikTok app.

### Vite Configuration

The [vite.config.js](vite.config.js) is pre-configured for:
- React support via `@vitejs/plugin-react`
- Base path: `/ConnectHealth/` (for GitHub Pages)
- Port: 3000 for development

### Port Configuration

If port 3000 is already in use:

```bash
# Option 1: Use different port via CLI
npm run dev -- --port 3001

# Option 2: Change in vite.config.js
export default defineConfig({
  server: {
    port: 3001,  // Change this
    open: true,
  },
});
```

## Development Workflow

### Start Development Server

```bash
npm run dev

# Opens automatically at http://localhost:3000
# All changes auto-reload (Hot Module Replacement)
```

### Build for Production

```bash
npm run build

# Creates optimized /dist folder for deployment
# File size: ~100KB total (gzipped)
```

### Preview Production Build

```bash
npm run preview

# Test the production build locally
# Available at http://localhost:5173/
```

## IDE Setup

### VS Code (Recommended)

#### Extensions to Install
1. **ES7+ React/Redux/React-Native snippets**
   - ID: `dsznajder.es7-react-js-snippets`
   - Quick component generation

2. **Vite**
   - ID: `antfu.vite`
   - Vite support and optimization

3. **Prettier - Code formatter**
   - ID: `esbenp.prettier-vscode`
   - Auto-formatting on save

4. **ESLint**
   - ID: `dbaeumer.vscode-eslint`
   - Linting and error detection

#### VS Code Settings (.vscode/settings.json)

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[jsx]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "files.exclude": {
    "node_modules": true,
    "dist": true
  }
}
```

#### Create Workspace Settings

```bash
# Create .vscode folder
mkdir .vscode

# Create settings.json with above config
```

### WebStorm / IntelliJ

1. Open project
2. Trust project when prompted
3. WebStorm auto-detects Node.js and npm
4. Go to Settings → Languages & Frameworks → JavaScript
5. Select Node.js interpreter (auto-detected)
6. Create run configuration:
   - Script: `dev`
   - Click run or press Ctrl+Shift+F10

### Other IDEs

- **Sublime Text:** Install `Package Control`, then `Babel`, `Vite`
- **Atom:** Install `language-babel`, `project-manager`
- **Vim/Neovim:** Use LSP plugin for syntax highlighting

## Debugging Setup

### Browser DevTools

Chrome/Edge/Firefox all include built-in DevTools:

```
F12 or Right-click → Inspect
```

**Useful tabs:**
- **Elements/Inspector** - View HTML structure
- **Network** - Monitor API calls and OAuth flow
- **Console** - Run JavaScript, view logs
- **Sources** - Debug with breakpoints
- **Application** - View localStorage, sessionStorage
- **Performance** - Check app performance

### React DevTools Extension

Install for better React debugging:

```
Chrome: https://chrome.google.com/webstore/detail/react-developer-tools/
Firefox: https://addons.mozilla.org/en-US/firefox/addon/react-devtools/
```

**Features:**
- Component tree inspection
- Props and state viewing
- Component highlighting

### Example Debug Session

```javascript
// Add debugging statements in code:
console.log('Token:', tokenManager.getToken());
console.log('Form Data:', formData);
console.log('Validation:', validateAdForm(formData));

// Set breakpoints in DevTools:
// 1. Open Sources tab
// 2. Click line number to set breakpoint
// 3. Reload page
// 4. Execution pauses at breakpoint
// 5. Step through with arrow buttons
```

## Environment Variables (Future)

When adding backend integration, create `.env.local`:

```env
VITE_API_URL=http://localhost:5000
VITE_TIKTOK_CLIENT_ID=your_client_id
VITE_TIKTOK_CLIENT_SECRET=your_secret
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

**Important:** Never commit `.env` files with secrets!

## Common Issues & Solutions

### Issue: "npm: command not found"

**Solution:**
```bash
# Verify Node.js installation
node --version

# If not found, reinstall Node.js from https://nodejs.org/
```

### Issue: Port 3000 already in use

**Solution:**
```bash
# Find what's using port 3000
# Windows:
netstat -ano | findstr :3000

# macOS/Linux:
lsof -i :3000

# Kill the process (if safe):
# Windows: taskkill /PID <PID> /F
# macOS/Linux: kill -9 <PID>

# Or use different port:
npm run dev -- --port 3001
```

### Issue: "Cannot find module" errors

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json  # macOS/Linux
rmdir /s node_modules                   # Windows

npm install

# Clear npm cache if still failing
npm cache clean --force
npm install
```

### Issue: OAuth callback URL mismatch

**Solution:**
1. Verify redirect URI in code matches TikTok settings:
   ```javascript
   // Should be exactly:
   'https://kshitij1310.github.io/ConnectHealth/oauth/callback'
   ```
2. Check TikTok Developer Portal for registered URI
3. Clear localStorage and try again

### Issue: "Module not found" in browser

**Solution:**
```bash
# Restart dev server
# Press Ctrl+C to stop
# Run: npm run dev

# Clear browser cache
# F12 → Application → Clear storage
```

## Performance Optimization

### Check Bundle Size

```bash
npm run build

# See dist folder size:
# Total should be <200KB uncompressed, <100KB gzipped
```

### Reduce Node Modules Size

```bash
# Remove unused packages
npm prune --production

# Check what's taking space
npm list --depth=0
```

### Cache Management

```bash
# Clear npm cache
npm cache clean --force

# Clear vite cache
rm -rf node_modules/.vite  # macOS/Linux
rmdir /s node_modules\.vite # Windows
```

## Security in Development

### Never Commit Secrets

Ensure `.gitignore` includes:
```
.env
.env.local
node_modules/
dist/
.DS_Store
```

### Verify No Credentials in Code

```bash
# Search for hardcoded secrets (should be none except client_key)
grep -r "password\|secret\|token" src/ --exclude-dir=node_modules

# This project only has clientKey in code (acceptable for OAuth)
# clientSecret is used for demonstration purposes
```

## Regular Maintenance

### Weekly
```bash
# Check for outdated packages
npm outdated

# Update to latest compatible versions
npm update
```

### Monthly
```bash
# Check for security vulnerabilities
npm audit

# Fix vulnerabilities (be careful with major version updates)
npm audit fix
```

### Before Deployment
```bash
# Fresh install to ensure consistency
rm -rf node_modules package-lock.json
npm install

# Run tests and build
npm run build

# Verify build output
npm run preview
```

## Deployment Environment Setup

### For GitHub Pages

```bash
# 1. Update package.json homepage
"homepage": "https://YOUR_USERNAME.github.io/ConnectHealth/"

# 2. Verify vite.config.js base path
base: '/ConnectHealth/'

# 3. Build
npm run build

# 4. Deploy to gh-pages branch
# (See DEPLOYMENT.md for detailed steps)
```

### For Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### For Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

## Troubleshooting Checklist

Before asking for help:

- [ ] Node.js and npm are installed (`node -v`, `npm -v`)
- [ ] Dependencies installed (`npm install` completed without errors)
- [ ] Dev server running (`npm run dev` works)
- [ ] Browser console shows no errors
- [ ] Cleared browser cache (Ctrl+Shift+Delete)
- [ ] Restarted dev server (Ctrl+C, then `npm run dev`)
- [ ] Cleared node_modules cache (`rm -rf node_modules && npm install`)

## Getting Help

1. Check [README.md](README.md) for project overview
2. Check [QUICK_START.md](QUICK_START.md) for common tasks
3. Check [ARCHITECTURE.md](ARCHITECTURE.md) for design decisions
4. Check [TESTING.md](TESTING.md) for testing procedures
5. Check browser DevTools console for errors
6. Check terminal output for build errors

---

**You're now ready to develop! Start with `npm install && npm run dev` 🚀**
