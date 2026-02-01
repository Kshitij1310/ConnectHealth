import React from 'react';
import './FormField.css';

export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  placeholder,
  children,
  helperText,
}) {
  return (
    <div className="form-field">
      {label && (
        <label htmlFor={name} className="form-field-label">
          {label}
          {required && <span className="required-indicator">*</span>}
        </label>
      )}
      
      {children ? (
        children
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`form-field-input ${error ? 'has-error' : ''}`}
        />
      )}

      {error && <div className="error-message">{error}</div>}
      {helperText && !error && <div className="helper-text">{helperText}</div>}
    </div>
  );
}
