"use client";

import { Filter } from "lucide-react";
import type { GalleryFilter } from "../hooks/useGallery";
import { FilterBar } from "./FilterBar";

interface GalleryHeaderProps {
  count: number;
  showFilters: boolean;
  onToggleFilters: () => void;
  filter: GalleryFilter;
  setFilter: (f: GalleryFilter) => void;
}

export function GalleryHeader({
  count,
  showFilters,
  onToggleFilters,
  filter,
  setFilter,
}: GalleryHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-[#E6B8A2]/15 bg-white/72 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-lg font-bold text-[#3F2A35]">Gallery</h1>
            <p className="text-xs text-[#5A3E4C]/50">{count} media</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleFilters}
            className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
              showFilters
                ? "border-[#9D0208]/30 bg-[#9D0208]/8 text-[#9D0208]"
                : "border-[#E6B8A2]/30 bg-white/60 text-[#5A3E4C]/60 hover:border-[#E6B8A2]/50"
            }`}
          >
            <Filter className="h-3.5 w-3.5" />
            Filter
          </button>
        </div>
      </div>

      {showFilters && <FilterBar filter={filter} setFilter={setFilter} />}
    </header>
  );
}
