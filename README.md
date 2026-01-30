# HealthConnect - TikTok OAuth Demo Application

![HealthConnect Demo](https://img.shields.io/badge/Status-Demo-yellow) ![Purpose](https://img.shields.io/badge/Purpose-Educational-blue) ![TikTok OAuth](https://img.shields.io/badge/TikTok-OAuth-black)

## 🎯 Purpose

**HealthConnect** is a demonstration web application created **exclusively for educational purposes** and to showcase **TikTok OAuth login integration**. This app is designed for testing TikTok's authentication flow and app review processes.

⚠️ **Important**: This is NOT a production application and should not be used for commercial purposes.

## 🌟 Features

- **Clean, Professional UI**: Modern design with fitness/health theme
- **TikTok OAuth Integration**: Demonstrates secure authentication flow
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Privacy-First**: Clear privacy policy and terms of service
- **Educational Comments**: Code includes detailed explanations for learning

## 📁 Project Structure

```
HealthConnect/
├── index.html          # Landing page with login button
├── dashboard.html      # Success page after login
├── privacy.html        # Privacy policy page
├── terms.html          # Terms of service page
├── styles.css          # All styling and responsive design
├── script.js           # TikTok OAuth implementation
└── README.md           # This file
```

## 🚀 Getting Started

### Option 1: Open Locally

1. Clone or download this project
2. Open `index.html` in any modern web browser
3. Click "Login with TikTok" to see the demo flow

### Option 2: Use with TikTok OAuth (Real Implementation)

To implement actual TikTok OAuth:

1. **Register Your App**
   - Go to [TikTok Developer Portal](https://developers.tiktok.com/)
   - Create a new app
   - Get your `Client Key` and `Client Secret`

2. **Configure the App**
   - Open `script.js`
   - Update `TIKTOK_CONFIG` with your credentials:
     ```javascript
     CLIENT_KEY: 'your_actual_client_key',
     REDIRECT_URI: 'your_redirect_uri',
     ```
   - Set your redirect URI (e.g., `http://localhost:8000/` for local testing)

3. **Update TikTok Developer Portal**
   - Add your redirect URI to allowed redirect URIs
   - Set OAuth scopes: `user.info.basic`

4. **Enable Real OAuth**
   - In `script.js`, uncomment the real OAuth implementation
   - Comment out or remove the demo simulation functions

5. **Set Up Backend (Recommended)**
   - For production, implement token exchange on a secure backend
   - Never expose `Client Secret` in client-side code

## 🔧 Technical Details

### Technologies Used
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with flexbox and grid
- **JavaScript (ES6+)**: OAuth flow implementation
- **No external dependencies**: Pure vanilla JavaScript

### OAuth Flow
1. User clicks "Login with TikTok"
2. App redirects to TikTok authorization page
3. User approves the app
4. TikTok redirects back with authorization code
5. App exchanges code for access token (backend)
6. App fetches user profile
7. User is logged in and shown dashboard

### Scopes Used
- `user.info.basic`: Only basic profile information
  - Username
  - User ID
  - Profile picture

**Note**: This app does NOT:
- Publish content to TikTok
- Access TikTok videos or posts
- Interact with followers/following
- Collect any sensitive data

## 🎨 Design Features

- **Color Scheme**: 
  - Primary: Green (#4CAF50) - Health/Fitness theme
  - Secondary: Blue (#2196F3) - Trust/Security
  - Accent: Cyan (#00BCD4)

- **Responsive Breakpoints**:
  - Desktop: 1200px+
  - Tablet: 768px - 1199px
  - Mobile: < 768px

- **Accessibility**:
  - Semantic HTML
  - High contrast ratios
  - Mobile-friendly touch targets

## 📄 Pages Overview

### 1. Index (Home)
- App introduction
- TikTok login button
- Feature highlights
- Links to Privacy and Terms

### 2. Dashboard
- Login success confirmation
- Mock user profile display
- Authentication badge
- Demo notice

### 3. Privacy Policy
- Clear data usage explanation
- TikTok integration details
- No content publishing guarantee
- Educational purpose notice

### 4. Terms of Service
- Demo app disclaimer
- No commercial use clause
- TikTok authentication scope
- Limitation of liability

## 🔒 Security Considerations

### Implemented
✅ CSRF protection with state parameter  
✅ Clear privacy policy  
✅ Minimal data collection  
✅ Client-side session for demo  

### For Production (Not Implemented Yet)
⚠️ Backend token exchange  
⚠️ Secure session management  
⚠️ HttpOnly cookies  
⚠️ Token encryption  
⚠️ Rate limiting  
⚠️ HTTPS enforcement  

## 📱 Browser Support

- Chrome/Edge: ✅ Latest
- Firefox: ✅ Latest
- Safari: ✅ Latest
- Mobile browsers: ✅ iOS Safari, Chrome Mobile

## 🚫 What This App Does NOT Do

- ❌ Publish TikTok content
- ❌ Access TikTok videos or posts
- ❌ Collect sensitive personal data
- ❌ Track fitness or health data
- ❌ Store data permanently (demo mode)
- ❌ Commercial usage
- ❌ Production deployment

## 🎓 Educational Use

This app is designed to teach:
- OAuth 2.0 authentication flow
- TikTok API integration
- Frontend web development
- Privacy-first design
- Responsive UI/UX

Feel free to:
- Study the code
- Modify for learning
- Use as a template for TikTok OAuth
- Share for educational purposes

## 📞 Support & Documentation

- **TikTok Developer Docs**: https://developers.tiktok.com/doc/
- **OAuth 2.0 Guide**: https://oauth.net/2/
- **TikTok API Scopes**: https://developers.tiktok.com/doc/tiktok-api-scopes

## ⚖️ License & Disclaimer

This is a **demonstration application** for educational purposes only.

- TikTok name and logo are trademarks of TikTok
- Used here only to demonstrate OAuth integration
- Not affiliated with or endorsed by TikTok
- No warranty or support provided
- Use at your own risk

## 🎉 Demo Mode

Currently, the app runs in **demo mode**:
- Clicking login simulates successful authentication
- No actual TikTok API calls are made
- Mock user data is displayed
- Perfect for testing UI without OAuth setup

To use with real TikTok OAuth, follow the "Getting Started" section above.

---

**Created for**: TikTok OAuth testing and educational purposes  
**Status**: Demo/Testing  
**Last Updated**: January 30, 2026  

**Happy Testing! 🚀**
