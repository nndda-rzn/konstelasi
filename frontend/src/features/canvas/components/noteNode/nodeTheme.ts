"use client";

/**
 * NoteNode theme system - color tokens for the 8 supported note colors.
 * Updated to use muted rose/gold selection and warm editorial palette.
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
    borderBase: "border-[rgba(47,39,48,0.10)]",
    borderHover: "hover:border-[#B84A5A]/30",
    shadowHover: "hover:shadow-[0_8px_36px_rgba(47,39,48,0.08)]",
    selectedBorder: "border-[#B84A5A]/50",
    selectedShadow: "shadow-[0_0_50px_-10px_rgba(184,74,90,0.18)]",
    selectedBg: "bg-[#FFFCF8]",
    bgHover: "hover:bg-[#FFFCF8]/90",
    topLine: "via-[#C99A45]",
    innerGlow: "from-[#C99A45]/8",
    innerGlowUnselected: "from-[#C99A45]/3",
  },
  red: {
    borderBase: "border-[#E63946]/20",
    borderHover: "hover:border-[#E63946]/40",
    shadowHover: "hover:shadow-[0_8px_36px_rgba(230,57,70,0.12)]",
    selectedBorder: "border-[#B84A5A]/60",
    selectedShadow: "shadow-[0_0_50px_-10px_rgba(184,74,90,0.22)]",
    selectedBg: "bg-[#FBEFEC]/90",
    bgHover: "hover:bg-[#FBEFEC]/60",
    topLine: "via-[#B84A5A]",
    innerGlow: "from-[#B84A5A]/10",
    innerGlowUnselected: "from-[#B84A5A]/3",
  },
  amber: {
    borderBase: "border-[#C99A45]/20",
    borderHover: "hover:border-[#C99A45]/40",
    shadowHover: "hover:shadow-[0_8px_36px_rgba(201,154,69,0.12)]",
    selectedBorder: "border-[#C99A45]/60",
    selectedShadow: "shadow-[0_0_50px_-10px_rgba(201,154,69,0.22)]",
    selectedBg: "bg-[#FAF3E0]/90",
    bgHover: "hover:bg-[#FAF3E0]/60",
    topLine: "via-[#C99A45]",
    innerGlow: "from-[#C99A45]/12",
    innerGlowUnselected: "from-[#C99A45]/3",
  },
  emerald: {
    borderBase: "border-[#34D399]/20",
    borderHover: "hover:border-[#34D399]/40",
    shadowHover: "hover:shadow-[0_8px_36px_rgba(52,211,153,0.12)]",
    selectedBorder: "border-[#34D399]/50",
    selectedShadow: "shadow-[0_0_50px_-10px_rgba(52,211,153,0.2)]",
    selectedBg: "bg-[#ECFDF5]/90",
    bgHover: "hover:bg-[#ECFDF5]/60",
    topLine: "via-[#34D399]",
    innerGlow: "from-[#34D399]/10",
    innerGlowUnselected: "from-[#34D399]/3",
  },
  blue: {
    borderBase: "border-[#60A5FA]/20",
    borderHover: "hover:border-[#60A5FA]/40",
    shadowHover: "hover:shadow-[0_8px_36px_rgba(96,165,250,0.12)]",
    selectedBorder: "border-[#60A5FA]/50",
    selectedShadow: "shadow-[0_0_50px_-10px_rgba(96,165,250,0.2)]",
    selectedBg: "bg-[#EFF6FF]/90",
    bgHover: "hover:bg-[#EFF6FF]/60",
    topLine: "via-[#60A5FA]",
    innerGlow: "from-[#60A5FA]/10",
    innerGlowUnselected: "from-[#60A5FA]/3",
  },
  indigo: {
    borderBase: "border-[#818CF8]/20",
    borderHover: "hover:border-[#818CF8]/40",
    shadowHover: "hover:shadow-[0_8px_36px_rgba(129,140,248,0.12)]",
    selectedBorder: "border-[#818CF8]/50",
    selectedShadow: "shadow-[0_0_50px_-10px_rgba(129,140,248,0.2)]",
    selectedBg: "bg-[#EEF2FF]/90",
    bgHover: "hover:bg-[#EEF2FF]/60",
    topLine: "via-[#818CF8]",
    innerGlow: "from-[#818CF8]/10",
    innerGlowUnselected: "from-[#818CF8]/3",
  },
  purple: {
    borderBase: "border-[#C084FC]/20",
    borderHover: "hover:border-[#C084FC]/40",
    shadowHover: "hover:shadow-[0_8px_36px_rgba(192,132,252,0.12)]",
    selectedBorder: "border-[#C084FC]/50",
    selectedShadow: "shadow-[0_0_50px_-10px_rgba(192,132,252,0.2)]",
    selectedBg: "bg-[#FAF5FF]/90",
    bgHover: "hover:bg-[#FAF5FF]/60",
    topLine: "via-[#C084FC]",
    innerGlow: "from-[#C084FC]/10",
    innerGlowUnselected: "from-[#C084FC]/3",
  },
  pink: {
    borderBase: "border-[#B84A5A]/20",
    borderHover: "hover:border-[#B84A5A]/40",
    shadowHover: "hover:shadow-[0_8px_36px_rgba(184,74,90,0.12)]",
    selectedBorder: "border-[#B84A5A]/50",
    selectedShadow: "shadow-[0_0_50px_-10px_rgba(184,74,90,0.2)]",
    selectedBg: "bg-[#FBEFEC]/90",
    bgHover: "hover:bg-[#FBEFEC]/60",
    topLine: "via-[#B84A5A]",
    innerGlow: "from-[#B84A5A]/10",
    innerGlowUnselected: "from-[#B84A5A]/3",
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
 * formatRelativeShort - Compact relative timestamp in English.
 * e.g. "2h" = 2 hours, "3d" = 3 days, "2w" = 2 weeks.
 */
export function formatRelativeShort(iso: string): string {
  const ts = new Date(iso).getTime();
  if (isNaN(ts)) return "";
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return "now";
  const min = Math.floor(diff / 60);
  if (min < 60) return `${min}m`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h`;
  const days = Math.floor(hr / 24);
  if (days < 7) return `${days}d`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w`;
  return new Date(ts).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
}
