# Architecture & Design Decisions

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    ConnectHealth App                         │
│                   (React + Vite SPA)                        │
└─────────────────────────────────────────────────────────────┘
         │                                      │
         ├──────────────────────────┬───────────┤
         │                          │           │
    ┌────▼────┐            ┌────────▼─┐   ┌────▼─────┐
    │ Browser │            │ TikTok   │   │ localStorage
    │ History │            │ OAuth    │   │ (tokens)
    │ API     │            │ Servers  │   │
    └────┬────┘            └────────┬─┘   └────┬─────┘
         │                          │           │
         └──────────────────────────┴───────────┘
```

## OAuth 2.0 Authorization Code Flow

### Why This Flow?

**Authorization Code Flow** (not Implicit or Device Flow) was chosen because:
- ✅ Most secure OAuth flow
- ✅ Allows secret exchange on backend (production)
- ✅ Industry standard for web applications
- ✅ Supports refresh tokens (future enhancement)
- ✅ Not deprecated (unlike Implicit flow)

### Flow Diagram

```
1. User clicks "Connect TikTok"
   ↓
2. App generates random state string
   ↓
3. Redirect to: https://www.tiktok.com/v2/auth/authorize/
   Query: client_key, response_type=code, scope, redirect_uri, state
   ↓
4. User logs in & authorizes on TikTok
   ↓
5. TikTok redirects to: /oauth/callback?code=XXXXX&state=YYYYY
   ↓
6. App validates state parameter
   ↓
7. App POSTs code to: https://open.tiktokapis.com/v2/oauth/token/
   Body: client_key, client_secret, code, grant_type, redirect_uri
   ↓
8. TikTok returns: { access_token, expires_in, token_type }
   ↓
9. App stores token in localStorage
   ↓
10. User redirected to ad creation form
```

## Component Architecture

### Layered Architecture

```
┌─────────────────────────────────────────┐
│         Pages (User Interactions)       │
│   Home.jsx, OAuthCallback.jsx, CreateAd│
└────────────────┬──────────────────────┘
                 │
┌─────────────────▼──────────────────────┐
│      Components (Reusable UI)          │
│   ErrorBanner, FormField, etc          │
└────────────────┬──────────────────────┘
                 │
┌─────────────────▼──────────────────────┐
│         Business Logic Layer           │
│  validators.js, tokenManager.js        │
└────────────────┬──────────────────────┘
                 │
┌─────────────────▼──────────────────────┐
│        API & Config Layer              │
│  oauthFlow.js, tiktokApi.js, constants │
└────────────────┬──────────────────────┘
                 │
┌─────────────────▼──────────────────────┐
│     External Services (TikTok)         │
│    OAuth & Ads APIs (HTTPS)            │
└─────────────────────────────────────────┘
```

## File Organization Rationale

### `/src/auth/` - Authentication
- **Separation of Concerns:** OAuth logic isolated from UI
- **Reusability:** Can be used across different pages
- **Testability:** Easy to unit test token management

**Files:**
- `oauthFlow.js` - Authorization & token exchange logic
- `tokenManager.js` - Token lifecycle management

### `/src/api/` - External API Calls
- **Centralized:** All API calls in one place
- **Error Handling:** Consistent error handling patterns
- **Future:** Easy to add request/response interceptors

**Files:**
- `tiktokApi.js` - TikTok user info & validation

### `/src/components/` - Reusable UI Components
- **Composability:** Small, focused components
- **Maintainability:** Changes in one place affect all usages
- **Consistency:** Unified styling and behavior

**Files:**
- `ErrorBanner.jsx` - Global error notifications
- `FormField.jsx` - Form input wrapper with validation

### `/src/pages/` - Route Pages
- **Router-based:** One page per route
- **State Management:** Local state for each page
- **User Flows:** Complete user journeys

**Files:**
- `Home.jsx` - Landing & OAuth entry
- `OAuthCallback.jsx` - OAuth callback handler
- `CreateAd.jsx` - Ad campaign creation

### `/src/config/` - Configuration
- **Centralized:** Single source of truth
- **Environment:** Easy to switch configs
- **Security:** All sensitive endpoints in one place

**Files:**
- `constants.js` - OAuth config, validation rules, error messages

### `/src/utils/` - Utility Functions
- **Pure Functions:** No side effects
- **Reusability:** Used across components
- **Testability:** Easy to test logic in isolation

**Files:**
- `validators.js` - Form validation functions

## State Management Strategy

### Why Not Redux/Context?

For this app's complexity, **local React state** is sufficient because:
- ✅ Only 2 shared pieces of state: OAuth token, user info
- ✅ Simple linear flow: Home → Callback → CreateAd
- ✅ Less boilerplate, easier to understand
- ✅ localStorage provides persistence

### State Flow

```
Home Component
    │
    ├─→ Click "Connect TikTok"
    └─→ Generate OAuth URL with state
    
