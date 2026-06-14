"use client";

import { Check } from "lucide-react";
import { usePhotoBoothStore } from "../photoBoothStore";
import type { LayoutId, PhotoLayout } from "../photoBooth.config";
import { MiniPreview } from "./MiniPreview";

interface LayoutCardProps {
  layout: PhotoLayout;
}

/**
 * LayoutCard - One layout choice in the gallery.
 * Shows a small SVG preview, the layout name, pose count, and a format tag.
 */
export function LayoutCard({ layout }: LayoutCardProps) {
  const selected = usePhotoBoothStore((s) => s.selectedLayoutId);
  const setSelectedLayout = usePhotoBoothStore((s) => s.setSelectedLayout);
  const active = selected === layout.id;

  return (
    <button
      onClick={() => setSelectedLayout(layout.id as LayoutId)}
      className={`group flex flex-col items-stretch overflow-hidden rounded-2xl border bg-white text-left transition-all ${
        active
          ? "border-[#E63946] ring-2 ring-[#E63946]/15 shadow-[0_8px_24px_rgba(230,57,70,0.12)]"
          : "border-black/10 hover:border-black/20 hover:shadow-[0_4px_16px_rgba(60,30,40,0.06)]"
      }`}
    >
      {/* Preview */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FAF8F5] p-4">
        <MiniPreview layoutId={layout.id as LayoutId} className="h-full w-full" />
        {active && (
          <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#E63946] text-white shadow-sm">
            <Check className="h-3.5 w-3.5" />
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="flex items-center justify-between gap-2 border-t border-black/[0.06] px-3.5 py-2.5">
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold text-[#3F2A35]">
            {layout.label}
          </p>
          <p className="text-[10px] text-[#8C7783]">
            {layout.requiredShots} Pose · {tagForLayout(layout)}
          </p>
        </div>
      </div>
    </button>
  );
}

function tagForLayout(l: PhotoLayout): string {
  switch (l.type) {
    case "single":
      return "Single";
    case "vertical-strip":
      return "Strip";
    case "grid":
      return "Grid";
    case "horizontal-strip":
      return "Wide";
    case "cinematic":
      return "Cinematic";
    case "ultra-wide-collage":
      return "Panorama";
    default:
      return l.type;
  }
}
