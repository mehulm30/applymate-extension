// src/App.js
import React, { useState } from "react";
import { useProfile } from "./hooks/useProfile";
import { useAutofill } from "./hooks/useAutofill";
import { FormField } from "./components/FormField";
import { SectionHeader } from "./components/SectionHeader";
import { AutofillButton } from "./components/AutofillButton";
import { ResumeUpload } from "./components/ResumeUpload";
import { ExperienceSection } from "./components/ExperienceSection";
import { useResume } from "./hooks/useResume";
import "./styles/App.css";

const TABS = ["Autofill", "Profile", "About"];

export default function App() {
  const [activeTab, setActiveTab] = useState("Autofill");
  const { profile, updateField, updateExperiences, saveProfile, clearProfile, loading, saved } = useProfile();
  const { triggerAutofill, status, filledCount, error } = useAutofill();
  const { resume, uploading, error: resumeError, uploadResume, removeResume, downloadResume } = useResume();

  const handleAutofill = () => triggerAutofill(profile);

  if (loading) {
    return (
      <div className="app loading-screen">
        <div className="loader-ring" />
        <p>Loading profile…</p>
      </div>
    );
  }

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="app-header">
        <div className="logo-mark">💼</div>
        <div className="header-text">
          <h1 className="app-title">ApplyMate</h1>
          <p className="app-subtitle">Auto-apply assistant</p>
        </div>
      </header>

      {/* ── Tab Bar ── */}
      <nav className="tab-bar">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? "tab-active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* ══════════ AUTOFILL TAB ══════════ */}
      {activeTab === "Autofill" && (
        <div className="tab-content">
          <div className="autofill-hero">
            <div className="hero-icon">⚡</div>
            <h2 className="hero-title">One-Click Apply</h2>
            <p className="hero-desc">
              Open any job application page, then click below to auto-fill all
              detected fields with your profile data.
            </p>
          </div>

          <AutofillButton onClick={handleAutofill} status={status} />

          {status === "success" && (
            <div className="status-badge badge-success">
              ✓ Filled <strong>{filledCount}</strong> field{filledCount !== 1 ? "s" : ""} successfully
            </div>
          )}
          {status === "error" && (
            <div className="status-badge badge-error">
              ✗ {error || "Something went wrong. Try reloading the page."}
            </div>
          )}

          <div className="tips-card">
            <p className="tips-title">💡 Tips</p>
            <ul className="tips-list">
              <li>Works on LinkedIn, Indeed, Naukri, Workday & more</li>
              <li>Fill your profile first in the Profile tab</li>
              <li>Green highlighted fields = filled by ApplyMate</li>
              <li>Scroll & click autofill again for multi-page forms</li>
            </ul>
          </div>
        </div>
      )}

      {/* ══════════ PROFILE TAB ══════════ */}
      {activeTab === "Profile" && (
        <div className="tab-content profile-tab">

          <SectionHeader icon="👤" title="Personal Info" />
          <div className="field-grid">
            <FormField label="First Name" name="firstName" value={profile.firstName} onChange={updateField} placeholder="Rahul" required />
            <FormField label="Last Name" name="lastName" value={profile.lastName} onChange={updateField} placeholder="Sharma" required />
          </div>
          <FormField label="Full Name" name="fullName" value={profile.fullName} onChange={updateField} placeholder="Rahul Sharma" />
          <FormField label="Email" name="email" value={profile.email} onChange={updateField} type="email" placeholder="rahul@email.com" required />
          <FormField label="Phone" name="phone" value={profile.phone} onChange={updateField} type="tel" placeholder="+91 9876543210" required />

          <SectionHeader icon="📍" title="Location" />
          <FormField label="Address" name="address" value={profile.address} onChange={updateField} placeholder="123 MG Road" />
          <div className="field-grid">
            <FormField label="City" name="city" value={profile.city} onChange={updateField} placeholder="Mumbai" />
            <FormField label="State" name="state" value={profile.state} onChange={updateField} placeholder="Maharashtra" />
          </div>
          <div className="field-grid">
            <FormField label="Country" name="country" value={profile.country} onChange={updateField} placeholder="India" />
            <FormField label="ZIP / PIN" name="zipCode" value={profile.zipCode} onChange={updateField} placeholder="400001" />
          </div>

          <SectionHeader icon="🔗" title="Online Presence" />
          <FormField label="LinkedIn URL" name="linkedIn" value={profile.linkedIn} onChange={updateField} placeholder="linkedin.com/in/rahulsharma" />
          <FormField label="GitHub URL" name="github" value={profile.github} onChange={updateField} placeholder="github.com/rahulsharma" />
          <FormField label="Portfolio / Website" name="portfolio" value={profile.portfolio} onChange={updateField} placeholder="rahulsharma.dev" />

          <SectionHeader icon="💼" title="Professional" />
          <div className="field-grid">
            <FormField label="Current Company" name="currentCompany" value={profile.currentCompany} onChange={updateField} placeholder="TCS" />
            <FormField label="Current Role" name="currentTitle" value={profile.currentTitle} onChange={updateField} placeholder="Senior Dev" />
          </div>
          <div className="field-grid">
            <FormField label="Years of Experience" name="yearsExperience" value={profile.yearsExperience} onChange={updateField} placeholder="4" />
            <FormField label="Notice Period" name="noticePeriod" value={profile.noticePeriod} onChange={updateField} placeholder="30 days" />
          </div>
          <div className="field-grid">
            <FormField label="Current CTC (LPA)" name="currentSalary" value={profile.currentSalary} onChange={updateField} placeholder="12" />
            <FormField label="Expected CTC (LPA)" name="expectedSalary" value={profile.expectedSalary} onChange={updateField} placeholder="18" />
          </div>

          <SectionHeader icon="🎓" title="Education" />
          <FormField label="Highest Degree" name="highestDegree" value={profile.highestDegree} onChange={updateField} placeholder="B.Tech Computer Science" />
          <FormField label="University / College" name="university" value={profile.university} onChange={updateField} placeholder="IIT Bombay" />
          <FormField label="Graduation Year" name="graduationYear" value={profile.graduationYear} onChange={updateField} placeholder="2021" />

          <SectionHeader icon="🛠" title="Skills" />
          <FormField label="Key Skills (comma separated)" name="skills" value={profile.skills} onChange={updateField} placeholder="React, Node.js, Python, SQL" textarea />

          <SectionHeader icon="🏢" title="Experience" />
          <ExperienceSection
            experiences={profile.experiences || []}
            onChange={updateExperiences}
          />

          <SectionHeader icon="📄" title="Resume" />
          <ResumeUpload
            resume={resume}
            uploading={uploading}
            error={resumeError}
            onUpload={uploadResume}
            onRemove={removeResume}
            onDownload={downloadResume}
          />

          {/* Save / Clear buttons */}
          <div className="action-row">
            <button className="btn-clear" onClick={clearProfile}>Reset</button>
            <button className="btn-save" onClick={saveProfile}>
              {saved ? "✓ Saved!" : "Save Profile"}
            </button>
          </div>
        </div>
      )}

      {/* ══════════ ABOUT TAB ══════════ */}
      {activeTab === "About" && (
        <div className="tab-content about-tab">
          <div className="logo-mark">💼</div>
          <h2 className="about-name">ApplyMate</h2>
          <p className="about-version">v1.0.0 — No backend required</p>
          <div className="about-card">
            <p className="about-section-title">🔒 Privacy First</p>
            <p className="about-text">
              All your data is stored locally on your device using Chrome's
              built-in storage. Nothing is ever sent to any server.
            </p>
          </div>
          <div className="about-card">
            <p className="about-section-title">🌐 Supported Sites</p>
            <p className="about-text">
              Works on LinkedIn, Indeed, Naukri, Internshala, Workday, Greenhouse,
              Lever, Taleo, and most other job boards with standard HTML forms.
            </p>
          </div>
          <div className="about-card">
            <p className="about-section-title">⚙️ How It Works</p>
            <p className="about-text">
              The extension scans every input, textarea, and select field on the
              page, matches them to your profile using smart keyword detection,
              and fills them automatically.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}