"use client";

import { cn } from "@/lib/utils";

type BadgeVariant = "success" | "warning" | "danger" | "neutral" | "blue" | "black";

interface StatusBadgeProps {
  label: string;
  variant?: BadgeVariant;
  dot?: boolean;
  size?: "sm" | "md";
}

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-[#dcfce7] text-[#16a34a]",
  warning: "bg-[#fef9c3] text-[#a16207]",
  danger: "bg-[#fee2e2] text-[#dc2626]",
  neutral: "bg-[#f4f4f5] text-[#52525b]",
  blue: "bg-[#dbeafe] text-[#1d4ed8]",
  black: "bg-[#0a0a0a] text-white",
};

const dotColors: Record<BadgeVariant, string> = {
  success: "bg-[#22c55e]",
  warning: "bg-[#f59e0b]",
  danger: "bg-[#ef4444]",
  neutral: "bg-[#71717a]",
  blue: "bg-[#2563eb]",
  black: "bg-white",
};

export default function StatusBadge({
  label,
  variant = "neutral",
  dot = false,
  size = "sm",
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded font-bold uppercase tracking-[0.08em]",
        size === "sm" ? "px-1.5 py-0.5 text-[9px]" : "px-2 py-1 text-[10px]",
        variantStyles[variant]
      )}
    >
      {dot && (
        <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", dotColors[variant])} />
      )}
      {label}
    </span>
  );
}
