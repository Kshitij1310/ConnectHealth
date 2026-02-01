import { TOKEN_STORAGE_KEYS } from '../config/constants';

class TokenManager {
  /**
   * Store token in localStorage
   */
  storeToken(accessToken, expiresIn, user = null) {
    const now = new Date().getTime();
    localStorage.setItem(TOKEN_STORAGE_KEYS.accessToken, accessToken);
    localStorage.setItem(TOKEN_STORAGE_KEYS.expiresIn, expiresIn);
    localStorage.setItem(TOKEN_STORAGE_KEYS.createdAt, now.toString());
    if (user) {
      localStorage.setItem(TOKEN_STORAGE_KEYS.user, JSON.stringify(user));
    }
  }

  /**
   * Retrieve stored token
   */
  getToken() {
    return localStorage.getItem(TOKEN_STORAGE_KEYS.accessToken);
  }

  /**
   * Check if token exists and is valid
   */
  isTokenValid() {
    const token = this.getToken();
    if (!token) return false;

    const createdAt = parseInt(localStorage.getItem(TOKEN_STORAGE_KEYS.createdAt) || '0');
    const expiresIn = parseInt(localStorage.getItem(TOKEN_STORAGE_KEYS.expiresIn) || '0');
    const now = new Date().getTime();

    // Token is valid if current time < creation time + expires in
    return now < createdAt + expiresIn * 1000;
  }

  /**
   * Get time remaining before token expires (in seconds)
   */
  getTimeRemaining() {
    const createdAt = parseInt(localStorage.getItem(TOKEN_STORAGE_KEYS.createdAt) || '0');
    const expiresIn = parseInt(localStorage.getItem(TOKEN_STORAGE_KEYS.expiresIn) || '0');
    const now = new Date().getTime();
    const remaining = createdAt + expiresIn * 1000 - now;
    return Math.max(0, Math.floor(remaining / 1000));
  }

  /**
   * Get stored user info
   */
  getUser() {
    const userJson = localStorage.getItem(TOKEN_STORAGE_KEYS.user);
    return userJson ? JSON.parse(userJson) : null;
  }

  /**
   * Clear all token data
   */
  clearToken() {
    localStorage.removeItem(TOKEN_STORAGE_KEYS.accessToken);
    localStorage.removeItem(TOKEN_STORAGE_KEYS.expiresIn);
    localStorage.removeItem(TOKEN_STORAGE_KEYS.createdAt);
    localStorage.removeItem(TOKEN_STORAGE_KEYS.user);
  }
}

export default new TokenManager();
