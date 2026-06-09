"use client";

import DashboardLayout from "@/components/dashboard-layout";
import StatusBadge from "@/components/ui/status-badge";
import { hiddenTalentCandidates } from "@/lib/mock-data";
import { Gem, TrendingUp, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function HiddenTalentPage() {
  return (
    <DashboardLayout
      title="Hidden Talent Discovery"
      subtitle="Candidates traditional ATS systems missed"
    >
      {/* Header insight */}
      <div className="bg-[#0a0a0a] border border-[#18181b] rounded-xl p-6 mb-5 pixel-grid-dark">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-[#18181b] border border-[#27272a] rounded-xl flex items-center justify-center flex-shrink-0">
            <Gem size={16} className="text-[#22c55e]" />
          </div>
          <div>
            <div className="label-caps text-[#52525b] mb-1">Secret Weapon</div>
            <h2 className="text-lg font-black text-white mb-2">
              23 high-potential candidates were nearly rejected by ATS
            </h2>
            <p className="text-[13px] text-[#71717a] max-w-2xl">
              TalentLens AI detected behavioral signals, semantic skill matches, and career growth trajectories that
              traditional keyword-based systems completely missed. These candidates average{" "}
              <span className="text-white font-bold">37 points higher</span> on TalentLens than on standard ATS scoring.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-6 pt-6 border-t border-[#18181b]">
          {[
            { value: "23", label: "Hidden candidates found" },
            { value: "+37", label: "Avg score delta vs ATS" },
            { value: "91%", label: "Avg growth potential" },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="mono text-2xl font-black text-white">{value}</div>
              <div className="label-caps text-[#52525b] mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Table header */}
      <div className="bg-white border border-[#f3f4f6] rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#f3f4f6] grid grid-cols-12 gap-4">
          <div className="col-span-3 label-caps text-[#71717a]">Candidate</div>
          <div className="col-span-1 label-caps text-[#71717a] text-center">ATS Score</div>
          <div className="col-span-1 label-caps text-[#71717a] text-center">TL Score</div>
          <div className="col-span-1 label-caps text-[#71717a] text-center">Delta</div>
          <div className="col-span-1 label-caps text-[#71717a] text-center">Growth</div>
          <div className="col-span-1 label-caps text-[#71717a]">Type</div>
          <div className="col-span-4 label-caps text-[#71717a]">Why ATS Missed Them</div>
        </div>

        <div className="divide-y divide-[#f9fafb]">
          {hiddenTalentCandidates.map((c, i) => (
            <div key={c.id} className="px-5 py-4 grid grid-cols-12 gap-4 items-center hover:bg-[#f9fafb] transition-colors">
              {/* Candidate */}
              <div className="col-span-3 flex items-center gap-3">
                <div className="w-7 h-7 bg-[#f4f4f5] rounded-lg flex items-center justify-center">
                  <span className="text-[10px] font-black text-[#0a0a0a]">
                    {c.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-bold text-[#0a0a0a]">{c.name}</div>
                  <div className="label-caps text-[#71717a]">Rank #{i + 1} (TL)</div>
                </div>
              </div>

              {/* ATS Score */}
              <div className="col-span-1 text-center">
                <span className="mono text-sm font-bold text-[#ef4444]">{c.atsScore}</span>
              </div>

              {/* TL Score */}
              <div className="col-span-1 text-center">
                <span className="mono text-sm font-bold text-[#22c55e]">{c.talentlensScore}</span>
              </div>

              {/* Delta */}
              <div className="col-span-1 text-center">
                <div className="inline-flex items-center gap-0.5 bg-[#dcfce7] text-[#16a34a] px-2 py-0.5 rounded">
                  <TrendingUp size={9} />
                  <span className="mono text-[10px] font-bold">+{c.delta}</span>
                </div>
              </div>

              {/* Growth */}
              <div className="col-span-1 text-center">
                <span className="mono text-sm font-bold text-[#2563eb]">{c.growthPotential}</span>
              </div>

              {/* Tag */}
              <div className="col-span-1">
                <StatusBadge
                  label={c.tag}
                  variant={
                    c.tag === "Hidden Gem" ? "success" :
                    c.tag === "High Growth" ? "blue" :
                    c.tag === "International" ? "neutral" : "neutral"
                  }
                />
              </div>

              {/* Reason */}
              <div className="col-span-4 text-[11px] text-[#666666] leading-relaxed">{c.reason}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Score comparison visual */}
      <div className="mt-5 grid md:grid-cols-2 gap-4">
        <div className="bg-white border border-[#f3f4f6] rounded-xl p-5">
          <div className="label-caps text-[#71717a] mb-4">ATS vs TalentLens Score Gap</div>
          <div className="space-y-3">
            {hiddenTalentCandidates.map((c) => (
              <div key={c.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold text-[#0a0a0a]">{c.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="mono text-[10px] text-[#ef4444]">{c.atsScore}</span>
                    <ArrowUpRight size={10} className="text-[#22c55e]" />
                    <span className="mono text-[10px] text-[#22c55e]">{c.talentlensScore}</span>
                  </div>
                </div>
                {/* Dual bar */}
                <div className="relative h-2 bg-[#f4f4f5] rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-[#ef4444]/30"
                    style={{ width: `${c.atsScore}%` }}
                  />
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-[#22c55e]"
                    style={{ width: `${c.talentlensScore}%`, opacity: 0.8 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-[#18181b] rounded-xl p-5">
          <div className="label-caps text-[#52525b] mb-4">Why ATS Systems Fail</div>
          <div className="space-y-3">
            {[
              { cause: "Keyword Dependency", pct: 78, desc: "78% of misses from missing exact terms" },
              { cause: "Degree Bias", pct: 61, desc: "61% filtered on institution, not capability" },
              { cause: "Career Gap Penalty", pct: 43, desc: "43% auto-rejected for gaps" },
              { cause: "International Blindspot", pct: 37, desc: "37% missed from unrecognized companies" },
            ].map(({ cause, pct, desc }) => (
              <div key={cause}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold text-white">{cause}</span>
                  <span className="mono text-[10px] text-[#71717a]">{pct}%</span>
                </div>
                <div className="h-1 bg-[#18181b] rounded-full overflow-hidden">
                  <div className="h-full bg-[#ef4444] rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
