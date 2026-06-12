"""
ranker.py — Intelligent Candidate Ranking Engine
Redrob AI Hackathon — Track 1

Scoring formula:
  score = 0.40×skills + 0.35×semantic + 0.15×signals + 0.06×experience + 0.04×career

Fix: added title relevance boost to prevent non-AI roles ranking high
"""

import json
import re
from datetime import date
from pathlib import Path
from typing import Optional
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

TODAY = date.today()

AI_SKILLS = {
    "python", "machine learning", "deep learning", "nlp",
    "natural language processing", "embeddings", "vector search",
    "retrieval", "rag", "retrieval augmented generation",
    "llm", "large language models", "fine-tuning", "finetuning",
    "lora", "qlora", "transformers", "bert", "sentence-transformers",
    "openai", "faiss", "pinecone", "weaviate", "qdrant", "milvus",
    "elasticsearch", "opensearch", "bm25", "ranking", "recommendation",
    "information retrieval", "mlops", "pytorch", "tensorflow",
    "huggingface", "scikit-learn", "xgboost", "learning to rank",
    "ndcg", "mrr", "map", "spark", "airflow", "kafka",
    "vector database", "hybrid search", "semantic search",
    "a/b testing", "data engineering", "distributed systems",
}

# Job titles that are clearly relevant to the Senior AI Engineer JD
RELEVANT_TITLES = {
    "ai", "ml", "machine learning", "data scientist", "nlp", "deep learning",
    "research engineer", "research scientist", "applied scientist",
    "recommendation", "search engineer", "ranking engineer", "platform engineer",
    "backend engineer", "software engineer", "full stack", "data engineer",
    "mlops", "llm", "generative", "computer vision",
}

# Titles that should be penalized
IRRELEVANT_TITLES = {
    "hr", "human resources", "recruiter", "sales", "marketing",
    "finance", "accountant", "operations", "product manager",
    "project manager", "business analyst", "content", "designer",
    "ux", "ui designer", "customer success", "support",
}

PROFICIENCY = {"beginner": 0.25, "intermediate": 0.55, "advanced": 0.80, "expert": 1.0}

CONSULTING = {"tcs", "infosys", "wipro", "accenture", "cognizant",
              "capgemini", "hcl", "mphasis", "tech mahindra", "hexaware"}

WEIGHTS = {
    "skills":     0.40,
    "semantic":   0.35,
    "signals":    0.15,
    "experience": 0.06,
    "career":     0.04,
}

def parse_jd(jd_text: str) -> dict:
    lower = jd_text.lower()
    exp = re.search(r"(\d+)[–\-]\s*(\d+)\s*years?", jd_text, re.IGNORECASE)
    min_exp = int(exp.group(1)) if exp else 5
    max_exp = int(exp.group(2)) if exp else 9
    required_skills = {s for s in AI_SKILLS if s in lower}
    return {"text": jd_text, "min_exp": min_exp, "max_exp": max_exp, "required_skills": required_skills}

def build_text(c: dict) -> str:
    p = c.get("profile", {})
    parts = [
        p.get("headline", ""),
        p.get("summary", ""),
        p.get("current_title", ""),
        p.get("current_industry", ""),
        " ".join(s["name"] for s in c.get("skills", [])),
        " ".join(
            f"{j.get('title','')} {j.get('company','')} {j.get('description','')}"
            for j in c.get("career_history", [])[:4]
        ),
        " ".join(
            f"{e.get('degree','')} {e.get('field_of_study','')} {e.get('institution','')}"
            for e in c.get("education", [])
        ),
        " ".join(cert.get("name", "") for cert in c.get("certifications", [])),
    ]
    return " | ".join(p for p in parts if p.strip())

def title_relevance(c: dict) -> float:
    """Boost AI-relevant titles, penalize clearly irrelevant ones."""
    title = c.get("profile", {}).get("current_title", "").lower()
    if any(t in title for t in IRRELEVANT_TITLES):
        return 0.3   # heavy penalty
    if any(t in title for t in RELEVANT_TITLES):
        return 1.0   # full score
    return 0.7       # neutral/unknown

def score_skills(c: dict, required: set) -> tuple:
    if not required:
        return 0.0, 0, []
    assessments = c.get("redrob_signals", {}).get("skill_assessment_scores", {})
    matched, total = [], 0.0
    for skill in c.get("skills", []):
        name = skill["name"].lower()
        if any(r in name or name in r for r in required):
            prof    = PROFICIENCY.get(skill.get("proficiency", "beginner"), 0.25)
            endorse = min(skill.get("endorsements", 0) / 50.0, 0.20)
            dur     = min(skill.get("duration_months", 0) / 48.0, 0.15)
            assess  = max((assessments.get(skill["name"], -1) / 100.0) * 0.20, 0)
            total  += min(prof + endorse + dur + assess, 1.5)
            matched.append(skill["name"])
    score = min(total / (len(required) * 1.5), 1.0)
    return score, len(matched), matched

def score_experience(c: dict, min_exp: int, max_exp: int) -> float:
    yoe = c.get("profile", {}).get("years_of_experience", 0)
    if min_exp <= yoe <= max_exp: return 1.0
    if yoe < min_exp: return max(0.0, 1.0 - (min_exp - yoe) / max(min_exp, 1))
    return max(0.5, 1.0 - (yoe - max_exp) * 0.05)

def score_career(c: dict) -> float:
    history = c.get("career_history", [])
    if not history: return 0.3
    total_m = consulting_m = 0
    for job in history:
        dur = job.get("duration_months", 0)
        total_m += dur
        if any(f in job.get("company", "").lower() for f in CONSULTING):
            consulting_m += dur
    if total_m == 0: return 0.3
    product_ratio = 1.0 - (consulting_m / total_m)
    stability = min((total_m / len(history)) / 24.0, 1.0)
    return round(0.6 * product_ratio + 0.4 * stability, 4)

