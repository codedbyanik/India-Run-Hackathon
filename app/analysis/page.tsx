"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import AIInsightCard from "@/components/ui/ai-insight-card";
import StatusBadge from "@/components/ui/status-badge";
import { jobAnalysis } from "@/lib/mock-data";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { Brain, ArrowRight, Upload, Clipboard, FileText, Sparkles } from "lucide-react";
import Link from "next/link";

const DEFAULT_JD = `Senior ML Engineer — Foundation Models Team

We are looking for a Senior ML Engineer to join our Foundation Models team. The ideal candidate has deep expertise in PyTorch or JAX, experience with distributed training at scale, and a strong understanding of RLHF and fine-tuning techniques.

Requirements:
- 5+ years of experience in ML engineering
- Expertise in PyTorch, JAX, or equivalent frameworks
- Experience with distributed training (multi-GPU, multi-node)
- Strong Python programming skills
- Experience with RLHF, fine-tuning, or alignment techniques
- CUDA/GPU optimization experience preferred
- Publications or open-source contributions a plus

Responsibilities:
- Design and implement training pipelines for large language models
- Optimize distributed training across GPU clusters
- Collaborate with research team on RLHF implementation
- Mentor junior engineers and contribute to technical direction`;

export default function AnalysisPage() {
  const [jd, setJd] = useState("");
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = () => {
    if (!jd.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAnalyzed(true);
    }, 1800);
  };

  const handlePaste = () => {
    setJd(DEFAULT_JD);
  };

  return (
    <DashboardLayout
      title="Job Intelligence"
      subtitle="AI-powered JD analysis and requirement extraction"
      actions={
        analyzed ? (
          <Link
            href="/candidates"
            className="flex items-center gap-1.5 bg-[#0a0a0a] text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#18181b] transition-colors"
          >
            Rank Candidates <ArrowRight size={12} />
          </Link>
        ) : null
      }
    >
      {!analyzed ? (
        /* Input state */
        <div className="max-w-3xl mx-auto">
          <div className="bg-white border border-[#f3f4f6] rounded-xl p-6 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-[#0a0a0a]">Paste Job Description</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePaste}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[#71717a] border border-[#f3f4f6] px-3 py-1.5 rounded-lg hover:bg-[#f9fafb] transition-colors"
                >
                  <Clipboard size={12} /> Use Sample JD
                </button>
                <button className="flex items-center gap-1.5 text-xs font-semibold text-[#71717a] border border-[#f3f4f6] px-3 py-1.5 rounded-lg hover:bg-[#f9fafb] transition-colors">
                  <Upload size={12} /> Upload PDF
                </button>
              </div>
            </div>

            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Paste your job description here. TalentLens AI will extract skills, behavioral requirements, leadership signals, and seniority requirements..."
              className="w-full h-64 text-sm text-[#0a0a0a] placeholder:text-[#a1a1aa] border border-[#f3f4f6] rounded-xl p-4 outline-none resize-none focus:border-[#d4d4d8] bg-[#f9fafb] font-mono leading-relaxed"
            />

            <div className="flex items-center justify-between mt-4">
              <div className="label-caps text-[#a1a1aa]">{jd.length} characters</div>
              <button
                onClick={handleAnalyze}
                disabled={!jd.trim() || loading}
                className="flex items-center gap-2 bg-[#0a0a0a] text-white text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-[#18181b] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain size={14} /> Analyze with AI
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: FileText, title: "Skill Extraction", desc: "Required + preferred skills with priority weights" },
              { icon: Brain, title: "Behavioral Signals", desc: "Culture, collaboration, and growth signals" },
              { icon: Sparkles, title: "AI Summary", desc: "Strategic hiring intelligence for recruiters" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-4 bg-[#f9fafb] border border-[#f3f4f6] rounded-xl">
                <Icon size={14} className="text-[#71717a] mb-2" />
                <div className="text-xs font-bold text-[#0a0a0a] mb-1">{title}</div>
                <div className="text-[11px] text-[#71717a]">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Results state */
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Left: Skills */}
          <div className="lg:col-span-2 space-y-4">
            {/* JD Header */}
            <div className="bg-white border border-[#f3f4f6] rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="label-caps text-[#71717a] mb-1">Analyzed Position</div>
                  <h2 className="font-black text-[#0a0a0a] text-lg">{jobAnalysis.jobTitle}</h2>
                  <div className="label-caps text-[#71717a] mt-1">{jobAnalysis.company} · {jobAnalysis.postedDate}</div>
                </div>
                <StatusBadge label="Analysis Complete" variant="success" dot />
              </div>
            </div>

            {/* Required Skills */}
            <div className="bg-white border border-[#f3f4f6] rounded-xl p-5">
              <div className="label-caps text-[#71717a] mb-4">Required Skills</div>
              <div className="space-y-2.5">
                {jobAnalysis.requiredSkills.map((s) => (
                  <div key={s.skill}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#0a0a0a]">{s.skill}</span>
                        <span className="label-caps bg-[#f4f4f5] text-[#71717a] px-1.5 py-0.5 rounded" style={{ fontSize: "8px" }}>
                          {s.category}
                        </span>
                      </div>
                      <span className="mono text-xs font-bold text-[#0a0a0a]">{s.weight}%</span>
                    </div>
                    <div className="h-1.5 bg-[#f4f4f5] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#0a0a0a] transition-all"
                        style={{ width: `${s.weight}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preferred Skills */}
            <div className="bg-white border border-[#f3f4f6] rounded-xl p-5">
              <div className="label-caps text-[#71717a] mb-4">Preferred Skills</div>
              <div className="space-y-2.5">
                {jobAnalysis.preferredSkills.map((s) => (
                  <div key={s.skill}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-[#0a0a0a]">{s.skill}</span>
                      <span className="mono text-xs font-bold text-[#71717a]">{s.weight}%</span>
                    </div>
                    <div className="h-1.5 bg-[#f4f4f5] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#d4d4d8] transition-all"
                        style={{ width: `${s.weight}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Behavioral Requirements */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white border border-[#f3f4f6] rounded-xl p-5">
                <div className="label-caps text-[#71717a] mb-3">Behavioral Requirements</div>
                <div className="space-y-2">
                  {jobAnalysis.behavioralRequirements.map((r) => (
                    <div key={r} className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-[#0a0a0a] mt-2 flex-shrink-0" />
                      <span className="text-[12px] text-[#666666]">{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-[#f3f4f6] rounded-xl p-5">
                <div className="label-caps text-[#71717a] mb-3">Leadership Signals</div>
                <div className="space-y-2">
                  {jobAnalysis.leadershipSignals.map((r) => (
                    <div key={r} className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-[#2563eb] mt-2 flex-shrink-0" />
                      <span className="text-[12px] text-[#666666]">{r}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-[#f9fafb]">
                  <div className="label-caps text-[#71717a] mb-2">Experience Range</div>
                  <div className="mono text-sm font-bold text-[#0a0a0a]">
                    {jobAnalysis.experienceRequirements.minimum}–{jobAnalysis.experienceRequirements.preferred}+ years
                  </div>
                  <div className="label-caps text-[#71717a]">{jobAnalysis.experienceRequirements.seniorityLevel}</div>
                </div>
              </div>
            </div>

            {/* AI Summary */}
            <AIInsightCard
              title="Strategic Hiring Intelligence"
              explanation={jobAnalysis.aiSummary}
            />
          </div>

          {/* Right: Radar + actions */}
          <div className="space-y-4">
            {/* Radar Chart */}
            <div className="bg-white border border-[#f3f4f6] rounded-xl p-5">
              <div className="label-caps text-[#71717a] mb-4">Requirement Breakdown</div>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={jobAnalysis.radarData}>
                  <PolarGrid stroke="#f3f4f6" />
                  <PolarAngleAxis
                    dataKey="category"
                    tick={{ fontSize: 9, fill: "#71717a", fontWeight: 700 }}
                  />
                  <Radar
                    name="Requirements"
                    dataKey="value"
                    stroke="#0a0a0a"
                    fill="#0a0a0a"
                    fillOpacity={0.08}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Priority stats */}
            <div className="bg-white border border-[#f3f4f6] rounded-xl p-5">
              <div className="label-caps text-[#71717a] mb-4">Hiring Priorities</div>
              <div className="space-y-3">
                {[
                  { label: "Technical Depth", value: 95, primary: true },
                  { label: "Research Output", value: 80, primary: false },
                  { label: "System Scale", value: 88, primary: true },
                  { label: "Leadership", value: 60, primary: false },
                  { label: "Communication", value: 72, primary: false },
                ].map(({ label, value, primary }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-24 label-caps text-[#71717a]">{label}</div>
                    <div className="flex-1 h-1 bg-[#f4f4f5] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${primary ? "bg-[#0a0a0a]" : "bg-[#d4d4d8]"}`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                    <span className="mono text-[10px] font-bold text-[#0a0a0a] w-6">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/candidates"
              className="block w-full bg-[#0a0a0a] text-white text-center text-sm font-bold py-3.5 rounded-xl hover:bg-[#18181b] transition-colors"
            >
              Rank Candidates →
            </Link>
            <Link
              href="/hidden-talent"
              className="block w-full bg-white border border-[#f3f4f6] text-[#0a0a0a] text-center text-sm font-bold py-3 rounded-xl hover:bg-[#f9fafb] transition-colors"
            >
              Find Hidden Talent →
            </Link>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
