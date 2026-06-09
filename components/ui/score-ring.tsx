"use client";

import { getScoreColor } from "@/lib/utils";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  showValue?: boolean;
}

export default function ScoreRing({
  score,
  size = 80,
  strokeWidth = 6,
  label,
  sublabel,
  showValue = true,
}: ScoreRingProps) {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = ((100 - score) / 100) * circumference;
  const color = getScoreColor(score);

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e4e4e7"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
        </svg>
        {showValue && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="mono font-bold text-[#0a0a0a]" style={{ fontSize: size * 0.18 }}>
              {score}
            </span>
          </div>
        )}
      </div>
      {label && (
        <div className="text-center">
          <div className="label-caps text-[#0a0a0a] text-center">{label}</div>
          {sublabel && <div className="label-caps text-[#71717a]" style={{ fontSize: "9px" }}>{sublabel}</div>}
        </div>
      )}
    </div>
  );
}