def score_signals(c: dict) -> float:
    sig = c.get("redrob_signals", {})
    scores = []
    scores.append((1.0 if sig.get("open_to_work_flag") else 0.15, 2.5))
    try:
        days = (TODAY - date.fromisoformat(sig.get("last_active_date", "2020-01-01"))).days
        scores.append((max(0.0, 1.0 - days / 180.0), 2.0))
    except:
        scores.append((0.2, 2.0))
    notice = sig.get("notice_period_days", 90)
    scores.append((1.0 if notice <= 30 else max(0.1, 1.0 - (notice - 30) / 150.0), 1.5))
    scores.append((sig.get("recruiter_response_rate", 0), 1.5))
    scores.append((sig.get("interview_completion_rate", 0), 1.2))
    rt = sig.get("avg_response_time_hours", 999)
    scores.append((max(0.0, 1.0 - rt / 168.0), 0.8))
    scores.append((sig.get("profile_completeness_score", 0) / 100.0, 1.0))
    gh = sig.get("github_activity_score", -1)
    scores.append(((gh / 100.0) if gh >= 0 else 0.1, 1.0))
    verified = sum([sig.get("verified_email", False), sig.get("verified_phone", False), sig.get("linkedin_connected", False)]) / 3.0
    scores.append((verified, 0.5))
    scores.append((min(sig.get("saved_by_recruiters_30d", 0) / 10.0, 1.0), 0.7))
    scores.append((1.0 if sig.get("willing_to_relocate") else 0.5, 0.4))
    total_w = sum(w for _, w in scores)
    return round(sum(v * w for v, w in scores) / total_w, 4)

def build_reasoning(c: dict, rank: int, skill_count: int, matched: list, semantic: float, composite: float) -> str:
    p   = c.get("profile", {})
    sig = c.get("redrob_signals", {})
    title  = p.get("current_title", "Unknown role")
    yoe    = p.get("years_of_experience", 0)
    notice = sig.get("notice_period_days", 90)
    rr     = sig.get("recruiter_response_rate", 0)
    otw    = "open to work" if sig.get("open_to_work_flag") else "not flagged open"
    skills = ", ".join(matched[:3]) if matched else "general skills"
    return (
        f"{title} · {yoe:.1f}yrs exp · "
        f"{skill_count} AI skills matched ({skills}) · "
        f"semantic fit {round(semantic * 100)}% · "
        f"response rate {rr:.2f} · notice {notice}d · {otw}"
    )

class CandidateRanker:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            ngram_range=(1, 2),
            max_features=60000,
            sublinear_tf=True,
            strip_accents="unicode",
            min_df=1,
        )
        self.candidates  = []
        self.texts       = []
        self.tfidf_matrix = None
        print("CandidateRanker initialized.")

    def load(self, path: str, limit: Optional[int] = None):
        print(f"Loading candidates from {path} ...")
        self.candidates = []
        with open(path, encoding="utf-8") as f:
            for i, line in enumerate(f):
                if limit and i >= limit: break
                line = line.strip()
                if line: self.candidates.append(json.loads(line))
        print(f"Loaded {len(self.candidates):,} candidates.")
        self.texts = [build_text(c) for c in self.candidates]

    def load_sample(self, path: str):
        with open(path, encoding="utf-8") as f:
            self.candidates = json.load(f)
        self.texts = [build_text(c) for c in self.candidates]
        print(f"Loaded {len(self.candidates)} sample candidates.")

    def build_index(self):
        print("Building TF-IDF index ...")
        self.tfidf_matrix = self.vectorizer.fit_transform(self.texts)
        print(f"Index ready — matrix shape: {self.tfidf_matrix.shape}")

    def rank(self, jd_text: str, top_n: int = 100) -> list:
        jd     = parse_jd(jd_text)
        jd_vec = self.vectorizer.transform([jd_text])
        sims   = cosine_similarity(jd_vec, self.tfidf_matrix)[0]

        results = []
        for i, c in enumerate(self.candidates):
            semantic                           = float(sims[i])
            skill_score, skill_count, matched  = score_skills(c, jd["required_skills"])
            exp_score                          = score_experience(c, jd["min_exp"], jd["max_exp"])
            career_score                       = score_career(c)
            signal_score                       = score_signals(c)
            title_boost                        = title_relevance(c)

            composite = (
                WEIGHTS["skills"]     * skill_score  +
                WEIGHTS["semantic"]   * semantic      +
                WEIGHTS["signals"]    * signal_score  +
                WEIGHTS["experience"] * exp_score     +
                WEIGHTS["career"]     * career_score
            ) * title_boost   # multiply whole score by title relevance

            results.append({
                "candidate_id":   c["candidate_id"],
                "score":          round(composite, 4),
                "skill_score":    round(skill_score, 4),
                "semantic_score": round(semantic, 4),
                "signal_score":   round(signal_score, 4),
                "exp_score":      round(exp_score, 4),
                "career_score":   round(career_score, 4),
                "skill_count":    skill_count,
                "matched_skills": matched,
                "profile":        c.get("profile", {}),
                "signals":        c.get("redrob_signals", {}),
                "education":      c.get("education", []),
                "career_history": c.get("career_history", []),
                "_idx":           i,
            })

        results.sort(key=lambda x: (-x["score"], x["candidate_id"]))

        for rank, r in enumerate(results[:top_n], 1):
            r["rank"]      = rank
            r["reasoning"] = build_reasoning(
                self.candidates[r["_idx"]], rank,
                r["skill_count"], r["matched_skills"],
                r["semantic_score"], r["score"],
            )

        return results[:top_n]