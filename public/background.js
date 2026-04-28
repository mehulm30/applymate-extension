// background.js - Service Worker
// Handles communication between popup and content scripts

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "AUTOFILL_REQUEST") {
    // Forward autofill request to the active tab's content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { type: "AUTOFILL_FORM", profileData: message.profileData },
          (response) => {
            if (chrome.runtime.lastError) {
              sendResponse({ success: false, error: chrome.runtime.lastError.message });
            } else {
              sendResponse(response);
            }
          }
        );
      } else {
        sendResponse({ success: false, error: "No active tab found" });
      }
    });
    return true; // Keep message channel open for async response
  }

  if (message.type === "GET_FIELD_COUNT") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { type: "SCAN_FIELDS" },
          (response) => {
            sendResponse(response || { count: 0 });
          }
        );
      }
    });
    return true;
  }
});

// On install: set default storage
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get("profileData", (result) => {
    if (!result.profileData) {
      chrome.storage.local.set({ profileData: {} });
    }
  });
});
