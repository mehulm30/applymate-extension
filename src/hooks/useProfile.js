/* global chrome */
// src/hooks/useProfile.js
import { useState, useEffect, useCallback } from "react";

const DEFAULT_PROFILE = {
  // Personal
  fullName: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  country: "",
  zipCode: "",

  // Online presence
  linkedIn: "",
  github: "",
  portfolio: "",

  // Professional
  currentCompany: "",
  currentTitle: "",
  yearsExperience: "",
  currentSalary: "",
  expectedSalary: "",
  noticePeriod: "",

  // Education
  highestDegree: "",
  university: "",
  graduationYear: "",

  // Content
  skills: "",
  experiences: [],
};

export function useProfile() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  // Load from Chrome storage on mount
  useEffect(() => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.get("profileData", (result) => {
        if (result.profileData && Object.keys(result.profileData).length > 0) {
          setProfile((prev) => ({ ...prev, ...result.profileData }));
        }
        setLoading(false);
      });
    } else {
      // Dev fallback: use localStorage
      const stored = localStorage.getItem("profileData");
      if (stored) setProfile((prev) => ({ ...prev, ...JSON.parse(stored) }));
      setLoading(false);
    }
  }, []);

  const updateField = useCallback((key, value) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }, []);

  const updateExperiences = useCallback((experiences) => {
    setProfile((prev) => ({ ...prev, experiences }));
    setSaved(false);
  }, []);

  const saveProfile = useCallback(async () => {
    if (typeof chrome !== "undefined" && chrome.storage) {
      await chrome.storage.local.set({ profileData: profile });
    } else {
      localStorage.setItem("profileData", JSON.stringify(profile));
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }, [profile]);

  const clearProfile = useCallback(() => {
    setProfile(DEFAULT_PROFILE);
    if (typeof chrome !== "undefined" && chrome.storage) {
      chrome.storage.local.set({ profileData: {} });
    } else {
      localStorage.removeItem("profileData");
    }
  }, []);

  return { profile, updateField, updateExperiences, saveProfile, clearProfile, loading, saved };
}