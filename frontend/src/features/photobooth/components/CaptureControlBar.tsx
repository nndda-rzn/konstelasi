"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Camera, RotateCcw, Download, Save, FlipHorizontal } from "lucide-react";
import { usePhotoboothStore } from "../store/usePhotoboothStore";

interface CaptureControlBarProps {
  onStart: () => void;
  onRetake: () => void;
  onDownload: () => void;
  onSave: () => void;
}

/**
 * CaptureControlBar - Slim in-flow control bar (72px tall).
 * Lives inside the preview column, not as a viewport-fixed overlay.
 * Context: status pill + progress on the left, primary CTA center,
 * secondary actions on the right.
 */
export function CaptureControlBar({
  onStart,
  onRetake,
  onDownload,
  onSave,
}: CaptureControlBarProps) {
  const stage = usePhotoboothStore((s) => s.stage);
  const capturedPhotos = usePhotoboothStore((s) => s.capturedPhotos);
  const selectedLayout = usePhotoboothStore((s) => s.selectedLayout);
  const toggleFacingMode = usePhotoboothStore((s) => s.toggleFacingMode);

  const isSetup = stage === "setup";
  const isCapture = stage === "countdown" || stage === "flash";
  const isEdit = stage === "edit" || stage === "saving";

  const total = totalShots(selectedLayout, capturedPhotos.length);
  const statusLabel = isSetup
    ? "Siap"
    : isCapture
      ? "Mengambil"
      : isEdit
        ? "Edit"
        : "Selesai";

  return (
    <div className="flex h-[72px] w-full items-center justify-between gap-3 rounded-2xl border border-[#FFB8C0]/20 bg-white/80 px-4 shadow-[0_4px_16px_rgba(84,45,55,0.08)] backdrop-blur-2xl">
      {/* Left: status + progress */}
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex items-center gap-1.5">
          <div
            className={`h-1.5 w-1.5 rounded-full ${
              isCapture ? "bg-red-500 animate-pulse" : "bg-emerald-500"
            }`}
          />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#6D5561]">
            {statusLabel}
          </span>
        </div>
        <div className="hidden h-3 w-px bg-[#FFB8C0]/30 sm:block" />
        <span className="hidden text-[10px] font-semibold text-[#8C7783] sm:inline">
          {capturedPhotos.length} / {total}
        </span>
      </div>

      {/* Center: primary CTA */}
      <div className="flex items-center">
        <AnimatePresence mode="wait">
          {isSetup && (
            <motion.button
              key="start"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={onStart}
              className="group flex h-10 items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#E63946] to-[#FF6B7A] px-6 text-sm font-bold text-white shadow-[0_4px_16px_rgba(230,57,70,0.25)] transition-all hover:shadow-[0_6px_20px_rgba(230,57,70,0.35)] active:scale-[0.98]"
            >
              <Camera className="h-4 w-4" />
              <span>Mulai Sesi Foto</span>
            </motion.button>
          )}
          {isEdit && (
            <motion.button
              key="save"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={onSave}
              className="flex h-10 items-center gap-2 overflow-hidden rounded-xl bg-[#E63946] px-6 text-sm font-bold text-white shadow-[0_4px_16px_rgba(230,57,70,0.25)] transition-all hover:bg-[#D62828] active:scale-[0.98]"
            >
              <Save className="h-4 w-4" />
              <span>Simpan ke Kanvas</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Right: secondary actions */}
      <div className="flex items-center gap-1.5">
        {isSetup && (
          <IconBtn onClick={toggleFacingMode} title="Ganti Kamera">
            <FlipHorizontal className="h-4 w-4" />
          </IconBtn>
        )}
        {isEdit && (
          <>
            <IconBtn onClick={onDownload} title="Unduh">
              <Download className="h-4 w-4" />
            </IconBtn>
            <IconBtn onClick={onRetake} title="Foto Ulang">
              <RotateCcw className="h-4 w-4" />
            </IconBtn>
          </>
        )}
      </div>
    </div>
  );
}

function IconBtn({
  onClick,
  title,
  children,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#FFB8C0]/20 bg-white/60 text-[#6D5561] transition-all hover:border-[#E63946]/40 hover:bg-white/80 hover:text-[#E63946]"
    >
      {children}
    </button>
  );
}

function totalShots(layout: string, fallback: number): number {
  if (layout.includes("single")) return 1;
  if (layout.includes("strip3")) return 3;
  if (layout.includes("grid6")) return 6;
  if (layout.includes("wide2")) return 2;
  if (layout.includes("cinematic3")) return 3;
  if (layout.includes("ultrawide4")) return 4;
  return 4; // default strip4/grid4
}
