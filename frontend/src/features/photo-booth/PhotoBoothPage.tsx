"use client";

import { useRef } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, SlidersHorizontal, ArrowLeft } from "lucide-react";
import { ApolloWrapper } from "@/lib/apollo/ApolloWrapper";
import { Providers } from "@/lib/Providers";
import { LandingStage } from "./components/LandingStage";
import { usePhotoBoothStore } from "./photoBoothStore";
import { usePhotoBooth } from "./usePhotoBooth";
import { CameraStage } from "./components/CameraStage";
import { PhotoBoothSettings } from "./components/PhotoBoothSettings";
import { ResultPreview } from "./components/ResultPreview";
import { ResultEditorPanel } from "./components/ResultEditorPanel";
import { AuthPromptModal } from "./components/AuthPromptModal";

// Sidebar is 260px (left 12, right 272). Global pl-[236px] leaves 36px
// hidden behind the sidebar; we add 48px on photobooth containers so the
// header/content align cleanly past the sidebar (272 + 12 gap = 284px).
const SIDEBAR_GUTTER = "md:pl-[48px]";

export function PhotoBoothPage() {
  const router = useRouter();
  const webcamRef = useRef<Webcam>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const stage = usePhotoBoothStore((s) => s.stage);
  const capturedFrames = usePhotoBoothStore((s) => s.capturedFrames);
  const composed = usePhotoBoothStore((s) => s.composed);
  void composed;
  const isAuthPromptOpen = usePhotoBoothStore((s) => s.isAuthPromptOpen);
  const setAuthPromptOpen = usePhotoBoothStore((s) => s.setAuthPromptOpen);
  const isSettingsSheetOpen = usePhotoBoothStore((s) => s.isSettingsSheetOpen);
  const setSettingsSheetOpen = usePhotoBoothStore((s) => s.setSettingsSheetOpen);
  const setSheetOpen = usePhotoBoothStore((s) => s.setSettingsSheetOpen);
  const selectedLayoutId = usePhotoBoothStore((s) => s.selectedLayoutId);
  void setSheetOpen;

  const {
    handleStart,
    handleRetake,
    handleDownload,
    handleSave,
  } = usePhotoBooth(webcamRef);

  // Sticker drag handler for result page
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

  const isCapture = stage === "setup" || stage === "countdown" || stage === "flash";
  const isEdit = stage === "edit" || stage === "saving";

  return (
    <ApolloWrapper>
      <Providers>
        {stage === "landing" ? (
          <LandingStage />
        ) : (
          <div className="relative min-h-screen overflow-hidden bg-[#FFF5F7]">
            <AnimatePresence>
              {stage === "flash" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="fixed inset-0 z-50 bg-white"
                />
              )}
            </AnimatePresence>

            {/* Header */}
            <header className="sticky top-0 z-20 border-b border-black/[0.06] bg-white/80 backdrop-blur-md">
              <div
                className={`mx-auto flex h-16 max-w-[1320px] items-center gap-3 pr-5 ${SIDEBAR_GUTTER}`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#E63946]">
                    <Camera className="h-4 w-4 text-white" />
                  </div>
                  <h1 className="text-[15px] font-semibold text-[#3F2A35]">
                    Photo Booth
                  </h1>
                </div>

                {(stage === "countdown" || stage === "flash") && (
                  <span className="ml-auto rounded-md border border-black/10 bg-white px-2.5 py-0.5 text-[11px] font-medium text-[#6D5561]">
                    Foto {capturedFrames.length + 1} / {requiredShots(selectedLayoutId)}
                  </span>
                )}
                {isEdit && (
                  <span className="ml-auto rounded-md border border-black/10 bg-white px-2.5 py-0.5 text-[11px] font-medium text-[#6D5561]">
                    Mode Edit
                  </span>
                )}

                {isCapture && (
                  <button
                    onClick={() => setSettingsSheetOpen(true)}
                    className="ml-auto flex h-9 w-9 items-center justify-center rounded-md border border-black/10 bg-white text-[#6D5561] hover:text-[#E63946] lg:hidden"
                    aria-label="Buka pengaturan"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                  </button>
                )}
              </div>
            </header>

            {/* Main */}
            <main
              className={`mx-auto max-w-[1320px] py-6 pr-5 ${SIDEBAR_GUTTER}`}
            >
              {isCapture && (
                <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] 2xl:grid-cols-[minmax(0,1fr)_360px] items-start">
                  <CameraStage
                    webcamRef={webcamRef}
                    onStart={handleStart}
                    onRetake={handleRetake}
                    onDownload={handleDownload}
                    onSave={handleSave}
                  />
                  <aside className="hidden lg:block">
                    <PhotoBoothSettings />
                  </aside>
                </div>
              )}

              {isEdit && (
                <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] items-start">
                  <div className="space-y-3">
                    <button
                      onClick={handleRetake}
                      className="inline-flex items-center gap-1.5 rounded text-[12px] font-medium text-[#6D5561] transition-colors hover:text-[#3F2A35]"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      Kembali ke Kamera
                    </button>
                    <ResultPreview
                      previewRef={previewRef}
                      onStickerDragEnd={handleStickerDragEnd}
                    />
                  </div>
                  <ResultEditorPanel />
                </div>
              )}

              {stage === "done" && (
                <div className="flex flex-col items-center gap-4 py-10">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                    ✓
                  </div>
                  <p className="text-sm font-semibold text-[#3F2A35]">
                    Foto tersimpan!
                  </p>
                </div>
              )}
            </main>

            {/* Mobile settings sheet (lazy via PhotoBoothSettings import in auth modal file; keep simple here) */}
            {isSettingsSheetOpen && (
              <div
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
                onClick={() => setSettingsSheetOpen(false)}
              />
            )}

            <AuthPromptModal
              open={isAuthPromptOpen}
              onClose={() => setAuthPromptOpen(false)}
              onLogin={() => router.push("/login?reason=photobooth_save")}
            />
          </div>
        )}
      </Providers>
    </ApolloWrapper>
  );
}

function requiredShots(layout: string): number {
  if (layout === "single") return 1;
  if (layout === "strip3") return 3;
  if (layout === "wide2") return 2;
  if (layout === "cinematic3") return 3;
  return 4; // strip4, grid2x2, grid3x2, ultraWide
}
