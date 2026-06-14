"use client";

import { useState } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import {
  PHOTO_QUALITIES,
  PHOTO_THEMES,
  PHOTO_BACKGROUNDS,
  usePhotoBoothStore,
} from "../photoBoothStore";
import type {
  QualityId,
  ThemeId,
  BackgroundId,
  PhotoQuality,
  PhotoTheme,
  PhotoBackground,
} from "../photoBooth.config";

/**
 * MoreSettingsPanel - Safe inline accordion for advanced settings.
 * Opens IN-PLACE (no absolute popover) so the panel's internal
 * scroll handles overflow. Quality is a compact segmented control.
 */
export function MoreSettingsPanel() {
  const isOpen = usePhotoBoothStore((s) => s.isMoreSettingsOpen);
  const setOpen = usePhotoBoothStore((s) => s.setMoreSettingsOpen);
  const quality = usePhotoBoothStore((s) => s.selectedQuality);
  const setQuality = usePhotoBoothStore((s) => s.setSelectedQuality);
  const theme = usePhotoBoothStore((s) => s.selectedTheme);
  const setTheme = usePhotoBoothStore((s) => s.setSelectedTheme);
  const background = usePhotoBoothStore((s) => s.selectedBackground);
  const setBackground = usePhotoBoothStore((s) => s.setSelectedBackground);

  // Local UI state so the chevron rotates immediately even before
  // the store commit lands. Keep store as the source of truth for
  // open/close across page navigations.
  const [, setLocal] = useState(false);
  const handleToggle = () => {
    setLocal(true);
    setOpen(!isOpen);
  };

  return (
    <div className="space-y-1.5">
      <button
        onClick={handleToggle}
        aria-expanded={isOpen}
        className={`flex w-full items-center justify-center gap-1.5 rounded-md border py-1.5 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
          isOpen
            ? "border-[#E63946]/40 bg-[#E63946]/[0.04] text-[#E63946]"
            : "border-black/10 bg-white text-[#6D5561] hover:border-black/20 hover:text-[#3F2A35]"
        }`}
      >
        <SlidersHorizontal className="h-3 w-3" />
        <span>Lainnya</span>
        <ChevronDown
          className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="space-y-3 rounded-md border border-black/[0.06] bg-[#FAFAFA] p-2.5">
          <Group label="Kualitas">
            <Segmented
              value={quality}
              options={Object.values(PHOTO_QUALITIES).map((q) => ({
                id: q.id,
                label: q.label,
              }))}
              onChange={(v) => setQuality(v as QualityId)}
            />
          </Group>

          <Group label="Tema Frame">
            <div className="grid grid-cols-4 gap-1">
              {Object.values(PHOTO_THEMES).map((t: PhotoTheme) => {
                const active = theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id as ThemeId)}
                    title={t.label}
                    className={`flex flex-col items-center gap-1 rounded border px-1 py-1.5 text-[9px] font-medium transition-colors ${
                      active
                        ? "border-[#E63946]/40 bg-[#E63946]/[0.04] text-[#E63946]"
                        : "border-black/10 bg-white text-[#6D5561]"
                    }`}
                  >
                    <div
                      className="h-4 w-full rounded-sm"
                      style={{
                        background: t.cssBg,
                        border: "1px solid rgba(0,0,0,0.06)",
                      }}
                    />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </Group>

          <Group label="Latar">
            <div className="grid grid-cols-4 gap-1">
              {Object.values(PHOTO_BACKGROUNDS).map((b: PhotoBackground) => {
                const active = background === b.id;
                return (
                  <button
                    key={b.id}
                    onClick={() => setBackground(b.id as BackgroundId)}
                    className={`rounded border px-1 py-1 text-[9px] font-medium transition-colors ${
                      active
                        ? "border-[#E63946]/40 bg-[#E63946]/[0.04] text-[#E63946]"
                        : "border-black/10 bg-white text-[#6D5561]"
                    }`}
                  >
                    {b.label}
                  </button>
                );
              })}
            </div>
          </Group>
        </div>
      )}
    </div>
  );
}

function Group({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-[9px] font-semibold uppercase tracking-wider text-[#8C7783]">
        {label}
      </p>
      {children}
    </div>
  );
}

function Segmented({
  value,
  options,
  onChange,
}: {
  value: string;
  options: { id: string; label: string }[];
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex w-full gap-1 rounded-md border border-black/10 bg-white p-0.5">
      {options.map((o) => {
        const active = value === o.id;
        return (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            className={`flex-1 rounded py-1 text-[10px] font-semibold transition-colors ${
              active
                ? "bg-[#E63946] text-white"
                : "text-[#6D5561] hover:text-[#3F2A35]"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
