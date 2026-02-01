import React, { useState } from 'react';
import { validateMusicId, generateMockMusicId, validateMusicIdWithApi } from '../utils/musicValidation';
import { validateAdForm, hasErrors, getFieldError } from '../utils/validation';
import '../styles/AdCreationForm.css';

export default function AdCreationForm({ accessToken, onSuccess }) {
  const [formData, setFormData] = useState({
    campaignName: '',
    objective: 'traffic',
    adText: '',
    cta: 'Learn More',
    musicOption: 'existing',
    musicId: '',
    customMusicId: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle objective change (validate music rules)
  const handleObjectiveChange = (e) => {
    const newObjective = e.target.value;
    setFormData(prev => ({
      ...prev,
      objective: newObjective,
    }));
    
    // Clear music-related errors
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.musicOption;
      delete newErrors.musicId;
      delete newErrors.customMusicId;
      return newErrors;
    });
  };

  // Handle music option change
  const handleMusicOptionChange = (option) => {
    setFormData(prev => ({
      ...prev,
      musicOption: option,
    }));
    
    // Clear music-related errors
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.musicOption;
      delete newErrors.musicId;
      delete newErrors.customMusicId;
      return newErrors;
    });
  };

  // Simulate custom music upload
  const handleCustomMusicUpload = async () => {
    const mockMusicId = generateMockMusicId();
    setFormData(prev => ({
      ...prev,
      customMusicId: mockMusicId,
    }));
    setSuccessMessage('Custom music uploaded successfully');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Validate and submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    
    // Validate form
    const validationErrors = validateAdForm(formData);
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    // Additional API validation for existing music ID
    if (formData.musicOption === 'existing') {
      setIsSubmitting(true);
      try {
        const musicValidation = await validateMusicIdWithApi(formData.musicId);
        if (!musicValidation.valid) {
          setErrors(prev => ({
            ...prev,
            musicId: musicValidation.error,
          }));
          setIsSubmitting(false);
          return;
        }
      } catch (error) {
        setSubmitError('Failed to validate music ID. Please try again.');
        setIsSubmitting(false);
        return;
      }
    }

    // Submit to TikTok API (simulated)
    try {
      setIsSubmitting(true);
      
      // In production, send to backend which will call TikTok API
      // For now, simulate successful submission
      const adPayload = {
        campaign_name: formData.campaignName,
        objective: formData.objective,
        ad_text: formData.adText,
        cta: formData.cta,
        music_id: formData.musicOption === 'none' ? null : 
                  (formData.musicOption === 'custom' ? formData.customMusicId : formData.musicId),
      };

      // Simulate API call
      console.log('Submitting ad with payload:', adPayload);
      
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSuccessMessage('Ad created successfully! 🎉');
      onSuccess?.(adPayload);
      
      // Reset form
      setFormData({
        campaignName: '',
        objective: 'traffic',
        adText: '',
        cta: 'Learn More',
        musicOption: 'existing',
        musicId: '',
        customMusicId: null,
      });
    } catch (error) {
      setSubmitError(error.message || 'Failed to create ad. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = !hasErrors(errors) && 
                      formData.campaignName.length >= 3 && 
                      formData.adText.length > 0;

  const showMusicRequired = formData.objective === 'conversions' && formData.musicOption === 'none';

  return (
    <div className="ad-form-container">
      <h2>Create TikTok Ads Campaign</h2>
      
      {submitError && (
        <div className="error-banner">
          <p>{submitError}</p>
        </div>
      )}

      {successMessage && (
        <div className="success-banner">
          <p>{successMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Campaign Name */}
        <div className="form-group">
          <label htmlFor="campaignName">Campaign Name *</label>
          <input
            type="text"
            id="campaignName"
            name="campaignName"
            value={formData.campaignName}
            onChange={handleInputChange}
            placeholder="e.g., Summer Health Campaign"
            className={getFieldError(errors, 'campaignName') ? 'input-error' : ''}
          />
          {getFieldError(errors, 'campaignName') && (
            <span className="field-error">{getFieldError(errors, 'campaignName')}</span>
          )}
        </div>

        {/* Objective */}
        <div className="form-group">
          <label htmlFor="objective">Objective *</label>
          <select
            id="objective"
            name="objective"
            value={formData.objective}
            onChange={handleObjectiveChange}
          >
            <option value="traffic">Traffic</option>
            <option value="conversions">Conversions</option>
          </select>
          {getFieldError(errors, 'objective') && (
            <span className="field-error">{getFieldError(errors, 'objective')}</span>
          )}
        </div>

        {/* Ad Text */}
        <div className="form-group">
          <label htmlFor="adText">Ad Text * ({formData.adText.length}/100)</label>
          <textarea
            id="adText"
            name="adText"
            value={formData.adText}
            onChange={handleInputChange}
            placeholder="Write your ad copy here..."
            maxLength="100"
            rows="3"
            className={getFieldError(errors, 'adText') ? 'input-error' : ''}
          />
          {getFieldError(errors, 'adText') && (
            <span className="field-error">{getFieldError(errors, 'adText')}</span>
          )}
        </div>

        {/* CTA */}
        <div className="form-group">
          <label htmlFor="cta">Call-to-Action *</label>
          <select
            id="cta"
            name="cta"
            value={formData.cta}
            onChange={handleInputChange}
          >
            <option value="Learn More">Learn More</option>
            <option value="Sign Up">Sign Up</option>
            <option value="Shop Now">Shop Now</option>
            <option value="Download">Download</option>
            <option value="Book Now">Book Now</option>
          </select>
          {getFieldError(errors, 'cta') && (
            <span className="field-error">{getFieldError(errors, 'cta')}</span>
          )}
        </div>

        {/* Music Selection */}
        <div className="music-section">
          <h3>Music Selection</h3>
          
          {formData.objective === 'conversions' && (
            <div className="info-message">
              ℹ️ Music is required for conversion campaigns
            </div>
          )}

          <div className="music-options">
            {/* Option A: Existing Music */}
            <div className="music-option">
              <label>
                <input
                  type="radio"
                  name="musicOption"
                  value="existing"
                  checked={formData.musicOption === 'existing'}
                  onChange={() => handleMusicOptionChange('existing')}
                />
                <span className="option-title">Use Existing Music ID</span>
              </label>
              {formData.musicOption === 'existing' && (
                <div className="option-content">
                  <input
                    type="text"
                    name="musicId"
                    value={formData.musicId}
                    onChange={handleInputChange}
                    placeholder="e.g., 6922529837349149190"
                    className={getFieldError(errors, 'musicId') ? 'input-error' : ''}
                  />
                  {getFieldError(errors, 'musicId') && (
                    <span className="field-error">{getFieldError(errors, 'musicId')}</span>
                  )}
                </div>
              )}
            </div>

            {/* Option B: Custom Music */}
            <div className="music-option">
              <label>
                <input
                  type="radio"
                  name="musicOption"
                  value="custom"
                  checked={formData.musicOption === 'custom'}
                  onChange={() => handleMusicOptionChange('custom')}
                />
                <span className="option-title">Upload Custom Music</span>
              </label>
              {formData.musicOption === 'custom' && (
                <div className="option-content">
                  {formData.customMusicId ? (
                    <div className="music-uploaded">
                      <p>✓ Music uploaded (ID: {formData.customMusicId})</p>
                      <button
                        type="button"
                        onClick={handleCustomMusicUpload}
                        className="btn-secondary"
                      >
                        Replace Music
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleCustomMusicUpload}
                      className="btn-secondary"
                    >
                      Upload Music File
                    </button>
                  )}
                  {getFieldError(errors, 'customMusicId') && (
                    <span className="field-error">{getFieldError(errors, 'customMusicId')}</span>
                  )}
                </div>
              )}
            </div>

            {/* Option C: No Music */}
            <div className="music-option">
              <label>
                <input
                  type="radio"
                  name="musicOption"
                  value="none"
                  checked={formData.musicOption === 'none'}
                  onChange={() => handleMusicOptionChange('none')}
                  disabled={formData.objective === 'conversions'}
                />
                <span className="option-title">
                  No Music
                  {formData.objective === 'conversions' && ' (Not allowed)'}
                </span>
              </label>
              {showMusicRequired && (
                <span className="field-error">Music is required for conversion ads</span>
              )}
            </div>
          </div>

          {getFieldError(errors, 'musicOption') && (
            <span className="field-error">{getFieldError(errors, 'musicOption')}</span>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn-primary"
          disabled={!isFormValid || isSubmitting || showMusicRequired}
        >
          {isSubmitting ? 'Creating Ad...' : 'Create Ad Campaign'}
        </button>
      </form>

      <div className="form-note">
        <p>* Required fields</p>
        <p className="production-note">
          Note: This form demonstrates validation. In production, the ad payload would be sent to your backend server, which would then securely call the TikTok API.
        </p>
      </div>
    </div>
  );
}
