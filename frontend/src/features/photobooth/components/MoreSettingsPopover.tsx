"use client";

import { useEffect, useRef } from "react";
import { SlidersHorizontal } from "lucide-react";
import { QUALITIES, BACKGROUNDS, ZOOM_LEVELS, type QualityKey, type BackgroundKey, type ZoomKey } from "../constants";
import { usePhotoboothStore } from "../store/usePhotoboothStore";

/**
 * MoreSettingsPopover - Floating popover with advanced settings:
 * Quality, Background, Zoom. Triggered from CompactSettingsPanel.
 */
export function MoreSettingsPopover() {
  const isOpen = usePhotoboothStore((s) => s.isMoreSettingsOpen);
  const setOpen = usePhotoboothStore((s) => s.setMoreSettingsOpen);

  const selectedQuality = usePhotoboothStore((s) => s.selectedQuality);
  const setSelectedQuality = usePhotoboothStore((s) => s.setSelectedQuality);

  const selectedBackground = usePhotoboothStore((s) => s.selectedBackground);
  const setSelectedBackground = usePhotoboothStore((s) => s.setSelectedBackground);

  const zoomLevelKey = usePhotoboothStore((s) => s.zoomLevel);
  const setZoomLevel = usePhotoboothStore((s) => s.setZoomLevel);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
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
    <div ref={containerRef} className="relative w-full">
      <button
        onClick={() => setOpen(!isOpen)}
        className={`flex w-full items-center justify-center gap-1.5 rounded-xl border py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all ${
          isOpen
            ? "border-[#E63946]/40 bg-[#E63946]/6 text-[#E63946]"
            : "border-[#FFB8C0]/20 bg-white/40 text-[#6D5561] hover:bg-white/60 hover:text-[#3F2A35]"
        }`}
      >
        <SlidersHorizontal className="h-3 w-3" />
        <span>Lainnya</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-30 rounded-2xl border border-[#FFB8C0]/25 bg-white/95 p-4 shadow-[0_8px_24px_rgba(84,45,55,0.15)] backdrop-blur-2xl">
          <div className="space-y-4">
            {/* Quality */}
            <div className="space-y-1.5">
              <p className="text-[9px] font-bold uppercase tracking-widest text-[#8C7783]">
                Kualitas
              </p>
              <div className="flex gap-1">
                {QUALITIES.map((q) => {
                  const active = q.key === selectedQuality;
                  return (
                    <button
                      key={q.key}
                      onClick={() => setSelectedQuality(q.key as QualityKey)}
                      className={`flex-1 rounded-lg border px-1.5 py-1 text-[10px] font-bold transition-all ${
                        active
                          ? "border-[#E63946]/40 bg-[#E63946]/8 text-[#E63946]"
                          : "border-[#FFB8C0]/20 bg-white/50 text-[#6D5561] hover:border-[#FFB8C0]/45"
                      }`}
                    >
                      {q.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Background */}
            <div className="space-y-1.5">
              <p className="text-[9px] font-bold uppercase tracking-widest text-[#8C7783]">
                Latar
              </p>
              <div className="grid grid-cols-4 gap-1.5">
                {BACKGROUNDS.map((b) => {
                  const active = b.key === selectedBackground;
                  return (
                    <button
                      key={b.key}
                      onClick={() => setSelectedBackground(b.key as BackgroundKey)}
                      className={`flex flex-col items-center gap-1 rounded-lg border px-1 py-1.5 text-[9px] font-semibold transition-all ${
                        active
                          ? "border-[#E63946]/40 bg-[#E63946]/8 text-[#E63946]"
                          : "border-[#FFB8C0]/20 bg-white/50 text-[#6D5561]"
                      }`}
                    >
                      <div
                        className="h-4 w-full rounded"
                        style={{
                          background:
                            b.key === "none"
                              ? "transparent"
                              : b.key === "cream"
                                ? "#FFF5E8"
                                : b.key === "gradient"
                                  ? "linear-gradient(135deg,#FFE5E8,#FFB8C0,#FFE5E8)"
                                  : "linear-gradient(135deg,#FFE5E8,#FFB8C0)",
                          border: b.key === "none" ? "1px dashed #FFB8C0" : "none",
                        }}
                      />
                      {b.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Zoom */}
            <div className="space-y-1.5">
              <p className="text-[9px] font-bold uppercase tracking-widest text-[#8C7783]">
                Sudut Pandang
              </p>
              <div className="grid grid-cols-4 gap-1">
                {ZOOM_LEVELS.map((z) => {
                  const active = z.key === zoomLevelKey;
                  return (
                    <button
                      key={z.key}
                      onClick={() => setZoomLevel(z.key as ZoomKey)}
                      className={`rounded-lg border px-1 py-1 text-[9px] font-bold transition-all ${
                        active
                          ? "border-[#E63946]/40 bg-[#E63946]/8 text-[#E63946]"
                          : "border-[#FFB8C0]/20 bg-white/50 text-[#6D5561]"
                      }`}
                    >
                      {z.desc}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
