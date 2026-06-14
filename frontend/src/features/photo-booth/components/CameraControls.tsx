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
import { usePhotoBoothStore, selectRequiredShots } from "../photoBoothStore";
import type { CapturePhase } from "../store/types";
import { IconBtn } from "./shared/IconBtn";

interface CameraControlsProps {
  onStart: () => void;
  onRetry: () => void;
  onRetake: () => void;
  onDownload: () => void;
  onSave: () => void;
}

const PHASE_LABEL: Record<CapturePhase, string> = {
  idle: "Siap",
  countdown: "Menghitung",
  capturing: "Mengambil",
  processing: "Memproses",
  result: "Selesai",
  error: "Gagal",
};

function getPrimaryLabel(phase: CapturePhase, stage: string): string {
  if (stage === "saving") return "Memproses";
  if (phase === "error") return "Coba Lagi";
  if (phase === "result") return "Simpan ke Kanvas";
  return "Mulai Sesi Foto";
}

export function CameraControls({
  onStart,
  onRetry,
  onRetake,
  onDownload,
  onSave,
}: CameraControlsProps) {
  const phase = usePhotoBoothStore((s) => s.phase);
  const stage = usePhotoBoothStore((s) => s.stage);
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
    ? "bg-red-500"
    : isError
      ? "bg-amber-500"
      : isResult
        ? "bg-emerald-500"
        : "bg-[#9D7B3F]";

  const primaryLabel = getPrimaryLabel(phase, stage);
  const primaryAction = isError ? onRetry : isResult ? onSave : onStart;
  const primaryDisabled = isSessionActive || isSaving;

  return (
    <div
      className="flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3"
      style={{
        background: "linear-gradient(180deg, #FFFCF8 0%, #FAF5EE 100%)",
        boxShadow:
          "0 1px 2px rgba(60, 30, 40, 0.05), 0 6px 16px rgba(60, 30, 40, 0.06), inset 0 0 0 1px rgba(225, 210, 195, 0.5)",
      }}
    >
      {/* Left: Status */}
      <div className="flex min-w-0 items-center gap-2.5">
        <div className="flex items-center gap-1.5">
          <div
            className={`h-1.5 w-1.5 rounded-full ${indicatorColor} ${
              isSessionActive ? "animate-pulse" : ""
            }`}
          />
          <span className="text-[10.5px] font-semibold tracking-[0.18em] uppercase" style={{ color: "#6D5561" }}>
            {statusLabel}
          </span>
        </div>
      </div>

      {/* Right: Actions */}
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
              whileHover={!primaryDisabled ? { y: -1 } : undefined}
              whileTap={!primaryDisabled ? { scale: 0.98 } : undefined}
              transition={{ type: "spring", stiffness: 380, damping: 22 }}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-5 py-2 text-[12.5px] font-semibold tracking-wide transition-all disabled:cursor-not-allowed disabled:opacity-40"
              style={{
                background: primaryDisabled
                  ? "rgba(212, 165, 116, 0.2)"
                  : isError
                    ? "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)"
                    : "linear-gradient(135deg, #E63946 0%, #C52836 100%)",
                color: primaryDisabled ? "#B89A8A" : "white",
                boxShadow: primaryDisabled
                  ? "none"
                  : "0 4px 16px rgba(230, 57, 70, 0.25), inset 0 1px 0 rgba(255,255,255,0.15)",
              }}
            >
              <span className="relative z-10 inline-flex items-center gap-2">
                {isError ? (
                  <AlertTriangle className="h-4 w-4" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
                {primaryLabel}
              </span>
              {!primaryDisabled && (
                <span
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%)",
                  }}
                  aria-hidden
                />
              )}
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
              whileHover={!isSaving ? { y: -1 } : undefined}
              whileTap={!isSaving ? { scale: 0.98 } : undefined}
              transition={{ type: "spring", stiffness: 380, damping: 22 }}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-5 py-2 text-[12.5px] font-semibold tracking-wide text-white transition-all disabled:opacity-50"
              style={{
                background:
                  "linear-gradient(135deg, #E63946 0%, #C52836 100%)",
                boxShadow:
                  "0 4px 16px rgba(230, 57, 70, 0.25), inset 0 1px 0 rgba(255,255,255,0.15)",
              }}
            >
              <span className="relative z-10 inline-flex items-center gap-2">
                <Save className="h-4 w-4" />
                Simpan ke Kanvas
              </span>
              <span
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%)",
                }}
                aria-hidden
              />
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
