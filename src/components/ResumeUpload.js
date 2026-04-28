// src/components/ResumeUpload.js
import React, { useRef, useState, useCallback } from "react";

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function FileIcon({ type }) {
  const isPdf = type === "application/pdf";
  return (
    <div className={`resume-file-icon ${isPdf ? "icon-pdf" : "icon-doc"}`}>
      {isPdf ? "PDF" : "DOC"}
    </div>
  );
}

export function ResumeUpload({ resume, uploading, error, onUpload, onRemove, onDownload }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = useCallback(
    (files) => {
      if (files && files[0]) onUpload(files[0]);
    },
    [onUpload]
  );

  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);
  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="resume-section">
      {/* Uploaded state */}
      {resume ? (
        <div className="resume-file-card">
          <FileIcon type={resume.type} />
          <div className="resume-file-info">
            <p className="resume-file-name" title={resume.name}>{resume.name}</p>
            <p className="resume-file-meta">
              {formatBytes(resume.size)} · Uploaded {formatDate(resume.uploadedAt)}
            </p>
          </div>
          <div className="resume-file-actions">
            <button
              className="resume-action-btn"
              onClick={onDownload}
              title="Download resume"
            >
              ↓
            </button>
            <button
              className="resume-action-btn resume-remove-btn"
              onClick={onRemove}
              title="Remove resume"
            >
              ✕
            </button>
          </div>
        </div>
      ) : (
        /* Drop zone */
        <div
          className={`resume-dropzone ${dragging ? "dropzone-active" : ""} ${uploading ? "dropzone-uploading" : ""}`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => !uploading && inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            style={{ display: "none" }}
            onChange={(e) => handleFiles(e.target.files)}
          />
          {uploading ? (
            <>
              <div className="dropzone-spinner" />
              <p className="dropzone-label">Reading file…</p>
            </>
          ) : (
            <>
              <div className="dropzone-icon">📄</div>
              <p className="dropzone-label">
                {dragging ? "Drop to upload" : "Drop your resume here"}
              </p>
              <p className="dropzone-sub">or click to browse · PDF or Word · max 5 MB</p>
            </>
          )}
        </div>
      )}

      {/* Replace button when already uploaded */}
      {resume && !uploading && (
        <button
          className="resume-replace-btn"
          onClick={() => inputRef.current?.click()}
        >
          Replace resume
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            style={{ display: "none" }}
            onChange={(e) => handleFiles(e.target.files)}
          />
        </button>
      )}

      {/* Error */}
      {error && <p className="resume-error">⚠ {error}</p>}

      {/* Info note */}
      <div className="resume-note">
        <p>
          💾 Stored locally on your device. When a job site has a file upload field,
          you can manually attach this file — autofill handles all text fields.
        </p>
      </div>
    </div>
  );
}
