"use client";

import { ArrowLeft, ArrowRight, Smartphone, Monitor, Square, Tv, RectangleVertical } from "lucide-react";
import { usePhotoBoothStore, RATIO_LIST } from "../photoBoothStore";
import type { RatioId } from "../photoBooth.config";

const ICON: Record<RatioId, React.ComponentType<{ className?: string }>> = {
  square: Square,
  portrait: RectangleVertical,
  story: Smartphone,
  wide: Monitor,
  ultraWide: Tv,
};

/**
 * FormatPicker - 5 horizontal format chips. One step in the session flow.
 */
export function FormatPicker() {
  const setFlowMode = usePhotoBoothStore((s) => s.setFlowMode);
  const setSessionStep = usePhotoBoothStore((s) => s.setSessionStep);
  const selected = usePhotoBoothStore((s) => s.selectedRatioId);
  const setSelectedRatio = usePhotoBoothStore((s) => s.setSelectedRatio);
  const setStage = usePhotoBoothStore((s) => s.setStage);

  const handleBack = () => {
    setSessionStep("choose-layout");
  };

  const handleLanjut = () => {
    if (!selected) return;
    setSessionStep("camera");
    setStage("setup");
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
            Pilih format
          </h2>
          <p className="text-[11px] text-[#8C7783]">
            Ukuran frame hasil jepretan
          </p>
        </div>
        <div className="w-12" />
      </div>

      <div className="mx-auto max-w-2xl">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {RATIO_LIST.map((r) => {
            const Icon = ICON[r.id as RatioId] || Square;
            const active = selected === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setSelectedRatio(r.id as RatioId)}
                className={`flex flex-col items-center gap-1.5 rounded-xl border bg-white p-3.5 transition-all ${
                  active
                    ? "border-[#E63946] ring-2 ring-[#E63946]/15 shadow-[0_4px_14px_rgba(230,57,70,0.10)]"
                    : "border-black/10 hover:border-black/20 hover:shadow-sm"
                }`}
              >
                <Icon className="h-4 w-4 text-[#3F2A35]" />
                <span className="text-[13px] font-semibold text-[#3F2A35]">
                  {r.label}
                </span>
                <span className="text-[9px] text-[#8C7783]">{r.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={handleLanjut}
          disabled={!selected}
          className="inline-flex items-center gap-2 rounded-xl bg-[#E63946] px-7 py-3 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(230,57,70,0.22)] transition-colors hover:bg-[#D62828] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Lanjut ke Kamera
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
