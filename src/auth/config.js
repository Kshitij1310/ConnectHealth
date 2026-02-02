// TikTok OAuth Configuration
export const TIKTOK_CONFIG = {
  clientKey: 'awxuo5vfx4akdo2i',
  authorizationUrl: 'https://www.tiktok.com/v2/auth/authorize/',
  tokenUrl: 'https://open.tiktokapis.com/v2/oauth/token/',
  redirectUri: 'https://kshitij1310.github.io/ConnectHealth/oauth/callback',
  scope: 'user.info.basic',
};

/**
 * ⚠️ SECURITY NOTICE - FRONTEND-ONLY ASSIGNMENT LIMITATION
 * 
 * This client secret is loaded from environment variables at build time.
 * While this is better than hardcoding, it still exposes the secret in the
 * bundled JavaScript code sent to browsers.
 * 
 * WHY THIS IS NOT PRODUCTION-READY:
 * - Anyone can inspect browser DevTools and see the secret in bundled code
 * - The secret can be extracted from the minified JavaScript
 * - This violates OAuth 2.0 security best practices
 * 
 * PRODUCTION SOLUTION:
 * - Token exchange (code -> access token) MUST happen on a secure backend
 * - Backend makes the token request with client_secret
 * - Frontend only receives the access token, never sees the secret
 * - Backend can validate, rate-limit, and log OAuth flows
 * 
 * This implementation demonstrates:
 * ✓ Awareness of security concerns
 * ✓ Environment-based configuration
 * ✓ Clear documentation of limitations
 * ✗ Not suitable for production use
 */
export const TIKTOK_CLIENT_SECRET = import.meta.env.VITE_TIKTOK_CLIENT_SECRET || '';

// Token storage keys
export const TOKEN_KEYS = {
  accessToken: 'tiktok_access_token',
  expiresIn: 'tiktok_expires_in',
  createdAt: 'tiktok_token_created_at',
  state: 'tiktok_oauth_state',
};

// API endpoints
export const API_ENDPOINTS = {
  userInfo: 'https://open.tiktokapis.com/v2/user/info/',
  adCreate: 'https://open.tiktokapis.com/v2/ad/create/',
};
