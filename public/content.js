// content.js - Injected into every webpage
// Detects form fields and autofills them based on profile data

(() => {
  // ─── Field keyword maps ───────────────────────────────────────────────────
  const FIELD_MAP = {
    firstName: ["first name", "firstname", "first-name", "fname", "given name"],
    lastName: ["last name", "lastname", "last-name", "lname", "surname", "family name"],
    fullName: ["full name", "fullname", "your name", "name", "candidate name", "applicant name"],
    email: ["email", "e-mail", "email address", "work email", "contact email"],
    phone: ["phone", "mobile", "cell", "telephone", "contact number", "phone number", "mobile number"],
    address: ["address", "street address", "home address", "current address", "location"],
    city: ["city", "town", "municipality"],
    state: ["state", "province", "region"],
    country: ["country", "nation"],
    zipCode: ["zip", "postal", "zip code", "postal code", "pin code", "pincode"],
    linkedIn: ["linkedin", "linked in", "linkedin url", "linkedin profile"],
    portfolio: ["portfolio", "website", "personal website", "portfolio url", "personal url"],
    github: ["github", "git hub", "github url", "github profile"],
    currentCompany: ["current company", "current employer", "present employer", "company name", "employer"],
    currentTitle: ["current title", "current role", "job title", "position", "designation", "current position"],
    yearsExperience: ["years of experience", "experience", "total experience", "work experience (years)", "years exp"],
    expectedSalary: ["expected salary", "desired salary", "salary expectation", "ctc expectation", "expected ctc"],
    currentSalary: ["current salary", "current ctc", "present salary", "last salary"],
    noticePeriod: ["notice period", "notice", "availability", "joining date", "when can you join"],
    skills: ["skills", "technical skills", "key skills", "core skills", "competencies"],
    education: ["education", "degree", "qualification", "highest qualification", "academic background"],
    university: ["university", "college", "institution", "school name", "alma mater"],
    graduationYear: ["graduation year", "passing year", "year of graduation", "year of passing"],
  };

  // ─── Helpers ──────────────────────────────────────────────────────────────
  function normalizeText(str) {
    return (str || "").toLowerCase().replace(/[^a-z0-9 ]/g, " ").trim();
  }

  function matchField(label, name, placeholder, id) {
    const texts = [label, name, placeholder, id].map(normalizeText);
    for (const [key, keywords] of Object.entries(FIELD_MAP)) {
      for (const kw of keywords) {
        if (texts.some((t) => t.includes(kw))) return key;
      }
    }
    return null;
  }

  function getLabelText(el) {
    // Check aria-label
    if (el.getAttribute("aria-label")) return el.getAttribute("aria-label");
    // Check associated <label>
    if (el.id) {
      const label = document.querySelector(`label[for="${el.id}"]`);
      if (label) return label.innerText;
    }
    // Check parent label
    const parentLabel = el.closest("label");
    if (parentLabel) return parentLabel.innerText;
    // Check previous sibling label
    const prev = el.previousElementSibling;
    if (prev && prev.tagName === "LABEL") return prev.innerText;
    // Check placeholder
    return el.placeholder || "";
  }

  function setNativeValue(element, value) {
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype, "value"
    )?.set;
    const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype, "value"
    )?.set;

    if (element.tagName === "TEXTAREA" && nativeTextAreaValueSetter) {
      nativeTextAreaValueSetter.call(element, value);
    } else if (nativeInputValueSetter) {
      nativeInputValueSetter.call(element, value);
    } else {
      element.value = value;
    }

    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
    element.dispatchEvent(new Event("blur", { bubbles: true }));
  }

  function fillSelectField(select, value) {
    if (!value) return false;
    const val = value.toLowerCase();
    for (const option of select.options) {
      if (option.text.toLowerCase().includes(val) || option.value.toLowerCase().includes(val)) {
        select.value = option.value;
        select.dispatchEvent(new Event("change", { bubbles: true }));
        return true;
      }
    }
    return false;
  }

  // ─── Core fill logic ──────────────────────────────────────────────────────
  function resolveValue(fieldKey, profile) {
    switch (fieldKey) {
      case "firstName": return profile.firstName || profile.fullName?.split(" ")[0] || "";
      case "lastName": return profile.lastName || profile.fullName?.split(" ").slice(1).join(" ") || "";
      case "fullName": return profile.fullName || `${profile.firstName || ""} ${profile.lastName || ""}`.trim();
      case "email": return profile.email || "";
      case "phone": return profile.phone || "";
      case "address": return profile.address || "";
      case "city": return profile.city || "";
      case "state": return profile.state || "";
      case "country": return profile.country || "";
      case "zipCode": return profile.zipCode || "";
      case "linkedIn": return profile.linkedIn || "";
      case "portfolio": return profile.portfolio || "";
      case "github": return profile.github || "";
      case "currentCompany": return profile.currentCompany || "";
      case "currentTitle": return profile.currentTitle || "";
      case "yearsExperience": return profile.yearsExperience || "";
      case "expectedSalary": return profile.expectedSalary || "";
      case "currentSalary": return profile.currentSalary || "";
      case "noticePeriod": return profile.noticePeriod || "";
      case "skills": return Array.isArray(profile.skills) ? profile.skills.join(", ") : profile.skills || "";
      case "education": return profile.highestDegree || "";
      case "university": return profile.university || "";
      case "graduationYear": return profile.graduationYear || "";
      default: return "";
    }
  }

  function autofillForms(profile) {
    let filled = 0;
    const inputs = document.querySelectorAll("input:not([type=hidden]):not([type=submit]):not([type=button]):not([type=checkbox]):not([type=radio]):not([type=file]), textarea");
    const selects = document.querySelectorAll("select");

    inputs.forEach((el) => {
      const label = getLabelText(el);
      const key = matchField(label, el.name, el.placeholder, el.id);
      if (!key) return;
      const value = resolveValue(key, profile);
      if (!value) return;
      setNativeValue(el, value);
      el.style.backgroundColor = "#e6ffe6";
      filled++;
    });

    selects.forEach((el) => {
      const label = getLabelText(el);
      const key = matchField(label, el.name, "", el.id);
      if (!key) return;
      const value = resolveValue(key, profile);
      if (!value) return;
      const ok = fillSelectField(el, value);
      if (ok) {
        el.style.backgroundColor = "#e6ffe6";
        filled++;
      }
    });

    return filled;
  }

  function scanFieldCount() {
    const inputs = document.querySelectorAll("input:not([type=hidden]):not([type=submit]):not([type=button]):not([type=file]), textarea, select");
    return inputs.length;
  }

  // ─── Message listener ─────────────────────────────────────────────────────
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "AUTOFILL_FORM") {
      try {
        const filled = autofillForms(message.profileData);
        sendResponse({ success: true, filled });
      } catch (err) {
        sendResponse({ success: false, error: err.message });
      }
    }

    if (message.type === "SCAN_FIELDS") {
      sendResponse({ count: scanFieldCount() });
    }

    return true;
  });
})();