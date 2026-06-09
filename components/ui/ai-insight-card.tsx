"use client";

import { Lightbulb } from "lucide-react";

interface AIInsightCardProps {
  title: string;
  explanation: string;
  candidateName?: string;
  rank?: number;
  dark?: boolean;
}

export default function AIInsightCard({
  title,
  explanation,
  candidateName,
  rank,
  dark = false,
}: AIInsightCardProps) {
  if (dark) {
    return (
      <div className="bg-[#0a0a0a] border border-[#27272a] rounded-xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 bg-[#18181b] border border-[#27272a] rounded-lg flex items-center justify-center flex-shrink-0">
            <Lightbulb size={13} className="text-[#22c55e]" />
          </div>
          <div>
            <div className="label-caps text-[#71717a] mb-1">AI EXPLANATION</div>
            <h4 className="text-sm font-bold text-white mb-2">{title}</h4>
            {candidateName && rank && (
              <div className="label-caps text-[#22c55e] mb-2">
                Why {candidateName} was ranked #{rank}
              </div>
            )}
            <p className="text-[13px] text-[#a1a1aa] leading-relaxed">{explanation}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#f3f4f6] rounded-xl p-5">
      <div className="flex items-start gap-3">
        <div className="w-7 h-7 bg-[#f9fafb] border border-[#f3f4f6] rounded-lg flex items-center justify-center flex-shrink-0">
          <Lightbulb size={13} className="text-[#2563eb]" />
        </div>
        <div>
          <div className="label-caps text-[#71717a] mb-1">AI EXPLANATION</div>
          <h4 className="text-sm font-bold text-[#0a0a0a] mb-2">{title}</h4>
          {candidateName && rank && (
            <div className="label-caps text-[#22c55e] mb-2">
              Why {candidateName} was ranked #{rank}
            </div>
          )}
          <p className="text-[13px] text-[#666666] leading-relaxed">{explanation}</p>
        </div>
      </div>
    </div>
  );
}
