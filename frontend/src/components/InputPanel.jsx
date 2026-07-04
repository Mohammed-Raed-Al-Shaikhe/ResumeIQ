import { useState, useRef } from "react";

export default function InputPanel({ cvText, setCvText, cvFile, setCvFile, jobDesc, setJobDesc, onScreen, error, canSubmit }) {
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFile = (file) => {
    const allowed = [".pdf", ".docx", ".txt"];
    const ext = "." + file.name.split(".").pop().toLowerCase();
    if (!allowed.includes(ext)) { alert("Please upload a PDF, DOCX, or TXT file."); return; }
    setCvFile(file);
    setCvText("");
  };

  const removeFile = () => { setCvFile(null); if (fileRef.current) fileRef.current.value = ""; };

  return (
    <div>
      <div className="hero">
        <div className="hero-eyebrow">✦ AI Resume Screener</div>
        <h1 className="hero-title">Match any CV to any job — <em>instantly</em></h1>
        <p className="hero-sub">Upload a resume and paste a job description. Get a match score, skill gap analysis, and improvement suggestions in seconds.</p>
      </div>

      <div className="input-grid">
        {/* CV Card */}
        <div className="card input-card">
          <div className="card-header">
            <div className="card-icon blue">📄</div>
            <div>
              <div className="card-title">Candidate Resume</div>
              <div className="card-subtitle">Upload a file or paste text below</div>
            </div>
          </div>

          {cvFile ? (
            <div className="file-preview">
              <span className="file-preview-icon">{cvFile.name.endsWith(".pdf") ? "📕" : cvFile.name.endsWith(".docx") ? "📘" : "📃"}</span>
              <span className="file-preview-name">{cvFile.name}</span>
              <button className="file-remove" onClick={removeFile} title="Remove file">✕</button>
            </div>
          ) : (
            <div
              className={`upload-zone${dragOver ? " drag-over" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
            >
              <input
                ref={fileRef} type="file" accept=".pdf,.docx,.txt"
                onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
                style={{ display: "none" }}
              />
              <div className="upload-icon">☁️</div>
              <div className="upload-title">Drop file here or click to browse</div>
              <div className="upload-sub">Drag & drop your resume file</div>
              <div className="upload-types">
                <span className="type-badge">PDF</span>
                <span className="type-badge">DOCX</span>
                <span className="type-badge">TXT</span>
              </div>
            </div>
          )}

          {!cvFile && (
            <>
              <div className="divider-or">or paste text</div>
              <textarea
                className="textarea"
                placeholder="Paste the candidate's CV or resume text here..."
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
              />
              <div className="textarea-footer">
                <span className="char-count">{cvText.length} characters</span>
              </div>
            </>
          )}
        </div>

        {/* JD Card */}
        <div className="card input-card">
          <div className="card-header">
            <div className="card-icon purple">💼</div>
            <div>
              <div className="card-title">Job Description</div>
              <div className="card-subtitle">Paste the full job posting</div>
            </div>
          </div>
          <textarea
            className="textarea"
            style={{ height: cvFile ? "320px" : "240px" }}
            placeholder="Paste the job description here — include required skills, responsibilities, and qualifications..."
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
          />
          <div className="textarea-footer">
            <span className="char-count">{jobDesc.length} characters</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-banner">⚠️ {error}</div>
      )}

      <div className="cta-row">
        <button className="screen-btn" onClick={onScreen} disabled={!canSubmit}>
          Analyze Match <span className="btn-arrow">→</span>
        </button>
        <span className="cta-note">Takes 5–10 seconds · Free · No data stored</span>
      </div>
    </div>
  );
}
