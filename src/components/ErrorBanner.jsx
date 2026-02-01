import React from 'react';
import './ErrorBanner.css';

export default function ErrorBanner({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="error-banner">
      <div className="error-banner-content">
        <span className="error-banner-icon">⚠️</span>
        <span className="error-banner-message">{message}</span>
        <button className="error-banner-close" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
}
