# GitHub Pages Routing & OAuth Configuration Guide

## Overview

This document explains how the ConnectHealth project is configured for GitHub Pages deployment and how OAuth callback routing works without a backend server.

## Project Deployment URL

```
https://kshitij1310.github.io/ConnectHealth/
```

## The Challenge: GitHub Pages Static Hosting

GitHub Pages is a **static hosting service** that doesn't support server-side routing. Traditional single-page applications (SPAs) that use BrowserRouter fail because:

### Traditional BrowserRouter Problem ❌

```
URL: https://kshitij1310.github.io/ConnectHealth/oauth/callback

GitHub Pages tries to serve: /ConnectHealth/oauth/callback/index.html
Result: 404 Not Found (no such file on GitHub Pages)
```

When you access a URL directly (not via React Router), GitHub Pages looks for a file at that path. Since we're not creating actual HTML files for each route, you get a 404 error.

## The Solution: HashRouter ✅

The ConnectHealth project uses **HashRouter** from React Router v6, which puts all routing information in the URL fragment (after the `#`).

### How HashRouter Works

```
Traditional URL:    https://kshitij1310.github.io/ConnectHealth/oauth/callback
HashRouter URL:     https://kshitij1310.github.io/ConnectHealth/#/oauth/callback
```

**Key advantage:** The `#` tells the browser to stop sending requests to the server. Everything after `#` is processed **client-side by React Router**.

### URL Structure Breakdown

```
https://kshitij1310.github.io/ConnectHealth/#/oauth/callback?code=XXX&state=YYY
                                           ↑                                   
                              Hash Router Starts Here
                              
├─ /ConnectHealth/     → GitHub Pages base path (served from root)
├─ #                   → Fragment identifier (client-side only)
├─ /oauth/callback     → React Router path (handled by React, not server)
└─ ?code=&state=       → Query parameters (same behavior with hash)
```

## How TikTok OAuth Works with HashRouter

### Step-by-Step OAuth Flow

```
1. USER CLICKS "Connect TikTok Account"
   ↓
2. JAVASCRIPT BUILDS OAUTH LINK
   window.location.href = 'https://www.tiktok.com/v2/auth/authorize/?...'
   ↓
3. TIKTOK REDIRECTS BACK TO CALLBACK
   Redirect URI configured in TikTok: 
   https://kshitij1310.github.io/ConnectHealth/oauth/callback
   
4. BUT TIKTOK APPENDS QUERY PARAMS
   Actual redirect:
   https://kshitij1310.github.io/ConnectHealth/oauth/callback?code=XXX&state=YYY
   ↓
5. REACT ROUTER INTERCEPTS
   React Router sees: /#/oauth/callback?code=XXX&state=YYY
   (because we're using HashRouter)
   ↓
6. OAUTHCALLBACK COMPONENT PROCESSES
   Extracts code and state from query parameters
   Exchanges code for access token
   Redirects to /create-ad
```

### Key Configuration Files

#### 1. **vite.config.js** - Base Path Configuration

```javascript
export default defineConfig({
  base: '/ConnectHealth/',  // Must match repository name
  plugins: [react()],
  // ... other config
});
```

**Why it's needed:**
- Vite bundles the app with correct asset paths
- Images, JS, CSS all load from `/ConnectHealth/` base
- Without this, assets would load from root path and fail

#### 2. **src/main.jsx** - HashRouter Setup

```javascript
import { HashRouter as Router } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
```

**Why it works:**
- `HashRouter` tells React Router to use hash-based navigation
- All routes become `/#/route-name`
- Navigation never hits the server, stays client-side

#### 3. **src/config/constants.js** - OAuth Redirect URI

```javascript
export const TIKTOK_CONFIG = {
  clientKey: 'awxuo5vfx4akdo2i',
  redirectUri: 'https://kshitij1310.github.io/ConnectHealth/oauth/callback',
  // ... other config
};
```

**Critical:** The `redirectUri` must exactly match:
1. The URL configured in TikTok Developer Console
2. The repository URL + path on GitHub Pages
3. The React Router path (without `#`, since TikTok adds it as query param)

#### 4. **src/pages/OAuthCallback.jsx** - Callback Handler

```javascript
useEffect(() => {
  // URL format with HashRouter: /#/oauth/callback?code=XXX&state=YYY
  // useSearchParams() correctly extracts query parameters from the hash
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  // Process authentication...
}, [searchParams, navigate]);
```

**How it works:**
- React Router's `useSearchParams()` hook
- Automatically extracts query params (`?code=...&state=...`)
- Works the same whether using BrowserRouter or HashRouter
- Query params stay the same, only the routing changes

#### 5. **src/config/constants.js** - OAuth Configuration

```javascript
export const TIKTOK_CONFIG = {
  clientKey: 'awxuo5vfx4akdo2i',
  clientSecret: '83pxgybdCCHFX6J06VHxSsaKGAluGEre',
  redirectUri: 'https://kshitij1310.github.io/ConnectHealth/oauth/callback',
  authorizationEndpoint: 'https://www.tiktok.com/v2/auth/authorize/',
  tokenEndpoint: 'https://open.tiktokapis.com/v2/oauth/token/',
  scope: 'user.info.basic',
};
```

## No Backend Required - Why It Works

### Traditional OAuth (with backend)

```
1. Browser → Client Secret kept on backend ❌
2. Exchange happens server-to-server
3. Backend validates everything
4. Backend stores tokens
```

### GitHub Pages OAuth (frontend-only)

```
1. Client Key (public) → Used in browser ✅
2. Code exchange happens browser → TikTok directly ✅
3. Browser receives token and stores in localStorage ✅
4. TikTok CORS allows cross-origin requests ✅
```

