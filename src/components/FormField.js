// src/components/FormField.js
import React from "react";

export function FormField({ label, name, value, onChange, type = "text", placeholder = "", textarea = false, required = false }) {
  const baseClass = "field-input";

  return (
    <div className="form-field">
      <label className="field-label">
        {label}
        {required && <span className="required-dot">*</span>}
      </label>
      {textarea ? (
        <textarea
          className={`${baseClass} field-textarea`}
          name={name}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={placeholder}
          rows={3}
        />
      ) : (
        <input
          className={baseClass}
          type={type}
          name={name}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}
