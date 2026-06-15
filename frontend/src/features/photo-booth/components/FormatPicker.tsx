"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  usePhotoBoothStore,
  LAYOUT_LIST,
} from "../photoBoothStore";
import { PHOTO_RATIOS, type PhotoRatio, type RatioId, tagForLayout } from "../photoBooth.config";
import { getRecommendedRatioId } from "../photoBooth.utils";
import { StepIndicator } from "./StepIndicator";
import { StickyBottomBar } from "./shared/StickyBottomBar";
import { FormatPreview } from "./FormatPreview";
import { FormatCard } from "./editor/FormatCard";
import { AmbientHaze } from "./shared/AmbientHaze";
import { StarIcon } from "./shared/StarIcon";

const RATIO_LIST: PhotoRatio[] = Object.values(PHOTO_RATIOS);

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

  const selectedRatio = PHOTO_RATIOS[selected];

  return (
    <div className="relative mx-auto flex max-w-[1320px] flex-col overflow-hidden px-5 pb-32 pt-8 sm:px-7 lg:pt-10">
      <AmbientHaze color="bg-[#FFB8C0]/22" top="6rem" left="25%" translateX="-50%" />
      <AmbientHaze color="bg-[#E8D4F0]/18" top="50%" right="25%" translateX="50%" />
      <AmbientHaze color="bg-[#F5ECD7]/20" bottom="8rem" left="50%" translateX="-50%" size={240} />

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <StepIndicator step={2} />
        </motion.div>

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

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
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

            {layout && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6 inline-flex items-center gap-3 text-[11px]"
              >
                <div className="flex items-center gap-1.5">
                  <StarIcon />
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
      <div className="mb-3 flex items-center justify-center gap-2 text-[9.5px] font-semibold tracking-[0.22em] uppercase" style={{ color: "#9D7B3F" }}>
        <StarIcon size={6} />
        <span>Live preview</span>
        <StarIcon size={6} />
      </div>
      {children}
    </div>
  );
}
