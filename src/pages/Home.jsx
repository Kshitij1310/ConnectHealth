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
          <h1>TikTok Ads Manager</h1>
          <p>Create and manage TikTok ad campaigns</p>
        </div>

        {!isAuthenticated ? (
          <div className="auth-section">
            <div className="auth-card">
              <div className="icon-large">🎬</div>
              <h2>Get Started</h2>
              <p>Connect your TikTok account to create ad campaigns</p>

              <button onClick={handleConnect} className="btn-connect">
                🔐 Connect TikTok Account
              </button>
            </div>
          </div>
        ) : (
          <div className="authenticated-section">
            <div className="success-card">
              <div className="icon-large">✓</div>
              <h2>Ready to Go!</h2>
              <p>You're connected to TikTok</p>

              <button onClick={handleCreateAd} className="btn-primary">
                Create Campaign →
              </button>

              <button onClick={handleLogout} className="btn-secondary">
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Key Features */}
        <div className="info-grid">
          <div className="info-card">
            <div className="info-icon">🔐</div>
            <h3>Secure OAuth</h3>
            <p>Real TikTok OAuth 2.0 authentication with secure token storage</p>
          </div>

          <div className="info-card">
            <div className="info-icon">📋</div>
            <h3>Smart Forms</h3>
            <p>Validated campaign forms with conditional field requirements</p>
          </div>

          <div className="info-card">
            <div className="info-icon">💾</div>
            <h3>Local Storage</h3>
            <p>Campaigns saved locally and persist across sessions</p>
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
