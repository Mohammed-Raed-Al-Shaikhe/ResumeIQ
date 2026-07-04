import ScoreMeter from "./ScoreMeter";

export default function ResultsDashboard({ result, onReset }) {
  return (
    <div className="results-wrap">
      <div className="results-topbar">
        <h2 className="results-heading">Screening Results</h2>
        <button className="back-btn" onClick={onReset}>← New Screening</button>
      </div>

      {/* Score + Summary */}
      <div className="results-top">
        <div className="card score-card">
          <div className="summary-label">Match Score</div>
          <ScoreMeter score={result.match_score} />
        </div>

        <div className="card summary-card">
          <div className="summary-label">Overall Assessment</div>
          <p className="summary-text">{result.summary}</p>
          <div className="summary-label" style={{ marginTop: 4 }}>Key Strengths</div>
          <div className="strengths-list">
            {result.strengths.map((s, i) => (
              <div key={i} className="strength-row">
                <div className="strength-check">✓</div>
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="skills-grid">
        <div className="card skills-card">
          <div className="skills-header">
            <div className="skills-dot dot-green" />
            Matched Skills
            <span className="skills-count">{result.matched_skills.length} found</span>
          </div>
          <div className="tags">
            {result.matched_skills.map((s, i) => <span key={i} className="tag tag-green">{s}</span>)}
          </div>
        </div>

        <div className="card skills-card">
          <div className="skills-header">
            <div className="skills-dot dot-red" />
            Missing Skills
            <span className="skills-count">{result.missing_skills.length} gaps</span>
          </div>
          <div className="tags">
            {result.missing_skills.map((s, i) => <span key={i} className="tag tag-red">{s}</span>)}
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <div className="card suggestions-card">
        <div className="suggestions-title">
          💡 How to Improve This Application
        </div>
        <ol className="suggestions-list">
          {result.suggestions.map((s, i) => (
            <li key={i} className="suggestion-item">
              <div className="sug-num">{String(i + 1).padStart(2, "0")}</div>
              <span className="sug-text">{s}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
