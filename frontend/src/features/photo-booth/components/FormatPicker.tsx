"use client";

import { Sparkles, Smartphone, Monitor, Square, Tv, RectangleVertical } from "lucide-react";
import { usePhotoBoothStore, RATIO_LIST, LAYOUT_LIST } from "../photoBoothStore";
import { getRecommendedRatioId } from "../photoBooth.utils";
import type { RatioId } from "../photoBooth.config";
import { tagForLayout } from "../photoBooth.config";
import { StepIndicator } from "./StepIndicator";
import { StickyBottomBar } from "./shared/StickyBottomBar";

const ICON: Record<RatioId, React.ComponentType<{ className?: string }>> = {
  square: Square,
  portrait: RectangleVertical,
  story: Smartphone,
  wide: Monitor,
  ultraWide: Tv,
};

const DESCRIPTIONS: Record<RatioId, string> = {
  square: "Klasik dan seimbang",
  portrait: "Cocok untuk portrait",
  story: "Format story vertikal",
  wide: "Lebar dan cinematic",
  ultraWide: "Ultra wide panorama",
};

/**
 * FormatPicker - Step 2 of 3.
 * Shows summary of selected layout, 5 format cards, recommended
 * badge on the suggested format, and sticky bottom CTA.
 */
export function FormatPicker() {
  const setSessionStep = usePhotoBoothStore((s) => s.setSessionStep);
  const setSelectedRatio = usePhotoBoothStore((s) => s.setSelectedRatio);
  const selected = usePhotoBoothStore((s) => s.selectedRatioId);
  const selectedLayoutId = usePhotoBoothStore((s) => s.selectedLayoutId);
  const setStage = usePhotoBoothStore((s) => s.setStage);

  const layout = LAYOUT_LIST.find((l) => l.id === selectedLayoutId);
  const recommended = selectedLayoutId
    ? getRecommendedRatioId(selectedLayoutId)
    : "square";

  const handleBack = () => {
    setSessionStep("choose-layout");
  };

  const handleLanjut = () => {
    if (!selected) return;
    setSessionStep("camera");
    setStage("setup");
  };

  const selectedRatio = RATIO_LIST.find((r) => r.id === selected);

  return (
    <div className="mx-auto flex max-w-[1320px] flex-col px-4 pb-28 pt-6 sm:px-6 lg:pt-8">
      <StepIndicator step={2} />

      {/* Summary of selected layout */}
      {layout && (
        <div className="mx-auto mt-4 max-w-2xl rounded-xl border border-black/[0.06] bg-white/70 p-4 sm:p-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#8C7783]">
            Layout dipilih
          </p>
          <div className="mt-1 flex items-center justify-between gap-3">
            <div>
              <p className="text-base font-semibold text-[#3F2A35]">
                {layout.label}
              </p>
              <p className="text-[11px] text-[#8C7783]">
                {layout.requiredShots} Pose · {tagForLayout(layout)}
              </p>
            </div>
            {selectedRatio && (
              <div className="text-right">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#8C7783]">
                  Format
                </p>
                <p className="text-base font-semibold text-[#3F2A35]">
                  {selectedRatio.label}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mx-auto mt-6 max-w-3xl text-center">
        <h2 className="text-xl font-semibold tracking-tight text-[#3F2A35] sm:text-2xl">
          Pilih Format
        </h2>
        <p className="mt-1 text-[13px] leading-relaxed text-[#6D5561]">
          Ukuran frame hasil jepretan. Disarankan:{" "}
          <span className="font-semibold text-[#3F2A35]">
            {RATIO_LIST.find((r) => r.id === recommended)?.label}
          </span>
          {layout && (
            <>
              {" "}
              untuk layout{" "}
              <span className="font-semibold text-[#3F2A35]">{layout.label}</span>
            </>
          )}
          .
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
        {RATIO_LIST.map((r) => {
          const Icon = ICON[r.id as RatioId] || Square;
          const active = selected === r.id;
          const isRecommended = r.id === recommended;
          return (
            <button
              key={r.id}
              onClick={() => setSelectedRatio(r.id as RatioId)}
              className={`relative flex flex-col items-center gap-1 rounded-xl border bg-white p-3 transition-all ${
                active
                  ? "border-[#E63946]/50 bg-[#E63946]/[0.04] ring-1 ring-[#E63946]/20"
                  : "border-black/10 hover:border-black/20"
              }`}
            >
              {isRecommended && (
                <span className="absolute top-1.5 right-1.5 inline-flex items-center gap-0.5 rounded-full bg-[#E63946]/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-[#E63946]">
                  <Sparkles className="h-2.5 w-2.5" />
                  Rec
                </span>
              )}
              <Icon className="h-4 w-4 text-[#3F2A35]" />
              <span className="text-[12px] font-semibold text-[#3F2A35]">
                {r.label}
              </span>
              <span className="text-[9px] leading-tight text-[#8C7783] text-center">
                {r.name}
                <br />
                {DESCRIPTIONS[r.id as RatioId]}
              </span>
            </button>
          );
        })}
      </div>

      <StickyBottomBar
        onBack={handleBack}
        backLabel="Pilih Ulang Layout"
        nextLabel="Lanjut ke Kamera"
        onNext={handleLanjut}
        nextDisabled={!selected}
        hint={selected ? "Siap. Lanjut?" : "Pilih format dulu."}
      />
    </div>
  );
}
