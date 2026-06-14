"use client";

import { usePhotoBoothStore, LAYOUT_LIST } from "../photoBoothStore";
import { getRecommendedRatioId } from "../photoBooth.utils";
import { LayoutCard } from "./LayoutCard";
import { StepIndicator } from "./StepIndicator";
import { StickyBottomBar } from "./shared/StickyBottomBar";

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

      <StickyBottomBar
        onBack={handleBack}
        backLabel="Kembali"
        nextLabel="Lanjut Pilih Format"
        onNext={handleLanjut}
        nextDisabled={!selected}
        hint={
          selected
            ? "Layout dipilih. Lanjut ke format?"
            : "Pilih satu layout untuk lanjut."
        }
      />
    </div>
  );
}
