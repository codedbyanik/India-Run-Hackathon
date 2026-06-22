"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import CandidateCard from "@/components/ui/candidate-card";
import { rankCandidates } from "@/lib/api";
import { Filter, SlidersHorizontal } from "lucide-react";

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCandidates, setTotalCandidates] = useState(100000);

  const [minScore, setMinScore] = useState(0);
  const [minBehavior, setMinBehavior] = useState(0);
  const [minTrust, setMinTrust] = useState(0);
  const [expFilter, setExpFilter] = useState("all");
  const [availFilter, setAvailFilter] = useState("all");
  const [showHiddenOnly, setShowHiddenOnly] = useState(false);

  // Fetch real candidates from backend on mount
  useEffect(() => {
    async function fetchCandidates() {
      try {
        setLoading(true);
        const data = await rankCandidates();
        setCandidates(data.candidates);
        setTotalCandidates(data.totalCandidates);
      } catch (err) {
        console.error("Failed to fetch candidates:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCandidates();
  }, []);

  const filtered = candidates.filter((c) => {
    if (c.fitScore < minScore) return false;
    if (c.behavioralFit < minBehavior) return false;
    if (c.trustScore < minTrust) return false;
    if (expFilter === "junior" && c.experience >= 7) return false;
    if (expFilter === "senior" && c.experience < 7) return false;
    if (availFilter === "immediate" && c.availability !== "Immediate") return false;
    if (showHiddenOnly && !c.tags.includes("Hidden Talent")) return false;
    return true;
  });

  return (
    <DashboardLayout
      title="Candidate Rankings"
      subtitle={
        loading
          ? "Loading candidates..."
          : `${filtered.length} candidates ranked · Senior AI Engineer · Redrob AI`
      }
    >
      <div className="flex gap-5">
        {/* Filters sidebar */}
        <div className="w-56 flex-shrink-0 space-y-4">
          <div className="bg-white border border-[#f3f4f6] rounded-xl p-4">
            <div className="flex items-center gap-1.5 mb-4">
              <SlidersHorizontal size={13} className="text-[#71717a]" />
              <div className="label-caps text-[#0a0a0a]">Filters</div>
            </div>

            {/* Fit Score */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="label-caps text-[#71717a]">Min Fit Score</div>
                <span className="mono text-[10px] font-bold text-[#0a0a0a]">{minScore}+</span>
              </div>
              <input
                type="range"
                min={0}
                max={90}
                step={5}
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
                className="w-full accent-[#0a0a0a]"
              />
            </div>

            {/* Behavior Score */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="label-caps text-[#71717a]">Min Behavior</div>
                <span className="mono text-[10px] font-bold text-[#0a0a0a]">{minBehavior}+</span>
              </div>
              <input
                type="range"
                min={0}
                max={90}
                step={5}
                value={minBehavior}
                onChange={(e) => setMinBehavior(Number(e.target.value))}
                className="w-full accent-[#0a0a0a]"
              />
            </div>

            {/* Trust Score */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="label-caps text-[#71717a]">Min Trust</div>
                <span className="mono text-[10px] font-bold text-[#0a0a0a]">{minTrust}+</span>
              </div>
              <input
                type="range"
                min={0}
                max={90}
                step={5}
                value={minTrust}
                onChange={(e) => setMinTrust(Number(e.target.value))}
                className="w-full accent-[#0a0a0a]"
              />
            </div>

            {/* Experience */}
            <div className="mb-4">
              <div className="label-caps text-[#71717a] mb-2">Experience</div>
              <div className="space-y-1">
                {[
                  { val: "all", label: "All levels" },
                  { val: "junior", label: "< 7 years" },
                  { val: "senior", label: "7+ years" },
                ].map(({ val, label }) => (
                  <button
                    key={val}
                    onClick={() => setExpFilter(val)}
                    className={`w-full text-left text-[11px] px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                      expFilter === val
                        ? "bg-[#0a0a0a] text-white"
                        : "text-[#71717a] hover:bg-[#f4f4f5]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="mb-4">
              <div className="label-caps text-[#71717a] mb-2">Availability</div>
              <div className="space-y-1">
                {[
                  { val: "all", label: "All" },
                  { val: "immediate", label: "Immediate" },
                ].map(({ val, label }) => (
                  <button
                    key={val}
                    onClick={() => setAvailFilter(val)}
                    className={`w-full text-left text-[11px] px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                      availFilter === val
                        ? "bg-[#0a0a0a] text-white"
                        : "text-[#71717a] hover:bg-[#f4f4f5]"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Hidden talent toggle */}
            <div className="pt-3 border-t border-[#f9fafb]">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <div
                  className={`w-8 h-4 rounded-full transition-colors relative ${showHiddenOnly ? "bg-[#22c55e]" : "bg-[#e4e4e7]"}`}
                  onClick={() => setShowHiddenOnly(!showHiddenOnly)}
                >
                  <div
                    className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${showHiddenOnly ? "translate-x-4" : "translate-x-0.5"}`}
                  />
                </div>
                <span className="label-caps text-[#0a0a0a]">Hidden Talent Only</span>
              </label>
            </div>

            {/* Reset */}
            <button
              onClick={() => {
                setMinScore(0);
                setMinBehavior(0);
                setMinTrust(0);
                setExpFilter("all");
                setAvailFilter("all");
                setShowHiddenOnly(false);
              }}
              className="w-full mt-3 text-[11px] font-semibold text-[#71717a] hover:text-[#0a0a0a] transition-colors"
            >
              Reset Filters
            </button>
          </div>

          {/* Summary */}
          <div className="bg-[#0a0a0a] border border-[#18181b] rounded-xl p-4">
            <div className="label-caps text-[#52525b] mb-3">Cohort Summary</div>
            {[
              { label: "Total Analyzed", value: totalCandidates.toLocaleString() },
              { label: "Top Ranked", value: candidates.length.toString() },
              { label: "Hidden Talent", value: candidates.filter(c => c.tags.includes("Hidden Talent")).length.toString() },
              { label: "Avg Fit Score", value: candidates.length ? Math.round(candidates.reduce((a, c) => a + c.fitScore, 0) / candidates.length).toString() : "—" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-1.5 border-b border-[#18181b] last:border-0">
                <span className="label-caps text-[#52525b]">{label}</span>
                <span className="mono text-[11px] font-bold text-white">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 space-y-3">
          {/* Sort header */}
          <div className="flex items-center justify-between">
            <div>
              <span className="mono text-sm font-bold text-[#0a0a0a]">{filtered.length}</span>
              <span className="text-sm text-[#71717a] ml-1.5">candidates ranked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="label-caps text-[#71717a]">Sort by:</div>
              <select className="text-xs font-semibold text-[#0a0a0a] border border-[#f3f4f6] rounded-lg px-2.5 py-1.5 bg-white outline-none">
                <option>Fit Score</option>
                <option>Technical Fit</option>
                <option>Behavioral Fit</option>
                <option>Trust Score</option>
                <option>Growth Potential</option>
              </select>
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="bg-white border border-[#f3f4f6] rounded-xl p-12 text-center">
              <div className="label-caps text-[#71717a] mb-2">Ranking 100,000 candidates...</div>
              <p className="text-sm text-[#a1a1aa]">Semantic scoring + behavioral signals + AI skills analysis</p>
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="bg-white border border-[#f3f4f6] rounded-xl p-12 text-center">
              <div className="label-caps text-[#71717a] mb-2">No candidates match filters</div>
              <p className="text-sm text-[#a1a1aa]">Try adjusting your filter criteria</p>
            </div>
          )}

          {!loading &&
            filtered.map((candidate) => (
              <CandidateCard key={candidate.id} candidate={candidate} />
            ))}
        </div>
      </div>
    </DashboardLayout>
  );
}