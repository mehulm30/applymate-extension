// src/components/ExperienceSection.js
import React from "react";

const WORK_TYPES = ["Onsite", "Hybrid", "Remote"];

const EMPTY_ENTRY = {
  organization: "",
  role: "",
  roleDescription: "",
  duration: "",
  workType: "Onsite",
};

export function ExperienceSection({ experiences, onChange }) {
  const addEntry = () => {
    onChange([...experiences, { ...EMPTY_ENTRY, id: Date.now() }]);
  };

  const removeEntry = (index) => {
    onChange(experiences.filter((_, i) => i !== index));
  };

  const updateEntry = (index, field, value) => {
    const updated = experiences.map((exp, i) =>
      i === index ? { ...exp, [field]: value } : exp
    );
    onChange(updated);
  };

  return (
    <div className="exp-section">
      {experiences.length === 0 && (
        <p className="exp-empty">No experience added yet.</p>
      )}

      {experiences.map((exp, index) => (
        <div className="exp-card" key={exp.id || index}>
          <div className="exp-card-header">
            <span className="exp-card-num">#{index + 1}</span>
            <button
              className="exp-remove-btn"
              onClick={() => removeEntry(index)}
              title="Remove experience"
            >
              ✕
            </button>
          </div>

          {/* Organization */}
          <div className="form-field">
            <label className="field-label">Organization / Company</label>
            <input
              className="field-input"
              type="text"
              value={exp.organization}
              onChange={(e) => updateEntry(index, "organization", e.target.value)}
              placeholder="e.g. Infosys, Google, Startup Inc."
            />
          </div>

          {/* Role title */}
          <div className="form-field">
            <label className="field-label">Role / Designation</label>
            <input
              className="field-input"
              type="text"
              value={exp.role}
              onChange={(e) => updateEntry(index, "role", e.target.value)}
              placeholder="e.g. Frontend Developer, SDE-II"
            />
          </div>

          {/* Duration + Work type row */}
          <div className="exp-row">
            <div className="form-field" style={{ flex: 1 }}>
              <label className="field-label">Duration</label>
              <input
                className="field-input"
                type="text"
                value={exp.duration}
                onChange={(e) => updateEntry(index, "duration", e.target.value)}
                placeholder="e.g. 1 yr 6 mo, Jun 2022 – Present"
              />
            </div>

            {/* Work type toggle */}
            <div className="form-field">
              <label className="field-label">Type</label>
              <div className="exp-type-toggle">
                {WORK_TYPES.map((type) => (
                  <button
                    key={type}
                    className={`exp-type-btn ${exp.workType === type ? "exp-type-active" : ""}`}
                    onClick={() => updateEntry(index, "workType", type)}
                    type="button"
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Role description */}
          <div className="form-field">
            <label className="field-label">About the Role</label>
            <textarea
              className="field-input field-textarea"
              value={exp.roleDescription}
              onChange={(e) => updateEntry(index, "roleDescription", e.target.value)}
              placeholder="Briefly describe your responsibilities, achievements, tech stack used…"
              rows={3}
            />
          </div>
        </div>
      ))}

      <button className="exp-add-btn" onClick={addEntry} type="button">
        + Add Experience
      </button>
    </div>
  );
}