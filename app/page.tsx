"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  TrendingUp,
  Shield,
  Brain,
  Search,
  Zap,
  ChevronRight,
  Activity,
} from "lucide-react";
import Navbar from "@/components/navbar";

const steps = [
  { step: "01", title: "Job Description", desc: "Paste or upload any JD" },
  { step: "02", title: "AI Requirement Extraction", desc: "Semantic parsing of skills, behavior, seniority" },
  { step: "03", title: "Candidate Retrieval", desc: "Vector search across 100,000+ profiles" },
  { step: "04", title: "Behavioral Analysis", desc: "Signal extraction from career data" },
  { step: "05", title: "Ranking Engine", desc: "Hybrid scoring: semantic + behavioral + trust" },
  { step: "06", title: "Explainable Results", desc: "Transparent AI decisions per candidate" },
];

const archNodes = [
  { id: "jd", label: "JD Intelligence Agent", sublabel: "NLP · LLM · Entity Extraction", pos: "top" },
  { id: "search", label: "Semantic Search Engine", sublabel: "FAISS · Embeddings · ANN", pos: "mid" },
  { id: "behavior", label: "Behavioral Signal Analyzer", sublabel: "GitHub · LinkedIn · Activity", pos: "mid" },
  { id: "trust", label: "Trust & Fraud Detection", sublabel: "Anomaly Detection · Verification", pos: "mid" },
  { id: "rank", label: "Hybrid Ranking Engine", sublabel: "Weighted Score Fusion", pos: "mid" },
  { id: "explain", label: "Explainability Layer", sublabel: "LLM · SHAP · Attribution", pos: "bot" },
];

const features = [
  {
    icon: Search,
    title: "Semantic Job Understanding",
    desc: "AI parses job descriptions beyond keywords — understanding intent, culture, and growth requirements.",
  },
  {
    icon: Brain,
    title: "Candidate Discovery",
    desc: "Vector similarity search across 100K+ profiles. Finds candidates traditional search misses.",
  },
  {
    icon: Activity,
    title: "Behavioral Signals",
    desc: "GitHub activity, career trajectory, communication patterns, and collaboration signals.",
  },
  {
    icon: TrendingUp,
    title: "Growth Potential Prediction",
    desc: "Career velocity analysis predicts who will succeed in the role 12–24 months from now.",
  },
  {
    icon: Zap,
    title: "Hidden Talent Detection",
    desc: "Surfaces high-potential candidates that ATS systems reject due to non-traditional backgrounds.",
  },
  {
    icon: Shield,
    title: "Explainable Ranking",
    desc: "Every ranking decision is fully transparent. No black boxes. Full audit trail per candidate.",
  },
];

