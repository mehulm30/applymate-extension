// src/components/AutofillButton.js
import React from "react";

export function AutofillButton({ onClick, status }) {
  const labels = {
    null: "⚡ Autofill This Page",
    filling: "Filling fields...",
    success: "✓ Done!",
    error: "✗ Failed",
  };

  const classes = {
    null: "btn-autofill",
    filling: "btn-autofill btn-filling",
    success: "btn-autofill btn-success",
    error: "btn-autofill btn-error",
  };

  return (
    <button
      className={classes[status] || classes[null]}
      onClick={onClick}
      disabled={status === "filling"}
    >
      {labels[status] ?? labels[null]}
    </button>
  );
}
