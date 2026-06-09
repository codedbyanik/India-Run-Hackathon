"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  change?: number;
  changeLabel?: string;
  accent?: boolean;
  mono?: boolean;
  sublabel?: string;
}

export default function MetricCard({
  label,
  value,
  unit,
  change,
  changeLabel,
  accent = false,
  mono = true,
  sublabel,
}: MetricCardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;

  return (
    <div
      className={cn(
        "p-5 rounded-xl border transition-all hover:shadow-sm",
        accent
          ? "bg-[#0a0a0a] border-[#27272a] text-white"
          : "bg-white border-[#f3f4f6]"
      )}
    >
      <div className="label-caps mb-3" style={{ color: accent ? "#71717a" : "#71717a" }}>
        {label}
      </div>

      <div className="flex items-end gap-1.5 mb-2">
        <span
          className={cn(
            "text-3xl font-black leading-none",
            mono && "mono",
            accent ? "text-white" : "text-[#0a0a0a]"
          )}
        >
          {value}
        </span>
        {unit && (
          <span
            className={cn("text-sm font-semibold mb-0.5", accent ? "text-[#71717a]" : "text-[#71717a]")}
          >
            {unit}
          </span>
        )}
      </div>

      {sublabel && (
        <div className="label-caps text-[#71717a] mb-2">{sublabel}</div>
      )}

      {change !== undefined && (
        <div className="flex items-center gap-1.5">
          <div
            className={cn(
              "flex items-center gap-0.5 label-caps px-1.5 py-0.5 rounded",
              isPositive && "bg-[#dcfce7] text-[#16a34a]",
              isNegative && "bg-[#fee2e2] text-[#dc2626]",
              !isPositive && !isNegative && "bg-[#f4f4f5] text-[#71717a]"
            )}
          >
            {isPositive ? (
              <TrendingUp size={9} />
            ) : isNegative ? (
              <TrendingDown size={9} />
            ) : (
              <Minus size={9} />
            )}
            <span>{Math.abs(change)}%</span>
          </div>
          {changeLabel && (
            <span className="label-caps text-[#a1a1aa]">{changeLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
