"use client";

/**
 * NoteNode theme system - color tokens for the 8 supported note colors.
 */
import type { NoteColor } from "@/features/canvas/types";

export interface NodeTheme {
  borderBase: string;
  borderHover: string;
  shadowHover: string;
  selectedBorder: string;
  selectedShadow: string;
  selectedBg: string;
  bgHover: string;
  topLine: string;
  innerGlow: string;
  innerGlowUnselected: string;
}

export const THEMES: Record<NoteColor, NodeTheme> = {
  default: {
    borderBase: "border-[#FFB4A2]/20",
    borderHover: "hover:border-[#FF8FA3]/40",
    shadowHover:
      "hover:shadow-[0_8px_40px_rgba(255,180,162,0.15),0_0_30px_rgba(255,143,163,0.1)]",
    selectedBorder: "border-[#FF8FA3]/50",
    selectedShadow: "shadow-[0_0_50px_-10px_rgba(255,143,163,0.25)]",
    selectedBg: "bg-white/95",
    bgHover: "hover:bg-white/90",
    topLine: "via-[#FF8FA3]",
    innerGlow: "from-[#FFB4A2]/10",
    innerGlowUnselected: "from-[#FFB4A2]/5",
  },
  red: {
    borderBase: "border-[#FF8FA3]/25",
    borderHover: "hover:border-[#FF8FA3]/50",
    shadowHover:
      "hover:shadow-[0_8px_40px_rgba(255,143,163,0.15),0_0_30px_rgba(255,143,163,0.1)]",
    selectedBorder: "border-[#FF8FA3]/60",
    selectedShadow: "shadow-[0_0_50px_-10px_rgba(255,143,163,0.3)]",
    selectedBg: "bg-pink-50/90",
    bgHover: "hover:bg-pink-50/60",
    topLine: "via-[#FF8FA3]",
    innerGlow: "from-[#FF8FA3]/15",
    innerGlowUnselected: "from-[#FF8FA3]/5",
  },
  amber: {
    borderBase: "border-amber-400/20",
    borderHover: "hover:border-amber-400/40",
    shadowHover:
      "hover:shadow-[0_8px_40px_rgba(251,191,36,0.15),0_0_30px_rgba(251,191,36,0.1)]",
    selectedBorder: "border-amber-400/60",
    selectedShadow: "shadow-[0_0_50px_-10px_rgba(251,191,36,0.3)]",
    selectedBg: "bg-amber-50/90",
    bgHover: "hover:bg-amber-50/60",
    topLine: "via-amber-400",
    innerGlow: "from-amber-400/15",
    innerGlowUnselected: "from-amber-400/5",
  },
  emerald: {
    borderBase: "border-emerald-400/20",
    borderHover: "hover:border-emerald-400/40",
    shadowHover:
      "hover:shadow-[0_8px_40px_rgba(52,211,153,0.15),0_0_30px_rgba(52,211,153,0.1)]",
    selectedBorder: "border-emerald-400/60",
    selectedShadow: "shadow-[0_0_50px_-10px_rgba(52,211,153,0.3)]",
    selectedBg: "bg-emerald-50/90",
    bgHover: "hover:bg-emerald-50/60",
    topLine: "via-emerald-400",
    innerGlow: "from-emerald-400/15",
    innerGlowUnselected: "from-emerald-400/5",
  },
  blue: {
    borderBase: "border-blue-400/20",
    borderHover: "hover:border-blue-400/40",
    shadowHover:
      "hover:shadow-[0_8px_40px_rgba(96,165,250,0.15),0_0_30px_rgba(96,165,250,0.1)]",
    selectedBorder: "border-blue-400/60",
    selectedShadow: "shadow-[0_0_50px_-10px_rgba(96,165,250,0.3)]",
    selectedBg: "bg-blue-50/90",
    bgHover: "hover:bg-blue-50/60",
    topLine: "via-blue-400",
    innerGlow: "from-blue-400/15",
    innerGlowUnselected: "from-blue-400/5",
  },
  indigo: {
    borderBase: "border-indigo-400/20",
    borderHover: "hover:border-indigo-400/40",
    shadowHover:
      "hover:shadow-[0_8px_40px_rgba(129,140,248,0.15),0_0_30px_rgba(129,140,248,0.1)]",
    selectedBorder: "border-indigo-400/60",
    selectedShadow: "shadow-[0_0_50px_-10px_rgba(129,140,248,0.3)]",
    selectedBg: "bg-indigo-50/90",
    bgHover: "hover:bg-indigo-50/60",
    topLine: "via-indigo-400",
    innerGlow: "from-indigo-400/15",
    innerGlowUnselected: "from-indigo-400/5",
  },
  purple: {
    borderBase: "border-purple-400/20",
    borderHover: "hover:border-purple-400/40",
    shadowHover:
      "hover:shadow-[0_8px_40px_rgba(192,132,252,0.15),0_0_30px_rgba(192,132,252,0.1)]",
    selectedBorder: "border-purple-400/60",
    selectedShadow: "shadow-[0_0_50px_-10px_rgba(192,132,252,0.3)]",
    selectedBg: "bg-purple-50/90",
    bgHover: "hover:bg-purple-50/60",
    topLine: "via-purple-400",
    innerGlow: "from-purple-400/15",
    innerGlowUnselected: "from-purple-400/5",
  },
  pink: {
    borderBase: "border-pink-400/20",
    borderHover: "hover:border-pink-400/40",
    shadowHover:
      "hover:shadow-[0_8px_40px_rgba(244,114,182,0.15),0_0_30px_rgba(244,114,182,0.1)]",
    selectedBorder: "border-pink-400/60",
    selectedShadow: "shadow-[0_0_50px_-10px_rgba(244,114,182,0.3)]",
    selectedBg: "bg-pink-50/90",
    bgHover: "hover:bg-pink-50/60",
    topLine: "via-pink-400",
    innerGlow: "from-pink-400/15",
    innerGlowUnselected: "from-pink-400/5",
  },
};

export const MOOD_STYLES: Record<
  string,
  { bg: string; text: string }
> = {
  "": { bg: "#D4D4D4", text: "#4A2F3C" },
  memory: { bg: "#C7CEEA", text: "#4A2F3C" },
  hope: { bg: "#B5EAD7", text: "#4A2F3C" },
  secret: { bg: "#E0BBE4", text: "#4A2F3C" },
  dream: { bg: "#FFD6A5", text: "#4A2F3C" },
  ordinary: { bg: "#D4D4D4", text: "#4A2F3C" },
  important: { bg: "#FF8FA3", text: "#FFFFFF" },
};

/**
 * formatRelativeShort - Compact relative timestamp ("2h", "3d", "2w").
 */
export function formatRelativeShort(iso: string): string {
  const ts = new Date(iso).getTime();
  if (isNaN(ts)) return "";
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return "baru saja";
  const min = Math.floor(diff / 60);
  if (min < 60) return `${min}m`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}j`;
  const days = Math.floor(hr / 24);
  if (days < 7) return `${days}h`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}mg`;
  return new Date(ts).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
}
