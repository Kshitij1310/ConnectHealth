import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ErrorBanner from '../components/ErrorBanner';
import tokenManager from '../auth/tokenManager';
import { exchangeCodeForToken, validateState } from '../auth/oauthFlow';
import { fetchUserInfo } from '../api/tiktokApi';
import './OAuthCallback.css';

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // GitHub Pages + HashRouter: URL format is /#/oauth/callback?code=XXX&state=YYY
    // useSearchParams() correctly extracts query parameters from the hash
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    console.log('OAuth Callback - Code:', code ? 'Present' : 'Missing');
    console.log('OAuth Callback - State:', state ? 'Present' : 'Missing');

    if (!code) {
      setError('Authorization code not found. Please try the login flow again.');
      setLoading(false);
      return;
    }

    if (!validateState(state)) {
      setError('Security validation failed. Please try again.');
      setLoading(false);
      return;
    }

    console.log('Starting token exchange...');
    // Exchange code for token
    exchangeCodeForToken(code)
      .then(async (tokenData) => {
        console.log('Token exchange successful!', tokenData);
        
        // Store token immediately
        tokenManager.storeToken(tokenData.accessToken, tokenData.expiresIn);
        console.log('Token stored in localStorage');

        // Redirect immediately to prevent hanging
        console.log('Navigating to /create-ad...');
        navigate('/create-ad', { replace: true });

        // Try to fetch user info in background (non-blocking)
        try {
          const userInfo = await fetchUserInfo();
          tokenManager.storeToken(tokenData.accessToken, tokenData.expiresIn, userInfo);
          console.log('User info updated:', userInfo);
        } catch (err) {
          console.warn('User info fetch failed (non-critical):', err.message);
        }
      })
      .catch((err) => {
        console.error('Token exchange failed:', err);
        setError(err.message || 'Failed to authenticate with TikTok.');
        setLoading(false);
      });
  }, [searchParams, navigate]);

  return (
    <div className="oauth-callback-container">
      <div className="oauth-callback-card">
        {loading ? (
          <>
            <div className="loading-spinner"></div>
            <h2>Authenticating...</h2>
            <p>Connecting to your TikTok account</p>
          </>
        ) : (
          <>
            <div className="error-icon">⚠️</div>
            <h2>Authentication Error</h2>
            <ErrorBanner message={error} onClose={() => navigate('/')} />
            <button
              onClick={() => navigate('/')}
              className="btn-primary"
            >
              Return to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}
