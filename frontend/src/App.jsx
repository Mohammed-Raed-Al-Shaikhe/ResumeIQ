import { useState } from "react";
import InputPanel from "./components/InputPanel";
import ResultsDashboard from "./components/ResultsDashboard";
import LoadingScreen from "./components/LoadingScreen";
import "./App.css";

export default function App() {
  const [cvText, setCvText] = useState("");
  const [cvFile, setCvFile] = useState(null);
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleScreen = async () => {
    setError("");
    setLoading(true);
    setResult(null);

    try {
      let res;
      if (cvFile) {
        const form = new FormData();
        form.append("cv_file", cvFile);
        form.append("job_description", jobDesc);
        res = await fetch("http://localhost:8000/screen-file", { method: "POST", body: form });
      } else {
        res = await fetch("http://localhost:8000/screen", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cv_text: cvText, job_description: jobDesc }),
        });
      }
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Screening failed.");
      }
      setResult(await res.json());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null); setCvText(""); setCvFile(null);
    setJobDesc(""); setError("");
  };

  const canSubmit = (cvFile || cvText.trim()) && jobDesc.trim();

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <div className="logo-mark">⚡</div>
            <span className="logo-name">Resume<span>IQ</span></span>
          </div>
        </div>
      </header>

      <main className="main">
        {loading ? (
          <LoadingScreen />
        ) : result ? (
          <ResultsDashboard result={result} onReset={handleReset} />
        ) : (
          <InputPanel
            cvText={cvText} setCvText={setCvText}
            cvFile={cvFile} setCvFile={setCvFile}
            jobDesc={jobDesc} setJobDesc={setJobDesc}
            onScreen={handleScreen} error={error} canSubmit={canSubmit}
          />
        )}
      </main>
    </div>
  );
}
