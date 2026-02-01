import axios from 'axios';
import tokenManager from '../auth/tokenManager';

const API_BASE_URL = 'https://open.tiktokapis.com/v2';

/**
 * Create axios instance with auth token
 */
function getAxiosInstance() {
  const token = tokenManager.getToken();
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
}

/**
 * Fetch user info from TikTok API
 */
export async function fetchUserInfo() {
  try {
    const instance = getAxiosInstance();
    const response = await instance.get('/user/info/', {
      params: {
        fields: 'open_id,union_id,avatar_url,display_name',
      },
    });

    if (response.data?.data) {
      return response.data.data;
    }
    throw new Error('Failed to fetch user info');
  } catch (error) {
    handleApiError(error);
  }
}

/**
 * Validate music ID (simulated for now as TikTok doesn't provide a direct validation endpoint)
 * In production, you'd integrate with TikTok's music library API
 */
export function validateMusicId(musicId) {
  // Check format: must be alphanumeric with underscores and hyphens
  const validFormat = /^[a-zA-Z0-9_-]+$/.test(musicId);
  
  if (!validFormat) {
    return {
      valid: false,
      error: 'Music ID can only contain letters, numbers, underscores, and hyphens',
    };
  }

  // Simulate validation (in production, call actual TikTok API)
  return { valid: true };
}

/**
 * Generate mock music ID for custom music upload
 */
export function generateMockMusicId() {
  const timestamp = new Date().getTime();
  const random = Math.random().toString(36).substring(2, 8);
  return `music_${timestamp}_${random}`;
}

/**
 * Handle API errors with user-friendly messages
 */
function handleApiError(error) {
  if (error.response?.status === 401) {
    tokenManager.clearToken();
    throw new Error('Your TikTok session expired. Please reconnect.');
  } else if (error.response?.status === 403) {
    throw new Error('TikTok Ads API is not available in your region.');
  } else if (error.response?.status === 400) {
    throw new Error('Invalid request. Please check your input and try again.');
  } else if (error.code === 'ERR_NETWORK') {
    throw new Error('Network error. Please check your connection and try again.');
  } else {
    throw new Error('An unexpected error occurred. Please try again.');
  }
}
