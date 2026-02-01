import React from 'react';
import './AdCard.css';

export default function AdCard({ ad, onView, onDelete }) {
  const getMusicTypeLabel = (musicOption) => {
    switch (musicOption) {
      case 'existing':
        return 'Existing Music';
      case 'custom':
        return 'Custom Music';
      case 'none':
        return 'No Music';
      default:
        return 'Music';
    }
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
    <div className="ad-card">
      <div className="ad-card-header">
        <h3 className="ad-campaign-name">{ad.campaignName}</h3>
        <div className="ad-badge">{getObjectiveLabel(ad.objective)}</div>
      </div>

      <div className="ad-card-body">
        <div className="ad-field">
          <label>Ad Text</label>
          <p className="ad-text-preview">{ad.adText}</p>
        </div>

        <div className="ad-field-row">
          <div className="ad-field">
            <label>CTA</label>
            <p className="ad-field-value">{getCTALabel(ad.cta)}</p>
          </div>
          <div className="ad-field">
            <label>Music</label>
            <p className="ad-field-value">{getMusicTypeLabel(ad.musicOption)}</p>
          </div>
        </div>

        {ad.musicId && (
          <div className="ad-field">
            <label>Music ID</label>
            <p className="ad-field-value music-id">{ad.musicId}</p>
          </div>
        )}

        <div className="ad-field-meta">
          <small>Created: {ad.createdAt}</small>
        </div>
      </div>

      <div className="ad-card-footer">
        <button
          onClick={() => onView(ad)}
          className="btn-view"
          title="View full details"
        >
          👁️ View
        </button>
        <button
          onClick={() => onDelete(ad.id)}
          className="btn-delete"
          title="Delete this ad"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}
