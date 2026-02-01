/**
 * HealthConnect - Demo App JavaScript
 * This file handles the TikTok OAuth login flow simulation
 * FOR EDUCATIONAL AND TESTING PURPOSES ONLY
 */

// TikTok OAuth Configuration
// NOTE: In a real implementation, these values would come from your TikTok Developer Portal
const TIKTOK_CONFIG = {
    // Replace these with your actual TikTok app credentials when ready
    CLIENT_KEY: 'YOUR_TIKTOK_CLIENT_KEY',  // Get this from TikTok Developer Portal
    REDIRECT_URI: 'YOUR_REDIRECT_URI',      // Must match the URI registered in TikTok Developer Portal
    
    // TikTok OAuth endpoints
    AUTHORIZATION_URL: 'https://www.tiktok.com/v2/auth/authorize/',
    TOKEN_URL: 'https://open.tiktokapis.com/v2/oauth/token/',
    
    // OAuth scopes - requesting only basic user info for authentication
    // See: https://developers.tiktok.com/doc/tiktok-api-scopes
    SCOPES: 'user.info.basic',  // Only basic profile information needed for login
    
    // OAuth response type
    RESPONSE_TYPE: 'code',
    
    // State parameter for CSRF protection
    STATE: generateRandomState()
};

/**
 * Generate a random state parameter for CSRF protection
 * This prevents cross-site request forgery attacks
 */
function generateRandomState() {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
}

/**
 * Main login function - initiates TikTok OAuth flow
 * Called when user clicks "Login with TikTok" button
 */
function loginWithTikTok() {
    // Store state in sessionStorage for verification when callback returns
    sessionStorage.setItem('oauth_state', TIKTOK_CONFIG.STATE);
    
    // Build the TikTok OAuth authorization URL
    const authUrl = buildAuthorizationUrl();
    
    console.log('Initiating TikTok OAuth flow...');
    console.log('Authorization URL:', authUrl);
    
    // ==========================================
    // REAL IMPLEMENTATION: Uncomment the line below when you have actual TikTok credentials
    // ==========================================
    // window.location.href = authUrl;
    
    // ==========================================
    // DEMO MODE: For testing without actual TikTok OAuth
    // Remove this section when implementing real OAuth
    // ==========================================
    console.log('DEMO MODE: Simulating successful TikTok login...');
    console.log('In production, user would be redirected to TikTok for authentication.');
    
    // Simulate OAuth callback with mock data
    simulateSuccessfulLogin();
}

/**
 * Build the complete TikTok OAuth authorization URL
 * This URL redirects users to TikTok for authentication
 */
function buildAuthorizationUrl() {
    const params = new URLSearchParams({
        client_key: TIKTOK_CONFIG.CLIENT_KEY,
        scope: TIKTOK_CONFIG.SCOPES,
        response_type: TIKTOK_CONFIG.RESPONSE_TYPE,
        redirect_uri: TIKTOK_CONFIG.REDIRECT_URI,
        state: TIKTOK_CONFIG.STATE
    });
    
    return `${TIKTOK_CONFIG.AUTHORIZATION_URL}?${params.toString()}`;
}

/**
 * Handle OAuth callback from TikTok
 * This function should be called when TikTok redirects back to your app
 * 
 * REAL IMPLEMENTATION STEPS:
 * 1. Extract 'code' and 'state' parameters from URL
 * 2. Verify state matches the one we sent (CSRF protection)
 * 3. Exchange authorization code for access token
 * 4. Use access token to fetch user profile
 * 5. Create user session
 * 6. Redirect to dashboard
 */
function handleOAuthCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const storedState = sessionStorage.getItem('oauth_state');
    
    // Verify state parameter to prevent CSRF attacks
    if (state !== storedState) {
        console.error('State mismatch - possible CSRF attack');
        alert('Authentication failed: Security check failed');
        return;
    }
    
    if (code) {
        console.log('Received authorization code:', code);
        
        // ==========================================
        // REAL IMPLEMENTATION: Exchange code for access token
        // This should be done on your backend server, never in client-side JavaScript
        // ==========================================
        /*
        fetch(TIKTOK_CONFIG.TOKEN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_key: TIKTOK_CONFIG.CLIENT_KEY,
                client_secret: 'YOUR_CLIENT_SECRET',  // Never expose this in client-side code!
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: TIKTOK_CONFIG.REDIRECT_URI
            })
        })
        .then(response => response.json())
        .then(data => {
            // Store access token securely (preferably in HttpOnly cookie set by backend)
            const accessToken = data.access_token;
            
            // Fetch user profile
            return fetchUserProfile(accessToken);
        })
        .then(userProfile => {
            // Store user session
            storeUserSession(userProfile);
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        })
        .catch(error => {
            console.error('OAuth error:', error);
            alert('Login failed. Please try again.');
        });
        */
    }
}

