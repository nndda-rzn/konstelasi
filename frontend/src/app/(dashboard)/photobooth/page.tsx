"use client";

import { useRef } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, SlidersHorizontal, ArrowLeft } from "lucide-react";
import { ApolloWrapper } from "@/lib/apollo/ApolloWrapper";
import { Providers } from "@/lib/Providers";
import { usePhotoboothStore } from "@/features/photobooth/store/usePhotoboothStore";
import { usePhotobooth } from "@/features/photobooth/hooks/usePhotobooth";
import { LandingStage } from "@/features/photobooth/components/LandingStage";
import { StudioStage } from "@/features/photobooth/components/StudioStage";
import { CompactSettingsPanel } from "@/features/photobooth/components/CompactSettingsPanel";
import { SettingsSheet } from "@/features/photobooth/components/SettingsSheet";
import { PhotoPreview } from "@/features/photobooth/components/PhotoPreview";
import { EditorSidebar } from "@/features/photobooth/components/EditorSidebar";
import { DoneStage } from "@/features/photobooth/components/DoneStage";
import { AuthPromptModal } from "@/features/photobooth/components/AuthPromptModal";

// Sidebar right edge: 12 + 260 = 272px. Global pl-[236px] leaves 36px
// hidden behind the sidebar; we add 48px on photobooth's own containers
// so header/content align cleanly past the sidebar (272 + 12 gap = 284px).
const SIDEBAR_GUTTER = "md:pl-[48px]";

function PhotoboothContent() {
  const router = useRouter();
  const webcamRef = useRef<Webcam>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const stage = usePhotoboothStore((s) => s.stage);
  const isAuthPromptOpen = usePhotoboothStore((s) => s.isAuthPromptOpen);
  const setAuthPromptOpen = usePhotoboothStore((s) => s.setAuthPromptOpen);
  const isSettingsSheetOpen = usePhotoboothStore((s) => s.isSettingsSheetOpen);
  const setSettingsSheetOpen = usePhotoboothStore((s) => s.setSettingsSheetOpen);
  const capturedPhotos = usePhotoboothStore((s) => s.capturedPhotos);

  const {
    layoutDef,
    handleStart,
    handleRetake,
    handleDownload,
    handleSave,
    handleStickerDragEnd,
  } = usePhotobooth(webcamRef, previewRef);

  const isCapture = stage === "setup" || stage === "countdown" || stage === "flash";
  const isEdit = stage === "edit" || stage === "saving";

  return (
    <>
      {stage === "landing" && <LandingStage />}

      {stage !== "landing" && (
        <div className="relative min-h-screen overflow-hidden bg-[#FFF5F7]">
          {/* Flash overlay */}
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

          {/* Header — 64px, aligned to content grid */}
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
                  Foto {capturedPhotos.length + 1} / {layoutDef.shots}
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

          {/* Main content */}
          <main
            className={`mx-auto max-w-[1320px] py-6 pr-5 ${SIDEBAR_GUTTER}`}
          >
            {isCapture && (
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px] items-start">
                <StudioStage
                  webcamRef={webcamRef}
                  layoutDef={layoutDef}
                  onStart={handleStart}
                  onRetake={handleRetake}
                  onDownload={handleDownload}
                  onSave={handleSave}
                />
                <aside className="hidden lg:block">
                  <CompactSettingsPanel />
                </aside>
              </div>
            )}

            {isEdit && (
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_360px] items-start">
                <div className="space-y-3">
                  <button
                    onClick={handleRetake}
                    className="inline-flex items-center gap-1.5 rounded text-[12px] font-medium text-[#6D5561] transition-colors hover:text-[#3F2A35]"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Kembali ke Kamera
                  </button>
                  <PhotoPreview
                    previewRef={previewRef}
                    onStickerDragEnd={handleStickerDragEnd}
                  />
                </div>
                <EditorSidebar
                  onSave={handleSave}
                  onDownload={handleDownload}
                  onRetake={handleRetake}
                />
              </div>
            )}

            {stage === "done" && <DoneStage />}
          </main>

          <SettingsSheet />

          <AuthPromptModal
            open={isAuthPromptOpen}
            onClose={() => setAuthPromptOpen(false)}
            onLogin={() => router.push("/login?reason=photobooth_save")}
          />
        </div>
      )}
    </>
  );
}

export default function PhotoboothPage() {
  return (
    <ApolloWrapper>
      <Providers>
        <PhotoboothContent />
      </Providers>
    </ApolloWrapper>
  );
}
