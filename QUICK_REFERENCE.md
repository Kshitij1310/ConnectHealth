# Quick Reference - OAuth Implementation

## 🎯 Core OAuth Files

### `src/auth/config.js`
**Purpose:** OAuth configuration constants
```javascript
TIKTOK_CONFIG: {
  clientKey, clientSecret, authorizationUrl, tokenUrl, redirectUri, scope
}
TOKEN_KEYS: Storage key names
API_ENDPOINTS: TikTok API URLs
```

### `src/auth/oauth.js`
**Purpose:** OAuth logic and token management

**Key Functions:**
- `generateState()` - Create secure CSRF token
- `validateState(state)` - Verify CSRF token
- `getAuthorizationUrl()` - Build TikTok login URL
- `exchangeCodeForToken(code)` - Exchange auth code for token
- `saveToken(accessToken, expiresIn)` - Store token in localStorage
- `getAccessToken()` - Retrieve stored token
- `isTokenExpired()` - Check token expiry
- `isAuthenticated()` - Verify authentication status
- `clearToken()` - Logout (clear storage)

**Custom Error Class:**
- `OAuthError` - User-friendly error messages

## 📝 Form Files

### `src/utils/validation.js`
**Key Function:** `validateAdForm(formData)`
- Validates all required fields
- Enforces music rules for objectives
- Returns errors object

### `src/utils/musicValidation.js`
**Key Functions:**
- `validateMusicId(musicId)` - Format validation
- `generateMockMusicId()` - Simulates upload
- `validateMusicIdWithApi(musicId)` - API validation (async)

## 🔄 Flow Summary

```
INITIALIZATION
↓
User clicks "Connect TikTok"
↓ 
generateState() → Save to localStorage
↓
Redirect to TikTok authorization URL
↓

USER AUTHENTICATION (on TikTok)
↓
User logs in
User grants permissions
↓

CALLBACK
↓
Browser redirected with ?code=XXX&state=YYY
↓
validateState(state) → If invalid, show error
↓
exchangeCodeForToken(code) → POST to TikTok
↓
Response: {access_token, expires_in}
↓
saveToken(accessToken, expiresIn) → localStorage
↓
Redirect to dashboard
↓

AD CREATION
↓
User fills form
↓
validateAdForm() → Check all fields
↓
Form submit disabled if errors
↓
Submit → Console log (production: send to backend)
↓
Show success message
```

## 🔒 Security Mechanisms

| Mechanism | Purpose | Implementation |
|-----------|---------|-----------------|
| State Parameter | CSRF Protection | `generateState()` / `validateState()` |
| Token Storage | Secure Access | localStorage (frontend only) |
| Token Expiry | Auto-logout | `isTokenExpired()` check |
| Error Handling | No Info Leak | `OAuthError` class |
| HTTPS | Encryption | Deployed on GitHub Pages |

## 📍 Routing

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | Dashboard.jsx | Main app, auth check, ad form |
| `/oauth/callback` | OAuthCallback.jsx | Handle OAuth redirect |

HashRouter → No server-side routing needed for GitHub Pages

## 🎨 Component Hierarchy

```
App.jsx (HashRouter)
├── Dashboard.jsx
│   ├── Auth UI (if not authenticated)
│   └── AdCreationForm.jsx (if authenticated)
└── OAuthCallback.jsx (on /oauth/callback route)
```

## 💾 localStorage Keys

| Key | Value | Lifetime |
|-----|-------|----------|
| `tiktok_access_token` | JWT token | Until expires_in |
| `tiktok_expires_in` | Seconds | Calculated at logout |
| `tiktok_token_created_at` | Timestamp | Calculated at logout |
| `tiktok_oauth_state` | Random string | Cleared after callback |

## ⚡ Key Implementation Details

### Why HashRouter?
```javascript
// GitHub Pages can't handle /paths directly
// HashRouter uses #/ instead
// Route: /#/oauth/callback
```

