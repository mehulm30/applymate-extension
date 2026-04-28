// src/components/SectionHeader.js
import React from "react";

export function SectionHeader({ icon, title }) {
  return (
    <div className="section-header">
      <span className="section-icon">{icon}</span>
      <span className="section-title">{title}</span>
    </div>
  );
}
