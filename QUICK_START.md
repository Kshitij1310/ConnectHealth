# Quick Start Guide - ConnectHealth TikTok OAuth App

## 🚀 5-Minute Setup

```bash
# Clone or download the project
cd ConnectHealth

# Install dependencies (one-time)
npm install

# Start development server
npm run dev

# Opens at: http://localhost:3000
```

## 🔐 Test the OAuth Flow

1. **Home Page**
   - Click "Connect TikTok Account"
   - You'll be redirected to TikTok login

2. **TikTok Login**
   - Use your **real TikTok account** (not a mock)
   - Log in if needed
   - Click "Authorize" on the permission screen

3. **OAuth Callback**
   - App exchanges authorization code for access token
   - Token stored in localStorage
   - Auto-redirects to ad form (1.5 seconds)

4. **Create Ad Campaign**
   - Fill out the form fields
   - Test validation by:
     - Leaving fields empty → inline errors
     - Entering short campaign name → error message
     - Trying "No Music" with "Conversions" objective → conditional error
   - Submit to see success message

5. **Logout**
   - Click "Logout" button
   - Token cleared from localStorage
   - Returns to home page

## 📁 Project Structure Quick Reference

```
src/
├── auth/          ← OAuth token management
├── api/           ← TikTok API calls
├── components/    ← Reusable UI components
├── config/        ← OAuth configuration
├── pages/         ← App pages (Home, Callback, CreateAd)
└── utils/         ← Validation functions
```

## 🔑 Key Files

| File | Purpose |
|------|---------|
| `src/auth/oauthFlow.js` | Generates OAuth URLs, state validation, code exchange |
| `src/auth/tokenManager.js` | Token storage and retrieval from localStorage |
| `src/utils/validators.js` | Form field validation logic |
| `src/pages/CreateAd.jsx` | Ad creation form with validation |
| `src/config/constants.js` | OAuth configuration (client key, endpoints) |

## 🧪 Common Testing Scenarios

### Scenario 1: Campaign Name Validation
```
Try entering: "ab" → Error: "Campaign name must be at least 3 characters"
Try entering: "Valid Campaign" → No error
```

### Scenario 2: Music Conditional Logic
```
Objective: Conversions
Music Option: No Music
→ Error: "Music is required when objective is Conversions"

Objective: Traffic
Music Option: No Music
→ No error (allowed)
```

### Scenario 3: Custom Music Upload
```
Music Option: Upload Custom Music
→ Click "Simulate Music Upload" button
→ Shows generated music ID: "music_1738396800000_abc123"
→ Form can be submitted
```

## 🔧 Development Tips

### Check Token Status
```javascript
import tokenManager from './auth/tokenManager';

console.log(tokenManager.getToken());           // Get access token
console.log(tokenManager.isTokenValid());       // Check expiration
console.log(tokenManager.getTimeRemaining());   // Seconds until expiry
console.log(tokenManager.getUser());            // Get user info
```

### Test Validation Manually
```javascript
import { validateAdForm } from './utils/validators';

const formData = {
  campaignName: 'Test',
  objective: 'conversions',
  adText: 'Test ad',
  cta: 'learn_more',
  musicOption: 'none',
  musicId: ''
};

const result = validateAdForm(formData);
console.log(result.valid);   // false
console.log(result.errors);  // { music: "Music is required..." }
```

### Clear All Stored Data
```javascript
import tokenManager from './auth/tokenManager';

// Clear token from localStorage
tokenManager.clearToken();

// Also clear state from sessionStorage if needed
sessionStorage.clear();
```

## 🚨 Error Messages Explained

| Error | Meaning | Fix |
|-------|---------|-----|
| "Authorization code not found" | OAuth callback didn't include code param | Try auth flow again |
| "Security validation failed" | State parameter mismatch | Clear cookies, try again |
| "Your TikTok session expired" | Token expired (after ~3 hours) | Logout and re-authenticate |
| "Campaign name must be at least 3 chars" | Field validation failed | Enter longer name |
| "Music is required when objective is Conversions" | Conditional validation | Select music option |

## 📊 Token Lifecycle

```
User clicks "Connect"
        ↓
Redirects to TikTok OAuth
        ↓
User logs in and authorizes
        ↓
TikTok redirects with code
        ↓
App exchanges code for token (POST to /v2/oauth/token/)
        ↓
Token stored in localStorage
        ↓
Token valid for ~3 hours (expires_in: 10800 seconds)
        ↓
User can create campaigns
        ↓
Token expires or user logs out
        ↓
localStorage cleared
```

## 🛠️ Build Commands

```bash
npm run dev       # Start dev server (port 3000)
npm run build     # Build for production (creates /dist)
npm run preview   # Preview production build locally
```

## 📱 Mobile Testing

```bash
# Get your machine's IP
ipconfig getifaddr en0  # macOS
hostname -I             # Linux

# Start dev server
npm run dev

# On phone, visit:
http://<YOUR_IP>:3000
```

## 🔒 OAuth App Details

- **App Name:** HealthConnect
- **Status:** Production (Live)
- **Client Key:** `awxuo5vfx4akdo2i`
- **Scope:** `user.info.basic`
- **Redirect URL:** `https://kshitij1310.github.io/ConnectHealth/oauth/callback`

## 📝 Making Changes

### Add New Form Field
1. Add to `formData` state in CreateAd.jsx
2. Create validation function in utils/validators.js
3. Add FormField component in JSX
4. Update validateAdForm() to include new field

### Modify OAuth Scope
1. Edit `TIKTOK_CONFIG.scope` in config/constants.js
2. Update TikTok app settings in developer portal
3. Test with fresh OAuth flow

### Change Validation Rules
1. Edit rules in config/constants.js
2. Update validator functions in utils/validators.js
3. Test with form inputs

## 🐛 Debugging

### Enable Verbose Logging
Add to CreateAd.jsx before form submission:
```javascript
console.log('Form Data:', formData);
console.log('Validation Result:', validation);
console.log('Field Errors:', fieldErrors);
```

### Monitor OAuth Flow
1. Open DevTools (F12)
2. Go to Network tab
3. Click "Connect TikTok"
4. Watch requests:
   - `authorize/` → redirect to TikTok
   - `token/` → code exchange (should be POST)
   - Check response contains `access_token`

### Check localStorage
```javascript
// In DevTools console:
localStorage.getItem('tiktok_access_token');
localStorage.getItem('tiktok_expires_in');
localStorage.getItem('tiktok_token_created_at');
```

## 📚 Resources

- [TikTok OAuth Docs](https://developers.tiktok.com/doc/login-kit-web-authorization-code-flow)
- [React Router Docs](https://reactrouter.com/)
- [Vite Docs](https://vitejs.dev/)
- [Project README](./README.md)
- [Deployment Guide](./DEPLOYMENT.md)

## ❓ FAQ

**Q: Can I use a dummy TikTok account?**
A: Yes, create a test account, but it must be a real TikTok account.

**Q: Where is my token stored?**
A: In browser localStorage under keys: `tiktok_access_token`, `tiktok_expires_in`, `tiktok_token_created_at`

**Q: Is the client secret exposed?**
A: Yes, in frontend code. This is acceptable for this assignment due to redirect URI restrictions, but never do this in production.

**Q: Can I run this without internet?**
A: No, OAuth requires TikTok's servers. You need active internet.

**Q: How long is the token valid?**
A: Typically 10800 seconds (~3 hours). Check remaining time in UI.

**Q: Can I skip the OAuth flow and test just the form?**
A: You can bypass the auth check in CreateAd.jsx for development (not recommended).

---

**Ready to build? Start with `npm install && npm run dev` 🚀**