**Key insight:** The OAuth `clientSecret` is **never used** in this implementation. It's only needed for:
- Backend-based OAuth flows
- Web server architectures

Since we're using the **Authorization Code Flow** on the frontend:
1. Browser requests authorization from TikTok
2. TikTok returns `code` (short-lived, disposable)
3. Browser sends `code` directly to TikTok's token endpoint
4. TikTok validates `code` and returns token
5. No secret needed because `code` is temporary and linked to this browser

## Routing Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│          GitHub Pages (Static Hosting)                  │
│          https://kshitij1310.github.io/ConnectHealth/   │
└─────────────────────────────────────────────────────────┘
                          ↓
                    [index.html loaded]
                          ↓
             HashRouter initializes with React
                          ↓
        ┌───────────────────────────────────┐
        │  Current URL with Hash Routing:   │
        │  /#/route-name?param=value        │
        │                                   │
        │  - Route matching (client-side)   │
        │  - No server requests for routes  │
        │  - Assets load from /ConnectHealth/
        └───────────────────────────────────┘
                          ↓
                    [React Component]
                          ↓
                   [Rendered to DOM]
```

### Route Examples

| Route | HashRouter URL | Path |
|-------|---|---|
| Home | `https://.../#/` | `/` |
| OAuth Callback | `https://.../#/oauth/callback?code=X&state=Y` | `/oauth/callback` |
| Create Ad | `https://.../#/create-ad` | `/create-ad` |
| 404 | `https://.../#/nonexistent` | `/*` (redirects to home) |

## Troubleshooting

### Issue: "404 Not Found" After OAuth Redirect

**Symptoms:**
- You see "404 Not Found" after TikTok redirects you
- URL looks like: `https://kshitij1310.github.io/ConnectHealth/oauth/callback?code=...`

**Cause:** 
- Using `BrowserRouter` instead of `HashRouter`
- Or old `base` path in vite.config.js

**Solution:**
```javascript
// ✅ Correct in src/main.jsx
import { HashRouter as Router } from 'react-router-dom';

// ✅ Correct in vite.config.js
base: '/ConnectHealth/',
```

### Issue: Assets Load 404 (CSS, JS, images)

**Symptoms:**
- Page loads but styling is broken
- Console shows 404 errors for `/style.css`, `/app.js`

**Cause:**
- `base` in vite.config.js doesn't match repository name

**Solution:**
```javascript
// vite.config.js
export default defineConfig({
  base: '/ConnectHealth/',  // Must match exact repo name
});
```

### Issue: OAuth Callback URL Mismatch

**Symptoms:**
- "Invalid redirect_uri" error from TikTok
- Authentication doesn't work

**Cause:**
- `redirectUri` in constants.js doesn't match TikTok Dev Console config
- Typo in domain or repository name

**Solution:**
1. Verify TikTok Developer Console has:
   ```
   Redirect URL: https://kshitij1310.github.io/ConnectHealth/oauth/callback
   ```
2. Verify constants.js has same URL:
   ```javascript
   redirectUri: 'https://kshitij1310.github.io/ConnectHealth/oauth/callback',
   ```

### Issue: Routes Don't Work, Page Refresh Breaks

**Symptoms:**
- Routes work when navigating with links
- Page breaks if you refresh or share URL
- Some routes give 404

**Cause:**
- Using `BrowserRouter` on GitHub Pages
- Server receives `/create-ad` request, has no matching file

**Solution:**
Use `HashRouter` (already configured):
```javascript
import { HashRouter as Router } from 'react-router-dom';
```

Now all routes work with refresh because:
- Browser interprets `/#/create-ad` as client-side navigation
- Server only sees request for `/` (the index.html)
- React Router handles the rest on client

## Performance Considerations

### Advantages of HashRouter on GitHub Pages
✅ Works on static hosting (no backend needed)  
✅ Fast (all routing client-side)  
✅ Works offline after initial load  
✅ Smaller server burden (no route-matching logic needed)  
✅ Works with OAuth 2.0 flow  

### Trade-offs
⚠️ URL includes `#` (less "clean" looking)  
⚠️ URL fragments not always visible in analytics  
⚠️ Slightly larger initial JS bundle (React Router overhead)  

## Production Checklist

- ✅ Vite `base` path set to `/ConnectHealth/`
- ✅ React Router using `HashRouter`
- ✅ OAuth redirect URI points to GitHub Pages URL
- ✅ TikTok Developer Console has matching redirect URI
- ✅ Assets load correctly (check network tab in DevTools)
- ✅ Routes work (including refresh and direct links)
- ✅ OAuth callback processes correctly
- ✅ Tokens stored in localStorage
- ✅ Logout works and clears tokens

## Summary

| Component | Role | GitHub Pages | OAuth |
|-----------|------|--------------|-------|
| **vite.config.js** | Build config | Sets asset base path | ✓ |
| **HashRouter** | Routing | Enables SPA routes | ✓ |
| **constants.js** | Config | OAuth redirect URI | ✓ |
| **OAuthCallback.jsx** | Handler | Processes callback | ✓ |
| **useSearchParams()** | React Hook | Extracts params from URL | ✓ |

The entire system works because:

1. **GitHub Pages serves static files** from `/ConnectHealth/` directory
2. **Vite builds with correct base path** so assets load correctly
3. **HashRouter keeps routing client-side** (never hits server)
4. **Query parameters persist** through hash-based URLs
5. **TikTok redirects to hash-based URL** which React Router can parse

This creates a fully functional OAuth flow without any backend server, perfect for GitHub Pages hosting! 🚀

---

**For more information:**
- [React Router HashRouter Docs](https://reactrouter.com/en/main/router-components/hash-router)
- [Vite Base Path Configuration](https://vitejs.dev/config/shared-options.html#base)
- [GitHub Pages Documentation](https://pages.github.com/)
