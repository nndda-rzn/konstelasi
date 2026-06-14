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
 * LayoutGallery - A curated gallery of photo booth print styles.
 * Step 1 of 3. Grouped into Classic / Themed / Wide collections
 * to feel like an editorial print catalog, not a form wizard.
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

  // Curated groups
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
      {/* Soft ambient orbs - Constella mood */}
      <div className="pointer-events-none absolute top-20 left-1/4 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-[#FFB8C0]/20 blur-[100px]" />
      <div className="pointer-events-none absolute top-1/3 right-1/4 h-[260px] w-[260px] translate-x-1/2 rounded-full bg-[#E8D4F0]/18 blur-[100px]" />

      <div className="relative z-10">
        {/* Step indicator */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
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
          {/* Tiny eyebrow */}
          <div className="mb-3 inline-flex items-center gap-1.5 text-[9.5px] font-semibold tracking-[0.32em] text-[#9D7B8A] uppercase">
            <span className="h-px w-3" style={{ background: "#D4A574" }} />
            Koleksi cetakan
            <span className="h-px w-3" style={{ background: "#D4A574" }} />
          </div>
          <h2 className="text-2xl font-light tracking-tight text-[#3F2A35] sm:text-3xl">
            Pilih <span className="italic font-normal" style={{ color: "#9D7B3F" }}>bentuk</span> ceritamu
          </h2>
          <p className="mx-auto mt-2.5 max-w-md text-[13px] leading-relaxed text-[#6D5561] sm:text-[13.5px]">
            Setiap cetakan punya karakter. Pilih yang paling cocok untuk
            fragmen kenangan yang ingin kamu simpan.
          </p>
        </motion.div>

        {/* Curated groups */}
        <div className="mt-10 space-y-10">
          <Group title="Classic" subtitle="Bentuk dasar yang tak lekang waktu">
            <Grid items={classic} />
          </Group>

          <Group title="Themed" subtitle="Cetakan dengan sentuhan karakter" category="themed">
            <Grid items={themed} category="themed" />
          </Group>

          <Group title="Wide & Cinematic" subtitle="Lebih lebar, lebih sinematik">
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
                className="text-[10px] font-semibold tracking-[0.22em] uppercase"
                style={{ color: "#9D7B3F" }}
              >
                Dipilih
              </span>
              <span className="text-[12px] font-medium text-[#3F2A35]">
                {selectedLayout.label}
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
  category,
  children,
}: {
  title: string;
  subtitle: string;
  category?: "themed";
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-4 flex items-end justify-between gap-4 border-b pb-3" style={{ borderColor: "rgba(212, 165, 116, 0.18)" }}>
        <div>
          <h3 className="text-[14px] font-semibold tracking-tight text-[#3F2A35]">
            {title}
            {category === "themed" && (
              <span
                className="ml-2 inline-flex items-center gap-1 text-[9.5px] font-medium tracking-[0.2em] uppercase"
                style={{ color: "#9D7B3F" }}
              >
                <svg width="7" height="7" viewBox="0 0 10 10" fill="none" aria-hidden>
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
