"use client";

import { useTags } from "@/context/TagContext";

interface ActiveFiltersProps {
  count: number;
  onClear: () => void;
}

/**
 * ActiveFilters - Banner showing active filter count + clear button.
 */
export function ActiveFilters({ count, onClear }: ActiveFiltersProps) {
  if (count === 0) return null;
  return (
    <div className="px-5 py-3 bg-[#FFF5F0]/50 border-b border-[#FFB4A2]/10">
      <p className="text-xs text-[#5A3E4C]/50">
        Filter aktif: {count} tag dipilih
      </p>
      <button
        onClick={onClear}
        className="text-xs text-[#FF8FA3] hover:underline mt-1"
      >
        Hapus semua filter
      </button>
    </div>
  );
}

/**
 * useTagFilter - Helper hook for tag filter state.
 */
export const useTagFilter = () => {
  const { selectedTagFilters, setSelectedTagFilters } = useTags();
  const toggle = (id: string) => {
    if (selectedTagFilters.includes(id)) {
      setSelectedTagFilters(selectedTagFilters.filter((f) => f !== id));
    } else {
      setSelectedTagFilters([...selectedTagFilters, id]);
    }
  };
  return { selectedTagFilters, toggle };
};
