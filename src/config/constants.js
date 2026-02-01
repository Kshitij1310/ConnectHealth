export const TIKTOK_CONFIG = {
  clientKey: 'awxuo5vfx4akdo2i',
  redirectUri: 'https://kshitij1310.github.io/ConnectHealth/oauth/callback',
  authorizationEndpoint: 'https://www.tiktok.com/v2/auth/authorize/',
  tokenEndpoint: 'https://open.tiktokapis.com/v2/oauth/token/',
  scope: 'user.info.basic',
};

// ⚠️ SECURITY WARNING: Client secret exposed for assignment purposes only
// In production, token exchange MUST be done on backend server
export const TIKTOK_CLIENT_SECRET = '83pxgybdCCHFX6J06VHxSsaKGAluGEre';

export const TOKEN_STORAGE_KEYS = {
  accessToken: 'tiktok_access_token',
  expiresIn: 'tiktok_expires_in',
  createdAt: 'tiktok_token_created_at',
  user: 'tiktok_user',
};

export const ERROR_MESSAGES = {
  401: 'Your TikTok session expired. Please reconnect.',
  403: 'TikTok Ads API is not available in your region.',
  400: 'Invalid request. Please check your input and try again.',
  500: 'TikTok server error. Please try again later.',
  networkError: 'Network error. Please check your connection and try again.',
  invalidState: 'Security validation failed. Please try again.',
  missingCode: 'Authorization code not found. Please try the login flow again.',
  defaultError: 'An unexpected error occurred. Please try again.',
};

export const VALIDATION_RULES = {
  campaignName: {
    minLength: 3,
    maxLength: 255,
    pattern: /^[a-zA-Z0-9\s\-_]+$/,
    errorMessage: {
      minLength: 'Campaign name must be at least 3 characters',
      maxLength: 'Campaign name cannot exceed 255 characters',
      pattern: 'Campaign name can only contain letters, numbers, spaces, hyphens, and underscores',
    },
  },
  adText: {
    maxLength: 100,
    errorMessage: {
      maxLength: 'Ad text cannot exceed 100 characters',
    },
  },
  musicId: {
    pattern: /^[a-zA-Z0-9_-]+$/,
    errorMessage: {
      pattern: 'Music ID can only contain letters, numbers, underscores, and hyphens',
    },
  },
};
