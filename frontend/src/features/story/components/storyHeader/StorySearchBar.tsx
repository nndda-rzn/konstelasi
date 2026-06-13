"use client";

import { Search } from "lucide-react";

interface StorySearchBarProps {
  query: string;
  onChange: (value: string) => void;
}

/**
 * StorySearchBar - Search input for filtering nodes in canvas.
 */
export function StorySearchBar({ query, onChange }: StorySearchBarProps) {
  return (
    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FFF5F0] dark:bg-[#1a1625]/60 border border-[#FFB4A2]/15 dark:border-[#E63946]/10 max-w-[200px]">
      <Search className="w-3.5 h-3.5 text-[#5A3E4C]/40 dark:text-[#e2d9f3]/40 shrink-0" />
      <input
        value={query}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Cari scene..."
        className="flex-1 bg-transparent text-xs text-[#4A2F3C] dark:text-[#e2d9f3] outline-none placeholder:text-[#5A3E4C]/30"
      />
    </div>
  );
}
