"""
rank.py — CLI script to produce submission.csv
Usage:
    python rank.py                         # uses data/candidates.jsonl
    python rank.py --sample                # uses data/sample_candidates.json (fast test)
    python rank.py --limit 1000            # test on first 1000 candidates
    python rank.py --out my_output.csv     # custom output path
"""

import argparse
import csv
import sys
from pathlib import Path

# ─── Auto-install deps if missing ────────────────────────────────────────────
def ensure_deps():
    import importlib
    missing = []
    for pkg, imp in [("scikit-learn", "sklearn"), ("numpy", "numpy")]:
        try:
            importlib.import_module(imp)
        except ImportError:
            missing.append(pkg)
    if missing:
        import subprocess
        print(f"Installing missing packages: {missing}")
        subprocess.check_call([sys.executable, "-m", "pip", "install"] + missing)

ensure_deps()

from ranker import CandidateRanker

# ─── Default JD ───────────────────────────────────────────────────────────────

FALLBACK_JD = """
Senior AI Engineer — Founding Team at Redrob AI (Series A)
Location: Pune/Noida, India. Experience: 5-9 years.

Required:
- Production embeddings-based retrieval systems
- Vector databases: Pinecone, Weaviate, Qdrant, FAISS, Elasticsearch
- Strong Python, ranking evaluation: NDCG, MRR, MAP
- Hybrid search, NLP / information retrieval background

Preferred:
- LLM fine-tuning: LoRA, QLoRA
- Learning-to-rank, XGBoost, distributed systems

Not looking for:
- Pure consulting backgrounds (TCS, Infosys, Wipro, Accenture)
- Candidates with no product company experience

Prefer: open to work, short notice period, active platform engagement.
"""


def load_jd(jd_path: str) -> str:
    p = Path(jd_path)
    if p.exists():
        return p.read_text(encoding="utf-8")
    print(f"JD file not found at {jd_path} — using built-in JD.")
    return FALLBACK_JD


def main():
    parser = argparse.ArgumentParser(description="Redrob Candidate Ranker CLI")
    parser.add_argument("--candidates", default="../data/candidates.jsonl")
    parser.add_argument("--jd",         default="../data/job_description.txt")
    parser.add_argument("--out",        default="../submission.csv")
    parser.add_argument("--sample",     action="store_true")
    parser.add_argument("--limit",      type=int, default=None)
    args = parser.parse_args()

    jd_text = load_jd(args.jd)
    print(f"JD loaded ({len(jd_text)} chars)")

    ranker = CandidateRanker()

    if args.sample:
        sample = str(Path(args.candidates).parent / "sample_candidates.json")
        ranker.load_sample(sample)
    else:
        ranker.load(args.candidates, limit=args.limit)

    ranker.build_index()

    print("Ranking...")
    results = ranker.rank(jd_text, top_n=100)

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    with open(out_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["candidate_id", "rank", "score", "reasoning"])
        for r in results:
            writer.writerow([
                r["candidate_id"],
                r["rank"],
                f"{r['score']:.4f}",
                r["reasoning"],
            ])

    print(f"\nsubmission.csv written to: {out_path}")
    print(f"\nTop 5 candidates:")
    for r in results[:5]:
        p = r["profile"]
        print(f"  #{r['rank']} {r['candidate_id']} | score={r['score']:.4f}")
        print(f"       {p.get('current_title')} | {p.get('years_of_experience')}yrs | {p.get('current_company')}")
        print(f"       {r['reasoning'][:90]}...")


if __name__ == "__main__":
    main()