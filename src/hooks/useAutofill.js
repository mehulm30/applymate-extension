/* global chrome */
// src/hooks/useAutofill.js
import { useState, useCallback } from "react";

export function useAutofill() {
  const [status, setStatus] = useState(null); // null | 'filling' | 'success' | 'error'
  const [filledCount, setFilledCount] = useState(0);
  const [error, setError] = useState(null);

  const triggerAutofill = useCallback(async (profileData) => {
    setStatus("filling");
    setError(null);

    try {
      if (typeof chrome !== "undefined" && chrome.runtime) {
        chrome.runtime.sendMessage(
          { type: "AUTOFILL_REQUEST", profileData },
          (response) => {
            if (chrome.runtime.lastError) {
              setError("Could not connect to the page. Reload the tab and try again.");
              setStatus("error");
              return;
            }
            if (response?.success) {
              setFilledCount(response.filled || 0);
              setStatus("success");
            } else {
              setError(response?.error || "Autofill failed.");
              setStatus("error");
            }
          }
        );
      } else {
        // Dev mode simulation
        await new Promise((r) => setTimeout(r, 800));
        setFilledCount(7);
        setStatus("success");
      }
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }

    setTimeout(() => setStatus(null), 3500);
  }, []);

  return { triggerAutofill, status, filledCount, error };
}
