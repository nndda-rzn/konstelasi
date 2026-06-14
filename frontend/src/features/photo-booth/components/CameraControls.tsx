"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  RotateCcw,
  Download,
  Save,
  FlipHorizontal,
  AlertTriangle,
} from "lucide-react";
import { usePhotoBoothStore } from "../photoBoothStore";
import type { CapturePhase } from "../photoBoothStore";

interface CameraControlsProps {
  onStart: () => void;
  onRetry: () => void;
  onRetake: () => void;
  onDownload: () => void;
  onSave: () => void;
}

/**
 * Map capture phase to the small status label shown on the left.
 */
const PHASE_LABEL: Record<CapturePhase, string> = {
  idle: "Siap",
  countdown: "Menghitung",
  capturing: "Mengambil",
  processing: "Memproses",
  result: "Selesai",
  error: "Gagal",
};

/**
 * Map capture phase to the primary action button label.
 */
function getPrimaryLabel(phase: CapturePhase, stage: string): string {
  if (stage === "saving") return "Memproses";
  if (phase === "error") return "Coba Lagi";
  if (phase === "result") return "Simpan ke Kanvas";
  return "Mulai Sesi Foto";
}

/**
 * CameraControls - Slim 68px bar under the preview.
 * Labels and disabled state are driven by CapturePhase.
 */
export function CameraControls({
  onStart,
  onRetry,
  onRetake,
  onDownload,
  onSave,
}: CameraControlsProps) {
  const phase = usePhotoBoothStore((s) => s.phase);
  const stage = usePhotoBoothStore((s) => s.stage);
  const captured = usePhotoBoothStore((s) => s.capturedFrames);
  const required = usePhotoBoothStore((s) =>
    s.selectedLayoutId === "single"
      ? 1
      : s.selectedLayoutId === "strip3"
        ? 3
        : s.selectedLayoutId === "strip4" ||
            s.selectedLayoutId === "grid2x2" ||
            s.selectedLayoutId === "ultraWide"
          ? 4
          : s.selectedLayoutId === "grid3x2"
            ? 6
            : s.selectedLayoutId === "wide2"
              ? 2
              : s.selectedLayoutId === "cinematic3"
                ? 3
                : 4
  );
  const toggleFacingMode = usePhotoBoothStore((s) => s.toggleFacingMode);

  const isSessionActive =
    phase === "countdown" || phase === "capturing" || phase === "processing";
  const isIdle = phase === "idle" || phase === "error";
  const isResult = phase === "result";
  const isEdit = isResult || stage === "saving";
  const isSaving = stage === "saving";
  const isError = phase === "error";

  const statusLabel = isError ? "Gagal" : PHASE_LABEL[phase];

  const indicatorColor = isSessionActive
    ? "bg-red-500 animate-pulse"
    : isError
      ? "bg-amber-500"
      : isResult
        ? "bg-emerald-500"
        : "bg-emerald-500";

  const primaryLabel = getPrimaryLabel(phase, stage);
  const primaryAction = isError ? onRetry : isResult ? onSave : onStart;
  const primaryDisabled = isSessionActive || isSaving;

  return (
    <div className="flex h-[68px] w-full items-center justify-between gap-3 rounded-lg border border-black/10 bg-white px-3.5 shadow-sm">
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="flex items-center gap-1.5">
          <div className={`h-1.5 w-1.5 rounded-full ${indicatorColor}`} />
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6D5561]">
            {statusLabel}
          </span>
        </div>
        <div className="hidden h-3 w-px bg-black/10 sm:block" />
        <span className="hidden text-[11px] font-medium tabular-nums text-[#8C7783] sm:inline">
          {captured.length} / {required}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        {isIdle && !isResult && (
          <IconBtn onClick={toggleFacingMode} title="Ganti Kamera">
            <FlipHorizontal className="h-4 w-4" />
          </IconBtn>
        )}

        <AnimatePresence mode="wait">
          {isIdle && !isResult && (
            <motion.button
              key="primary"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              onClick={primaryAction}
              disabled={primaryDisabled}
              className={`flex h-10 items-center gap-2 rounded-lg px-5 text-[13px] font-semibold text-white transition-colors active:scale-[0.98] ${
                isError
                  ? "bg-amber-500 hover:bg-amber-600 disabled:opacity-60"
                  : "bg-[#E63946] hover:bg-[#D62828] disabled:opacity-60"
              }`}
            >
              {isError ? (
                <AlertTriangle className="h-4 w-4" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
              <span>{primaryLabel}</span>
            </motion.button>
          )}
          {isEdit && (
            <motion.button
              key="save"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              onClick={onSave}
              disabled={isSaving}
              className="flex h-10 items-center gap-2 rounded-lg bg-[#E63946] px-5 text-[13px] font-semibold text-white transition-colors hover:bg-[#D62828] disabled:opacity-60 active:scale-[0.98]"
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
