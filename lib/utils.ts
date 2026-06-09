import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatScore(score: number): string {
  return score.toFixed(1);
}

export function getScoreColor(score: number): string {
  if (score >= 90) return "#22c55e";
  if (score >= 75) return "#2563eb";
  if (score >= 60) return "#f59e0b";
  return "#ef4444";
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 60) return "Average";
  return "Below Average";
}
