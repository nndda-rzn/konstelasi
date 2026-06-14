"use client";

import { useRef } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Camera } from "lucide-react";
import { ApolloWrapper } from "@/lib/apollo/ApolloWrapper";
import { Providers } from "@/lib/Providers";
import { usePhotoboothStore } from "@/features/photobooth/store/usePhotoboothStore";
import { usePhotobooth } from "@/features/photobooth/hooks/usePhotobooth";
import { LandingStage } from "@/features/photobooth/components/LandingStage";
import { CameraStage } from "@/features/photobooth/components/CameraStage";
import { CaptureSettingsPanel } from "@/features/photobooth/components/CaptureSettingsPanel";
import { StickyCaptureBar } from "@/features/photobooth/components/StickyCaptureBar";
import { PhotoPreview } from "@/features/photobooth/components/PhotoPreview";
import { EditorSidebar } from "@/features/photobooth/components/EditorSidebar";
import { DoneStage } from "@/features/photobooth/components/DoneStage";
import { AuthPromptModal } from "@/features/photobooth/components/AuthPromptModal";

function PhotoboothContent() {
  const router = useRouter();
  const webcamRef = useRef<Webcam>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const stage = usePhotoboothStore((s) => s.stage);
  const capturedPhotos = usePhotoboothStore((s) => s.capturedPhotos);
  const isAuthPromptOpen = usePhotoboothStore((s) => s.isAuthPromptOpen);
  const setAuthPromptOpen = usePhotoboothStore((s) => s.setAuthPromptOpen);

  const {
    layoutDef,
    handleStart,
    handleRetake,
    handleDownload,
    handleSave,
    handleStickerDragEnd,
  } = usePhotobooth(webcamRef, previewRef);

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

          {/* Header */}
          <header className="sticky top-0 z-20 border-b border-[#FFB8C0]/15 bg-white/72 backdrop-blur-2xl">
            <div className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#E63946] to-[#9D0208]">
                  <Camera className="h-4 w-4 text-white" />
                </div>
                <h1 className="text-base font-bold text-[#3F2A35]">
                  Photo Booth
                </h1>
              </div>
              {(stage === "countdown" || stage === "flash") && (
                <span className="ml-auto rounded-full border border-[#FFB8C0]/30 bg-white/60 px-3 py-1 text-[11px] font-semibold text-[#E63946]">
                  Foto {capturedPhotos.length + 1} / {layoutDef.shots}
                </span>
              )}
              {stage === "edit" && (
                <span className="ml-auto rounded-full border border-[#FFB8C0]/30 bg-white/60 px-3 py-1 text-[11px] font-semibold text-[#E63946]">
                  Mode Edit
                </span>
              )}
            </div>
          </header>

          {/* Main content */}
          <main className="mx-auto max-w-6xl xl:max-w-7xl 2xl:max-w-[1600px] px-6 py-8 pb-32 transition-all duration-500">
            {/* SETUP / COUNTDOWN / FLASH stage */}
            {(stage === "setup" ||
              stage === "countdown" ||
              stage === "flash") && (
              <div className="grid gap-8 lg:grid-cols-[1fr_360px] 2xl:grid-cols-[1fr_420px] items-start">
                <CameraStage webcamRef={webcamRef} layoutDef={layoutDef} />
                <CaptureSettingsPanel onStart={handleStart} />
              </div>
            )}

            {/* EDIT / SAVING stage */}
            {(stage === "edit" || stage === "saving") && (
              <div className="grid gap-8 lg:grid-cols-[1fr_320px] 2xl:grid-cols-[1fr_380px] items-start">
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

            {/* DONE stage */}
            {stage === "done" && <DoneStage />}
          </main>

          {/* Sticky Bottom Control Bar */}
          {(stage === "setup" || stage === "countdown" || stage === "flash" || stage === "edit") && (
            <StickyCaptureBar
              onStart={handleStart}
              onRetake={handleRetake}
              onDownload={handleDownload}
              onSave={handleSave}
            />
          )}

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
