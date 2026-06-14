"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { usePhotoBoothStore, LAYOUT_LIST } from "../photoBoothStore";
import { LayoutCard } from "./LayoutCard";

/**
 * LayoutGallery - Visual gallery of layout cards.
 * 3 cols on lg+, 2 cols on sm. Includes back button and lanjut button.
 */
export function LayoutGallery() {
  const setFlowMode = usePhotoBoothStore((s) => s.setFlowMode);
  const setSessionStep = usePhotoBoothStore((s) => s.setSessionStep);
  const selected = usePhotoBoothStore((s) => s.selectedLayoutId);

  const handleBack = () => {
    setFlowMode("welcome");
  };

  const handleLanjut = () => {
    if (!selected) return;
    setSessionStep("choose-format");
  };

  return (
    <div className="mx-auto max-w-[1320px] px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#6D5561] transition-colors hover:text-[#3F2A35]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Kembali
        </button>
        <div className="text-center">
          <h2 className="text-lg font-semibold text-[#3F2A35] sm:text-xl">
            Pilih layout
          </h2>
          <p className="text-[11px] text-[#8C7783]">
            Tampilan koleksi fotomu saat dicetak
          </p>
        </div>
        <div className="w-12" />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {LAYOUT_LIST.map((layout) => (
          <LayoutCard key={layout.id} layout={layout} />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={handleLanjut}
          disabled={!selected}
          className="inline-flex items-center gap-2 rounded-xl bg-[#E63946] px-7 py-3 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(230,57,70,0.22)] transition-colors hover:bg-[#D62828] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Lanjut ke Format
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
