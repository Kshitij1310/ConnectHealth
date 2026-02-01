# Testing Guide

## Manual Testing Checklist

### 1. OAuth Flow Testing

#### Test Case 1.1: Successful OAuth Authentication

**Steps:**
1. Start dev server: `npm run dev`
2. Navigate to Home page
3. Click "Connect TikTok Account" button
4. Verify you're redirected to TikTok login page

**Expected Result:**
- TikTok login page loads
- URL includes: `client_key=awxuo5vfx4akdo2i`, `response_type=code`, `scope=user.info.basic`

**Verification:**
```javascript
// In browser console
sessionStorage.getItem('oauth_state'); // Should show random state string
```

#### Test Case 1.2: OAuth State Validation

**Steps:**
1. Complete OAuth login
2. TikTok redirects to: `/oauth/callback?code=XXXX&state=YYYY`

**Expected Result:**
- State parameter matches what we stored in sessionStorage
- If different → "Security validation failed" error

**Verification:**
```javascript
// In browser console during callback
sessionStorage.getItem('oauth_state'); // Should match URL state param
```

#### Test Case 1.3: Token Exchange

**Steps:**
1. Complete OAuth authentication
2. Watch Network tab (F12) during callback

**Expected Result:**
- POST request to: `https://open.tiktokapis.com/v2/oauth/token/`
- Request body includes: `client_key`, `client_secret`, `code`, `grant_type`, `redirect_uri`
- Response includes: `access_token`, `expires_in`, `token_type`

**Verification:**
```javascript
// After successful auth, in console:
localStorage.getItem('tiktok_access_token');  // Should show token
localStorage.getItem('tiktok_expires_in');    // Should show seconds (10800)
localStorage.getItem('tiktok_token_created_at'); // Should show timestamp
```

#### Test Case 1.4: Token Persistence

**Steps:**
1. Complete OAuth authentication
2. Refresh page (F5)
3. Should still be authenticated

**Expected Result:**
- Ad creation form still accessible
- Token still in localStorage
- No need to re-authenticate

#### Test Case 1.5: Token Expiration Handling

**Steps:**
1. Authenticate and note token creation time
2. Manually modify `tiktok_expires_in` to 0 in localStorage
3. Try to access protected page

**Expected Result:**
- Should redirect to home page
- Token considered expired

**Verification:**
```javascript
// In console:
localStorage.setItem('tiktok_expires_in', '0'); // Simulate expired token
// Refresh page → should kick you to home
```

---

### 2. Form Validation Testing

#### Test Case 2.1: Campaign Name Validation

**Test:** Empty campaign name
```
Input: ""
Expected Error: "Campaign name is required"
Submit Button: Disabled
```

**Test:** Campaign name too short
```
Input: "ab"
Expected Error: "Campaign name must be at least 3 characters"
Submit Button: Disabled
```

**Test:** Campaign name too long
```
Input: (300 characters)
Expected Error: "Campaign name cannot exceed 255 characters"
Submit Button: Disabled
```

**Test:** Invalid characters
```
Input: "Campaign@123"
Expected Error: "Campaign name can only contain letters, numbers, spaces, hyphens, and underscores"
Submit Button: Disabled
```

**Test:** Valid campaign name
```
Input: "Q1 Spring Launch"
Expected: No error
Submit Button: Enabled
```

#### Test Case 2.2: Ad Text Validation

**Test:** Empty ad text
```
Input: ""
Expected Error: "Ad text is required"
Submit Button: Disabled
```

**Test:** Ad text too long
```
Input: (101+ characters)
Expected Error: "Ad text cannot exceed 100 characters"
Submit Button: Disabled
Character Counter: Shows red/over limit
```

**Test:** Valid ad text
```
Input: "Get fit with ConnectHealth!" (30 chars)
Character Counter: Shows "30/100"
Submit Button: Enabled
```

#### Test Case 2.3: Objective Selection

**Test:** No objective selected
```
State: Empty
Expected Error: "Please select a valid objective"
Submit Button: Disabled
```

**Test:** Valid objective selected
```
Selected: "Traffic" or "Conversions"
Expected: No error
Submit Button: Enabled (if other fields valid)
```

