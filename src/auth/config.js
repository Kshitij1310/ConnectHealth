// TikTok OAuth Configuration
export const TIKTOK_CONFIG = {
  clientKey: 'awxuo5vfx4akdo2i',
  authorizationUrl: 'https://www.tiktok.com/v2/auth/authorize/',
  tokenUrl: 'https://open.tiktokapis.com/v2/oauth/token/',
  redirectUri: 'https://kshitij1310.github.io/ConnectHealth/oauth/callback',
  scope: 'user.info.basic',
};

// ⚠️ SECURITY WARNING: Client secret exposed for assignment purposes only
// In production, token exchange MUST be done on backend server
export const TIKTOK_CLIENT_SECRET = '83pxgybdCCHFX6J06VHxSsaKGAluGEre';

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
