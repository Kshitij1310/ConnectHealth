import { TOKEN_STORAGE_KEYS } from '../config/constants';

class TokenManager {
  /**
   * Store token in localStorage
   */
  storeToken(accessToken, expiresIn, user = null) {
    const now = new Date().getTime();
    console.log('Storing token:', { accessToken: accessToken ? 'Present' : 'Missing', expiresIn, now, user });
    
    localStorage.setItem(TOKEN_STORAGE_KEYS.accessToken, accessToken);
    localStorage.setItem(TOKEN_STORAGE_KEYS.expiresIn, expiresIn);
    localStorage.setItem(TOKEN_STORAGE_KEYS.createdAt, now.toString());
    if (user) {
      localStorage.setItem(TOKEN_STORAGE_KEYS.user, JSON.stringify(user));
    }
    
    console.log('Token stored. Verification:', {
      accessToken: localStorage.getItem(TOKEN_STORAGE_KEYS.accessToken) ? 'Stored' : 'Failed',
      expiresIn: localStorage.getItem(TOKEN_STORAGE_KEYS.expiresIn),
      createdAt: localStorage.getItem(TOKEN_STORAGE_KEYS.createdAt)
    });
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
    if (!token) {
      console.log('TokenManager: No token found');
      return false;
    }

    const createdAt = parseInt(localStorage.getItem(TOKEN_STORAGE_KEYS.createdAt) || '0');
    const expiresIn = parseInt(localStorage.getItem(TOKEN_STORAGE_KEYS.expiresIn) || '0');
    const now = new Date().getTime();

    console.log('TokenManager validation:', {
      createdAt,
      expiresIn,
      now,
      expiresAt: createdAt + expiresIn * 1000,
      isValid: now < createdAt + expiresIn * 1000
    });

    // Token is valid if current time < creation time + expires in
    const isValid = now < createdAt + expiresIn * 1000;
    console.log('Token is valid:', isValid);
    return isValid;
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