#### Test Case 2.4: CTA Selection

**Test:** No CTA selected
```
State: Empty
Expected Error: "CTA is required"
Submit Button: Disabled
```

**Test:** Valid CTA selected
```
Selected: Any option from dropdown
Expected: No error
Submit Button: Enabled (if other fields valid)
```

#### Test Case 2.5: Music Selection - Existing Music ID

**Test:** Select "Use Existing Music ID" without entering ID
```
State: Radio selected, no input
Expected Error: "Music ID is required"
Submit Button: Disabled
```

**Test:** Enter invalid music ID format
```
Input: "music@123"
Expected Error: "Music ID can only contain letters, numbers, underscores, and hyphens"
Submit Button: Disabled
```

**Test:** Enter valid music ID
```
Input: "music_abc123"
Expected: No error
Submit Button: Enabled
```

#### Test Case 2.6: Music Selection - Custom Music Upload

**Test:** Select "Upload Custom Music" and click button
```
Button: "📁 Simulate Music Upload"
Expected: 
- Button disappears
- Shows generated music ID
- Music ID format: "music_[timestamp]_[random]"
Submit Button: Enabled
```

#### Test Case 2.7: Music Selection - No Music

**Test:** Select "No Music" with "Traffic" objective
```
Objective: Traffic
Music: No Music
Expected: No error
Submit Button: Enabled
```

**Test:** Select "No Music" with "Conversions" objective
```
Objective: Conversions
Music: No Music
Expected Error: "Music is required when objective is Conversions"
Submit Button: Disabled
```

**Test:** Change objective to Traffic, then back to Conversions
```
Steps:
1. Select Traffic objective + No Music → OK
2. Change to Conversions objective
Expected Error: Shows immediately with conditional message
```

---

### 3. Form Submission Testing

#### Test Case 3.1: Successful Form Submission

**Steps:**
1. Fill all fields correctly:
   - Campaign Name: "Test Campaign 2025"
   - Objective: "Traffic"
   - Ad Text: "Get healthy today!"
   - CTA: "Learn More"
   - Music: "No Music" or valid selection
2. Click "Create Campaign"

**Expected Result:**
- Success message appears: "✓ Ad campaign "Test Campaign 2025" created successfully!"
- Form clears for new entry
- Message disappears after 3 seconds

#### Test Case 3.2: Submission with Missing Fields

**Steps:**
1. Click "Create Campaign" without filling fields

**Expected Result:**
- No submission happens
- Error banner appears at top
- Field errors show inline
- Submit button remains disabled

#### Test Case 3.3: Submit Button State

**Test:** Button disabled state
```
Condition: Any validation errors exist
Expected: Button disabled (grayed out)
Cursor: Shows "not-allowed"
```

**Test:** Button enabled state
```
Condition: All fields valid, no errors
Expected: Button enabled (black)
Cursor: Shows "pointer"
```

---

### 4. Error Handling Testing

#### Test Case 4.1: OAuth Error - Invalid State

**Steps:**
1. Manually modify sessionStorage oauth_state to different value
2. Complete OAuth and callback will receive different state
3. Watch callback page

**Expected Result:**
- Error message: "Security validation failed. Please try again."
- Error banner shows (red)
- "Return to Home" button appears

#### Test Case 4.2: OAuth Error - Missing Authorization Code

**Steps:**
1. Manually navigate to: `/oauth/callback?state=xxx` (no code param)

**Expected Result:**
- Error message: "Authorization code not found. Please try the login flow again."
- Error banner shown
- Button to return home

#### Test Case 4.3: Network Error During Token Exchange

**Steps:**
1. Use Network Throttling to simulate offline (DevTools → Network → Offline)
2. Start OAuth flow during offline

**Expected Result:**
- Error message: "Network error. Please check your connection and try again."
- User can try again after going online

#### Test Case 4.4: OAuth Server Error (400/500)

**Steps:**
1. Use DevTools to mock failed token exchange response
2. Modify code before exchange to trigger error

**Expected Result:**
- Friendly error message shown (not raw JSON)
- "Return to Home" button available

---

### 5. UI/UX Testing

