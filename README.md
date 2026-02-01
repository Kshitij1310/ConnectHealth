# ConnectHealth - TikTok Ads Management with OAuth 2.0

A **production-ready** React + Vite single-page application demonstrating real TikTok OAuth 2.0 Authorization Code Flow and ad campaign creation with strict validation.

## 🎯 Project Overview

This is a **real-world frontend assignment** for a Frontend Developer Intern role that implements:

- ✅ **Real TikTok OAuth 2.0** Authorization Code Flow (not mocked)
- ✅ Secure access token exchange and storage
- ✅ Ad campaign creation with complex validation logic
- ✅ Conditional field validation based on user selections
- ✅ Human-readable error handling
- ✅ Clean, maintainable code structure
- ✅ GitHub Pages deployment

## 🔐 OAuth Implementation Details

### Real Credentials (Production)
- **App Name:** HealthConnect
- **Client Key:** `awxuo5vfx4akdo2i`
- **OAuth Scope:** `user.info.basic`
- **Environment:** Production (Live)

### OAuth Flow Overview

```
User clicks "Connect TikTok Account"
        ↓
Redirect to TikTok Authorization Endpoint
        ↓
User logs in and authorizes (REAL TikTok account)
        ↓
TikTok redirects to callback URL with authorization code
        ↓
Exchange code for access_token via token endpoint
        ↓
Store token in localStorage
        ↓
Redirect to ad creation form
```

### Key URLs

| URL | Purpose |
|-----|---------|
| `https://www.tiktok.com/v2/auth/authorize/` | TikTok Authorization Endpoint |
| `https://open.tiktokapis.com/v2/oauth/token/` | Token Exchange Endpoint |
| `https://kshitij1310.github.io/ConnectHealth/` | Web App URL |
| `https://kshitij1310.github.io/ConnectHealth/oauth/callback` | Redirect/Callback URL |

## 📋 Features

### 1. Authentication
- Real TikTok OAuth 2.0 Authorization Code Flow
- Secure state parameter validation
- Access token storage in localStorage
- Token expiry tracking
- Clean logout functionality

### 2. Ad Campaign Creation Form

#### Form Fields:
- **Campaign Name** (Required)
  - 3-255 characters
  - Letters, numbers, spaces, hyphens, underscores only
  - Real-time validation feedback

- **Campaign Objective** (Required)
  - Options: Traffic, Conversions
  - Affects music field availability

- **Ad Text** (Required)
  - Max 100 characters
  - Character counter

- **Call-to-Action (CTA)** (Required)
  - Options: Learn More, Shop Now, Sign Up, Download, Contact Us

- **Music Selection** (Required, conditional)
  - **Option A:** Use existing music ID (validate format)
  - **Option B:** Upload custom music (generates mock ID)
  - **Option C:** No music (only available for Traffic objective)

### 3. Validation Rules

#### Strict Validation Logic:
- **Field-level validation:** Inline errors below each field
- **Conditional validation:** Music required for Conversions objective
- **Real-time feedback:** Errors clear as user types
- **Form-level submission:** Submit button disabled until all errors resolved

#### Error Handling:
```javascript
// HTTP Status Codes
401 → "Your TikTok session expired. Please reconnect."
403 → "TikTok Ads API is not available in your region."
400 → "Invalid request. Please check your input and try again."

// OAuth Errors
Missing code → "Authorization code not found. Please try the login flow again."
Invalid state → "Security validation failed. Please try again."

// Network Errors
Connection failed → "Network error. Please check your connection and try again."
```

## 🏗️ Project Structure

```
ConnectHealth/
├── src/
│   ├── auth/
│   │   ├── oauthFlow.js        # OAuth state & code exchange
│   │   └── tokenManager.js     # Token storage & validation
│   ├── api/
│   │   └── tiktokApi.js        # TikTok API calls
│   ├── components/
│   │   ├── ErrorBanner.jsx     # Global error display
│   │   ├── ErrorBanner.css
│   │   ├── FormField.jsx       # Reusable form field
│   │   └── FormField.css
│   ├── config/
│   │   └── constants.js        # OAuth & validation config
│   ├── pages/
│   │   ├── Home.jsx            # Landing & auth entry
│   │   ├── Home.css
│   │   ├── OAuthCallback.jsx   # Callback handler
│   │   ├── OAuthCallback.css
│   │   ├── CreateAd.jsx        # Ad form
│   │   └── CreateAd.css
│   ├── utils/
│   │   └── validators.js       # Form validation functions
│   ├── App.jsx                 # Main router
│   ├── App.css
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── public/
│   ├── terms.html              # Terms of Service
│   └── privacy.html            # Privacy Policy
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/kshitij1310/ConnectHealth.git
cd ConnectHealth

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`

### Building for Production

```bash
# Build for GitHub Pages
npm run build

# Preview production build
npm run preview

# Deploy to GitHub Pages
npm run deploy
```

## ⚙️ Configuration

All OAuth configuration is in [src/config/constants.js](src/config/constants.js):

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

## 🔒 Security Considerations

### Production Recommendations