// Mini dashboard mockup component
function MiniDashboard() {
  const candidates = [
    { rank: 1, name: "Priya Sharma", score: 96, technical: 98, behavioral: 94, trust: 97, tag: "Hidden Gem" },
    { rank: 2, name: "Marcus Chen", score: 93, technical: 95, behavioral: 89, trust: 94, tag: "" },
    { rank: 3, name: "Aisha Okonkwo", score: 91, technical: 89, behavioral: 96, trust: 88, tag: "Hidden Gem" },
  ];

  return (
    <div className="bg-white border border-[#e4e4e7] rounded-2xl shadow-2xl overflow-hidden w-full max-w-sm">
      {/* Header */}
      <div className="bg-[#0a0a0a] px-4 py-3 flex items-center justify-between">
        <div>
          <div className="text-white text-xs font-bold">Candidate Intelligence</div>
          <div className="text-[#71717a] text-[10px] font-mono">1,847 analyzed · 23 hidden talent</div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] status-dot" />
          <span className="text-[#22c55e] text-[10px] font-mono">LIVE</span>
        </div>
      </div>

      {/* Candidates */}
      <div className="p-3 space-y-2.5">
        {candidates.map((c) => (
          <div key={c.rank} className="p-3 rounded-lg border border-[#f3f4f6] bg-[#f9fafb]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#0a0a0a] flex items-center justify-center">
                  <span className="text-white font-mono text-[9px] font-bold">#{c.rank}</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0a0a0a]">{c.name}</div>
                  {c.tag && (
                    <span className="text-[8px] font-bold uppercase tracking-wider text-[#16a34a]">{c.tag}</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-sm font-black text-[#0a0a0a]">{c.score}</div>
                <div className="text-[8px] text-[#71717a] uppercase tracking-wider">fit score</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { l: "Technical", v: c.technical },
                { l: "Behavioral", v: c.behavioral },
                { l: "Trust", v: c.trust },
              ].map(({ l, v }) => (
                <div key={l}>
                  <div className="flex justify-between mb-0.5">
                    <span className="text-[8px] text-[#71717a] uppercase tracking-wider">{l}</span>
                    <span className="font-mono text-[9px] font-bold text-[#0a0a0a]">{v}</span>
                  </div>
                  <div className="h-0.5 bg-[#e4e4e7] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#2563eb]"
                      style={{ width: `${v}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Ranking graph bar */}
        <div className="p-3 rounded-lg border border-[#f3f4f6] bg-white">
          <div className="text-[9px] uppercase tracking-wider font-bold text-[#71717a] mb-2">Hiring Funnel</div>
          <div className="space-y-1.5">
            {[
              { label: "Analyzed", pct: 100 },
              { label: "Semantic Match", pct: 48 },
              { label: "Behavioral Pass", pct: 22 },
              { label: "Top Ranked", pct: 4 },
            ].map(({ label, pct }) => (
              <div key={label} className="flex items-center gap-2">
                <div className="w-16 text-[9px] text-[#71717a]">{label}</div>
                <div className="flex-1 h-1 bg-[#f4f4f5] rounded-full overflow-hidden">
                  <div className="h-full bg-[#0a0a0a] rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <div className="font-mono text-[9px] text-[#0a0a0a] w-6 text-right">{pct}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ─── HERO ─── */}
      <section className="pt-28 pb-20 px-6 pixel-grid">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 bg-[#f4f4f5] border border-[#e4e4e7] rounded-lg px-3 py-1.5 mb-8">
                <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] status-dot" />
                <span className="label-caps text-[#52525b]">Processing 1,847 candidates live</span>
              </div>

              <h1 className="heading-display text-[#0a0a0a] mb-6" style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)" }}>
                DISCOVER
                <br />
                HIDDEN TALENT
                <br />
                <span className="text-[#71717a]">BEYOND</span>
                <br />
                KEYWORDS
              </h1>

              <p className="text-base text-[#666666] mb-8 max-w-md leading-relaxed">
                TalentLens AI analyzes job requirements, candidate skills, behavioral signals, career growth, and hiring probability to identify top candidates from 100,000+ profiles.
              </p>

              <div className="flex items-center gap-3">
                <Link
                  href="/analysis"
                  className="flex items-center gap-2 bg-[#0a0a0a] text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-[#18181b] transition-colors"
                >
                  Analyze Candidates <ArrowRight size={15} />
                </Link>
                <Link
                  href="/candidates"
                  className="flex items-center gap-2 bg-white border border-[#e4e4e7] text-[#0a0a0a] px-5 py-3 rounded-xl font-bold text-sm hover:bg-[#f9fafb] transition-colors"
                >
                  View Rankings
                </Link>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-6 mt-10 pt-8 border-t border-[#f3f4f6]">
                {[
                  { value: "100K+", label: "Profiles analyzed" },
                  { value: "31%", label: "Hidden talent found" },
                  { value: "47%", label: "Faster time to hire" },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <div className="mono text-xl font-black text-[#0a0a0a]">{value}</div>
                    <div className="label-caps text-[#71717a]">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — rotated dashboard */}
            <div className="hidden lg:flex justify-center items-center">
              <div style={{ transform: "rotate(-3deg) perspective(800px) rotateY(-5deg)" }}>
                <MiniDashboard />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PROBLEM ─── */}
      <section className="py-20 px-6 bg-[#f9fafb] border-y border-[#f3f4f6]">
        <div className="max-w-7xl mx-auto">
          <div className="label-caps text-[#71717a] mb-4">The Hiring Problem</div>
          <h2 className="heading-display text-[#0a0a0a] mb-14" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
            Traditional ATS vs TalentLens AI
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* ATS */}
            <div className="bg-white border border-[#f3f4f6] rounded-2xl p-8">
              <div className="label-caps text-[#ef4444] mb-5">Traditional ATS</div>
              <div className="space-y-4">
                {[
                  { title: "Keyword Matching", desc: "Rejects candidates missing exact terms. Misses semantic equivalents." },
                  { title: "Resume Filtering", desc: "Filters by institution prestige, not actual capability." },
                  { title: "Hidden Bias", desc: "Systematic bias against non-traditional paths, career gaps, bootcamp grads." },
                  { title: "Misses Hidden Talent", desc: "Up to 38% of top performers are rejected before human review." },
                ].map(({ title, desc }) => (
                  <div key={title} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444] mt-2 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-[#0a0a0a]">{title}</div>
                      <div className="text-[13px] text-[#666666] mt-0.5">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TalentLens */}
            <div className="bg-[#0a0a0a] border border-[#18181b] rounded-2xl p-8">
              <div className="label-caps text-[#22c55e] mb-5">TalentLens AI</div>
              <div className="space-y-4">
                {[
                  { title: "Semantic Understanding", desc: "Understands that 'PyTorch' and 'deep learning framework' mean the same thing." },
                  { title: "Behavioral Intelligence", desc: "Extracts real capability signals from GitHub, career velocity, and collaboration patterns." },
                  { title: "Career Growth Analysis", desc: "Predicts future performance, not just past experience." },
                  { title: "Explainable AI Ranking", desc: "Every decision is transparent. Full audit trail. No black boxes." },
                ].map(({ title, desc }) => (
                  <div key={title} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] mt-2 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-white">{title}</div>
                      <div className="text-[13px] text-[#71717a] mt-0.5">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="label-caps text-[#71717a] mb-4">How TalentLens Works</div>
          <h2 className="heading-display text-[#0a0a0a] mb-14" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
            6-Step Intelligence Pipeline
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {steps.map((s, i) => (
              <div
                key={s.step}
                className="p-6 border border-[#f3f4f6] rounded-xl hover:border-[#d4d4d8] hover:shadow-sm transition-all bg-white"
              >
                <div className="mono text-[#71717a] text-sm mb-3">{s.step}</div>
                <div className="font-bold text-[#0a0a0a] text-sm mb-1.5">{s.title}</div>
                <div className="text-[13px] text-[#666666]">{s.desc}</div>
                {i < steps.length - 1 && (
                  <div className="mt-3 flex items-center gap-1 text-[#d4d4d8]">
                    <div className="flex-1 h-px bg-[#f3f4f6]" />
                    <ChevronRight size={12} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ARCHITECTURE ─── */}
      <section className="py-20 px-6 bg-[#0a0a0a] pixel-grid-dark">
        <div className="max-w-7xl mx-auto">
          <div className="label-caps text-[#52525b] mb-4">AI Architecture</div>
          <h2
            className="heading-display text-white mb-14"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
          >
            System Architecture
          </h2>

          <div className="max-w-2xl mx-auto">
            {archNodes.map((node, i) => (
              <div key={node.id}>
                <div className="arch-node rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-white">{node.label}</div>
                    <div className="label-caps text-[#52525b] mt-0.5">{node.sublabel}</div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-[#22c55e] status-dot" />
                </div>
                {i < archNodes.length - 1 && (
                  <div className="flex justify-center py-2">
                    <div className="w-px h-6 bg-[#27272a] relative">
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rotate-45 border-r border-b border-[#3f3f46]" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="label-caps text-[#71717a] mb-4">Platform Features</div>
          <h2 className="heading-display text-[#0a0a0a] mb-14" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
            Enterprise Capabilities
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="p-6 border border-[#f3f4f6] rounded-xl hover:border-[#d4d4d8] hover:shadow-sm transition-all bg-white group"
              >
                <div className="w-9 h-9 bg-[#f4f4f5] rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#0a0a0a] transition-colors">
                  <Icon size={16} className="text-[#0a0a0a] group-hover:text-white transition-colors" />
                </div>
                <div className="font-bold text-[#0a0a0a] text-sm mb-1.5">{title}</div>
                <div className="text-[13px] text-[#666666] leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER CTA ─── */}
      <section className="py-20 px-6 bg-[#0a0a0a]">
        <div className="max-w-2xl mx-auto text-center">
          <div className="label-caps text-[#52525b] mb-6">Get Started</div>
          <h2
            className="heading-display text-white mb-6"
            style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
          >
            STOP REJECTING GREAT TALENT.
          </h2>
          <p className="text-[#71717a] mb-10 text-base">
            Start analyzing candidates with semantic intelligence.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@company.com"
              className="flex-1 bg-[#18181b] border border-[#27272a] text-white text-sm px-4 py-3 rounded-xl outline-none placeholder:text-[#52525b] focus:border-[#3f3f46]"
            />
            <Link
              href="/analysis"
              className="bg-white text-[#0a0a0a] px-5 py-3 rounded-xl font-bold text-sm whitespace-nowrap hover:bg-[#f4f4f5] transition-colors"
            >
              Launch Platform
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] border-t border-[#18181b] py-6 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-[#18181b] rounded flex items-center justify-center">
              <span className="text-white text-[8px] font-black">TL</span>
            </div>
            <span className="label-caps text-[#52525b]">TalentLens AI</span>
          </div>
          <div className="label-caps text-[#52525b]">Enterprise AI Recruiting Platform</div>
        </div>
      </footer>
    </div>
  );
}
