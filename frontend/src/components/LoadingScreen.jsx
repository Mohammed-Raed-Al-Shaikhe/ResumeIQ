import { useEffect, useState } from "react";

const steps = [
  "Parsing resume content...",
  "Extracting skills & experience...",
  "Matching against job requirements...",
  "Generating improvement tips...",
];

export default function LoadingScreen() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep(s => s < steps.length - 1 ? s + 1 : s), 1400);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="loading-wrap">
      <div className="loading-logo">⚡</div>
      <div>
        <h2 className="loading-title" style={{ textAlign: "center", marginBottom: 8 }}>Analyzing resume...</h2>
        <p style={{ textAlign: "center", fontSize: 14, color: "var(--text-muted)" }}>This usually takes 5–10 seconds</p>
      </div>
      <div className="loading-steps">
        {steps.map((s, i) => (
          <div key={i} className={`loading-step${i < step ? " done" : i === step ? " active" : ""}`}>
            <div className="step-icon">{i < step ? "✓" : i + 1}</div>
            <span>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
