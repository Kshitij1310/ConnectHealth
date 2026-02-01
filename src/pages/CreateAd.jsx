import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorBanner from '../components/ErrorBanner';
import FormField from '../components/FormField';
import AdCard from '../components/AdCard';
import AdPreview from '../components/AdPreview';
import tokenManager from '../auth/tokenManager';
import {
  validateAdForm,
  validateMusicSelection,
} from '../utils/validators';
import { generateMockMusicId, validateMusicId } from '../api/tiktokApi';
import './CreateAd.css';

export default function CreateAd() {
  const navigate = useNavigate();
  const [globalError, setGlobalError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    campaignName: '',
    objective: '',
    adText: '',
    cta: '',
    musicOption: '',
    musicId: '',
    customMusicUpload: false,
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [ads, setAds] = useState([]);
  const [selectedAd, setSelectedAd] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Load saved campaigns from localStorage on mount
  useEffect(() => {
    const savedCampaigns = localStorage.getItem('campaigns');
    if (savedCampaigns) {
      try {
        const campaigns = JSON.parse(savedCampaigns);
        setAds(campaigns);
        console.log('Loaded', campaigns.length, 'campaigns from localStorage');
      } catch (error) {
        console.error('Failed to load campaigns:', error);
      }
    }
  }, []);

  // Save campaigns to localStorage whenever ads state changes
  useEffect(() => {
    if (ads.length > 0) {
      localStorage.setItem('campaigns', JSON.stringify(ads));
      console.log('Saved', ads.length, 'campaigns to localStorage');
    }
  }, [ads]);

  // Check authentication on mount - ONLY check if token exists, not validity
  useEffect(() => {
    console.log('CreateAd mounted - checking token presence');
    const token = tokenManager.getToken();
    console.log('Token:', token ? 'Present' : 'Missing');
    
    // Only redirect if NO token exists at all
    if (!token) {
      console.log('No token found - redirecting to home');
      navigate('/');
    } else {
      console.log('Token present - rendering form (validity checked on API calls)');
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleMusicOptionChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      musicOption: value,
      musicId: '',
      customMusicUpload: false,
    }));
    if (fieldErrors.music) {
      setFieldErrors((prev) => ({
        ...prev,
        music: '',
      }));
    }
  };

  const handleMusicUpload = () => {
    const musicId = generateMockMusicId();
    setFormData((prev) => ({
      ...prev,
      musicId,
      customMusicUpload: true,
      musicOption: 'custom',
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setGlobalError(null);
    setSuccessMessage(null);

    // Validate form
    const validation = validateAdForm(formData);

    if (!validation.valid) {
      setFieldErrors(validation.errors);
      setGlobalError('Please fix the errors below and try again.');
      return;
    }

    // Additional validation for custom music
    if (formData.musicOption === 'custom' && formData.musicId) {
      const musicValidation = validateMusicId(formData.musicId);
      if (!musicValidation.valid) {
        setFieldErrors((prev) => ({
          ...prev,
          music: musicValidation.error,
        }));
        setGlobalError('Please fix the errors below and try again.');
        return;
      }
    }

    // Simulate API submission
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Create ad object and add to ads array
      const newAd = {
        id: Date.now(), // Simple unique ID
        campaignName: formData.campaignName,
        objective: formData.objective,
        adText: formData.adText,
        cta: formData.cta,
        musicOption: formData.musicOption,
        musicId: formData.musicId,
        createdAt: new Date().toLocaleString(),
      };

      setAds((prevAds) => [newAd, ...prevAds]); // Add new ad to top
      
      setSuccessMessage(
        `✓ Ad campaign "${formData.campaignName}" created successfully!`
      );
      setFormData({
        campaignName: '',
        objective: '',
        adText: '',
        cta: '',
        musicOption: '',
        musicId: '',
        customMusicUpload: false,
      });
      setFieldErrors({});

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    }, 500);
  };

  const handleViewAd = (ad) => {
    setSelectedAd(ad);
    setShowPreview(true);
  };

  const handleDeleteAd = (adId) => {
    if (
      window.confirm(
        'Are you sure you want to delete this ad campaign? This action cannot be undone.'
      )
    ) {
      setAds((prevAds) => prevAds.filter((ad) => ad.id !== adId));
    }
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    setSelectedAd(null);
  };

  const handleLogout = () => {
    tokenManager.clearToken();
    navigate('/');
  };

  const user = tokenManager.getUser();
  const isFormValid = Object.keys(fieldErrors).every((key) => !fieldErrors[key]);

  return (
    <div className="create-ad-container">
      <div className="create-ad-header">
        <div className="header-left">
          <h1>Create TikTok Ads Campaign</h1>
          {user && <p className="user-info">Connected as: {user.display_name}</p>}
        </div>
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </div>

      {globalError && (
        <ErrorBanner
          message={globalError}
          onClose={() => setGlobalError(null)}
        />
      )}

      {successMessage && (
        <div className="success-banner">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="create-ad-form">
        {/* Campaign Name */}
        <FormField
          label="Campaign Name"
          name="campaignName"
          value={formData.campaignName}
          onChange={handleInputChange}
          error={fieldErrors.campaignName}
          required
          placeholder="e.g., Q1 Spring Launch"
          helperText="3-255 characters. Letters, numbers, spaces, hyphens, underscores only."
        />

        {/* Objective */}
        <FormField label="Campaign Objective" name="objective" required>
          <select
            name="objective"
            value={formData.objective}
            onChange={handleInputChange}
            className={`form-field-input ${fieldErrors.objective ? 'has-error' : ''}`}
          >
            <option value="">Select an objective...</option>
            <option value="traffic">Traffic</option>
            <option value="conversions">Conversions</option>
          </select>
          {fieldErrors.objective && (
            <div className="error-message">{fieldErrors.objective}</div>
          )}
        </FormField>

        {/* Ad Text */}
        <FormField
          label="Ad Text"
          name="adText"
          value={formData.adText}
          onChange={handleInputChange}
          error={fieldErrors.adText}
          required
          placeholder="Write engaging ad copy..."
          helperText={`${formData.adText.length}/100 characters`}
        />

        {/* CTA */}
        <FormField label="Call-to-Action (CTA)" name="cta" required>
          <select
            name="cta"
            value={formData.cta}
            onChange={handleInputChange}
            className={`form-field-input ${fieldErrors.cta ? 'has-error' : ''}`}
          >
            <option value="">Select CTA...</option>
            <option value="learn_more">Learn More</option>
            <option value="shop_now">Shop Now</option>
            <option value="sign_up">Sign Up</option>
            <option value="download">Download</option>
            <option value="contact_us">Contact Us</option>
          </select>
          {fieldErrors.cta && (
            <div className="error-message">{fieldErrors.cta}</div>
          )}
        </FormField>

        {/* Music Selection */}
        <div className="form-section">
          <label className="form-section-title">
            Music Selection
            <span className="required-indicator">*</span>
          </label>

          <div className="radio-group">
            <div className="radio-option">
              <input
                type="radio"
                id="music-existing"
                name="musicOption"
                value="existing"
                checked={formData.musicOption === 'existing'}
                onChange={handleMusicOptionChange}
              />
              <label htmlFor="music-existing">Use Existing Music ID</label>
            </div>

            {formData.musicOption === 'existing' && (
              <div className="radio-details">
                <FormField
                  name="musicId"
                  value={formData.musicId}
                  onChange={handleInputChange}
                  error={fieldErrors.music}
                  placeholder="e.g., music_abc123"
                  helperText="Must be a valid TikTok music ID"
                />
              </div>
            )}

            <div className="radio-option">
              <input
                type="radio"
                id="music-custom"
                name="musicOption"
                value="custom"
                checked={formData.musicOption === 'custom'}
                onChange={handleMusicOptionChange}
              />
              <label htmlFor="music-custom">Upload Custom Music</label>
            </div>

            {formData.musicOption === 'custom' && (
              <div className="radio-details">
                {!formData.customMusicUpload ? (
                  <button
                    type="button"
                    onClick={handleMusicUpload}
                    className="btn-upload"
                  >
                    📁 Simulate Music Upload
                  </button>
                ) : (
                  <div className="upload-success">
                    ✓ Music uploaded: {formData.musicId}
                  </div>
                )}
              </div>
            )}

            <div className="radio-option">
              <input
                type="radio"
                id="music-none"
                name="musicOption"
                value="none"
                checked={formData.musicOption === 'none'}
                onChange={handleMusicOptionChange}
              />
              <label htmlFor="music-none">No Music</label>
              <span className="music-note">
                Only available for "Traffic" objective
              </span>
            </div>

            {fieldErrors.music && formData.musicOption === 'none' && (
              <div className="error-message">{fieldErrors.music}</div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn-submit"
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Campaign'}
        </button>
      </form>

      {/* Created Ads Section */}
      {ads.length > 0 && (
        <div className="created-ads-section">
          <h2>📋 Created Ads ({ads.length})</h2>
          <div className="ads-grid">
            {ads.map((ad) => (
              <AdCard
                key={ad.id}
                ad={ad}
                onView={handleViewAd}
                onDelete={handleDeleteAd}
              />
            ))}
          </div>
        </div>
      )}

      {/* Ad Preview Modal */}
      {showPreview && selectedAd && (
        <AdPreview ad={selectedAd} onClose={handleClosePreview} />
      )}

      {/* Helpful Info */}
      <div className="info-box">
        <h3>ℹ️ Important Notes</h3>
        <ul>
          <li>
            <strong>Music & Objective:</strong> If you select "Conversions",
            music is required. "Traffic" campaigns can run without music.
          </li>
          <li>
            <strong>Custom Music:</strong> Simulated upload generates a mock
            music ID. In production, this would connect to a real music library.
          </li>
          <li>
            <strong>Real Token:</strong> Your access token is securely stored
            and valid for{' '}
            {Math.floor(tokenManager.getTimeRemaining() / 60)} minutes.
          </li>
        </ul>
      </div>
    </div>
  );
}