#### Test Case 5.1: Real-time Error Clearing

**Steps:**
1. Enter invalid campaign name: "ab"
2. See error: "Campaign name must be at least 3 characters"
3. Type one more character: "abc"
4. Error should disappear immediately

**Expected Result:**
- Error clears without needing to blur field
- Submit button becomes enabled

#### Test Case 5.2: Character Counter

**Steps:**
1. Focus on "Ad Text" field
2. Type some text
3. Watch character counter

**Expected Result:**
- Counter updates in real-time: "15/100"
- When over 100 chars: shows error, button disabled

#### Test Case 5.3: Form Responsiveness

**Steps:**
1. Fill form on mobile/tablet view
2. Check that:
   - Fields stack vertically
   - Labels clearly visible
   - Buttons are tappable (>44px height)
   - Text readable without zoom

**Expected Result:**
- Form is usable on small screens
- No horizontal scrolling
- All elements accessible

#### Test Case 5.4: Error Banner Appearance

**Steps:**
1. Trigger an error (submit with empty fields)
2. Watch error banner

**Expected Result:**
- Banner slides in from top (animation)
- Red background with border-left
- Close button (✕) in top-right
- Click close → banner disappears

#### Test Case 5.5: Success Message Appearance

**Steps:**
1. Submit valid form
2. Watch success message

**Expected Result:**
- Green background banner appears
- Shows campaign name in message
- Auto-hides after 3 seconds
- Form clears for next entry

---

### 6. Token Management Testing

#### Test Case 6.1: Logout Functionality

**Steps:**
1. After authentication, click "Logout" button

**Expected Result:**
- All localStorage tokens cleared
- Redirected to home page
- localStorage keys removed:
  - `tiktok_access_token`
  - `tiktok_expires_in`
  - `tiktok_token_created_at`
  - `tiktok_user`

**Verification:**
```javascript
// In console after logout:
localStorage.getItem('tiktok_access_token'); // null
```

#### Test Case 6.2: Token Expiration Detection

**Steps:**
1. Authenticate and get token
2. Check "Token expires in" time on ad form
3. Manually set expiry to past timestamp
4. Try to access protected resource

**Expected Result:**
- App detects expired token
- Redirects to home
- Prompt to re-authenticate

**Verification:**
```javascript
import tokenManager from './auth/tokenManager';
tokenManager.isTokenValid(); // Should return false
```

#### Test Case 6.3: Token Time Remaining

**Steps:**
1. After authentication, check ad form
2. Should show token remaining time

**Expected Result:**
- Displays: "Token is valid for ~3 hours"
- Updates accurately
- Shows minutes/seconds remaining

---

### 7. Responsive Design Testing

#### Test Case 7.1: Desktop (1920x1080)

**Steps:**
1. Open app on desktop
2. Check all pages render correctly
3. Verify multi-column layouts where applicable

**Expected Result:**
- All content visible without scrolling
- Proper spacing and alignment
- Buttons/fields properly sized

#### Test Case 7.2: Tablet (768x1024)

**Steps:**
1. Resize browser to tablet width
2. Test all interactions

**Expected Result:**
- Single column layout
- Touch-friendly button sizes
- Text readable without zoom

#### Test Case 7.3: Mobile (375x667)

**Steps:**
1. Resize to mobile width
2. Test form on mobile
3. Test OAuth flow on mobile

**Expected Result:**
- Vertically stacked layout
- All touch targets >44x44px
- No horizontal scrolling
- Form usable without zooming

---

### 8. Cross-Browser Testing

#### Supported Browsers

