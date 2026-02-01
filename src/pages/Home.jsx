import React from 'react';
import { useNavigate } from 'react-router-dom';
import { generateAuthorizationUrl } from '../auth/oauthFlow';
import tokenManager from '../auth/tokenManager';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const isAuthenticated = tokenManager.isTokenValid();

  const handleConnect = () => {
    const authUrl = generateAuthorizationUrl();
    window.location.href = authUrl;
  };

  const handleCreateAd = () => {
    navigate('/create-ad');
  };

  const handleLogout = () => {
    tokenManager.clearToken();
    window.location.reload();
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="home-hero">
          <h1>ConnectHealth TikTok Ads</h1>
          <p>Create and manage your TikTok advertising campaigns with ease</p>
        </div>

        {!isAuthenticated ? (
          <div className="auth-section">
            <div className="auth-card">
              <div className="icon-large">🎬</div>
              <h2>Connect Your TikTok Account</h2>
              <p>
                Use OAuth 2.0 Authorization Code Flow to securely authenticate
                with your TikTok account. Your access token will be stored
                locally.
              </p>

              <button onClick={handleConnect} className="btn-connect">
                🔐 Connect TikTok Account
              </button>

              <div className="oauth-info">
                <h3>How it works:</h3>
                <ol>
                  <li>Click the button above to initiate OAuth flow</li>
                  <li>
                    You'll be redirected to TikTok's login page (if not already
                    logged in)
                  </li>
                  <li>Authorize the app to access basic user information</li>
                  <li>You'll be redirected back with an access token</li>
                  <li>Create your first TikTok ad campaign</li>
                </ol>
              </div>
            </div>
          </div>
        ) : (
          <div className="authenticated-section">
            <div className="success-card">
              <div className="icon-large">✓</div>
              <h2>Authentication Successful!</h2>
              <p>You're connected to TikTok. Ready to create your first ad campaign.</p>

              <button onClick={handleCreateAd} className="btn-primary">
                Create Ad Campaign →
              </button>

              <button onClick={handleLogout} className="btn-secondary">
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Information Boxes */}
        <div className="info-grid">
          <div className="info-card">
            <div className="info-icon">🔒</div>
            <h3>Real OAuth 2.0</h3>
            <p>
              This application uses real TikTok OAuth 2.0 Authorization Code
              Flow. Your credentials are handled securely through TikTok's
              official OAuth endpoints.
            </p>
          </div>

          <div className="info-card">
            <div className="info-icon">💾</div>
            <h3>Local Storage</h3>
            <p>
              Your access token is stored in browser localStorage. It's not
              sent to any external servers (frontend-only implementation).
            </p>
          </div>

          <div className="info-card">
            <div className="info-icon">🎯</div>
            <h3>Ad Management</h3>
            <p>
              Create campaigns with flexible options for objectives, CTAs, and
              music. Smart validation ensures your ads meet platform
              requirements.
            </p>
          </div>

          <div className="info-card">
            <div className="info-icon">⚠️</div>
            <h3>Frontend-Only Note</h3>
            <p>
              Token exchange happens on the frontend for this assignment. In
              production, this critical step should always run on a secure
              backend.
            </p>
          </div>
        </div>

        {/* Technical Details */}
        <div className="technical-box">
          <h2>Technical Details</h2>
          <div className="tech-grid">
            <div className="tech-item">
              <strong>OAuth App:</strong> HealthConnect (Production)
            </div>
            <div className="tech-item">
              <strong>Redirect URI:</strong>{' '}
              https://kshitij1310.github.io/ConnectHealth/oauth/callback
            </div>
            <div className="tech-item">
              <strong>Scope:</strong> user.info.basic
            </div>
            <div className="tech-item">
              <strong>Authorization Endpoint:</strong>{' '}
              https://www.tiktok.com/v2/auth/authorize/
            </div>
            <div className="tech-item">
              <strong>Token Endpoint:</strong>{' '}
              https://open.tiktokapis.com/v2/oauth/token/
            </div>
            <div className="tech-item">
              <strong>State Management:</strong> Secure random string validation
            </div>
          </div>
        </div>
      </div>

      <footer className="home-footer">
        <p>
          © 2025 ConnectHealth - TikTok Ads Management |{' '}
          <a href="/ConnectHealth/terms.html" target="_blank" rel="noopener noreferrer">
            Terms
          </a>
          {' '} |{' '}
          <a href="/ConnectHealth/privacy.html" target="_blank" rel="noopener noreferrer">
            Privacy
          </a>
        </p>
      </footer>
    </div>
  );
}
