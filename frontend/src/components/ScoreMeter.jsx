import { useEffect, useState } from "react";

export default function ScoreMeter({ score }) {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    let frame;
    let current = 0;
    const tick = () => {
      current += (score - current) * 0.07;
      if (Math.abs(score - current) < 0.5) { setAnimated(score); return; }
      setAnimated(Math.round(current));
      frame = requestAnimationFrame(tick);
    };
    const t = setTimeout(() => { frame = requestAnimationFrame(tick); }, 200);
    return () => { clearTimeout(t); cancelAnimationFrame(frame); };
  }, [score]);

  const size = 160;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (animated / 100) * circ;

  const color = animated >= 75 ? "#16A34A" : animated >= 50 ? "#D97706" : "#DC2626";
  const verdict = animated >= 75 ? "Strong Match" : animated >= 50 ? "Partial Match" : "Weak Match";
  const verdictClass = animated >= 75 ? "verdict-strong" : animated >= 50 ? "verdict-partial" : "verdict-weak";
  const desc = animated >= 75
    ? "This candidate meets most of the role's requirements."
    : animated >= 50
    ? "Candidate has relevant experience but has skill gaps."
    : "Significant gaps between the CV and the job requirements.";

  return (
    <>
      <div className="score-ring-wrap">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle className="score-ring-track" cx={size/2} cy={size/2} r={r} fill="none" strokeWidth={stroke} />
          <circle
            className="score-ring-fill"
            cx={size/2} cy={size/2} r={r} fill="none"
            stroke={color} strokeWidth={stroke}
            strokeDasharray={circ}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="score-center">
          <span className="score-number" style={{ color }}>{animated}</span>
          <span className="score-denom">/ 100</span>
        </div>
      </div>
      <span className={`score-verdict ${verdictClass}`}>{verdict}</span>
      <p className="score-desc">{desc}</p>
    </>
  );
}
