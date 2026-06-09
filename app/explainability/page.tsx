"use client";

import DashboardLayout from "@/components/dashboard-layout";
import ScoreRing from "@/components/ui/score-ring";
import AIInsightCard from "@/components/ui/ai-insight-card";
import { explainabilityData } from "@/lib/mock-data";
import { getScoreColor } from "@/lib/utils";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { TrendingUp, ArrowUpRight } from "lucide-react";

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#e4e4e7] rounded-lg p-3 shadow-sm">
        <div className="label-caps text-[#71717a] mb-1">{label}</div>
        <div className="mono text-sm font-bold text-[#0a0a0a]">{payload[0].value}</div>
      </div>
    );
  }
  return null;
};

export default function ExplainabilityPage() {
  const data = explainabilityData;

  return (
    <DashboardLayout
      title="Explainability Center"
      subtitle="Transparent AI ranking decisions"
    >
      {/* Header */}
      <div className="bg-[#0a0a0a] border border-[#18181b] rounded-xl p-6 mb-5">
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <div className="label-caps text-[#52525b] mb-2">Subject</div>
            <h2 className="text-xl font-black text-white">{data.candidateName}</h2>
            <div className="label-caps text-[#71717a] mt-1">Ranked #{data.rank} of 1,847 candidates</div>
            <div className="mt-4">
              <div className="label-caps text-[#52525b] mb-1">Final Score</div>
              <div className="mono text-4xl font-black text-white">{data.finalScore}</div>
              <div className="label-caps text-[#22c55e] mt-1">/ 100 — Strong Hire</div>
            </div>
          </div>
          <div className="flex items-center gap-6 justify-center">
            <ScoreRing score={data.candidateName ? 95 : 0} size={90} strokeWidth={7} label="Semantic Match" />
            <ScoreRing score={94} size={90} strokeWidth={7} label="Behavioral" />
            <ScoreRing score={92} size={90} strokeWidth={7} label="Career Growth" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left: Factor Breakdown */}
        <div className="lg:col-span-2 space-y-4">
          {/* Scoring Formula */}
          <div className="bg-white border border-[#f3f4f6] rounded-xl p-5">
            <div className="label-caps text-[#71717a] mb-3">Ranking Formula</div>
            <div className="bg-[#f9fafb] border border-[#f3f4f6] rounded-lg p-4">
              <code className="mono text-xs text-[#0a0a0a] leading-relaxed block">{data.formula}</code>
            </div>
          </div>

          {/* Factor breakdown */}
          <div className="bg-white border border-[#f3f4f6] rounded-xl p-5">
            <div className="label-caps text-[#71717a] mb-4">Scoring Factor Breakdown</div>
            <div className="space-y-5">
              {data.scoringBreakdown.map((factor, i) => (
                <div key={factor.factor} className="border border-[#f9fafb] rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-sm font-bold text-[#0a0a0a]">{factor.factor}</div>
                      <div className="label-caps text-[#71717a] mt-0.5">
                        Weight: {factor.weight}% · Contribution: {factor.contribution.toFixed(2)} pts
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="mono text-lg font-black" style={{ color: getScoreColor(factor.score) }}>
                        {factor.score}
                      </div>
                      <div className="label-caps text-[#71717a]">score</div>
                    </div>
                  </div>

                  {/* Score bar */}
                  <div className="mb-3">
                    <div className="h-2 bg-[#f4f4f5] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${factor.score}%`, backgroundColor: getScoreColor(factor.score) }}
                      />
                    </div>
                  </div>

                  {/* Explanation */}
                  <p className="text-[12px] text-[#666666] leading-relaxed">{factor.explanation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Ranking comparison chart */}
          <div className="bg-white border border-[#f3f4f6] rounded-xl p-5">
            <div className="font-bold text-sm text-[#0a0a0a] mb-1">ATS vs TalentLens Ranking</div>
            <div className="label-caps text-[#71717a] mb-4">Top 5 candidates — score comparison</div>
            <div className="space-y-3">
              {data.rankingComparison.map((item) => (
                <div key={item.candidate}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#0a0a0a]">{item.candidate}</span>
                      {item.hidden && (
                        <span className="label-caps bg-[#dcfce7] text-[#16a34a] px-1.5 py-0.5 rounded" style={{ fontSize: "8px" }}>
                          Hidden Gem
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="mono text-[10px] text-[#ef4444]">ATS: {item.ats}</span>
                      <span className="mono text-[10px] text-[#22c55e]">TL: {item.tl}</span>
                      <div className="flex items-center gap-0.5">
                        <ArrowUpRight size={10} className="text-[#22c55e]" />
                        <span className="mono text-[10px] font-bold text-[#22c55e]">+{item.tl - item.ats}</span>
                      </div>
                    </div>
                  </div>
                  <div className="relative h-2 bg-[#f4f4f5] rounded-full overflow-hidden">
                    <div className="absolute inset-y-0 left-0 rounded-full bg-[#fecaca]" style={{ width: `${item.ats}%` }} />
                    <div className="absolute inset-y-0 left-0 rounded-full bg-[#22c55e]" style={{ width: `${item.tl}%`, opacity: 0.7 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-4">
          {/* Weight chart */}
          <div className="bg-white border border-[#f3f4f6] rounded-xl p-5">
            <div className="label-caps text-[#71717a] mb-4">Factor Weights</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={data.scoringBreakdown} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 9, fill: "#71717a", fontFamily: "monospace" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="factor" tick={{ fontSize: 8, fill: "#0a0a0a", fontWeight: 700 }} axisLine={false} tickLine={false} width={110} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="weight" name="Weight %" radius={[0, 3, 3, 0]} maxBarSize={12}>
                  {data.scoringBreakdown.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? "#0a0a0a" : index === 1 ? "#27272a" : index === 2 ? "#3f3f46" : "#71717a"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ATS comparison */}
          <div className="bg-white border border-[#f3f4f6] rounded-xl p-5">
            <div className="label-caps text-[#71717a] mb-3">ATS vs TalentLens</div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-[#f9fafb] rounded-lg p-3 text-center">
                <div className="mono text-2xl font-black text-[#ef4444]">{data.vsAtsPrediction.atsScore}</div>
                <div className="label-caps text-[#71717a] mt-1">ATS Score</div>
              </div>
              <div className="bg-[#f0fdf4] rounded-lg p-3 text-center">
                <div className="mono text-2xl font-black text-[#22c55e]">{data.vsAtsPrediction.talentlensScore}</div>
                <div className="label-caps text-[#16a34a] mt-1">TL Score</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-1.5 mb-3">
              <TrendingUp size={13} className="text-[#22c55e]" />
              <span className="mono text-sm font-black text-[#22c55e]">
                +{data.vsAtsPrediction.delta} points improvement
              </span>
            </div>
            <div className="space-y-2">
              <div className="p-2.5 bg-[#fef2f2] rounded-lg">
                <div className="label-caps text-[#ef4444] mb-1">ATS would have</div>
                <div className="text-[11px] text-[#666666]">{data.vsAtsPrediction.atsWouldHave}</div>
              </div>
              <div className="p-2.5 bg-[#f0fdf4] rounded-lg">
                <div className="label-caps text-[#16a34a] mb-1">TalentLens insight</div>
                <div className="text-[11px] text-[#666666]">{data.vsAtsPrediction.talentlensInsight}</div>
              </div>
            </div>
          </div>

          {/* AI Explanation */}
          <AIInsightCard
            title="Complete AI Explanation"
            explanation={`Priya Sharma ranked #1 due to a rare combination of research-level expertise and production engineering capability. The 35-point gap vs ATS reflects the depth of non-keyword signals captured: RLHF expertise validated through GitHub history, distributed training skills cross-referenced with public talks, and behavioral signals indicating 97th percentile problem-solving. Every factor contributing to the final score of ${data.finalScore} is fully auditable.`}
            candidateName={data.candidateName}
            rank={data.rank}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