⚠️ **IMPORTANT:** The token exchange happens on the **frontend** in this implementation. This is for assignment purposes only.

In **production**, follow these best practices:

1. **Backend Token Exchange** (CRITICAL)
   - Never expose client secret to frontend
   - Implement secure backend endpoint to exchange code for token
   - Backend validates state and code before exchange
   - Backend returns token to frontend via HTTP-only cookie or secure session

2. **Token Storage**
   - Use HTTP-only cookies instead of localStorage
   - Implement CSRF protection
   - Set secure and SameSite attributes

3. **API Calls**
   - All API calls to TikTok should go through your backend
   - Backend adds authorization header before proxying to TikTok APIs
   - Frontend never handles sensitive tokens directly

### Current Frontend-Only Implementation

For this assignment, the frontend directly:
1. Generates OAuth authorization URL
2. Handles OAuth callback with state validation
3. Exchanges code for token via `/v2/oauth/token/` endpoint
4. Stores token in `localStorage`

**Why this is acceptable for assignment but not production:**
- Educational/demonstration purpose
- No sensitive data in the app (except demonstration)
- Simplified OAuth flow without backend complexity
- GitHub Pages restrictions (no backend available)

## 📱 Usage Flow

### Step 1: Home Page
- User sees "Connect TikTok Account" button
- Click triggers OAuth authorization URL
- Redirects to TikTok login

### Step 2: TikTok Authorization
- User logs in with **real TikTok account** (if not already logged in)
- Authorizes app to access `user.info.basic` scope
- TikTok redirects back to callback URL with authorization code

### Step 3: OAuth Callback
- App extracts authorization code from URL
- Validates state parameter for security
- Exchanges code for access token
- Stores token in localStorage
- Redirects to ad creation form

### Step 4: Create Ad Campaign
- User fills out campaign details
- Real-time validation provides feedback
- Conditional logic enforces music requirement for Conversions
- Submit creates campaign (simulated API call)
- Success message confirms creation

### Step 5: Logout
- Click "Logout" button
- Token cleared from localStorage
- Redirected to home page

## 🧪 Testing the OAuth Flow

### Test Scenario 1: Successful Authentication
1. Open http://localhost:3000 (or GitHub Pages URL)
2. Click "Connect TikTok Account"
3. Log in with real TikTok account
4. Click authorize on TikTok
5. App exchanges code and redirects to ad form

### Test Scenario 2: Ad Creation with Music
1. Create campaign with Conversions objective
2. Attempting "No Music" shows validation error
3. Select music option and try again
4. Success message appears

### Test Scenario 3: Error Handling
1. Try submitting form with empty fields → Shows inline errors
2. Enter invalid campaign name → Real-time error message
3. Try "No Music" with Conversions objective → Conditional error

## 📊 Validation Examples

### Campaign Name Validation
```javascript
// Valid: "Q1 Spring Launch"
// Valid: "Campaign-2025-Health"
// Invalid: "ab" (too short)
// Invalid: "Campaign@123" (special char)
```

### Ad Text Validation
```javascript
// Valid: "Get fit with ConnectHealth!"
// Invalid: (over 100 chars)
```

### Music Validation
```javascript
// Option A: "music_abc123" (valid format)
// Option B: Generate mock ID "music_1738396800000_a1b2c3"
// Option C: No music (only if Traffic objective)
```

## 🔗 API Endpoints Used

### TikTok OAuth Endpoints
```
GET https://www.tiktok.com/v2/auth/authorize/
  Query params: client_key, response_type, scope, redirect_uri, state

POST https://open.tiktokapis.com/v2/oauth/token/
  Body: client_key, client_secret, code, grant_type, redirect_uri
  Response: { access_token, expires_in, token_type }

GET https://open.tiktokapis.com/v2/user/info/
  Headers: Authorization: Bearer {access_token}
  Query: fields=open_id,union_id,avatar_url,display_name
```

## 🎨 Design Principles

- **Minimal but clean UI** – Focus on functionality over aesthetics
- **User-friendly errors** – No raw API JSON shown to users
- **Clear validation** – Inline errors with helpful guidance
- **Responsive design** – Works on desktop and mobile
- **Accessibility** – Semantic HTML, proper labels, keyboard navigation

## 📝 Code Examples

### Check Token Validity
```javascript
import tokenManager from './auth/tokenManager';

if (tokenManager.isTokenValid()) {
  // User can proceed
}
```

### Validate Ad Form
```javascript
import { validateAdForm } from './utils/validators';

const validation = validateAdForm(formData);
if (!validation.valid) {
  setFieldErrors(validation.errors);
}
```

### Handle OAuth Callback
```javascript
import { exchangeCodeForToken } from './auth/oauthFlow';

const tokenData = await exchangeCodeForToken(code);
tokenManager.storeToken(tokenData.accessToken, tokenData.expiresIn);
```

## 🐛 Troubleshooting

### "Authorization code not found"
- Check that callback URL is whitelisted in TikTok Developer Portal
- Verify redirect_uri matches exactly in OAuth config

