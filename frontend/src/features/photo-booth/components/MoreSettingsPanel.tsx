"use client";

import { useEffect, useRef } from "react";
import { SlidersHorizontal } from "lucide-react";
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

export function MoreSettingsPanel() {
  const isOpen = usePhotoBoothStore((s) => s.isMoreSettingsOpen);
  const setOpen = usePhotoBoothStore((s) => s.setMoreSettingsOpen);
  const quality = usePhotoBoothStore((s) => s.selectedQuality);
  const setQuality = usePhotoBoothStore((s) => s.setSelectedQuality);
  const theme = usePhotoBoothStore((s) => s.selectedTheme);
  const setTheme = usePhotoBoothStore((s) => s.setSelectedTheme);
  const background = usePhotoBoothStore((s) => s.selectedBackground);
  const setBackground = usePhotoBoothStore((s) => s.setSelectedBackground);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, setOpen]);

  return (
    <div ref={ref} className="relative w-full">
      <button
        onClick={() => setOpen(!isOpen)}
        className={`flex w-full items-center justify-center gap-1.5 rounded-md border py-1.5 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
          isOpen
            ? "border-[#E63946]/40 bg-[#E63946]/6 text-[#E63946]"
            : "border-black/10 bg-white text-[#6D5561] hover:border-black/20 hover:text-[#3F2A35]"
        }`}
      >
        <SlidersHorizontal className="h-3 w-3" />
        <span>Lainnya</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-30 rounded-md border border-black/10 bg-white p-3 shadow-lg">
          <div className="space-y-3">
            <Group label="Kualitas">
              <div className="flex gap-1">
                {Object.values(PHOTO_QUALITIES).map((q: PhotoQuality) => (
                  <button
                    key={q.id}
                    onClick={() => setQuality(q.id as QualityId)}
                    className={`flex-1 rounded border px-1.5 py-1 text-[10px] font-semibold transition-colors ${
                      quality === q.id
                        ? "border-[#E63946]/40 bg-[#E63946]/8 text-[#E63946]"
                        : "border-black/10 bg-white text-[#6D5561] hover:border-black/20"
                    }`}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </Group>

            <Group label="Tema Frame">
              <div className="grid grid-cols-4 gap-1">
                {Object.values(PHOTO_THEMES).map((t: PhotoTheme) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id as ThemeId)}
                    className={`flex flex-col items-center gap-1 rounded border px-1 py-1.5 text-[9px] font-medium transition-colors ${
                      theme === t.id
                        ? "border-[#E63946]/40 bg-[#E63946]/8 text-[#E63946]"
                        : "border-black/10 bg-white text-[#6D5561]"
                    }`}
                    title={t.label}
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
                ))}
              </div>
            </Group>

            <Group label="Latar">
              <div className="grid grid-cols-4 gap-1">
                {Object.values(PHOTO_BACKGROUNDS).map((b: PhotoBackground) => (
                  <button
                    key={b.id}
                    onClick={() => setBackground(b.id as BackgroundId)}
                    className={`rounded border px-1 py-1 text-[9px] font-medium transition-colors ${
                      background === b.id
                        ? "border-[#E63946]/40 bg-[#E63946]/8 text-[#E63946]"
                        : "border-black/10 bg-white text-[#6D5561]"
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </Group>
          </div>
        </div>
      )}
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#6D5561]">
        {label}
      </p>
      {children}
    </div>
  );
}