OAuthCallback Component
    │
    ├─→ Extract code from URL
    ├─→ Validate state parameter
    ├─→ Exchange code for token
    ├─→ Store in localStorage
    └─→ Redirect to CreateAd
    
CreateAd Component
    │
    ├─→ Check token validity
    ├─→ Manage form local state
    ├─→ Validate on each change
    └─→ Submit (simulated)
```

### Future Scaling

If app grows, implement Context API:
```javascript
// src/context/AuthContext.jsx
export const AuthContext = createContext();

// src/context/AuthProvider.jsx
export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  // ...
}
```

Then use in components:
```javascript
const { token } = useContext(AuthContext);
```

## Validation Strategy

### Why Strict Validation?

1. **User Experience:** Immediate feedback prevents frustration
2. **Data Quality:** Ensures clean data for backend
3. **Business Rules:** Enforces conditional logic (music for conversions)
4. **Security:** Prevents injection attacks with pattern validation

### Three-Layer Validation

```
Layer 1: Real-time Field Validation
├─ Campaign name length
├─ Ad text character count
└─ Music ID format

Layer 2: Conditional Validation
├─ Music required IF objective = conversions
└─ CTA must be selected IF creating ad

Layer 3: Form-Level Validation
├─ All required fields filled
├─ No field-level errors
└─ Custom validation rules passed
```

### Validation Flow

```
User types in field
    ↓
onChange handler triggered
    ↓
Real-time validation function called
    ↓
If error: display inline error message
If no error: clear error message
    ↓
User sees immediate feedback
    ↓
Submit button updates disabled state
```

## Error Handling Strategy

### HTTP Status Code Mapping

| Code | Message | User Action |
|------|---------|-------------|
| 401 | Token expired | Re-authenticate |
| 403 | API unavailable in region | Contact support |
| 400 | Invalid request | Check input |
| 500 | Server error | Retry later |
| Network | Connection failed | Check internet |

### Error Presentation

**Global Errors** (ErrorBanner):
- OAuth failures
- Network errors
- Server errors

**Field Errors** (FormField):
- Invalid campaign name length
- Exceeded character limits
- Invalid format

**Inline Help** (Helper text):
- Character counter for ad text
- Format requirements for music ID
- Conditional requirements (music with conversions)

## Token Management Strategy

### Storage Location: localStorage

**Why localStorage?**
- ✅ Persists across page refreshes
- ✅ Accessible across tabs (same domain)
- ✅ Simple API (get/set/remove)
- ✅ Sufficient for this use case

**Why NOT sessionStorage?**
- ❌ Cleared when tab closes
- ❌ Users would lose token on refresh

**Why NOT IndexedDB?**
- ❌ Overkill for simple token storage
- ❌ More complex API
- ❌ Slower than localStorage

### Token Lifecycle

```
Token Created
    ↓
Stored in localStorage with timestamp
    ↓
Every request checks validity:
  - Current time < created_at + expires_in?
    ↓
Token is valid ✓
    ↓
Token is expired ✗ → Clear & redirect to login
```

### Storage Keys

```javascript
localStorage: {
  'tiktok_access_token': 'xxxx...',      // The actual token
  'tiktok_expires_in': '10800',          // Validity in seconds
  'tiktok_token_created_at': '1234...',  // Unix timestamp
  'tiktok_user': '{...}'                 // User info (optional)
}
```

## Security Considerations

### Current Implementation (Assignment)

✅ **Implemented:**
- State parameter validation (CSRF prevention)
- Secure token storage (localStorage with HTTPOnly consideration)
- Error message sanitization (no raw API JSON)
- HTTPS redirects only
- Proper OAuth scopes limiting

❌ **Not Implemented (by design for assignment):**
- Backend token exchange (frontend limitation)
- Refresh token handling
- PKCE flow (for mobile apps)
- Session timeout enforcement

### Production Recommendations

```
CRITICAL CHANGES FOR PRODUCTION:

