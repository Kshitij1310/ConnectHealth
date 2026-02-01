import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { validateState, exchangeCodeForToken, OAuthError } from '../auth/oauth';
import '../styles/OAuthCallback.css';

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');

        // Step 1: Validate state parameter
        if (!state || !validateState(state)) {
          throw new Error('Invalid state parameter. OAuth handshake validation failed.');
        }

        // Step 2: Check authorization code
        if (!code) {
          throw new Error('No authorization code received. Please try connecting again.');
        }

        setStatus('exchanging');

        // Step 3: Exchange code for token
        const tokenData = await exchangeCodeForToken(code);

        setStatus('success');
        
        // Redirect to dashboard
        setTimeout(() => {
          navigate('/');
        }, 2000);

      } catch (err) {
        console.error('OAuth callback error:', err);
        
        let errorMessage = 'An unexpected error occurred.';
        
        if (err instanceof OAuthError) {
          errorMessage = err.message;
        } else {
          errorMessage = err.message;
        }
        
        setStatus('error');
        setError(errorMessage);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="oauth-callback-container">
      <div className="callback-card">
        {status === 'processing' && (
          <>
            <div className="spinner"></div>
            <h1>Connecting your TikTok account...</h1>
            <p>Validating your OAuth handshake</p>
          </>
        )}

        {status === 'exchanging' && (
          <>
            <div className="spinner"></div>
            <h1>Exchanging authorization code...</h1>
            <p>Getting your access token</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="success-icon">✓</div>
            <h1>Successfully authenticated!</h1>
            <p>Redirecting to dashboard...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="error-icon">✕</div>
            <h1>Authentication failed</h1>
            <p className="error-message">{error}</p>
            <button onClick={() => navigate('/')} className="btn-primary">
              Return to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}
