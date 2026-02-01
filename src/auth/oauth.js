import { TIKTOK_CONFIG, TOKEN_KEYS } from './config';

/**
 * Generate OAuth state parameter for security
 * This prevents CSRF attacks by validating state on callback
 */
export function generateState() {
  const state = Math.random().toString(36).substring(2, 15) +
                Math.random().toString(36).substring(2, 15);
  localStorage.setItem(TOKEN_KEYS.state, state);
  return state;
}

/**
 * Validate OAuth state parameter
 */
export function validateState(state) {
  const savedState = localStorage.getItem(TOKEN_KEYS.state);
  const isValid = state === savedState;
  if (isValid) {
    localStorage.removeItem(TOKEN_KEYS.state);
  }
  return isValid;
}

/**
 * Get TikTok OAuth authorization URL
 */
export function getAuthorizationUrl() {
  const state = generateState();
  const params = new URLSearchParams({
    client_key: TIKTOK_CONFIG.clientKey,
    response_type: 'code',
    scope: TIKTOK_CONFIG.scope,
    redirect_uri: TIKTOK_CONFIG.redirectUri,
    state,
  });
  
  return `${TIKTOK_CONFIG.authorizationUrl}?${params.toString()}`;
}

/**
 * Exchange authorization code for access token
 * NOTE: In production, this must happen on a backend server
 * Frontend-only implementation shown here for assignment scope
 */
export async function exchangeCodeForToken(code) {
  try {
    const response = await fetch(TIKTOK_CONFIG.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_key: TIKTOK_CONFIG.clientKey,
        client_secret: TIKTOK_CONFIG.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: TIKTOK_CONFIG.redirectUri,
      }).toString(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new OAuthError(response.status, errorData);
    }

    const data = await response.json();
    
    // Store token and metadata
    saveToken(data.access_token, data.expires_in);
    
    return {
      accessToken: data.access_token,
      expiresIn: data.expires_in,
    };
  } catch (error) {
    if (error instanceof OAuthError) {
      throw error;
    }
    throw new OAuthError(500, {
      error: 'token_exchange_failed',
      error_description: error.message,
    });
  }
}

/**
 * Save token to localStorage
 */
export function saveToken(accessToken, expiresIn) {
  localStorage.setItem(TOKEN_KEYS.accessToken, accessToken);
  localStorage.setItem(TOKEN_KEYS.expiresIn, expiresIn);
  localStorage.setItem(TOKEN_KEYS.createdAt, Date.now().toString());
}

/**
 * Get stored access token
 */
export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEYS.accessToken);
}

/**
 * Check if token is expired
 */
export function isTokenExpired() {
  const createdAt = localStorage.getItem(TOKEN_KEYS.createdAt);
  const expiresIn = localStorage.getItem(TOKEN_KEYS.expiresIn);
  
  if (!createdAt || !expiresIn) return true;
  
  const expiryTime = parseInt(createdAt) + parseInt(expiresIn) * 1000;
  return Date.now() >= expiryTime;
}

/**
 * Clear stored token
 */
export function clearToken() {
  localStorage.removeItem(TOKEN_KEYS.accessToken);
  localStorage.removeItem(TOKEN_KEYS.expiresIn);
  localStorage.removeItem(TOKEN_KEYS.createdAt);
  localStorage.removeItem(TOKEN_KEYS.state);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  const token = getAccessToken();
  return !!token && !isTokenExpired();
}

/**
 * Custom error class for OAuth errors
 */
export class OAuthError extends Error {
  constructor(statusCode, errorData) {
    let message = 'OAuth Error';
    
    switch (statusCode) {
      case 401:
        message = 'Your TikTok session expired. Please reconnect.';
        break;
      case 403:
        message = 'TikTok Ads API is not available in your region.';
        break;
      case 400:
        if (errorData.error_description) {
          message = errorData.error_description;
        } else if (errorData.error === 'invalid_request') {
          message = 'Invalid request. Please try again.';
        }
        break;
      default:
        message = 'Failed to authenticate with TikTok. Please try again.';
    }
    
    super(message);
    this.name = 'OAuthError';
    this.statusCode = statusCode;
    this.errorData = errorData;
  }
}
