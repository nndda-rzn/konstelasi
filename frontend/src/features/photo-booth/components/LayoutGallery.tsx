"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { usePhotoBoothStore, LAYOUT_LIST, PHOTO_LAYOUTS } from "../photoBoothStore";
import { getRecommendedRatioId } from "../photoBooth.utils";
import type { PhotoLayout } from "../photoBooth.config";
import { LayoutCard } from "./LayoutCard";
import { StepIndicator } from "./StepIndicator";
import { StickyBottomBar } from "./shared/StickyBottomBar";

/**
 * LayoutGallery - Constella's curated print catalog.
 * 3 groups: Classic / Themed / Wide & Cinematic
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

  const { classic, themed, wide } = useMemo(() => {
    const classic: PhotoLayout[] = [];
    const themed: PhotoLayout[] = [];
    const wide: PhotoLayout[] = [];

    LAYOUT_LIST.forEach((l) => {
      if (["classicStrip", "vintageStrip", "withLove", "hearts"].includes(l.id)) {
        themed.push(l);
      } else if (["ultraWide", "wide2", "cinematic3"].includes(l.id)) {
        wide.push(l);
      } else {
        classic.push(l);
      }
    });

    return { classic, themed, wide };
  }, []);

  const selectedLayout = selected ? PHOTO_LAYOUTS[selected] : null;

  return (
    <div className="relative mx-auto flex max-w-[1320px] flex-col overflow-hidden px-5 pb-32 pt-8 sm:px-7 lg:pt-10">
      {/* Constella ambient haze */}
      <div className="pointer-events-none absolute top-20 left-1/4 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-[#FFB8C0]/22 blur-[100px]" />
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
          <StepIndicator step={1} />
        </motion.div>

        {/* Page title block */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-8 max-w-2xl text-center"
        >
          {/* Eyebrow with thin lines */}
          <div className="mb-3 inline-flex items-center gap-2 text-[9.5px] font-medium tracking-[0.32em] text-[#9D7B8A] uppercase">
            <span
              className="h-px w-4"
              style={{ background: "linear-gradient(90deg, transparent, #D4A574)" }}
            />
            <span>Koleksi cetakan</span>
            <span
              className="h-px w-4"
              style={{ background: "linear-gradient(90deg, #D4A574, transparent)" }}
            />
          </div>
          <h2 className="text-[26px] font-light tracking-tight text-[#3F2A35] sm:text-[30px]">
            Pilih <span className="italic font-normal" style={{ color: "#9D7B3F" }}>bentuk</span> ceritamu
          </h2>
          <p className="mx-auto mt-3 max-w-md text-[12.5px] leading-relaxed text-[#6D5561] sm:text-[13px]">
            Setiap cetakan punya karakter. Pilih yang paling cocok
            untuk fragmen kenangan yang ingin kamu simpan.
          </p>
        </motion.div>

        {/* Curated groups */}
        <div className="mt-10 space-y-9">
          <Group
            title="Classic"
            subtitle="Bentuk dasar yang tak lekang waktu"
            count={classic.length}
          >
            <Grid items={classic} />
          </Group>

          <Group
            title="Themed"
            subtitle="Cetakan dengan sentuhan karakter"
            count={themed.length}
            category="themed"
          >
            <Grid items={themed} category="themed" />
          </Group>

          <Group
            title="Wide & Cinematic"
            subtitle="Lebih lebar, lebih sinematik"
            count={wide.length}
          >
            <Grid items={wide} />
          </Group>
        </div>
      </div>

      <StickyBottomBar
        onBack={handleBack}
        backLabel="Kembali"
        nextLabel="Lanjut ke format"
        onNext={handleLanjut}
        nextDisabled={!selected}
        hint={
          selected
            ? "Pilihan siap. Lanjut?"
            : "Pilih satu cetakan untuk lanjut"
        }
        summary={
          selectedLayout && (
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
                {selectedLayout.label}
              </span>
              <span className="text-[10px] text-[#8C7783]">
                · {selectedLayout.requiredShots} pose
              </span>
            </div>
          )
        }
      />
    </div>
  );
}

function Group({
  title,
  subtitle,
  count,
  category,
  children,
}: {
  title: string;
  subtitle: string;
  count: number;
  category?: "themed";
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className="mb-4 flex items-end justify-between gap-4 border-b pb-3"
        style={{ borderColor: "rgba(212, 165, 116, 0.18)" }}
      >
        <div>
          <h3 className="flex items-center gap-2 text-[14.5px] font-semibold tracking-tight text-[#3F2A35]">
            {title}
            {category === "themed" && (
              <span
                className="inline-flex items-center gap-1 text-[9.5px] font-normal tracking-[0.2em] uppercase"
                style={{ color: "#9D7B3F" }}
              >
                <svg width="6" height="6" viewBox="0 0 10 10" fill="none" aria-hidden>
                  <path
                    d="M5 0L5.7 4.3L10 5L5.7 5.7L5 10L4.3 5.7L0 5L4.3 4.3L5 0Z"
                    fill="#D4A574"
                  />
                </svg>
                Edisi kecil
              </span>
            )}
          </h3>
          <p className="mt-0.5 text-[11.5px] text-[#8C7783]">{subtitle}</p>
        </div>
        <span
          className="text-[10px] font-medium tracking-[0.18em] uppercase"
          style={{ color: "#9D7B8A" }}
        >
          {String(count).padStart(2, "0")}
        </span>
      </div>
      {children}
    </motion.section>
  );
}

function Grid({
  items,
  category,
}: {
  items: PhotoLayout[];
  category?: "themed";
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
      {items.map((layout) => (
        <LayoutCard key={layout.id} layout={layout} category={category} />
      ))}
    </div>
  );
}