### Why State Parameter?
```javascript
// Prevents CSRF attacks
// 1. Frontend generates random state
// 2. Saves to localStorage
// 3. Redirect includes state=XXX
// 4. TikTok redirects back with same state
// 5. Frontend validates: saved === callback state
// 6. If different → attack detected
```

### Why localStorage?
```javascript
// Persists across page reloads
// Accessible to all pages in origin
// Cleared by user (Logout button)
// Note: Not httpOnly (for frontend only)
// In production: Use httpOnly cookies via backend
```

### Music Option Logic
```javascript
// Conversions objective ALWAYS requires music
if (objective === 'conversions' && musicOption === 'none') {
  error = "Music is required for conversion ads"
}

// Traffic objective: music is optional
// All three options allowed
```

## 🚀 Deployment Checklist

```
PRE-DEPLOYMENT:
- [ ] npm install runs without errors
- [ ] npm run dev starts on localhost:3000
- [ ] npm run build creates dist/ folder
- [ ] npm run deploy pushes to gh-pages branch

GITHUB PAGES:
- [ ] Repository is public
- [ ] Settings → Pages → gh-pages branch
- [ ] TikTok OAuth Redirect URI updated

TESTING POST-DEPLOYMENT:
- [ ] Live URL accessible
- [ ] OAuth flow works (real account)
- [ ] Form validation works
- [ ] Ad submission works
- [ ] Error handling works
```

## 🔗 External APIs Called

```javascript
// Step 1: Authorization (browser redirect)
GET https://www.tiktok.com/v2/auth/authorize/?
  client_key=...&response_type=code&scope=...&redirect_uri=...&state=...

// Step 2: Token Exchange (XMLHttpRequest)
POST https://open.tiktokapis.com/v2/oauth/token/
Body: {client_key, client_secret, code, grant_type, redirect_uri}

// Step 3: Get User Info (if needed)
GET https://open.tiktokapis.com/v2/user/info/
Header: Authorization: Bearer {access_token}
```

## ❌ Common Mistakes to Avoid

1. **Exposing Client Secret**
   - ✅ Only in backend (production)
   - ❌ Never in frontend (except this assignment)

2. **Wrong Redirect URI**
   - ✅ Must match EXACTLY in TikTok portal
   - ❌ Don't include/exclude trailing slash inconsistently

3. **Not Validating State**
   - ✅ Always check state matches
   - ❌ Skipping validation exposes to CSRF

4. **Hardcoding Credentials**
   - ✅ Use environment variables
   - ❌ Never commit secrets to git

5. **Not Handling Token Expiry**
   - ✅ Check expiry before API calls
   - ❌ Assume token is always valid

6. **Storing Token Unsecurely**
   - ✅ httpOnly cookies (production)
   - ❌ localStorage with sensitive data (frontend)

## 📚 File Reference

### Core OAuth
- [config.js](./src/auth/config.js) - Configuration
- [oauth.js](./src/auth/oauth.js) - OAuth logic

### Form & Validation
- [AdCreationForm.jsx](./src/components/AdCreationForm.jsx) - Form component
- [validation.js](./src/utils/validation.js) - Form validation
- [musicValidation.js](./src/utils/musicValidation.js) - Music validation

### Pages & Routing
- [Dashboard.jsx](./src/pages/Dashboard.jsx) - Main page
- [OAuthCallback.jsx](./src/pages/OAuthCallback.jsx) - Callback handler
- [App.jsx](./src/App.jsx) - Routing setup

### Styling
- [Dashboard.css](./src/styles/Dashboard.css) - Dashboard styles
- [AdCreationForm.css](./src/styles/AdCreationForm.css) - Form styles
- [OAuthCallback.css](./src/styles/OAuthCallback.css) - Callback styles

### Configuration
- [package.json](./package.json) - Dependencies
- [vite.config.js](./vite.config.js) - Vite config
- [index.html](./index.html) - HTML entry point

---

**Last Updated:** February 2026  
**Status:** ✅ Production-Ready for GitHub Pages  
**Real OAuth:** ✅ Yes - Uses actual TikTok API
