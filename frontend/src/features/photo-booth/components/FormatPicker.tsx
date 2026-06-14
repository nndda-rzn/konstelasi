"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { usePhotoBoothStore, LAYOUT_LIST, PHOTO_LAYOUTS } from "../photoBoothStore";
import { getRecommendedRatioId } from "../photoBooth.utils";
import type { PhotoRatio, RatioId } from "../photoBooth.config";
import { tagForLayout } from "../photoBooth.config";
import { StepIndicator } from "./StepIndicator";
import { StickyBottomBar } from "./shared/StickyBottomBar";
import { FormatPreview } from "./FormatPreview";

/**
 * FormatPicker - Step 2 of 3.
 * A studio step where user previews how their layout will look
 * in the chosen aspect ratio, then refines the format.
 */
export function FormatPicker() {
  const setSessionStep = usePhotoBoothStore((s) => s.setSessionStep);
  const setSelectedRatio = usePhotoBoothStore((s) => s.setSelectedRatio);
  const selected = usePhotoBoothStore((s) => s.selectedRatioId);
  const selectedLayoutId = usePhotoBoothStore((s) => s.selectedLayoutId);
  const setStage = usePhotoBoothStore((s) => s.setStage);

  const layout = useMemo(
    () => LAYOUT_LIST.find((l) => l.id === selectedLayoutId),
    [selectedLayoutId]
  );
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

  const selectedRatio = RATIO_LIST_MAP[selected];

  return (
    <div className="relative mx-auto flex max-w-[1320px] flex-col overflow-hidden px-5 pb-32 pt-8 sm:px-7 lg:pt-10">
      {/* Constella ambient haze */}
      <div className="pointer-events-none absolute top-24 left-1/4 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-[#FFB8C0]/22 blur-[100px]" />
      <div className="pointer-events-none absolute top-1/2 right-1/4 h-[280px] w-[280px] translate-x-1/2 rounded-full bg-[#E8D4F0]/18 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-32 left-1/2 h-[240px] w-[240px] -translate-x-1/2 rounded-full bg-[#F5ECD7]/20 blur-[100px]" />

      <div className="relative z-10">
        {/* Step indicator */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <StepIndicator step={2} />
        </motion.div>

        {/* Page title block */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-8 max-w-2xl text-center"
        >
          <div className="mb-3 inline-flex items-center gap-2 text-[9.5px] font-medium tracking-[0.32em] text-[#9D7B8A] uppercase">
            <span
              className="h-px w-4"
              style={{ background: "linear-gradient(90deg, transparent, #D4A574)" }}
            />
            <span>Format cetakan</span>
            <span
              className="h-px w-4"
              style={{ background: "linear-gradient(90deg, #D4A574, transparent)" }}
            />
          </div>
          <h2 className="text-[26px] font-light tracking-tight text-[#3F2A35] sm:text-[30px]">
            Pilih <span className="italic font-normal" style={{ color: "#9D7B3F" }}>bingkai</span> ceritamu
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[12.5px] leading-relaxed text-[#6D5561] sm:text-[13px]">
            Bingkai menentukan bentuk akhir kenanganmu. Lihat preview di
            samping sebelum memilih.
          </p>
        </motion.div>

        {/* Two-column: preview + format options */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
          {/* Left: Live preview */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <PreviewFrame>
              {selectedLayoutId && selectedRatio ? (
                <FormatPreview
                  layoutId={selectedLayoutId}
                  ratio={selectedRatio.aspectRatio}
                  ratioLabel={selectedRatio.label}
                  ratioName={selectedRatio.name}
                />
              ) : (
                <div className="flex h-48 items-center justify-center text-[12px] text-[#8C7783]">
                  Pilih layout & format untuk melihat preview
                </div>
              )}
            </PreviewFrame>

            {/* Layout summary (integrated) */}
            {layout && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6 inline-flex items-center gap-3 text-[11px]"
              >
                <div className="flex items-center gap-1.5">
                  <svg width="7" height="7" viewBox="0 0 10 10" fill="none" aria-hidden>
                    <path
                      d="M5 0L5.7 4.3L10 5L5.7 5.7L5 10L4.3 5.7L0 5L4.3 4.3L5 0Z"
                      fill="#D4A574"
                    />
                  </svg>
                  <span className="text-[9.5px] font-semibold tracking-[0.22em] uppercase" style={{ color: "#9D7B3F" }}>
                    Layout
                  </span>
                  <span className="font-medium text-[#3F2A35]">{layout.label}</span>
                </div>
                <span
                  className="h-3 w-px"
                  style={{ background: "rgba(212, 165, 116, 0.3)" }}
                />
                <span className="italic text-[#9D7B8A]">
                  {layout.requiredShots} pose · {tagForLayout(layout)}
                </span>
              </motion.div>
            )}
          </motion.div>

          {/* Right: Format options */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="mb-4 flex items-end justify-between border-b pb-3" style={{ borderColor: "rgba(212, 165, 116, 0.18)" }}>
              <div>
                <h3 className="text-[14.5px] font-semibold tracking-tight text-[#3F2A35]">
                  Ukuran bingkai
                </h3>
                <p className="mt-0.5 text-[11.5px] text-[#8C7783]">
                  Pilih rasio yang paling cocok untuk layout ini
                </p>
              </div>
              <span
                className="text-[10px] font-medium tracking-[0.18em] uppercase"
                style={{ color: "#9D7B8A" }}
              >
                05
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2 sm:gap-3">
              {RATIO_LIST.map((r) => (
                <FormatCard
                  key={r.id}
                  ratio={r}
                  active={selected === r.id}
                  isRecommended={r.id === recommended}
                  onSelect={() => setSelectedRatio(r.id as RatioId)}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <StickyBottomBar
        onBack={handleBack}
        backLabel="Pilih ulang layout"
        nextLabel="Lanjut ke kamera"
        onNext={handleLanjut}
        nextDisabled={!selected}
        hint={
          selected && selectedRatio
            ? `${selectedRatio.name} ${selectedRatio.label} siap digunakan`
            : "Pilih satu bingkai untuk lanjut"
        }
        summary={
          selectedRatio && (
            <div className="flex items-center gap-2">
              <span
                className="text-[9.5px] font-semibold tracking-[0.22em] uppercase"
                style={{ color: "#9D7B3F" }}
              >
                Dipilih
              </span>
              <span
                className="h-2 w-px"
                style={{ background: "rgba(212, 165, 116, 0.3)" }}
              />
              <span className="text-[12px] font-medium tracking-tight text-[#3F2A35]">
                {selectedRatio.name}
              </span>
              <span className="text-[10px] text-[#8C7783]">
                {selectedRatio.label}
              </span>
            </div>
          )
        }
      />
    </div>
  );
}

function PreviewFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full">
      {/* Section label above preview */}
      <div className="mb-3 flex items-center justify-center gap-2 text-[9.5px] font-semibold tracking-[0.22em] uppercase" style={{ color: "#9D7B3F" }}>
        <svg width="6" height="6" viewBox="0 0 10 10" fill="none" aria-hidden>
          <path
            d="M5 0L5.7 4.3L10 5L5.7 5.7L5 10L4.3 5.7L0 5L4.3 4.3L5 0Z"
            fill="#D4A574"
          />
        </svg>
        <span>Live preview</span>
        <svg width="6" height="6" viewBox="0 0 10 10" fill="none" aria-hidden>
          <path
            d="M5 0L5.7 4.3L10 5L5.7 5.7L5 10L4.3 5.7L0 5L4.3 4.3L5 0Z"
            fill="#D4A574"
          />
        </svg>
      </div>
      {children}
    </div>
  );
}

function FormatCard({
  ratio,
  active,
  isRecommended,
  onSelect,
}: {
  ratio: PhotoRatio;
  active: boolean;
  isRecommended: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ y: -1 }}
      whileTap={{ y: 0, scale: 0.99 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className={`group relative flex flex-col items-stretch overflow-hidden rounded-xl p-3 text-left transition-all ${
        active ? "bg-white" : "bg-white/60 hover:bg-white"
      }`}
      style={{
        boxShadow: active
          ? "0 1px 2px rgba(60, 30, 40, 0.05), 0 6px 16px rgba(60, 30, 40, 0.07), 0 0 0 1.5px rgba(212, 165, 116, 0.5), 0 0 20px -4px rgba(212, 165, 116, 0.25)"
          : "0 1px 2px rgba(60, 30, 40, 0.03), 0 2px 5px rgba(60, 30, 40, 0.04)",
        border: "1px solid rgba(225, 210, 195, 0.5)",
      }}
    >
      {/* Recommended badge */}
      {isRecommended && (
        <div
          className="absolute right-1.5 top-1.5 z-10 flex items-center gap-0.5 rounded-full px-1.5 py-0.5"
          style={{
            background: "rgba(212, 165, 116, 0.15)",
            border: "1px solid rgba(212, 165, 116, 0.3)",
          }}
        >
          <svg width="5" height="5" viewBox="0 0 10 10" fill="none" aria-hidden>
            <path
              d="M5 0L5.7 4.3L10 5L5.7 5.7L5 10L4.3 5.7L0 5L4.3 4.3L5 0Z"
              fill="#9D7B3F"
            />
          </svg>
          <span
            className="text-[7.5px] font-semibold tracking-[0.15em] uppercase"
            style={{ color: "#9D7B3F" }}
          >
            Rec
          </span>
        </div>
      )}

      {/* Selected check */}
      {active && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 380, damping: 20 }}
          className="absolute right-1.5 top-1.5 z-20 flex h-4 w-4 items-center justify-center rounded-full"
          style={{
            background: "linear-gradient(135deg, #D4A574 0%, #B8895A 100%)",
            boxShadow: "0 2px 5px rgba(184, 137, 90, 0.4)",
          }}
        >
          <svg width="8" height="8" viewBox="0 0 10 10" fill="none" aria-hidden>
            <path
              d="M2 5.5L4 7.5L8 3"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      )}

      {/* Ratio shape (mini mockup) */}
      <div className="mb-2.5 flex h-12 items-center justify-center">
        <div
          className="rounded-[2px]"
          style={{
            aspectRatio: `${ratio.aspectRatio}`,
            width: ratio.aspectRatio >= 1.5 ? 56 : ratio.aspectRatio >= 1 ? 44 : 28,
            background: active
              ? "linear-gradient(135deg, #FFE0E8 0%, #F0E2C5 100%)"
              : "linear-gradient(135deg, #FAF5EE 0%, #F0E8DD 100%)",
            boxShadow:
              "inset 0 0 0 1px rgba(255, 255, 255, 0.6), 0 1px 2px rgba(60, 30, 40, 0.05)",
          }}
        />
      </div>

      {/* Label */}
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-[14px] font-semibold tracking-tight text-[#3F2A35]">
            {ratio.label}
          </p>
          <p className="mt-0.5 text-[10.5px] italic text-[#9D7B8A]">
            {ratio.name}
          </p>
        </div>
      </div>
    </motion.button>
  );
}

// Local helper - ratios by id (re-imported here to keep it explicit)
import { PHOTO_RATIOS } from "../photoBooth.config";
const RATIO_LIST_MAP: Record<RatioId, PhotoRatio> = PHOTO_RATIOS;
const RATIO_LIST = Object.values(PHOTO_RATIOS);

// Unused but kept for future use
void PHOTO_LAYOUTS;