/**
 * Fetch user profile from TikTok API
 * Uses the access token obtained during OAuth flow
 * 
 * @param {string} accessToken - The OAuth access token
 * @returns {Promise} User profile data
 */
function fetchUserProfile(accessToken) {
    // TikTok User Info API endpoint
    const USER_INFO_URL = 'https://open.tiktokapis.com/v2/user/info/';
    
    return fetch(USER_INFO_URL, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        return {
            username: data.data.user.display_name,
            userId: data.data.user.open_id,
            profilePicture: data.data.user.avatar_url
        };
    });
}

/**
 * Store user session data
 * In a real app, this should be handled securely on the backend
 * 
 * @param {Object} userProfile - User profile data from TikTok
 */
function storeUserSession(userProfile) {
    // Store minimal user data in sessionStorage for the demo
    // In production, use secure server-side sessions
    sessionStorage.setItem('user_profile', JSON.stringify(userProfile));
    sessionStorage.setItem('is_authenticated', 'true');
}

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is logged in
 */
function isAuthenticated() {
    return sessionStorage.getItem('is_authenticated') === 'true';
}

/**
 * Get stored user profile
 * @returns {Object|null} User profile or null if not logged in
 */
function getUserProfile() {
    const profileData = sessionStorage.getItem('user_profile');
    return profileData ? JSON.parse(profileData) : null;
}

/**
 * Logout function - clears user session
 */
function logout() {
    sessionStorage.removeItem('user_profile');
    sessionStorage.removeItem('is_authenticated');
    sessionStorage.removeItem('oauth_state');
    window.location.href = 'index.html';
}

/**
 * ==========================================
 * DEMO MODE FUNCTIONS
 * Remove these when implementing real OAuth
 * ==========================================
 */

/**
 * Simulate successful login for demo purposes
 * This allows testing the UI without actual TikTok OAuth setup
 */
function simulateSuccessfulLogin() {
    // Create mock user data
    const mockUserProfile = {
        username: 'Demo User',
        userId: 'demo_' + Date.now(),
        profilePicture: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'120\' height=\'120\'%3E%3Ccircle cx=\'60\' cy=\'60\' r=\'60\' fill=\'%234CAF50\'/%3E%3C/svg%3E'
    };
    
    // Store mock session
    storeUserSession(mockUserProfile);
    
    // Redirect to dashboard
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 500);
}

/**
 * Initialize dashboard page
 * Loads and displays user information
 */
function initDashboard() {
    if (!isAuthenticated()) {
        // Redirect to home if not authenticated
        window.location.href = 'index.html';
        return;
    }
    
    const userProfile = getUserProfile();
    if (userProfile) {
        // Update dashboard with user info
        const usernameElement = document.getElementById('username');
        if (usernameElement) {
            usernameElement.textContent = userProfile.username;
        }
        
        console.log('Dashboard initialized for user:', userProfile.username);
    }
}

/**
 * ==========================================
 * PAGE INITIALIZATION
 * ==========================================
 */

// Initialize page when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the dashboard page
    if (window.location.pathname.includes('dashboard.html')) {
        initDashboard();
    }
    
    // Check for OAuth callback parameters
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('code')) {
        handleOAuthCallback();
    }
    
    console.log('HealthConnect Demo App Loaded');
    console.log('=================================');
    console.log('This is a DEMO application for TikTok OAuth testing');
    console.log('To implement real OAuth:');
    console.log('1. Register your app at https://developers.tiktok.com/');
    console.log('2. Get your Client Key and Client Secret');
    console.log('3. Update TIKTOK_CONFIG with your credentials');
    console.log('4. Uncomment the real OAuth implementation code');
    console.log('5. Remove the demo/simulation functions');
    console.log('=================================');
});

/**
 * ==========================================
 * SECURITY NOTES FOR REAL IMPLEMENTATION
 * ==========================================
 * 
 * 1. NEVER store Client Secret in client-side code
 * 2. Token exchange MUST happen on a secure backend server
 * 3. Use HttpOnly cookies for session management
 * 4. Implement CSRF protection with state parameter
 * 5. Use HTTPS for all OAuth redirects
 * 6. Validate and sanitize all user input
 * 7. Implement rate limiting on your backend
 * 8. Store access tokens securely (encrypted, server-side)
 * 9. Implement token refresh logic for long-lived sessions
 * 10. Follow TikTok's API usage guidelines and rate limits
 * 
 * For production use, consider using a backend framework with
 * built-in OAuth support (e.g., Node.js with Passport, Python Flask-Dance)
 */
