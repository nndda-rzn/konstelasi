"use client";

import { Heart } from "lucide-react";

interface ArcStateProps {
  loading: boolean;
  arc: any;
}

/**
 * ArcState - Loading spinner and empty-state placeholder for
 * the emotional arc panel.
 */
export function ArcState({ loading, arc }: ArcStateProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="w-5 h-5 border-2 border-[#FF6B8B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (!arc || arc.dataPoints.length === 0) {
    return (
      <div className="text-center py-10">
        <Heart className="w-8 h-8 text-[#5A3E4C]/20 dark:text-[#e2d9f3]/20 mx-auto mb-2" />
        <p className="text-xs text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">
          Tambahkan mood ke nodes untuk melihat emotional arc
        </p>
      </div>
    );
  }
  return null;
}
