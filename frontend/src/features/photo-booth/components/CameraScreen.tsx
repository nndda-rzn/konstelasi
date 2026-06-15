"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type Webcam from "react-webcam";
import type { CapturePhase } from "../store/types";
import { CameraStage } from "./CameraStage";
import { StepIndicator } from "./StepIndicator";
import { AuthPromptModal } from "./AuthPromptModal";
import { SIDEBAR_GUTTER } from "../constants";

export interface CameraScreenProps {
  webcamRef: React.RefObject<Webcam | null>;
  showFlashOverlay: boolean;
  onStart: () => void;
  onRetry: () => void;
  onRetake: () => void;
  onDownload: () => void;
  onSave: () => void;
  onBack: () => void;
  isAuthPromptOpen: boolean;
  setAuthPromptOpen: (b: boolean) => void;
  isSettingsSheetOpen: boolean;
  setSettingsSheetOpen: (b: boolean) => void;
  phase: CapturePhase;
  capturedFramesCount: number;
  requiredShots: number;
  onLogin: () => void;
}

/**
 * CameraScreen - The capture stage. Shown during the "camera"
 * session step. Header has a back-to-format link; the stage
 * delegates to CameraStage for the actual capture UI.
 */
export function CameraScreen({
  webcamRef,
  showFlashOverlay,
  onStart,
  onRetry,
  onRetake,
  onDownload,
  onSave,
  onBack,
  isAuthPromptOpen,
  setAuthPromptOpen,
  isSettingsSheetOpen,
  setSettingsSheetOpen,
  phase,
  capturedFramesCount,
  requiredShots,
  onLogin,
}: CameraScreenProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FFF5F7]">
      <div className="pointer-events-none absolute top-20 left-1/4 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-[#FFB8C0]/22 blur-[110px]" />
      <div className="pointer-events-none absolute bottom-1/3 right-1/4 h-[300px] w-[300px] translate-x-1/2 rounded-full bg-[#E8D4F0]/18 blur-[110px]" />

      <AnimatePresence>
        {showFlashOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-white"
          />
        )}
      </AnimatePresence>

      <header className="sticky top-0 z-20 border-b border-black/[0.06] bg-white/80 backdrop-blur-md">
        <div
          className={`mx-auto flex h-14 max-w-[1320px] items-center gap-4 pr-5 ${SIDEBAR_GUTTER}`}
        >
          <button
            onClick={onBack}
            className="group inline-flex items-center gap-1.5 text-[11.5px] font-normal tracking-wide text-[#8C7783] transition-colors hover:text-[#3F2A35]"
          >
            <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
            Pilih ulang format
          </button>
        </div>
      </header>

      <main
        className={`mx-auto max-w-[1100px] px-5 py-8 pr-5 sm:px-7 ${SIDEBAR_GUTTER}`}
      >
        <div className="flex flex-col items-center gap-6">
          <StepIndicator step={3} />
          <CameraStage
            webcamRef={webcamRef}
            onStart={onStart}
            onRetry={onRetry}
            onRetake={onRetake}
            onDownload={onDownload}
            onSave={onSave}
          />
        </div>
      </main>

      {isSettingsSheetOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSettingsSheetOpen(false)}
        />
      )}

      <AuthPromptModal
        open={isAuthPromptOpen}
        onClose={() => setAuthPromptOpen(false)}
        onLogin={onLogin}
      />
    </div>
  );
}
