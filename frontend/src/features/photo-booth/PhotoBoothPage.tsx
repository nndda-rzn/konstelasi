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

const SIDEBAR_GUTTER = "md:pl-[48px]";

export function PhotoBoothPage() {
  const router = useRouter();
  const webcamRef = useRef<Webcam>(null);
  const previewRef = useRef<HTMLDivElement>(null);

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
  } = usePhotoBooth(webcamRef);

  const handleStickerDragEnd = (
    id: string,
    info: { point: { x: number; y: number } }
  ) => {
    if (!previewRef.current) return;
    const rect = previewRef.current.getBoundingClientRect();
    const nx = ((info.point.x - rect.left) / rect.width) * 100;
    const ny = ((info.point.y - rect.top) / rect.height) * 100;
    usePhotoBoothStore.getState().updateStickerPosition(
      id,
      Math.max(0, Math.min(100, nx)),
      Math.max(0, Math.min(100, ny))
    );
  };

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
            previewRef={previewRef}
            onStickerDragEnd={handleStickerDragEnd}
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
  previewRef: React.RefObject<HTMLDivElement | null>;
  onStickerDragEnd: (id: string, info: { point: { x: number; y: number } }) => void;
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
  onStickerDragEnd,
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
            className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#6D5561] transition-colors hover:text-[#3F2A35]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Foto Ulang
          </button>
          <div className="ml-auto flex items-center gap-2.5">
            <span className="rounded-md border border-black/10 bg-white px-2.5 py-0.5 text-[11px] font-medium text-[#6D5561]">
              Mode Edit
            </span>
          </div>
        </div>
      </header>

      <main
        className={`mx-auto max-w-[1320px] py-6 pr-5 ${SIDEBAR_GUTTER}`}
      >
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] items-start">
          <ResultPreviewInner
            previewRef={previewRef}
            onStickerDragEnd={onStickerDragEnd}
          />
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

// Local re-imports to keep imports at top minimal
import { ResultPreview } from "./components/ResultPreview";
import { ResultEditorPanel } from "./components/ResultEditorPanel";
function ResultPreviewInner(
  props: React.ComponentProps<typeof ResultPreview>
) {
  return <ResultPreview {...props} />;
}
