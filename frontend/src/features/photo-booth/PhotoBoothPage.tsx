"use client";

import { useRef } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, SlidersHorizontal, Timer, FlipHorizontal, Zap } from "lucide-react";
import { ApolloWrapper } from "@/lib/apollo/ApolloWrapper";
import { Providers } from "@/lib/Providers";
import {
  usePhotoBoothStore,
  selectRequiredShots,
  selectPhotoLayout,
  selectPhotoRatio,
} from "./photoBoothStore";
import { usePhotoBooth } from "./usePhotoBooth";
import { CameraStage } from "./components/CameraStage";
import { StepIndicator } from "./components/StepIndicator";
import { AuthPromptModal } from "./components/AuthPromptModal";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { LayoutGallery } from "./components/LayoutGallery";
import { FormatPicker } from "./components/FormatPicker";
import { PhotoBoothMark } from "./components/PhotoBoothMark";
import { ResultEditorPanel } from "./components/ResultEditorPanel";
import {
  KonvaResultPreview,
  type KonvaResultPreviewHandle,
} from "./components/KonvaResultPreview";

const SIDEBAR_GUTTER = "md:pl-[48px]";

export function PhotoBoothPage() {
  const router = useRouter();
  const webcamRef = useRef<Webcam>(null);
  // Ref to the Konva result preview so we can call its export
  // methods (Download + Save use the same exported data URL).
  const konvaPreviewRef = useRef<KonvaResultPreviewHandle>(null);

  const flowMode = usePhotoBoothStore((s) => s.flowMode);
  const sessionStep = usePhotoBoothStore((s) => s.sessionStep);
  const phase = usePhotoBoothStore((s) => s.phase);
  const stage = usePhotoBoothStore((s) => s.stage);
  const capturedFrames = usePhotoBoothStore((s) => s.capturedFrames);
  const requiredShots = usePhotoBoothStore(selectRequiredShots);
  const isAuthPromptOpen = usePhotoBoothStore((s) => s.isAuthPromptOpen);
  const setAuthPromptOpen = usePhotoBoothStore((s) => s.setAuthPromptOpen);
  const isSettingsSheetOpen = usePhotoBoothStore((s) => s.isSettingsSheetOpen);
  const setSettingsSheetOpen = usePhotoBoothStore((s) => s.setSettingsSheetOpen);

  const {
    handleStart,
    handleRetry,
    handleRetake,
    handleDownload,
    handleSave,
  } = usePhotoBooth(webcamRef, () => konvaPreviewRef.current);

  const showFlashOverlay = stage === "flash";
  // Result mode is EXCLUSIVELY when flowMode is "result".
  // This ensures the camera screen is unmounted when result is shown,
  // so the result doesn't appear "stuck" under the camera preview.
  const isResultMode = flowMode === "result";

  return (
    <ApolloWrapper>
      <Providers>
        {flowMode === "welcome" && <WelcomeScreen />}

        {flowMode === "session" && sessionStep === "choose-layout" && (
          <SessionShell>
            <LayoutGallery />
          </SessionShell>
        )}

        {flowMode === "session" && sessionStep === "choose-format" && (
          <SessionShell>
            <FormatPicker />
          </SessionShell>
        )}

        {flowMode === "session" && sessionStep === "camera" && (
          <CameraScreen
            webcamRef={webcamRef}
            showFlashOverlay={showFlashOverlay}
            onStart={handleStart}
            onRetry={handleRetry}
            onRetake={handleRetake}
            onDownload={handleDownload}
            onSave={handleSave}
            isAuthPromptOpen={isAuthPromptOpen}
            setAuthPromptOpen={setAuthPromptOpen}
            isSettingsSheetOpen={isSettingsSheetOpen}
            setSettingsSheetOpen={setSettingsSheetOpen}
            phase={phase}
            stage={stage}
            capturedFramesCount={capturedFrames.length}
            requiredShots={requiredShots}
            onLogin={() => router.push("/login?reason=photobooth_save")}
          />
        )}

        {isResultMode && (
          <ResultScreen
            previewRef={konvaPreviewRef}
            onRetake={handleRetake}
            onDownload={handleDownload}
            onSave={handleSave}
            isAuthPromptOpen={isAuthPromptOpen}
            setAuthPromptOpen={setAuthPromptOpen}
            stage={stage}
            onLogin={() => router.push("/login?reason=photobooth_save")}
          />
        )}
      </Providers>
    </ApolloWrapper>
  );
}

function SessionShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#FFF5F7]">
      <header className="sticky top-0 z-20 border-b border-black/[0.06] bg-white/80 backdrop-blur-md">
        <div
          className={`mx-auto flex h-14 max-w-[1320px] items-center gap-4 pr-5 ${SIDEBAR_GUTTER}`}
        >
          <div className="flex items-center gap-2.5">
            <PhotoBoothMark size={26} />
            <div className="flex items-baseline gap-1.5">
              <h1 className="text-[14px] font-semibold tracking-tight text-[#3F2A35]">
                Photo Booth
              </h1>
              <span className="text-[9px] font-semibold tracking-[0.22em] text-[#9D7B8A] uppercase">
                · Studio
              </span>
            </div>
          </div>
        </div>
      </header>
      <main className={`mx-auto max-w-[1320px] pr-5 ${SIDEBAR_GUTTER}`}>{children}</main>
    </div>
  );
}

interface CameraScreenProps {
  webcamRef: React.RefObject<Webcam | null>;
  showFlashOverlay: boolean;
  onStart: () => void;
  onRetry: () => void;
  onRetake: () => void;
  onDownload: () => void;
  onSave: () => void;
  isAuthPromptOpen: boolean;
  setAuthPromptOpen: (b: boolean) => void;
  isSettingsSheetOpen: boolean;
  setSettingsSheetOpen: (b: boolean) => void;
  phase: ReturnType<typeof usePhotoBoothStore.getState>["phase"];
  stage: ReturnType<typeof usePhotoBoothStore.getState>["stage"];
  capturedFramesCount: number;
  requiredShots: number;
  onLogin: () => void;
}

function CameraScreen({
  webcamRef,
  showFlashOverlay,
  onStart,
  onRetry,
  onRetake,
  onDownload,
  onSave,
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
      {/* Constella ambient haze */}
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
            onClick={() => {
              const s = usePhotoBoothStore.getState();
              s.setStage("setup");
              s.setFlowMode("session");
              s.setSessionStep("choose-format");
            }}
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

interface ResultScreenProps {
  /**
   * Ref to the KonvaResultPreview. The Result/Edit screen only
   * mounts the Konva stage; the Konva stage itself owns sticker
   * positions (now drawn IN the stage, not as DOM overlay).
   */
  previewRef: React.RefObject<KonvaResultPreviewHandle | null>;
  onRetake: () => void;
  onDownload: () => void;
  onSave: () => void;
  isAuthPromptOpen: boolean;
  setAuthPromptOpen: (b: boolean) => void;
  stage: ReturnType<typeof usePhotoBoothStore.getState>["stage"];
  onLogin: () => void;
}

function ResultScreen({
  previewRef,
  onRetake,
  onDownload,
  onSave,
  isAuthPromptOpen,
  setAuthPromptOpen,
  onLogin,
}: ResultScreenProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FFF5F7]">
      <header className="sticky top-0 z-20 border-b border-black/[0.06] bg-white/80 backdrop-blur-md">
        <div
          className={`mx-auto flex h-14 max-w-[1320px] items-center gap-3 pr-5 ${SIDEBAR_GUTTER}`}
        >
          <button
            onClick={onRetake}
            className="group inline-flex items-center gap-1.5 text-[11.5px] font-normal tracking-wide text-[#8C7783] transition-colors hover:text-[#3F2A35]"
          >
            <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
            Foto ulang
          </button>
          <div className="ml-auto flex items-center gap-2.5">
            <span
              className="rounded-full px-2.5 py-0.5 text-[10px] font-medium tracking-[0.18em] uppercase"
              style={{
                background: "rgba(212, 165, 116, 0.15)",
                color: "#9D7B3F",
                border: "1px solid rgba(212, 165, 116, 0.3)",
              }}
            >
              Mode Edit
            </span>
          </div>
        </div>
      </header>

      <main
        className={`mx-auto max-w-[1320px] py-6 pr-5 sm:px-7 ${SIDEBAR_GUTTER}`}
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] items-start">
          <div className="flex items-start justify-center">
            <KonvaResultPreview ref={previewRef} displayWidth={720} />
          </div>
          <ResultEditorPanel />
        </div>
      </main>

      <AuthPromptModal
        open={isAuthPromptOpen}
        onClose={() => setAuthPromptOpen(false)}
        onLogin={onLogin}
      />
    </div>
  );
}
