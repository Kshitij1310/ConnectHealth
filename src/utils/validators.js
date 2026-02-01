import { VALIDATION_RULES } from '../config/constants';

export function validateCampaignName(name) {
  if (!name) {
    return { valid: false, error: 'Campaign name is required' };
  }

  const rule = VALIDATION_RULES.campaignName;

  if (name.length < rule.minLength) {
    return { valid: false, error: rule.errorMessage.minLength };
  }

  if (name.length > rule.maxLength) {
    return { valid: false, error: rule.errorMessage.maxLength };
  }

  if (!rule.pattern.test(name)) {
    return { valid: false, error: rule.errorMessage.pattern };
  }

  return { valid: true };
}

export function validateObjective(objective) {
  const validObjectives = ['traffic', 'conversions'];
  if (!objective || !validObjectives.includes(objective)) {
    return { valid: false, error: 'Please select a valid objective' };
  }
  return { valid: true };
}

export function validateAdText(text) {
  if (!text) {
    return { valid: false, error: 'Ad text is required' };
  }

  const rule = VALIDATION_RULES.adText;
  if (text.length > rule.maxLength) {
    return { valid: false, error: rule.errorMessage.maxLength };
  }

  return { valid: true };
}

export function validateCTA(cta) {
  if (!cta) {
    return { valid: false, error: 'CTA is required' };
  }
  return { valid: true };
}

export function validateMusicSelection(musicOption, musicId, objective) {
  // Option A: Existing Music ID
  if (musicOption === 'existing') {
    if (!musicId) {
      return { valid: false, error: 'Music ID is required' };
    }

    const rule = VALIDATION_RULES.musicId;
    if (!rule.pattern.test(musicId)) {
      return { valid: false, error: rule.errorMessage.pattern };
    }

    return { valid: true };
  }

  // Option B: Custom Music
  if (musicOption === 'custom') {
    return { valid: true };
  }

  // Option C: No Music
  if (musicOption === 'none') {
    if (objective === 'conversions') {
      return {
        valid: false,
        error: 'Music is required when objective is "Conversions"',
      };
    }
    return { valid: true };
  }

  return { valid: false, error: 'Please select a music option' };
}

export function validateAdForm(formData) {
  const errors = {};

  // Campaign Name
  const campaignNameValidation = validateCampaignName(formData.campaignName);
  if (!campaignNameValidation.valid) {
    errors.campaignName = campaignNameValidation.error;
  }

  // Objective
  const objectiveValidation = validateObjective(formData.objective);
  if (!objectiveValidation.valid) {
    errors.objective = objectiveValidation.error;
  }

  // Ad Text
  const adTextValidation = validateAdText(formData.adText);
  if (!adTextValidation.valid) {
    errors.adText = adTextValidation.error;
  }

  // CTA
  const ctaValidation = validateCTA(formData.cta);
  if (!ctaValidation.valid) {
    errors.cta = ctaValidation.error;
  }

  // Music
  const musicValidation = validateMusicSelection(
    formData.musicOption,
    formData.musicId,
    formData.objective
  );
  if (!musicValidation.valid) {
    errors.music = musicValidation.error;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
