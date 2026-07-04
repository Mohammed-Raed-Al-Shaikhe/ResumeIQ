from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
import json
import re
import io

app = FastAPI(title="Smart Resume Screener API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq()

class ScreenResult(BaseModel):
    match_score: int
    summary: str
    matched_skills: list[str]
    missing_skills: list[str]
    suggestions: list[str]
    strengths: list[str]

def extract_text_from_pdf(file_bytes: bytes) -> str:
    try:
        import pypdf
        reader = pypdf.PdfReader(io.BytesIO(file_bytes))
        return "\n".join(page.extract_text() or "" for page in reader.pages)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not read PDF: {str(e)}")

def extract_text_from_docx(file_bytes: bytes) -> str:
    try:
        import docx
        doc = docx.Document(io.BytesIO(file_bytes))
        return "\n".join(p.text for p in doc.paragraphs if p.text.strip())
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not read DOCX: {str(e)}")

def run_screening(cv_text: str, job_description: str) -> ScreenResult:
    if not cv_text.strip() or not job_description.strip():
        raise HTTPException(status_code=400, detail="Both CV and job description are required.")

    prompt = f"""You are an expert technical recruiter and career coach.
Analyze the following CV against the job description and return a structured evaluation.

JOB DESCRIPTION:
{job_description}

CV / RESUME:
{cv_text}

Respond ONLY with a valid JSON object (no markdown, no extra text) with these exact keys:
{{
  "match_score": <integer 0-100>,
  "summary": "<2-3 sentence overall assessment>",
  "matched_skills": ["<skill>", ...],
  "missing_skills": ["<skill>", ...],
  "strengths": ["<strength point>", ...],
  "suggestions": ["<actionable improvement>", ...]
}}

Rules:
- match_score: how well the CV fits the job (0-100)
- matched_skills: skills from the JD present in the CV (max 8)
- missing_skills: important skills from the JD missing in CV (max 6)
- strengths: 3 specific strengths from the CV
- suggestions: 3-4 concrete, actionable CV improvements for this role
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        max_tokens=1000,
        messages=[
            {
                "role": "system",
                "content": "You are an expert technical recruiter. Always respond with valid JSON only — no markdown, no explanation, no extra text."
            },
            {"role": "user", "content": prompt}
        ]
    )

    raw = response.choices[0].message.content.strip()
    raw = re.sub(r"^```json\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)

    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse AI response.")

    return ScreenResult(**data)

# Route 1: JSON text input
from pydantic import BaseModel as BM
class ScreenRequest(BM):
    cv_text: str
    job_description: str

@app.post("/screen", response_model=ScreenResult)
async def screen_text(req: ScreenRequest):
    return run_screening(req.cv_text, req.job_description)

# Route 2: File upload
@app.post("/screen-file", response_model=ScreenResult)
async def screen_file(
    cv_file: UploadFile = File(...),
    job_description: str = Form(...)
):
    content = await cv_file.read()
    filename = cv_file.filename.lower()

    if filename.endswith(".pdf"):
        cv_text = extract_text_from_pdf(content)
    elif filename.endswith(".docx"):
        cv_text = extract_text_from_docx(content)
    elif filename.endswith(".txt"):
        cv_text = content.decode("utf-8", errors="ignore")
    else:
        raise HTTPException(status_code=400, detail="Unsupported file type. Upload PDF, DOCX, or TXT.")

    if not cv_text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from the uploaded file.")

    return run_screening(cv_text, job_description)

@app.get("/health")
async def health():
    return {"status": "ok"}
