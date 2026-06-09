"use client";

import { use } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import ScoreRing from "@/components/ui/score-ring";
import StatusBadge from "@/components/ui/status-badge";
import AIInsightCard from "@/components/ui/ai-insight-card";
import { candidates } from "@/lib/mock-data";
import { getScoreColor } from "@/lib/utils";
import { MapPin, Clock, TrendingUp, Shield, Brain, Zap, Activity, GitBranch, Star, AlertTriangle, CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function CandidateProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const candidate = candidates.find((c) => c.id === id) ?? candidates[0];

  const hiringColor =
    candidate.hiringRecommendation === "Strong Hire"
      ? "success"
      : candidate.hiringRecommendation === "Hire"
      ? "blue"
      : "warning";

  return (
    <DashboardLayout
      title={candidate.name}
      subtitle={`${candidate.title} · Rank #${candidate.rank}`}
      actions={
        <div className="flex items-center gap-2">
          <StatusBadge label={candidate.hiringRecommendation} variant={hiringColor as "success"} dot />
          <Link
            href="/explainability"
            className="flex items-center gap-1.5 text-xs font-bold text-[#2563eb] border border-[#dbeafe] bg-[#dbeafe]/30 px-3 py-1.5 rounded-lg hover:bg-[#dbeafe]/60 transition-colors"
          >
            Full Explanation <ChevronRight size={11} />
          </Link>
        </div>
      }
    >
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left main */}
        <div className="lg:col-span-2 space-y-4">
          {/* Profile overview */}
          <div className="bg-white border border-[#f3f4f6] rounded-xl p-6">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 bg-[#0a0a0a] rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-black text-lg">
                  {candidate.name.split(" ").map((n) => n[0]).join("")}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="font-black text-[#0a0a0a] text-xl">{candidate.name}</h1>
                    <div className="text-sm text-[#71717a]">{candidate.title} · {candidate.company}</div>
                  </div>
                  <div className="rank-badge bg-[#0a0a0a] text-white w-10 h-10 rounded-xl flex items-center justify-center text-xs">
                    #{candidate.rank}
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1">
                    <MapPin size={12} className="text-[#71717a]" />
                    <span className="text-[12px] text-[#71717a]">{candidate.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={12} className="text-[#71717a]" />
                    <span className="text-[12px] text-[#71717a]">Available in {candidate.availability}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[12px] text-[#71717a]">{candidate.experience} years exp</span>
                  </div>
                </div>
                <p className="text-[13px] text-[#666666] mt-3 leading-relaxed">{candidate.summary}</p>
              </div>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="bg-white border border-[#f3f4f6] rounded-xl p-5">
            <div className="label-caps text-[#71717a] mb-5">Score Breakdown</div>
            <div className="flex items-center justify-around">
              <ScoreRing score={candidate.fitScore} size={90} strokeWidth={7} label="Fit Score" sublabel="Overall" />
              <ScoreRing score={candidate.technicalFit} size={72} strokeWidth={6} label="Technical" />
              <ScoreRing score={candidate.behavioralFit} size={72} strokeWidth={6} label="Behavioral" />
              <ScoreRing score={candidate.trustScore} size={72} strokeWidth={6} label="Trust" />
              <ScoreRing score={candidate.growthPotential} size={72} strokeWidth={6} label="Growth" />
            </div>
          </div>

          {/* Career Timeline */}
          <div className="bg-white border border-[#f3f4f6] rounded-xl p-5">
            <div className="label-caps text-[#71717a] mb-4">Career Timeline</div>
            <div className="space-y-4">
              {candidate.careerTimeline.map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-[#0a0a0a] flex-shrink-0 mt-1.5" />
                    {i < candidate.careerTimeline.length - 1 && (
                      <div className="w-px flex-1 bg-[#f3f4f6] my-1" style={{ minHeight: "24px" }} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-bold text-[#0a0a0a]">{item.role}</div>
                        <div className="label-caps text-[#71717a]">{item.company}</div>
                      </div>
                      <div className="mono text-[11px] text-[#71717a] font-bold">{item.year}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Behavioral Signals */}
          <div className="bg-white border border-[#f3f4f6] rounded-xl p-5">
            <div className="label-caps text-[#71717a] mb-4">Behavioral Signals</div>
            <div className="space-y-3">
              {Object.entries(candidate.behavioralSignals).map(([key, value]) => {
                const label = key
                  .replace(/([A-Z])/g, " $1")
                  .replace("Score", "")
                  .replace("Index", "")
                  .trim();
                return (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <Brain size={11} className="text-[#71717a]" />
                        <span className="label-caps text-[#71717a]">{label}</span>
                      </div>
                      <span className="mono text-xs font-bold text-[#0a0a0a]">{value}</span>
                    </div>
                    <div className="h-1.5 bg-[#f4f4f5] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${value}%`, backgroundColor: getScoreColor(value) }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Strengths + Weaknesses */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white border border-[#f3f4f6] rounded-xl p-5">
              <div className="label-caps text-[#71717a] mb-3">Strengths</div>
              <div className="space-y-2">
                {candidate.strengths.map((s) => (
                  <div key={s} className="flex items-start gap-2">
                    <CheckCircle2 size={13} className="text-[#22c55e] mt-0.5 flex-shrink-0" />
                    <span className="text-[12px] text-[#666666]">{s}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border border-[#f3f4f6] rounded-xl p-5">
              <div className="label-caps text-[#71717a] mb-3">Weaknesses</div>
              <div className="space-y-2">
                {candidate.weaknesses.map((w) => (
                  <div key={w} className="flex items-start gap-2">
                    <AlertTriangle size={13} className="text-[#f59e0b] mt-0.5 flex-shrink-0" />
                    <span className="text-[12px] text-[#666666]">{w}</span>
                  </div>
                ))}
              </div>
              {candidate.riskIndicators.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[#f9fafb]">
                  <div className="label-caps text-[#ef4444] mb-2">Risk Indicators</div>
                  {candidate.riskIndicators.map((r) => (
                    <div key={r} className="flex items-start gap-2">
                      <AlertTriangle size={13} className="text-[#ef4444] mt-0.5 flex-shrink-0" />
                      <span className="text-[12px] text-[#666666]">{r}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* AI Explanation */}
          <AIInsightCard
            title={`Why ${candidate.name} was ranked #${candidate.rank}`}
            explanation={candidate.aiExplanation}
            candidateName={candidate.name}
            rank={candidate.rank}
          />
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Hiring recommendation */}
          <div className="bg-[#0a0a0a] border border-[#18181b] rounded-xl p-5">
            <div className="label-caps text-[#52525b] mb-3">Hiring Recommendation</div>
            <div className="text-2xl font-black text-white mb-1">{candidate.hiringRecommendation}</div>
            <div className="label-caps text-[#71717a]">Based on {candidate.fitScore}/100 fit score</div>

            <div className="mt-4 pt-4 border-t border-[#18181b]">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="label-caps text-[#52525b] mb-1">ATS Would Score</div>
                  <div className="mono text-lg font-black text-[#ef4444]">{candidate.atsScore}</div>
                </div>
                <div>
                  <div className="label-caps text-[#52525b] mb-1">TalentLens Score</div>
                  <div className="mono text-lg font-black text-[#22c55e]">{candidate.fitScore}</div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1.5">
                <TrendingUp size={12} className="text-[#22c55e]" />
                <span className="mono text-sm font-bold text-[#22c55e]">
                  +{candidate.fitScore - candidate.atsScore} points above ATS
                </span>
              </div>
            </div>
          </div>

          {/* Trust Signals */}
          <div className="bg-white border border-[#f3f4f6] rounded-xl p-5">
            <div className="label-caps text-[#71717a] mb-3">Trust Signals</div>
            <div className="space-y-2.5">
              {[
                { label: "Experience Verified", value: candidate.trustSignals.verifiedExperience },
                { label: "Publication Record", value: candidate.trustSignals.publicationRecord },
                { label: "Consistent Trajectory", value: candidate.trustSignals.consistentCareerTrajectory },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield size={11} className="text-[#71717a]" />
                    <span className="text-[11px] font-medium text-[#0a0a0a]">{label}</span>
                  </div>
                  <StatusBadge label={value ? "Verified" : "Pending"} variant={value ? "success" : "warning"} />
                </div>
              ))}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GitBranch size={11} className="text-[#71717a]" />
                  <span className="text-[11px] font-medium text-[#0a0a0a]">GitHub Activity</span>
                </div>
                <StatusBadge
                  label={candidate.trustSignals.githubActivity}
                  variant={
                    candidate.trustSignals.githubActivity === "High"
                      ? "success"
                      : candidate.trustSignals.githubActivity === "Medium"
                      ? "blue"
                      : "warning"
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={11} className="text-[#71717a]" />
                  <span className="text-[11px] font-medium text-[#0a0a0a]">Anomaly Flags</span>
                </div>
                <StatusBadge
                  label={candidate.trustSignals.anomalyFlags === 0 ? "None" : `${candidate.trustSignals.anomalyFlags}`}
                  variant={candidate.trustSignals.anomalyFlags === 0 ? "success" : "danger"}
                />
              </div>
            </div>
          </div>

          {/* Activity Signals */}
          <div className="bg-white border border-[#f3f4f6] rounded-xl p-5">
            <div className="label-caps text-[#71717a] mb-3">Activity Signals</div>
            <div className="space-y-3">
              {[
                { label: "Open Source Contributions", value: candidate.activitySignals.openSourceContributions, mono: true },
                { label: "GitHub Stars", value: candidate.activitySignals.githubStars.toLocaleString(), mono: true },
                { label: "Response Rate", value: `${candidate.activitySignals.responseRate}%`, mono: true },
                { label: "Last Active", value: candidate.activitySignals.lastActive, mono: false },
              ].map(({ label, value, mono }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity size={11} className="text-[#71717a]" />
                    <span className="label-caps text-[#71717a]">{label}</span>
                  </div>
                  <span className={`text-[11px] font-bold text-[#0a0a0a] ${mono ? "mono" : ""}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white border border-[#f3f4f6] rounded-xl p-5">
            <div className="label-caps text-[#71717a] mb-3">Skills</div>
            <div className="flex flex-wrap gap-1.5">
              {candidate.skills.map((skill) => (
                <span
                  key={skill}
                  className="label-caps bg-[#f4f4f5] text-[#52525b] px-2 py-1 rounded"
                  style={{ fontSize: "9px" }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {candidate.tags.map((tag) => (
              <StatusBadge
                key={tag}
                label={tag}
                variant={
                  tag === "Hidden Talent" || tag === "Hidden Gem"
                    ? "success"
                    : tag === "High Growth"
                    ? "blue"
                    : "neutral"
                }
              />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
