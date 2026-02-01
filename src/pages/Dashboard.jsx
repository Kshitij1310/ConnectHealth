import React, { useEffect, useState } from 'react';
import { getAuthorizationUrl, isAuthenticated, clearToken, getAccessToken } from '../auth/oauth';
import AdCreationForm from '../components/AdCreationForm';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [isAuth, setIsAuth] = useState(false);
  const [showAdForm, setShowAdForm] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    // Check authentication status
    const authStatus = isAuthenticated();
    setIsAuth(authStatus);
    setLoadingAuth(false);
  }, []);

  const handleConnect = () => {
    const authUrl = getAuthorizationUrl();
    window.location.href = authUrl;
  };

  const handleLogout = () => {
    clearToken();
    setIsAuth(false);
    setShowAdForm(false);
  };

  const handleAdSuccess = (adPayload) => {
    console.log('Ad created:', adPayload);
    setShowAdForm(false);
    // Could show success message or navigate here
  };

  if (loadingAuth) {
    return (
      <div className="dashboard">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>🎵 TikTok Ads Manager</h1>
          <p className="subtitle">HealthConnect OAuth Integration</p>
        </div>
        {isAuth && (
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        )}
      </header>

      <main className="dashboard-main">
        {!isAuth ? (
          // Unauthenticated state
          <div className="auth-section">
            <div className="auth-card">
              <div className="auth-icon">🔐</div>
              <h2>Connect Your TikTok Account</h2>
              <p>
                To create and manage TikTok ads, you need to authenticate with your TikTok account.
              </p>
              <p className="flow-description">
                You'll be securely redirected to TikTok to authorize HealthConnect.
              </p>
              <button onClick={handleConnect} className="btn-primary btn-large">
                Connect TikTok Ads Account
              </button>

              <div className="auth-info">
                <h3>What happens next:</h3>
                <ol>
                  <li>You'll be redirected to TikTok's login page</li>
                  <li>Log in with your TikTok account</li>
                  <li>Grant permission for basic account info</li>
                  <li>You'll be redirected back to create ads</li>
                </ol>
              </div>

              <div className="oauth-details">
                <h4>OAuth Flow Details</h4>
                <ul className="tech-details">
                  <li><strong>Grant Type:</strong> Authorization Code Flow</li>
                  <li><strong>Scope:</strong> user.info.basic</li>
                  <li><strong>Token Storage:</strong> localStorage (secure in production)</li>
                  <li><strong>CSRF Protection:</strong> State parameter validation</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          // Authenticated state
          <div className="authenticated-section">
            <div className="user-status">
              <div className="status-badge">
                <span className="badge-icon">✓</span>
                <span>TikTok Account Connected</span>
              </div>
              <p className="token-info">
                Access token stored securely in localStorage
              </p>
            </div>

            {!showAdForm ? (
              <div className="action-card">
                <h2>Ready to Create Your First Campaign?</h2>
                <p>
                  Use our ad creation form to set up your TikTok ads with strict validation
                  and human-readable error handling.
                </p>
                <button
                  onClick={() => setShowAdForm(true)}
                  className="btn-primary btn-large"
                >
                  Create New Ad Campaign
                </button>

                <div className="features">
                  <h3>Form Features:</h3>
                  <ul>
                    <li>✓ Real-time field validation</li>
                    <li>✓ Conditional music requirements (Conversions vs Traffic)</li>
                    <li>✓ Multiple music options (Existing ID, Custom, None)</li>
                    <li>✓ Inline error messages</li>
                    <li>✓ Character count for ad text</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="form-wrapper">
                <button
                  onClick={() => setShowAdForm(false)}
                  className="btn-back"
                >
                  ← Back
                </button>
                <AdCreationForm
                  accessToken={getAccessToken()}
                  onSuccess={handleAdSuccess}
                />
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="dashboard-footer">
        <div className="footer-content">
          <p>
            ℹ️ <strong>Production Note:</strong> In a production environment, the OAuth token
            exchange must occur on a secure backend server. This frontend implementation is for
            assignment purposes only.
          </p>
          <p>
            <a href="/ConnectHealth/terms.html" target="_blank" rel="noopener noreferrer">Terms of Service</a> |
            <a href="/ConnectHealth/privacy.html" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
