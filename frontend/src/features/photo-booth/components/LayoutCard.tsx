"use client";

import { Check } from "lucide-react";
import { usePhotoBoothStore } from "../photoBoothStore";
import type { LayoutId, PhotoLayout } from "../photoBooth.config";
import { tagForLayout } from "../photoBooth.config";
import { MiniPreview } from "./MiniPreview";

interface LayoutCardProps {
  layout: PhotoLayout;
}

/**
 * LayoutCard - One layout choice in the gallery.
 * Compact: 4:3 preview + name + poses/type tag.
 */
export function LayoutCard({ layout }: LayoutCardProps) {
  const selected = usePhotoBoothStore((s) => s.selectedLayoutId);
  const setSelectedLayout = usePhotoBoothStore((s) => s.setSelectedLayout);
  const active = selected === layout.id;

  return (
    <button
      onClick={() => setSelectedLayout(layout.id as LayoutId)}
      className={`group relative flex flex-col items-stretch overflow-hidden rounded-xl border bg-white text-left transition-all ${
        active
          ? "border-[#E63946]/50 ring-1 ring-[#E63946]/20"
          : "border-black/10 hover:border-black/20"
      }`}
    >
      {/* Preview */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FAF8F5] p-3">
        <MiniPreview layoutId={layout.id as LayoutId} className="h-full w-full" />
        {active && (
          <div className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#E63946] text-white shadow-sm">
            <Check className="h-3 w-3" />
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="border-t border-black/[0.06] px-2.5 py-2">
        <p className="truncate text-[12px] font-semibold text-[#3F2A35]">
          {layout.label}
        </p>
        <p className="text-[10px] text-[#8C7783]">
          {layout.requiredShots} Pose · {tagForLayout(layout)}
        </p>
      </div>
    </button>
  );
}
