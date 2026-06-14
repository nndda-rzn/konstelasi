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
 * CaptureControlBar - Slim bar (68px) that lives directly under the camera
 * preview. Width is bounded to the preview column. Compact, not floating.
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

  const total = totalShots(selectedLayout);
  const statusLabel = isSetup
    ? "Siap"
    : isCapture
      ? "Mengambil"
      : isEdit
        ? "Edit"
        : "Selesai";

  return (
    <div className="flex h-[68px] w-full items-center justify-between gap-3 rounded-lg border border-black/10 bg-white px-3.5 shadow-sm">
      {/* Left: status + progress */}
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="flex items-center gap-1.5">
          <div
            className={`h-1.5 w-1.5 rounded-full ${
              isCapture ? "bg-red-500 animate-pulse" : "bg-emerald-500"
            }`}
          />
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6D5561]">
            {statusLabel}
          </span>
        </div>
        <div className="hidden h-3 w-px bg-black/10 sm:block" />
        <span className="hidden text-[11px] font-medium tabular-nums text-[#8C7783] sm:inline">
          {capturedPhotos.length} / {total}
        </span>
      </div>

      {/* Right: primary CTA + secondary actions */}
      <div className="flex items-center gap-1.5">
        {isSetup && (
          <IconBtn onClick={toggleFacingMode} title="Ganti Kamera">
            <FlipHorizontal className="h-4 w-4" />
          </IconBtn>
        )}

        <AnimatePresence mode="wait">
          {isSetup && (
            <motion.button
              key="start"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              onClick={onStart}
              className="flex h-10 items-center gap-2 rounded-lg bg-[#E63946] px-5 text-[13px] font-semibold text-white transition-colors hover:bg-[#D62828] active:scale-[0.98]"
            >
              <Camera className="h-4 w-4" />
              <span>Mulai Sesi Foto</span>
            </motion.button>
          )}
          {isEdit && (
            <motion.button
              key="save"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              onClick={onSave}
              className="flex h-10 items-center gap-2 rounded-lg bg-[#E63946] px-5 text-[13px] font-semibold text-white transition-colors hover:bg-[#D62828] active:scale-[0.98]"
            >
              <Save className="h-4 w-4" />
              <span>Simpan ke Kanvas</span>
            </motion.button>
          )}
        </AnimatePresence>

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
      className="flex h-10 w-10 items-center justify-center rounded-lg border border-black/10 bg-white text-[#6D5561] transition-colors hover:border-[#E63946]/40 hover:text-[#E63946]"
    >
      {children}
    </button>
  );
}

function totalShots(layout: string): number {
  if (layout.includes("single")) return 1;
  if (layout.includes("strip3")) return 3;
  if (layout.includes("grid6")) return 6;
  if (layout.includes("wide2")) return 2;
  if (layout.includes("cinematic3")) return 3;
  if (layout.includes("ultrawide4")) return 4;
  return 4;
}
