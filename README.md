# TikTok Ads OAuth Integration - HealthConnect

A production-grade React + Vite single-page application demonstrating **REAL TikTok OAuth 2.0 Authorization Code Flow** with a complete ad creation workflow.

## 🎯 Live Demo

**App URL:** https://kshitij1310.github.io/ConnectHealth/

**Redirect URI:** https://kshitij1310.github.io/ConnectHealth/oauth/callback

## ✨ Features

### 1. Real TikTok OAuth Implementation
- ✅ **Authorization Code Flow** (most secure OAuth grant type)
- ✅ **CSRF Protection** via state parameter validation
- ✅ **Secure Token Storage** in localStorage
- ✅ **Real API Integration** with TikTok's OAuth endpoints
- ✅ **User-Friendly Error Handling** for all OAuth failures

### 2. Ad Creation Workflow
- 📝 **Campaign Name** - 3+ characters required
- 🎯 **Objective Selection** - Traffic or Conversions
- 📢 **Ad Text** - Max 100 characters with live counter
- 🔔 **Call-to-Action** - Pre-defined options
- 🎵 **Music Selection** (Critical Logic)
  - Option A: Existing Music ID with validation
  - Option B: Custom Music Upload (simulated)
  - Option C: No Music (Traffic-only)
  - **Enforcement:** Conversions MUST have music

### 3. Validation & UX
- ⚠️ Inline field-level errors
- 🚨 Global error banners
- ✅ Real-time validation feedback
- 🔒 Conditional music rules enforced
- ⏸️ Submit button disabled until form valid

### 4. Security & Best Practices
- 🔐 State parameter for CSRF prevention
- 📦 Minimal dependency footprint
- 🏗️ Clean separation of concerns
- 📝 Clear, readable code with comments
- ⚠️ Production-ready error handling

## 🏗️ Project Structure

```
src/
├── auth/
│   ├── config.js           # OAuth configuration (credentials, endpoints)
│   └── oauth.js            # Core OAuth logic, token management
├── api/
│   └── tiktokApi.js        # API request helpers
├── utils/
│   ├── validation.js       # Form validation logic
│   └── musicValidation.js  # Music ID validation & mocking
├── components/
│   └── AdCreationForm.jsx  # Ad form component
├── pages/
│   ├── Dashboard.jsx       # Main app page
│   └── OAuthCallback.jsx   # OAuth callback handler
├── styles/
│   ├── index.css
│   ├── Dashboard.css
│   ├── OAuthCallback.css
│   └── AdCreationForm.css
├── App.jsx                 # Main app with routing
└── main.jsx                # React entry point
```

## 🔐 OAuth Flow Explained

### Step 1: User Initiates Login
```
User clicks "Connect TikTok Ads Account"
↓
Generates random state parameter
```

### Step 2: Authorization Request
```
User redirected to:
https://www.tiktok.com/v2/auth/authorize/?
  client_key=awxuo5vfx4akdo2i&
  response_type=code&
  scope=user.info.basic&
  redirect_uri=https://kshitij1310.github.io/ConnectHealth/oauth/callback&
  state=<random-secure-string>
```

### Step 3: User Authenticates
```
User logs in with real TikTok account
User grants permission to access basic info
TikTok redirects to callback URL with authorization code
```

### Step 4: Authorization Code Callback
```
Browser redirected to:
https://kshitij1310.github.io/ConnectHealth/oauth/callback?
  code=<authorization_code>&
  state=<same-state-from-step-1>
```

### Step 5: Token Exchange
```
Frontend exchanges code for access_token:
POST https://open.tiktokapis.com/v2/oauth/token/
Body:
  {
    "client_key": "awxuo5vfx4akdo2i",
    "client_secret": "83pxgybdCCHFX6J06VHxSsaKGAluGEre",
    "code": "<authorization_code>",
    "grant_type": "authorization_code",
    "redirect_uri": "https://kshitij1310.github.io/ConnectHealth/oauth/callback"
  }
```

### Step 6: Token Storage
```
Response includes:
{
  "access_token": "<actual_token>",
  "expires_in": 86400,
  "token_type": "Bearer"
}

Stored in localStorage with timestamp
```

## ⚠️ PRODUCTION SECURITY NOTES

### Why Frontend Token Exchange?
This assignment demonstrates OAuth with **frontend-only token exchange** due to:
- **Constraint:** No backend allowed (GitHub Pages only)
- **Security Impact:** Client secret is exposed in frontend code
- **Duration:** Assignment scope only

### Production Implementation
In a real application, follow this pattern:

```
FRONTEND:
1. User clicks "Login"
2. Redirect to: /v2/auth/authorize/?client_key=...&redirect_uri=...

CALLBACK:
3. Browser receives: ?code=XXX&state=YYY

BACKEND (SECURE):
4. Backend exchanges code for token (never expose client_secret to frontend)
5. Backend securely stores token
6. Backend returns session cookie to frontend
7. Frontend only receives httpOnly, Secure cookie

API CALLS:
8. Frontend calls backend with cookie
9. Backend calls TikTok API with stored token
```

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

### Environment Setup
No `.env` file needed - OAuth credentials are hardcoded for this assignment.

