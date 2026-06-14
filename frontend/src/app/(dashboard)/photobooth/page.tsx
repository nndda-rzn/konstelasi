"use client";

import { useRef } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, SlidersHorizontal } from "lucide-react";
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

function PhotoboothContent() {
  const router = useRouter();
  const webcamRef = useRef<Webcam>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const stage = usePhotoboothStore((s) => s.stage);
  const isAuthPromptOpen = usePhotoboothStore((s) => s.isAuthPromptOpen);
  const setAuthPromptOpen = usePhotoboothStore((s) => s.setAuthPromptOpen);
  const isSettingsSheetOpen = usePhotoboothStore((s) => s.isSettingsSheetOpen);
  const setSettingsSheetOpen = usePhotoboothStore((s) => s.setSettingsSheetOpen);
  const selectedLayout = usePhotoboothStore((s) => s.selectedLayout);
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
          {/* Ambient background glow */}
          <div className="pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFB8C0]/20 blur-[130px]" />

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

          {/* Slim Header */}
          <header className="sticky top-0 z-20 border-b border-[#FFB8C0]/15 bg-white/72 backdrop-blur-2xl">
            <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-5">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#E63946] to-[#9D0208]">
                  <Camera className="h-3.5 w-3.5 text-white" />
                </div>
                <h1 className="text-sm font-bold text-[#3F2A35]">Photo Booth</h1>
              </div>
              {(stage === "countdown" || stage === "flash") && (
                <span className="ml-auto rounded-full border border-[#FFB8C0]/30 bg-white/60 px-2.5 py-0.5 text-[10px] font-semibold text-[#E63946]">
                  Foto {capturedPhotos.length + 1} / {layoutDef.shots}
                </span>
              )}
              {isEdit && (
                <span className="ml-auto rounded-full border border-[#FFB8C0]/30 bg-white/60 px-2.5 py-0.5 text-[10px] font-semibold text-[#E63946]">
                  Mode Edit
                </span>
              )}

              {/* Mobile: open settings sheet */}
              {isCapture && (
                <button
                  onClick={() => setSettingsSheetOpen(true)}
                  className="ml-auto flex h-9 w-9 items-center justify-center rounded-xl border border-[#FFB8C0]/25 bg-white/60 text-[#6D5561] hover:text-[#E63946] lg:hidden"
                  aria-label="Buka pengaturan"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </button>
              )}
            </div>
          </header>

          {/* Main content */}
          <main className="mx-auto max-w-7xl px-4 py-5 lg:px-6 lg:py-6 transition-all duration-500">
            {/* Capture stage: asymmetric grid (preview hero + settings rail) */}
            {isCapture && (
              <div className="grid gap-5 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_360px] 2xl:grid-cols-[1fr_380px] items-start">
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

            {/* Edit stage: keep existing 2-col editor + sidebar */}
            {isEdit && (
              <div className="grid gap-5 lg:grid-cols-[1fr_320px] items-start">
                <PhotoPreview
                  previewRef={previewRef}
                  onStickerDragEnd={handleStickerDragEnd}
                />
                <EditorSidebar
                  onSave={handleSave}
                  onDownload={handleDownload}
                  onRetake={handleRetake}
                />
              </div>
            )}

            {/* Done stage */}
            {stage === "done" && <DoneStage />}
          </main>

          {/* Mobile bottom sheet for settings */}
          <SettingsSheet />

          {/* Soft auth prompt replaces hard redirect */}
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
