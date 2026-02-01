/**
 * Make authenticated API request to TikTok
 */
export async function makeApiRequest(url, options = {}) {
  const { getToken } = await import('./oauth.js');
  const token = getToken?.() || localStorage.getItem('tiktok_access_token');
  
  if (!token) {
    throw new Error('No access token available');
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw handleApiError(response.status, error);
  }

  return response.json();
}

/**
 * Handle API errors with user-friendly messages
 */
export function handleApiError(statusCode, errorData) {
  let userMessage = 'An error occurred. Please try again.';

  switch (statusCode) {
    case 401:
      userMessage = 'Your TikTok session expired. Please reconnect.';
      break;
    case 403:
      userMessage = 'TikTok Ads API is not available in your region.';
      break;
    case 400:
      userMessage = errorData.message || 'Invalid request. Please check your input.';
      break;
    case 429:
      userMessage = 'Too many requests. Please wait a moment and try again.';
      break;
    case 500:
      userMessage = 'TikTok service error. Please try again later.';
      break;
  }

  const error = new Error(userMessage);
  error.statusCode = statusCode;
  error.originalError = errorData;
  return error;
}