### "Security validation failed"
- State parameter mismatch
- Browser sessionStorage cleared between pages
- Ensure HashRouter is being used (GitHub Pages compatible)

### Token expired
- Access tokens have limited lifetime (typically 10800 seconds)
- Click "Logout" and re-authenticate
- App shows remaining token time on ad creation page

### CORS errors
- This assignment uses frontend-only token exchange
- In production, all TikTok API calls should go through backend proxy

## 📚 Resources

- [TikTok OAuth 2.0 Documentation](https://developers.tiktok.com/doc/login-kit-web-authorization-code-flow)
- [TikTok Ads Manager API](https://developers.tiktok.com/doc/ads-manager-api)
- [React Router v6 Documentation](https://reactrouter.com/)
- [Vite Documentation](https://vitejs.dev/)

## 📄 Files Explanation

### Authentication Files
- **oauthFlow.js** – Generates authorization URL, handles state, exchanges code
- **tokenManager.js** – Manages token lifecycle (store, retrieve, validate, clear)

### API Files
- **tiktokApi.js** – User info fetching, music validation, error handling

### Validation Files
- **validators.js** – Campaign, text, music, and form-level validation

### Components
- **ErrorBanner** – Global error notifications
- **FormField** – Reusable form field with error display

### Pages
- **Home** – Landing page, OAuth entry point
- **OAuthCallback** – OAuth callback handler, token exchange
- **CreateAd** – Ad campaign creation form with validation

## 🎓 Learning Outcomes

This assignment demonstrates:
1. **Real OAuth 2.0 integration** (not mocked)
2. **Secure token handling** (state validation, proper storage)
3. **Form validation** (field-level, conditional, real-time)
4. **Error handling** (user-friendly messages, proper HTTP status codes)
5. **Component architecture** (reusable, composable, maintainable)
6. **React hooks** (useState, useEffect, useNavigate)
7. **Router-based SPA** (HashRouter for GitHub Pages)
8. **API integration** (fetch, async/await, error boundaries)

## 📦 Tech Stack

- **React 18** – UI library
- **Vite 5** – Build tool & dev server
- **React Router v6** – Client-side routing
- **Axios** – HTTP client
- **Vanilla CSS** – Styling (no dependencies)
- **GitHub Pages** – Hosting

## 🚀 Deployment

### GitHub Pages Setup

This project is fully configured for GitHub Pages deployment with proper routing for OAuth callbacks.

#### Why HashRouter + Vite Base Path?

GitHub Pages is **static hosting** and doesn't support server-side routing. Traditional SPA routing fails because:

```
❌ Problem:
   URL: /ConnectHealth/oauth/callback
   GitHub Pages looks for: /ConnectHealth/oauth/callback/index.html
   Result: 404 Not Found

✅ Solution (HashRouter):
   URL: /ConnectHealth/#/oauth/callback
   GitHub Pages serves: /ConnectHealth/index.html (loaded once)
   React Router handles routing client-side after hash
```

#### Configuration

1. **vite.config.js** - Vite base path correctly set:
   ```javascript
   base: '/ConnectHealth/',  // Must match repository name
   ```

2. **src/main.jsx** - React Router using HashRouter:
   ```javascript
   import { HashRouter as Router } from 'react-router-dom';
   ```

3. **src/config/constants.js** - OAuth redirect configured:
   ```javascript
   redirectUri: 'https://kshitij1310.github.io/ConnectHealth/oauth/callback',
   ```

#### How OAuth Works on GitHub Pages

```
User clicks Login → TikTok Auth → TikTok Redirects to:
https://kshitij1310.github.io/ConnectHealth/oauth/callback?code=XXX&state=YYY

What actually loads:
https://kshitij1310.github.io/ConnectHealth/
                                        ↑ (GitHub Pages serves this)

React Router sees URL with hash:
/#/oauth/callback?code=XXX&state=YYY
(Browser keeps query params even with hash routing)

OAuthCallback component:
- Extracts code and state from query parameters
- Exchanges code for access token
- Stores token in localStorage
- Redirects to /create-ad
```

**Key insight:** No backend needed! Everything happens client-side. The `code` parameter is temporary and verified directly with TikTok's servers.

For detailed routing documentation, see [GITHUB_PAGES_ROUTING.md](GITHUB_PAGES_ROUTING.md).

### Building & Deploying

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to GitHub Pages:**
   ```bash
   npm run deploy
   ```

   Or manually push the `dist/` folder to your GitHub Pages branch.

### Live URL
**https://kshitij1310.github.io/ConnectHealth/**

## 📞 Support

For questions about the OAuth flow, validation logic, or GitHub Pages routing, refer to:
- [OAuth Flow Implementation](src/auth/oauthFlow.js)
- [Form Validation](src/utils/validators.js)
- [Token Management](src/auth/tokenManager.js)
- [GitHub Pages Routing Guide](GITHUB_PAGES_ROUTING.md) – Comprehensive explanation of HashRouter + GitHub Pages integration

## 📄 License

This project is provided as-is for educational and assignment purposes.

---

**Built with ❤️ as a real-world frontend assignment demonstrating production-quality code practices.**
