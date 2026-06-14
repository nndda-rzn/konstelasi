"use client";

import { useRef } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Camera, SlidersHorizontal } from "lucide-react";
import { ApolloWrapper } from "@/lib/apollo/ApolloWrapper";
import { Providers } from "@/lib/Providers";
import { usePhotoBoothStore, selectRequiredShots } from "./photoBoothStore";
import { usePhotoBooth } from "./usePhotoBooth";
import { CameraStage } from "./components/CameraStage";
import { PhotoBoothSettings } from "./components/PhotoBoothSettings";
import { ResultPreview } from "./components/ResultPreview";
import { ResultEditorPanel } from "./components/ResultEditorPanel";
import { AuthPromptModal } from "./components/AuthPromptModal";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { LayoutGallery } from "./components/LayoutGallery";
import { FormatPicker } from "./components/FormatPicker";

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
  const isResultMode = flowMode === "result" || phase === "result";

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
          className={`mx-auto flex h-14 max-w-[1320px] items-center gap-3 pr-5 ${SIDEBAR_GUTTER}`}
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#E63946]">
              <Camera className="h-3.5 w-3.5 text-white" />
            </div>
            <h1 className="text-sm font-semibold text-[#3F2A35]">Photo Booth</h1>
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
          className={`mx-auto flex h-14 max-w-[1320px] items-center gap-3 pr-5 ${SIDEBAR_GUTTER}`}
        >
          <button
            onClick={() => {
              const s = usePhotoBoothStore.getState();
              s.setStage("setup");
              s.setFlowMode("session");
              s.setSessionStep("choose-layout");
            }}
            className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#6D5561] transition-colors hover:text-[#3F2A35]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Pilih Ulang Layout
          </button>
          <div className="ml-auto flex items-center gap-3">
            {(phase === "countdown" || phase === "capturing") && (
              <span className="rounded-md border border-black/10 bg-white px-2.5 py-0.5 text-[11px] font-medium text-[#6D5561]">
                Foto {capturedFramesCount + 1} / {requiredShots}
              </span>
            )}
            <button
              onClick={() => setSettingsSheetOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-black/10 bg-white text-[#6D5561] hover:text-[#E63946] lg:hidden"
              aria-label="Buka pengaturan"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main
        className={`mx-auto max-w-[1320px] py-6 pr-5 ${SIDEBAR_GUTTER}`}
      >
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] 2xl:grid-cols-[minmax(0,1fr)_360px] items-start">
          <CameraStage
            webcamRef={webcamRef}
            onStart={onStart}
            onRetry={onRetry}
            onRetake={onRetake}
            onDownload={onDownload}
            onSave={onSave}
          />
          <div className="hidden lg:block">
            <PhotoBoothSettings />
          </div>
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
          <ResultPreview
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