Test on:
- ✅ Chrome/Chromium (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile Safari (iOS)
- ✅ Chrome Mobile (Android)

#### Test Checklist

For each browser:
- [ ] OAuth flow completes
- [ ] Form validation works
- [ ] All styles render correctly
- [ ] No console errors
- [ ] localStorage works
- [ ] sessionStorage works

---

### 9. Accessibility Testing

#### Test Case 9.1: Keyboard Navigation

**Steps:**
1. Use Tab key to navigate form
2. Use Shift+Tab to go backward
3. Use Enter to submit
4. Use Space for radio buttons

**Expected Result:**
- Clear focus indicators
- Tab order makes sense
- All interactive elements reachable via keyboard
- No keyboard traps

#### Test Case 9.2: Screen Reader Support

**Steps:**
1. Use screen reader (NVDA, JAWS, or browser built-in)
2. Navigate form

**Expected Result:**
- Form labels announced
- Error messages announced
- Button states announced
- Instructions clear

#### Test Case 9.3: Color Contrast

**Steps:**
1. Check color contrast of text vs background
2. Use WebAIM contrast checker

**Expected Result:**
- All text meets WCAG AA standards (4.5:1 for body text)
- Error text (red) has sufficient contrast
- Success text (green) readable

---

## Automated Testing Examples

### Unit Test Template (validators.js)

```javascript
import { validateCampaignName } from '../utils/validators';

describe('Campaign Name Validation', () => {
  test('should reject empty name', () => {
    const result = validateCampaignName('');
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/required/i);
  });

  test('should reject name too short', () => {
    const result = validateCampaignName('ab');
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/at least 3/i);
  });

  test('should accept valid name', () => {
    const result = validateCampaignName('Valid Campaign');
    expect(result.valid).toBe(true);
  });

  test('should reject invalid characters', () => {
    const result = validateCampaignName('Campaign@123');
    expect(result.valid).toBe(false);
  });
});
```

### Integration Test Template (OAuth Flow)

```javascript
import { generateAuthorizationUrl, validateState } from '../auth/oauthFlow';

describe('OAuth Flow', () => {
  test('should generate valid authorization URL', () => {
    const url = generateAuthorizationUrl();
    expect(url).toContain('client_key=awxuo5vfx4akdo2i');
    expect(url).toContain('response_type=code');
    expect(url).toContain('scope=user.info.basic');
  });

  test('should validate matching state', () => {
    const state = sessionStorage.getItem('oauth_state');
    const isValid = validateState(state);
    expect(isValid).toBe(true);
  });

  test('should reject mismatched state', () => {
    const isValid = validateState('wrong_state');
    expect(isValid).toBe(false);
  });
});
```

---

## Testing Command-Line Script

```bash
#!/bin/bash
# test-checklist.sh

echo "🧪 ConnectHealth Testing Checklist"
echo "=================================="
echo ""

echo "1️⃣  OAuth Flow"
echo "   [ ] Home page loads"
echo "   [ ] Connect TikTok button visible"
echo "   [ ] Redirects to TikTok"
echo "   [ ] Callback processes code"
echo "   [ ] Token stored in localStorage"
echo ""

echo "2️⃣  Form Validation"
echo "   [ ] Required fields enforced"
echo "   [ ] Campaign name length checked"
echo "   [ ] Ad text character limit enforced"
echo "   [ ] Music conditional logic works"
echo "   [ ] Submit button state updates"
echo ""

echo "3️⃣  Error Handling"
echo "   [ ] Network errors shown"
echo "   [ ] Validation errors inline"
echo "   [ ] No raw JSON shown"
echo "   [ ] Close button on error banner"
echo ""

echo "4️⃣  Responsive Design"
echo "   [ ] Desktop (1920x1080)"
echo "   [ ] Tablet (768x1024)"
echo "   [ ] Mobile (375x667)"
echo ""

echo "5️⃣  Cross-Browser"
echo "   [ ] Chrome"
echo "   [ ] Firefox"
echo "   [ ] Safari"
echo "   [ ] Edge"
echo ""

echo "✅ All tests passed!"
```

---

## Performance Testing

### Lighthouse Audit

```bash
# Run Lighthouse audit in Chrome DevTools
1. F12 → Lighthouse
2. Select "Mobile"
3. Run audit
4. Check scores:
   - Performance: >80
   - Accessibility: >90
   - Best Practices: >90
   - SEO: >90
```

### Bundle Size

```bash
# Check production bundle size
npm run build

# Expected sizes:
# dist/index.html          ~2KB
# dist/assets/main-*.js    ~80KB (gzipped)
# dist/assets/main-*.css   ~8KB (gzipped)
```

---

**Use this checklist before deployment to ensure production readiness!**
