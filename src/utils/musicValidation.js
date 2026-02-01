/**
 * Validate music ID format
 */
export function validateMusicId(musicId) {
  if (!musicId || musicId.trim().length === 0) {
    return { valid: false, error: 'Music ID is required' };
  }
  
  // TikTok music IDs are numeric
  if (!/^\d+$/.test(musicId.trim())) {
    return { valid: false, error: 'Music ID must contain only numbers' };
  }
  
  if (musicId.trim().length > 20) {
    return { valid: false, error: 'Music ID is too long' };
  }
  
  return { valid: true };
}

/**
 * Generate mock music ID for custom uploads
 */
export function generateMockMusicId() {
  // Simulate TikTok music ID format (numeric)
  return Math.floor(Math.random() * 10000000000).toString();
}

/**
 * Validate music ID format (simulated API check)
 * In production, this would call TikTok's music validation API
 */
export async function validateMusicIdWithApi(musicId) {
  // Simulate network request
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate API validation - invalid IDs starting with 0 are rejected
      if (musicId.startsWith('0') && musicId.length > 1) {
        resolve({
          valid: false,
          error: 'This music ID is not available',
        });
      } else {
        resolve({ valid: true });
      }
    }, 500);
  });
}
