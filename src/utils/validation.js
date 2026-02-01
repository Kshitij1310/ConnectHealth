/**
 * Ad form validation
 */
export const validateAdForm = (formData) => {
  const errors = {};

  // Campaign Name
  if (!formData.campaignName || formData.campaignName.trim().length < 3) {
    errors.campaignName = 'Campaign name must be at least 3 characters';
  }

  // Objective
  if (!formData.objective || !['traffic', 'conversions'].includes(formData.objective)) {
    errors.objective = 'Please select a valid objective';
  }

  // Ad Text
  if (!formData.adText || formData.adText.trim().length === 0) {
    errors.adText = 'Ad text is required';
  }
  if (formData.adText && formData.adText.length > 100) {
    errors.adText = `Ad text must be 100 characters or less (${formData.adText.length}/100)`;
  }

  // CTA
  if (!formData.cta || formData.cta.trim().length === 0) {
    errors.cta = 'Call-to-action is required';
  }

  // Music validation - critical logic
  if (formData.musicOption === 'existing') {
    if (!formData.musicId || formData.musicId.trim().length === 0) {
      errors.musicId = 'Music ID is required';
    }
    if (formData.musicId && !/^\d+$/.test(formData.musicId.trim())) {
      errors.musicId = 'Music ID must contain only numbers';
    }
  } else if (formData.musicOption === 'custom') {
    if (!formData.customMusicId) {
      errors.customMusicId = 'Please upload custom music';
    }
  } else if (formData.musicOption === 'none') {
    // Conversions objective requires music
    if (formData.objective === 'conversions') {
      errors.musicOption = 'Music is required for conversion ads';
    }
  }

  return errors;
};

/**
 * Check if form has any errors
 */
export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0;
};

/**
 * Get error message for a field
 */
export const getFieldError = (errors, fieldName) => {
  return errors[fieldName] || null;
};
