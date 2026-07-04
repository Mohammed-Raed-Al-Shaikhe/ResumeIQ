# ResumeIQ — Smart Resume Screener

An AI-powered resume screening tool built with FastAPI + React + Groq API.

## Project Structure

```
resume-screener/
├── backend/
│   ├── main.py              # FastAPI app
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── App.css
    │   ├── main.jsx
    │   └── components/
    │       ├── InputPanel.jsx
    │       ├── ResultsDashboard.jsx
    │       ├── ScoreMeter.jsx
    │       └── LoadingScreen.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## Setup & Run

### 1. Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt

# Set your Anthropic API key
export GROQ_API_KEY=your_key_here   # Linux/Mac
# OR
set GROQ_API_KEY=your_key_here      # Windows CMD

uvicorn main:app --reload
# Runs on http://localhost:8000
```

### 2. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

### 3. Open the app

Navigate to **http://localhost:5173** in your browser.

## Features

- Paste any CV + Job Description
- Animated match score meter (0–100)
- Matched skills (green tags)
- Missing skills (red tags)
- Numbered improvement suggestions
- Live loading steps during analysis

## Tech Stack

- **Backend:** Python, FastAPI, Groq API
- **Frontend:** React 18, Vite, CSS (no UI library)
