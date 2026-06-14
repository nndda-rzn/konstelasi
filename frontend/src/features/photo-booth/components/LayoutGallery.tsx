"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { usePhotoBoothStore, LAYOUT_LIST } from "../photoBoothStore";
import { getRecommendedRatioId } from "../photoBooth.utils";
import { LayoutCard } from "./LayoutCard";
import { StepIndicator } from "./StepIndicator";

/**
 * LayoutGallery - Visual gallery of layout cards.
 * Step 1 of 3. Compact 4-col grid on desktop, 2 on mobile.
 * Sticky bottom CTA enables once a layout is picked.
 */
export function LayoutGallery() {
  const setFlowMode = usePhotoBoothStore((s) => s.setFlowMode);
  const setSessionStep = usePhotoBoothStore((s) => s.setSessionStep);
  const setSelectedRatio = usePhotoBoothStore((s) => s.setSelectedRatio);
  const selected = usePhotoBoothStore((s) => s.selectedLayoutId);

  const handleBack = () => {
    setFlowMode("welcome");
  };

  const handleLanjut = () => {
    if (!selected) return;
    // Auto-sync the format to the recommended ratio for the chosen layout.
    setSelectedRatio(getRecommendedRatioId(selected));
    setSessionStep("choose-format");
  };

  return (
    <div className="mx-auto flex max-w-[1320px] flex-col px-4 pb-28 pt-6 sm:px-6 lg:pt-8">
      <StepIndicator step={1} />

      <div className="mx-auto mt-2 max-w-2xl text-center">
        <h2 className="text-xl font-semibold tracking-tight text-[#3F2A35] sm:text-2xl">
          Pilih Layout
        </h2>
        <p className="mt-1 text-[13px] leading-relaxed text-[#6D5561]">
          Tentukan bentuk cetakan fotomu sebelum mulai.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4">
        {LAYOUT_LIST.map((layout) => (
          <LayoutCard key={layout.id} layout={layout} />
        ))}
      </div>

      {/* Sticky bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-black/[0.06] bg-white/85 backdrop-blur-md md:pl-[260px]">
        <div className="mx-auto flex max-w-[1320px] items-center gap-3 px-4 py-3 sm:px-6">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#6D5561] transition-colors hover:text-[#3F2A35]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali
          </button>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-[11px] text-[#8C7783] sm:inline">
              {selected
                ? "Layout dipilih. Lanjut ke format?"
                : "Pilih satu layout untuk lanjut."}
            </span>
            <button
              onClick={handleLanjut}
              disabled={!selected}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#E63946] px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_4px_14px_rgba(230,57,70,0.22)] transition-colors hover:bg-[#D62828] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Lanjut Pilih Format
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
