"use client";

import { cn, getScoreColor } from "@/lib/utils";
import Link from "next/link";
import { MapPin, Clock, TrendingUp, ChevronRight, Shield, Brain, Zap } from "lucide-react";
import ScoreRing from "./score-ring";

interface Candidate {
  id: string;
  rank: number;
  name: string;
  title: string;
  company: string;
  location: string;
  experience: number;
  availability: string;
  fitScore: number;
  technicalFit: number;
  behavioralFit: number;
  trustScore: number;
  growthPotential: number;
  skills: string[];
  tags: string[];
  atsScore?: number;
}

interface CandidateCardProps {
  candidate: Candidate;
  compact?: boolean;
}

export default function CandidateCard({ candidate, compact = false }: CandidateCardProps) {
  const rankColor =
    candidate.rank === 1
      ? "bg-[#0a0a0a] text-white"
      : candidate.rank === 2
      ? "bg-[#18181b] text-white"
      : candidate.rank <= 5
      ? "bg-[#f4f4f5] text-[#0a0a0a]"
      : "bg-[#f9fafb] text-[#71717a]";

  return (
    <div className={cn(
      "bg-white border border-[#f3f4f6] rounded-xl hover:border-[#d4d4d8] hover:shadow-sm transition-all",
      compact ? "p-4" : "p-5"
    )}>
      <div className="flex items-start gap-4">
        {/* Rank */}
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 rank-badge", rankColor)}>
          #{candidate.rank}
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-bold text-[#0a0a0a] text-sm">{candidate.name}</h3>
                {candidate.tags.includes("Hidden Talent") && (
                  <span className="label-caps bg-[#dcfce7] text-[#16a34a] px-1.5 py-0.5 rounded" style={{ fontSize: "8px" }}>
                    Hidden Gem
                  </span>
                )}
              </div>
              <div className="text-xs text-[#71717a]">
                {candidate.title} · {candidate.company}
              </div>
            </div>

            <ScoreRing score={candidate.fitScore} size={52} strokeWidth={4} showValue />
          </div>

          {/* Meta info */}
          <div className="flex items-center gap-4 mt-2.5 mb-3">
            <div className="flex items-center gap-1">
              <MapPin size={11} className="text-[#71717a]" />
              <span className="text-[11px] text-[#71717a]">{candidate.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={11} className="text-[#71717a]" />
              <span className="text-[11px] text-[#71717a]">{candidate.availability}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-[#71717a]">{candidate.experience}y exp</span>
            </div>
          </div>

          {/* Score bars */}
          <div className="grid grid-cols-4 gap-3 mb-3">
            {[
              { label: "Technical", value: candidate.technicalFit, icon: Zap },
              { label: "Behavioral", value: candidate.behavioralFit, icon: Brain },
              { label: "Trust", value: candidate.trustScore, icon: Shield },
              { label: "Growth", value: candidate.growthPotential, icon: TrendingUp },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-0.5">
                    <Icon size={9} className="text-[#71717a]" />
                    <span className="label-caps text-[#71717a]" style={{ fontSize: "8px" }}>{label}</span>
                  </div>
                  <span className="mono text-[10px] font-bold text-[#0a0a0a]">{value}</span>
                </div>
                <div className="h-1 bg-[#f4f4f5] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${value}%`,
                      backgroundColor: getScoreColor(value),
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 flex-wrap">
              {candidate.skills.slice(0, 4).map((skill) => (
                <span
                  key={skill}
                  className="label-caps bg-[#f4f4f5] text-[#52525b] px-2 py-0.5 rounded"
                  style={{ fontSize: "9px" }}
                >
                  {skill}
                </span>
              ))}
              {candidate.skills.length > 4 && (
                <span className="label-caps text-[#71717a]" style={{ fontSize: "9px" }}>
                  +{candidate.skills.length - 4}
                </span>
              )}
            </div>

            <Link
              href={`/candidate/${candidate.id}`}
              className="flex items-center gap-1 text-[11px] font-semibold text-[#2563eb] hover:text-[#1d4ed8] transition-colors"
            >
              Profile <ChevronRight size={11} />
            </Link>
          </div>

          {/* ATS vs TL comparison if available */}
          {candidate.atsScore !== undefined && (
            <div className="mt-3 pt-3 border-t border-[#f3f4f6] flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="label-caps text-[#71717a]" style={{ fontSize: "8px" }}>ATS Score</span>
                <span className="mono text-[10px] font-bold text-[#71717a]">{candidate.atsScore}</span>
              </div>
              <div className="w-px h-3 bg-[#e4e4e7]" />
              <div className="flex items-center gap-1.5">
                <span className="label-caps text-[#0a0a0a]" style={{ fontSize: "8px" }}>TalentLens</span>
                <span className="mono text-[10px] font-bold text-[#22c55e]">{candidate.fitScore}</span>
              </div>
              <div className="flex items-center gap-0.5">
                <TrendingUp size={9} className="text-[#22c55e]" />
                <span className="mono text-[10px] font-bold text-[#22c55e]">+{candidate.fitScore - candidate.atsScore}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
