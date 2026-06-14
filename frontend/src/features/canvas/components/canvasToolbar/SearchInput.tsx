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
      <Search className="w-3.5 h-3.5 text-[#9A8F95] absolute left-3 z-10 pointer-events-none" strokeWidth={1.6} />
      <input
        ref={searchInputRef}
        type="text"
        placeholder="Search notes..."
        value={searchQuery}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        aria-label="Search notes"
        className="w-56 bg-[#F7F1EA]/70 border border-[rgba(47,39,48,0.06)] rounded-full pl-8 pr-3 py-1.5 text-[13px] text-[#2F2730] placeholder-[#9A8F95] focus:outline-none focus:ring-1 focus:ring-[#C99A45]/40 focus:border-[#C99A45]/50 focus:bg-[#FFFCF8] transition-colors hover:bg-[#FFFCF8]"
      />
      <kbd className="hidden lg:inline-block absolute right-2.5 px-1.5 py-0.5 text-[10px] font-mono text-[#9A8F95] bg-[#F3ECE4] rounded border border-[rgba(47,39,48,0.06)]">
        ⌘F
      </kbd>
    </div>
  );
}
