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

    // Exchange code for token
    exchangeCodeForToken(code)
      .then(async (tokenData) => {
        // Store token
        tokenManager.storeToken(tokenData.accessToken, tokenData.expiresIn);

        // Try to fetch user info for better UX
        try {
          const userInfo = await fetchUserInfo();
          tokenManager.storeToken(
            tokenData.accessToken,
            tokenData.expiresIn,
            userInfo
          );
        } catch (err) {
          // User info fetch failed, but token is valid
          // Continue with just the token
          console.warn('Could not fetch user info:', err.message);
        }

        // Redirect to ad creation form
        setTimeout(() => {
          navigate('/create-ad');
        }, 1500);
      })
      .catch((err) => {
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
