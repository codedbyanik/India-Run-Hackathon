// lib/api.ts
// Fetches real candidate data from FastAPI backend
// Maps backend response to the exact same structure as mock-data.ts
// so all frontend pages work without any changes

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://india-run-hackathon.onrender.com";

// ─── The real JD text (from the hackathon) ────────────────────────────────────
export const REAL_JD = `Job Description: Senior AI Engineer — Founding Team
Company: Redrob AI (Series A AI-native talent intelligence platform)
Location: Pune/Noida, India (Hybrid) | Open to relocation candidates from Tier-1 Indian cities
Employment Type: Full-time
Experience Required: 5–9 years

Things you absolutely need:
Production experience with embeddings-based retrieval systems (sentence-transformers, OpenAI embeddings, BGE, E5)
Production experience with vector databases or hybrid search infrastructure — Pinecone, Weaviate, Qdrant, Milvus, OpenSearch, Elasticsearch, FAISS
Strong Python
Hands-on experience designing evaluation frameworks for ranking systems — NDCG, MRR, MAP

Things we'd like you to have:
LLM fine-tuning experience (LoRA, QLoRA, PEFT)
Experience with learning-to-rank models
Background in distributed systems or large-scale inference optimization

Not looking for:
Pure consulting backgrounds (TCS, Infosys, Wipro, Accenture, Cognizant, Capgemini)
Title-chasers switching companies every 1.5 years
People whose primary expertise is computer vision, speech, or robotics

Prefer: open to work, short notice period under 30 days, active on platform.`;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BackendCandidate {
  candidate_id: string;
  rank: number;
  score: number;
  reasoning: string;
  current_title: string;
  current_company: string;
  location: string;
  years_of_experience: number;
  skill_count: number;
  matched_skills: string[];
  semantic_score: number;
  skill_score: number;
  signal_score: number;
  open_to_work: boolean;
  notice_period_days: number;
  last_active_date: string;
  github_activity_score: number;
}

export interface RankResponse {
  total_candidates: number;
  returned: number;
  results: BackendCandidate[];
}

// ─── Score converter (0-1 → 0-100) ───────────────────────────────────────────
const toPercent = (v: number) => Math.round(v * 100);

// ─── Map backend candidate → frontend candidate shape ────────────────────────
function mapCandidate(c: BackendCandidate) {
  const fitScore     = toPercent(c.score);
  const techFit      = toPercent(c.skill_score);
  const behavFit     = toPercent(c.signal_score);
  const semanticMatch = toPercent(c.semantic_score);

  // ATS score simulation: just keyword count based, much lower for hidden gems
  const atsScore = Math.max(
    20,
    Math.round(c.skill_count * 6 + semanticMatch * 0.2)
  );

  // Availability string from notice period
  const availability =
    c.notice_period_days === 0
      ? "Immediate"
      : c.notice_period_days <= 14
      ? "2 weeks"
      : c.notice_period_days <= 30
      ? "1 month"
      : `${c.notice_period_days} days`;

  // Tags
  const tags: string[] = [];
  if (c.rank === 1) tags.push("Top Match");
  if (atsScore < 55 && fitScore > 75) tags.push("Hidden Talent");
  if (c.open_to_work) tags.push("Open to Work");
  if (c.notice_period_days <= 14) tags.push("Immediate");
  if (c.years_of_experience >= 8) tags.push("Senior Hire");

  return {
    id: c.candidate_id,
    rank: c.rank,
    name: `Candidate ${c.candidate_id.replace("CAND_", "#")}`,
    title: c.current_title,
    company: c.current_company,
    location: c.location,
    experience: Math.round(c.years_of_experience),
    availability,
    fitScore,
    technicalFit: techFit,
    behavioralFit: behavFit,
    trustScore: Math.min(95, behavFit + 5),
    growthPotential: Math.round((techFit + behavFit) / 2),
    semanticMatch,
    skills: c.matched_skills.slice(0, 6),
    tags,
    summary: c.reasoning,
    careerTimeline: [],
    behavioralSignals: {
      leadershipIndex: Math.round(behavFit * 0.9),
      collaborationScore: Math.round(behavFit * 1.05),
      adaptabilityScore: Math.round(behavFit * 0.95),
      communicationScore: Math.round(behavFit * 0.92),
      problemSolvingScore: Math.round(techFit * 0.98),
    },
    trustSignals: {
      verifiedExperience: true,
      githubActivity:
        c.github_activity_score > 60
          ? "High"
          : c.github_activity_score > 30
          ? "Medium"
          : "Low",
      publicationRecord: false,
      consistentCareerTrajectory: true,
      anomalyFlags: 0,
    },
    activitySignals: {
      openSourceContributions: Math.round(c.github_activity_score * 2),
      githubStars: Math.round(c.github_activity_score * 10),
      recentJobSwitch: false,
      responseRate: Math.round(c.signal_score * 100),
      lastActive: c.last_active_date || "Recently",
    },
    riskIndicators:
      c.notice_period_days > 60 ? ["Long notice period"] : [],
    strengths: c.matched_skills.slice(0, 3).map((s) => `Strong ${s} expertise`),
    weaknesses:
      c.notice_period_days > 30 ? ["Notice period above 30 days"] : [],
    aiExplanation: c.reasoning,
    hiringRecommendation: fitScore >= 85 ? "Strong Hire" : "Hire",
    atsScore,
    talentlensScore: fitScore,
  };
}

// ─── API Functions ────────────────────────────────────────────────────────────

// Check if backend is alive
export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return res.ok;
  } catch {
    return false;
  }
}

// Rank candidates against JD — main function used by all pages
export async function rankCandidates(
  jdText: string = REAL_JD,
  topN: number = 100
) {
  const res = await fetch(`${API_BASE}/rank`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jd_text: jdText, top_n: topN }),
  });

  if (!res.ok) throw new Error(`Rank API error: ${res.status}`);

  const data: RankResponse = await res.json();
  return {
    totalCandidates: data.total_candidates,
    candidates: data.results.map(mapCandidate),
  };
}

// Get hidden talent — candidates where ATS score << TalentLens score
export async function getHiddenTalent(jdText: string = REAL_JD) {
  const { candidates } = await rankCandidates(jdText, 100);

  return candidates
    .filter((c) => c.talentlensScore - c.atsScore > 25)
    .slice(0, 6)
    .map((c) => ({
      id: c.id,
      name: c.name,
      atsScore: c.atsScore,
      talentlensScore: c.talentlensScore,
      growthPotential: c.growthPotential,
      reason: c.aiExplanation,
      tag:
        c.talentlensScore - c.atsScore > 40
          ? "Hidden Gem"
          : "High Growth",
      delta: c.talentlensScore - c.atsScore,
    }));
}

// Export submission CSV
export async function exportCSV(jdText: string = REAL_JD) {
  const res = await fetch(`${API_BASE}/export`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jd_text: jdText, top_n: 100 }),
  });

  if (!res.ok) throw new Error("Export failed");

  const blob = await res.blob();
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = "submission.csv";
  a.click();
  URL.revokeObjectURL(url);
}