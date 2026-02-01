import { TIKTOK_CONFIG } from '../config/constants';

/**
 * Generate a secure random state string for OAuth
 */
export function generateState() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Store state in session storage for validation
 */
export function storeState(state) {
  sessionStorage.setItem('oauth_state', state);
}

/**
 * Retrieve and validate state
 */
export function validateState(returnedState) {
  const storedState = sessionStorage.getItem('oauth_state');
  sessionStorage.removeItem('oauth_state');
  return storedState === returnedState;
}

/**
 * Generate TikTok OAuth authorization URL
 */
export function generateAuthorizationUrl() {
  const state = generateState();
  storeState(state);

  const params = new URLSearchParams({
    client_key: TIKTOK_CONFIG.clientKey,
    response_type: 'code',
    scope: TIKTOK_CONFIG.scope,
    redirect_uri: TIKTOK_CONFIG.redirectUri,
    state,
  });

  return `${TIKTOK_CONFIG.authorizationEndpoint}?${params.toString()}`;
}

/**
 * Exchange authorization code for access token
 * ⚠️  IMPORTANT: In production, this should be done on the backend.
 * Frontend-only implementation is used here due to project constraints.
 */
export async function exchangeCodeForToken(code) {
  try {
    const payload = {
      client_key: TIKTOK_CONFIG.clientKey,
      client_secret: TIKTOK_CONFIG.clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: TIKTOK_CONFIG.redirectUri,
    };

    const response = await fetch(TIKTOK_CONFIG.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const statusCode = response.status;

      // Map HTTP status codes to user-friendly messages
      if (statusCode === 401) {
        throw new Error('Your TikTok session expired. Please reconnect.');
      } else if (statusCode === 403) {
        throw new Error('TikTok Ads API is not available in your region.');
      } else {
        throw new Error(
          errorData?.error_description ||
            'Failed to authenticate. Please try again.'
        );
      }
    }

    const data = await response.json();
    console.log('TikTok token response:', data);
    
    const tokenData = {
      accessToken: data.access_token,
      expiresIn: data.expires_in,
      tokenType: data.token_type,
    };
    console.log('Returning token data:', tokenData);
    return tokenData;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        'Network error. Please check your connection and try again.'
      );
    }
    throw error;
  }
}
