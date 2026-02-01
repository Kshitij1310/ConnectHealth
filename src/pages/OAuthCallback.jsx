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
        console.log('Token exchange successful!');
        // Store token FIRST so it's available for user info fetch
        tokenManager.storeToken(tokenData.accessToken, tokenData.expiresIn);

        // Now fetch user info with the stored token
        try {
          console.log('Fetching user info...');
          const userInfo = await fetchUserInfo();
          // Update token storage with user info
          tokenManager.storeToken(
            tokenData.accessToken,
            tokenData.expiresIn,
            userInfo
          );
          console.log('User info fetched successfully:', userInfo);
        } catch (err) {
          // User info fetch failed, but token is valid - continue anyway
          console.warn('Could not fetch user info (continuing anyway):', err.message);
        }

        // Redirect to ad creation form
        console.log('Redirecting to create-ad page...');
        setTimeout(() => {
          navigate('/create-ad');
        }, 1000);
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