1. Backend Token Exchange
   ├─ Create /api/auth/token endpoint
   ├─ Only backend sends client_secret
   ├─ Frontend receives token via secure cookie
   └─ Validate state & code server-side

2. Cookie-Based Storage
   ├─ Use HttpOnly cookies instead of localStorage
   ├─ Enable Secure flag (HTTPS only)
   ├─ Set SameSite=Strict
   └─ Implement CSRF protection

3. Token Refresh
   ├─ Implement refresh token rotation
   ├─ Automatic token refresh before expiry
   └─ Graceful re-authentication on expired tokens

4. Additional Security
   ├─ Implement Content Security Policy
   ├─ Add rate limiting
   ├─ Monitor token usage
   └─ Implement logout on all devices
```

## Routing Architecture

### Why HashRouter?

```
HashRouter: /app/#/create-ad
    ✅ Works with GitHub Pages (no server-side routing)
    ✅ All routes handled client-side
    ✅ OAuth callback works correctly
    
BrowserRouter: /app/create-ad
    ❌ Requires server-side routing
    ❌ GitHub Pages can't handle 404s
    ❌ Users see 404 on page refresh
```

### Route Structure

```
/                 → Home page
/oauth/callback   → OAuth callback handler
/create-ad        → Ad creation form
/* (fallback)     → Redirect to /
```

## API Integration Pattern

### Error Handling Pattern

```javascript
try {
  // Make API call
  const response = await fetch(url, options);
  
  if (!response.ok) {
    // Map HTTP status to user message
    const message = ERROR_MESSAGES[response.status];
    throw new Error(message);
  }
  
  return response.json();
  
} catch (error) {
  // Consistent error handling
  if (error instanceof TypeError) {
    // Network error
    throw new Error(ERROR_MESSAGES.networkError);
  }
  // Re-throw with user-friendly message
  throw error;
}
```

## Performance Considerations

### Optimizations Implemented

1. **Code Splitting**
   - Vite automatic chunking
   - React lazy loading ready

2. **Asset Optimization**
   - CSS minification
   - JS minification
   - Tree shaking

3. **Network**
   - Minimal dependencies (4 packages only)
   - No unnecessary API calls
   - localStorage caching

### Future Optimizations

```javascript
// Lazy load pages
const CreateAd = lazy(() => import('./pages/CreateAd'));

// Implement caching
const cachedUserInfo = useMemo(() => fetchUserInfo(), []);

// Add request debouncing
const debouncedValidate = debounce(validateForm, 500);
```

## Testing Strategy

### Unit Tests (validators.js)

```javascript
// Test campaign name validation
expect(validateCampaignName('ab')).toEqual({
  valid: false,
  error: 'Campaign name must be at least 3 characters'
});
```

### Integration Tests (OAuth Flow)

```javascript
// Test complete OAuth callback flow
1. Extract code from URL
2. Validate state
3. Exchange code
4. Store token
5. Verify token validity
```

### E2E Tests (User Flows)

```javascript
// Test complete user journey
1. Home page loads
2. Click "Connect TikTok"
3. Authorize on TikTok
4. Callback processes
5. Ad form loads
6. Create campaign
7. Success message shows
8. Logout clears token
```

## Scalability Considerations

### Current Constraints

- ✅ Single SPA (no server)
- ✅ Client-side routing only
- ✅ No backend scaling needed
- ✅ Local state management

### Scaling Strategies

**If adding backend:**
```
Frontend: React SPA
    ↓ (HTTPS)
Backend: Express/Node.js
    ├─ Token exchange
    ├─ API proxy to TikTok
    ├─ User session management
    └─ Database for campaigns
```

**If adding database:**
```
Real-time features:
├─ WebSocket for live updates
├─ Campaign status notifications
└─ Real-time validation
```

**If adding multiple users:**
```
Authentication:
├─ JWT tokens with refresh
├─ User role-based access
└─ Audit logging
```

## Monitoring & Debugging

### Development Tools

```javascript
// Token monitoring
localStorage.getItem('tiktok_access_token');
localStorage.getItem('tiktok_token_created_at');

// OAuth state debugging
sessionStorage.getItem('oauth_state');

// Form validation debugging
console.log(validateAdForm(formData));
```

### Production Monitoring

```
Things to track:
├─ OAuth success rate
├─ Token refresh rate
├─ Form submission errors
├─ Campaign creation success
└─ User session duration
```

---

**This architecture prioritizes clarity, maintainability, and security while remaining simple enough for a frontend assignment.**
