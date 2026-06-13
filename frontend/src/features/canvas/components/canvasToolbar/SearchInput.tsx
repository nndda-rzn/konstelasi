"use client";

import { RefObject } from "react";
import { Search } from "lucide-react";

interface SearchInputProps {
  searchInputRef: RefObject<HTMLInputElement | null>;
  searchQuery: string;
  onChange: (value: string) => void;
  onFocus: () => void;
}

export function SearchInput({
  searchInputRef,
  searchQuery,
  onChange,
  onFocus,
}: SearchInputProps) {
  return (
    <div className="hidden md:flex items-center relative ml-1">
      <Search className="w-3.5 h-3.5 text-[#5A3E4C]/40 absolute left-3 z-10 pointer-events-none" />
      <input
        ref={searchInputRef}
        type="text"
        placeholder="Cari catatan..."
        value={searchQuery}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        aria-label="Cari catatan"
        className="w-56 bg-white/70 border border-[#FFB4A2]/20 rounded-full pl-8 pr-3 py-1.5 text-sm text-[#5A3E4C] placeholder-[#5A3E4C]/35 focus:outline-none focus:ring-2 focus:ring-[#FF8FA3]/30 focus:border-[#FF8FA3]/40 focus:bg-white transition-all hover:bg-white/90"
      />
      <kbd className="hidden lg:inline-block absolute right-2.5 px-1.5 py-0.5 text-[10px] font-mono text-[#5A3E4C]/40 bg-[#FFB4A2]/10 rounded">
        ⌘F
      </kbd>
    </div>
  );
}
