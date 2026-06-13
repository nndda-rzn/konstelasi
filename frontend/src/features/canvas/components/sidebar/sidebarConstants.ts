"use client";

/**
 * Sidebar configuration constants.
 */

export const MOOD_OPTIONS = [
  { id: "", label: "None", color: "transparent" },
  { id: "memory", label: "Memory", color: "#C7CEEA" },
  { id: "hope", label: "Hope", color: "#B5EAD7" },
  { id: "secret", label: "Secret", color: "#E0BBE4" },
  { id: "dream", label: "Dream", color: "#FFD6A5" },
  { id: "ordinary", label: "Ordinary", color: "#D4D4D4" },
  { id: "important", label: "Important", color: "#FF8FA3" },
];

export const COLOR_OPTIONS = [
  { id: "default", bg: "bg-white", border: "border-[#FFB4A2]/50" },
  { id: "red", bg: "bg-pink-100", border: "border-pink-400/50" },
  { id: "amber", bg: "bg-amber-100", border: "border-amber-400/50" },
  { id: "emerald", bg: "bg-emerald-100", border: "border-emerald-400/50" },
  { id: "blue", bg: "bg-blue-100", border: "border-blue-400/50" },
  { id: "indigo", bg: "bg-indigo-100", border: "border-indigo-400/50" },
  { id: "purple", bg: "bg-purple-100", border: "border-purple-400/50" },
  { id: "pink", bg: "bg-pink-200", border: "border-pink-400/50" },
];

export const NOTE_TYPES = [
  { value: "text", label: "Catatan" },
  { value: "quote", label: "Kutipan" },
];

export const AUTO_SAVE_DELAY = 800;
