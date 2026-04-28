/* global chrome */
// src/hooks/useResume.js
// Stores resume as base64 in chrome.storage.local (max ~5MB after encoding)

import { useState, useEffect, useCallback } from "react";

const RESUME_KEY = "resumeData";
const MAX_FILE_SIZE_MB = 5;

export function useResume() {
  const [resume, setResume] = useState(null);
  // resume shape: { name, size, type, base64, uploadedAt }
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  // Load saved resume metadata on mount
  useEffect(() => {
    const load = () => {
      if (typeof chrome !== "undefined" && chrome.storage) {
        chrome.storage.local.get(RESUME_KEY, (result) => {
          if (result[RESUME_KEY]) setResume(result[RESUME_KEY]);
        });
      } else {
        const stored = localStorage.getItem(RESUME_KEY);
        if (stored) setResume(JSON.parse(stored));
      }
    };
    load();
  }, []);

  const uploadResume = useCallback((file) => {
    setError(null);

    if (!file) return;

    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowed.includes(file.type)) {
      setError("Only PDF or Word (.doc/.docx) files are supported.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`File too large. Max size is ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    setUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result; // full data URL
      const resumeData = {
        name: file.name,
        size: file.size,
        type: file.type,
        base64,
        uploadedAt: new Date().toISOString(),
      };

      if (typeof chrome !== "undefined" && chrome.storage) {
        chrome.storage.local.set({ [RESUME_KEY]: resumeData }, () => {
          setResume(resumeData);
          setUploading(false);
        });
      } else {
        localStorage.setItem(RESUME_KEY, JSON.stringify(resumeData));
        setResume(resumeData);
        setUploading(false);
      }
    };
    reader.onerror = () => {
      setError("Failed to read file. Please try again.");
      setUploading(false);
    };
    reader.readAsDataURL(file);
  }, []);

  const removeResume = useCallback(() => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.remove(RESUME_KEY);
    } else {
      localStorage.removeItem(RESUME_KEY);
    }
    setResume(null);
    setError(null);
  }, []);

  const downloadResume = useCallback(() => {
    if (!resume?.base64) return;
    const link = document.createElement("a");
    link.href = resume.base64;
    link.download = resume.name;
    link.click();
  }, [resume]);

  return { resume, uploading, error, uploadResume, removeResume, downloadResume };
}