**Important:** Replace credentials before deploying to production!

## 🧪 Testing the OAuth Flow

### Test Account Requirements
- Real TikTok account (email/phone verified)
- Account must be creator-enabled for ads access
- Recommended: Use a test account with ads API access

### Testing Steps

1. **Start the app:**
   ```bash
   npm run dev
   ```

2. **Click "Connect TikTok Ads Account"**
   - Should redirect to TikTok's OAuth page

3. **Log in with real TikTok credentials**
   - Use a verified TikTok account

4. **Grant permissions**
   - Approve access to basic account info

5. **Callback handling**
   - Should redirect back to dashboard
   - Should display "TikTok Account Connected" message
   - Token should be stored in localStorage

6. **Create an ad campaign**
   - Fill in campaign name (3+ chars)
   - Select objective (Traffic/Conversions)
   - Enter ad text (max 100 chars)
   - Choose music option:
     - Try existing ID: `6922529837349149190`
     - Try custom upload
     - Try no music (only with Traffic objective)
   - Submit and verify validation

### Validation Testing

**Form Validation Rules:**
- Campaign Name: Required, min 3 characters
- Objective: Traffic or Conversions
- Ad Text: Required, max 100 characters
- CTA: Required
- Music (Conversions): **REQUIRED** - cannot select "No Music"
- Music (Traffic): Optional - all options allowed

**Error Scenarios:**
- Invalid music ID starting with `0` will be rejected by API
- Missing required fields show inline errors
- System errors display in global banner

## 📦 Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "vite": "^5.0.0"
}
```

## 🔑 Credentials (For Reference Only)

```javascript
// auth/config.js
{
  clientKey: "awxuo5vfx4akdo2i",
  clientSecret: "83pxgybdCCHFX6J06VHxSsaKGAluGEre",
  authorizationUrl: "https://www.tiktok.com/v2/auth/authorize/",
  tokenUrl: "https://open.tiktokapis.com/v2/oauth/token/",
}
```

⚠️ **These are real credentials - protect in production!**

## 📡 API Endpoints Used

| Endpoint | Purpose | Method |
|----------|---------|--------|
| `https://www.tiktok.com/v2/auth/authorize/` | OAuth authorization | GET |
| `https://open.tiktokapis.com/v2/oauth/token/` | Token exchange | POST |
| `https://open.tiktokapis.com/v2/user/info/` | Get user info | GET |

## 🎨 UI/UX Features

### Responsive Design
- Mobile-optimized (375px+)
- Tablet-friendly layout
- Desktop polish

### Color Scheme
- **Primary:** TikTok Cyan (#25f4ee)
- **Dark Primary:** #00b4a6
- **Error:** #ff2d55
- **Success:** #31a24c

### Accessibility
- Semantic HTML
- Clear error messaging
- Disabled states for invalid forms
- Keyboard navigation support

## 🐛 Error Handling

### OAuth Errors
```javascript
401 → "Your TikTok session expired. Please reconnect."
403 → "TikTok Ads API is not available in your region."
400 → "Invalid request. Please try again."
500 → "Failed to authenticate with TikTok. Please try again."
```

### Form Validation Errors
```
- Campaign Name: "Campaign name must be at least 3 characters"
- Ad Text: "Ad text must be 100 characters or less"
- Music: "Music is required for conversion ads"
- Music ID: "Music ID must contain only numbers"
```

## 📊 Code Quality

- ✅ JSDoc comments on all functions
- ✅ Clear variable naming
- ✅ Modular component structure
- ✅ Error boundary handling
- ✅ Consistent code formatting

## 🚀 Deployment

### GitHub Pages Deployment

1. **Update package.json:**
   ```json
   "homepage": "https://your-username.github.io/your-repo-name/",
   ```

2. **Build and deploy:**
   ```bash
   npm run build
   npm run deploy
   ```

3. **Configure redirect URI:**
   - TikTok Developer Console
   - OAuth Redirect URI: `https://your-username.github.io/your-repo-name/oauth/callback`

### HashRouter for GitHub Pages
The app uses `HashRouter` for GitHub Pages routing:
- Routes: `/#/` (home), `/#/oauth/callback`
- No server-side configuration needed
- Works on static hosting

## 📚 References

- [TikTok OAuth Documentation](https://developer.tiktok.com/doc/login-kit-oas-app-authorization-flow)
- [OAuth 2.0 Authorization Code Flow](https://datatracker.ietf.org/doc/html/rfc6749#section-1.3.1)
- [CSRF Protection with State Parameter](https://tools.ietf.org/html/draft-ietf-oauth-security-topics#section-3.1)

## ⚖️ Legal & Terms

- See [Terms of Service](/ConnectHealth/terms.html)
- See [Privacy Policy](/ConnectHealth/privacy.html)

## 🤝 Contributing

This is an assignment project. Modifications for educational use are welcome.

## 📝 License

Educational use only. TikTok OAuth credentials are tied to a specific app and must not be reused.

---

**Built with:** React 18 + Vite 5 + React Router 6  
**Last Updated:** February 2026  
**Status:** ✅ Production-Ready (Assignment Scope)
