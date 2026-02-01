import React from 'react';
import './AdPreview.css';

const AdPreview = ({ ad, onClose }) => {
  if (!ad) return null;

  const getMusicTypeLabel = (option) => {
    const labels = {
      existing: 'Existing Music',
      custom: 'Custom Audio',
      no_music: 'No Music',
    };
    return labels[option] || option;
  };

  const getObjectiveLabel = (objective) => {
    return objective.charAt(0).toUpperCase() + objective.slice(1);
  };

  const getCTALabel = (cta) => {
    return cta
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="ad-preview-overlay">
      <div className="ad-preview-modal">
        <div className="ad-preview-header">
          <h2>Ad Preview</h2>
          <button className="btn-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="ad-preview-body">
          <div className="preview-section">
            <div className="preview-row">
              <div className="preview-field">
                <label>Campaign Name</label>
                <p className="preview-value">{ad.campaignName}</p>
              </div>
              <div className="preview-field">
                <label>Objective</label>
                <div className="objective-badge">{getObjectiveLabel(ad.objective)}</div>
              </div>
            </div>
          </div>

          <div className="preview-section">
            <div className="preview-field">
              <label>Ad Text</label>
              <p className="preview-value preview-ad-text">{ad.adText}</p>
            </div>
          </div>

          <div className="preview-section">
            <div className="preview-field">
              <label>Call-to-Action</label>
              <p className="preview-value">{getCTALabel(ad.cta)}</p>
            </div>
          </div>

          <div className="preview-section">
            <div className="preview-row">
              <div className="preview-field">
                <label>Music Option</label>
                <p className="preview-value">{getMusicTypeLabel(ad.musicOption)}</p>
              </div>
              {ad.musicId && ad.musicOption !== 'no_music' && (
                <div className="preview-field">
                  <label>Music ID</label>
                  <p className="preview-value preview-music-id">{ad.musicId}</p>
                </div>
              )}
            </div>
          </div>

          <div className="preview-section">
            <div className="preview-field">
              <label>Created</label>
              <p className="preview-value preview-timestamp">{ad.createdAt}</p>
            </div>
          </div>
        </div>

        <div className="ad-preview-footer">
          <button className="btn-close-modal" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdPreview;
