"""
main.py — FastAPI Backend
Redrob AI Hackathon

Endpoints:
  GET  /health        — status check
  POST /rank          — rank candidates against JD
  POST /export        — download ranked CSV
  GET  /candidate/:id — get single candidate detail
"""

import csv
import io
import os
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from ranker import CandidateRanker

# ─── App ──────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="TalentLens Candidate Ranker API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Load ranker on startup ───────────────────────────────────────────────────

DATA_DIR   = Path(os.getenv("DATA_DIR", "../data"))
JSONL_PATH = DATA_DIR / "candidates.jsonl"
SAMPLE_PATH = DATA_DIR / "sample_candidates.json"
JD_PATH    = DATA_DIR / "job_description.txt"

ranker = CandidateRanker()

@app.on_event("startup")
async def startup():
    if JSONL_PATH.exists():
        ranker.load(str(JSONL_PATH))
    elif SAMPLE_PATH.exists():
        print("candidates.jsonl not found — using sample_candidates.json")
        ranker.load_sample(str(SAMPLE_PATH))
    else:
        raise RuntimeError("No candidate data found in data/ folder.")
    ranker.build_index()
    print("API ready.")

# ─── Models ───────────────────────────────────────────────────────────────────

class RankRequest(BaseModel):
    jd_text: str
    top_n:   int = 100

# ─── Endpoints ────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {
        "status":            "ok",
        "candidates_loaded": len(ranker.candidates),
        "index_ready":       ranker.tfidf_matrix is not None,
    }


@app.post("/rank")
def rank(req: RankRequest):
    if not req.jd_text.strip():
        raise HTTPException(400, "jd_text is required")
    if ranker.tfidf_matrix is None:
        raise HTTPException(503, "Ranker not ready yet")

    top_n   = max(1, min(req.top_n, 100))
    results = ranker.rank(req.jd_text, top_n=top_n)

    return {
        "total_candidates": len(ranker.candidates),
        "returned":         len(results),
        "results": [
            {
                "candidate_id":   r["candidate_id"],
                "rank":           r["rank"],
                "score":          r["score"],
                "reasoning":      r["reasoning"],
                "current_title":  r["profile"].get("current_title", ""),
                "current_company":r["profile"].get("current_company", ""),
                "location":       r["profile"].get("location", ""),
                "years_of_experience": r["profile"].get("years_of_experience", 0),
                "skill_count":    r["skill_count"],
                "matched_skills": r["matched_skills"],
                "semantic_score": r["semantic_score"],
                "skill_score":    r["skill_score"],
                "signal_score":   r["signal_score"],
                "open_to_work":   r["signals"].get("open_to_work_flag", False),
                "notice_period_days": r["signals"].get("notice_period_days", 90),
                "last_active_date":   r["signals"].get("last_active_date", ""),
                "github_activity_score": r["signals"].get("github_activity_score", 0),
            }
            for r in results
        ],
    }


@app.post("/export")
def export(req: RankRequest):
    """Export ranked results as submission-ready CSV."""
    if not req.jd_text.strip():
        raise HTTPException(400, "jd_text is required")

    results = ranker.rank(req.jd_text, top_n=100)

    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerow(["candidate_id", "rank", "score", "reasoning"])
    for r in results:
        writer.writerow([r["candidate_id"], r["rank"], f"{r['score']:.4f}", r["reasoning"]])

    buf.seek(0)
    return StreamingResponse(
        iter([buf.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=submission.csv"},
    )


@app.get("/candidate/{candidate_id}")
def get_candidate(candidate_id: str):
    """Get full profile for a single candidate."""
    match = next(
        (c for c in ranker.candidates if c["candidate_id"] == candidate_id),
        None
    )
    if not match:
        raise HTTPException(404, f"Candidate {candidate_id} not found")
    return match