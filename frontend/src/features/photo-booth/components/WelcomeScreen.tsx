"use client";

import { Camera, LayoutGrid } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePhotoBoothStore } from "../photoBoothStore";
import { PhotoStripSample } from "./PhotoStripSample";

/**
 * WelcomeScreen - First screen of the photobooth flow.
 * Title + subtitle + sample strip + 2 entry buttons.
 */
export function WelcomeScreen() {
  const router = useRouter();
  const setFlowMode = usePhotoBoothStore((s) => s.setFlowMode);
  const setSessionStep = usePhotoBoothStore((s) => s.setSessionStep);
  const setStage = usePhotoBoothStore((s) => s.setStage);

  const handleStart = () => {
    // Skip layout/format steps: jump straight to camera with defaults.
    setFlowMode("session");
    setSessionStep("camera");
    setStage("setup");
  };

  const handlePickLayout = () => {
    setFlowMode("session");
    setSessionStep("choose-layout");
  };

  return (
    <div className="relative flex min-h-[calc(100vh-160px)] items-center justify-center overflow-hidden bg-[#FFF5F7] px-4">
      {/* Soft ambient orbs */}
      <div className="pointer-events-none absolute top-1/3 left-1/4 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFB8C0]/30 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-[360px] w-[360px] translate-x-1/2 rounded-full bg-[#FFE5E8]/40 blur-[100px]" />

      <div className="relative z-10 mx-auto grid w-full max-w-3xl items-center gap-8 sm:gap-10 md:grid-cols-[auto_1fr]">
        <div className="flex justify-center md:justify-end">
          <PhotoStripSample />
        </div>

        <div className="text-center md:text-left">
          <p className="mb-2 inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.3em] text-[#8C7783] uppercase">
            <span className="inline-block h-1 w-1 rounded-full bg-[#E63946]" />
            Constella
          </p>
          <h1 className="text-3xl font-light tracking-tight text-[#3F2A35] sm:text-4xl">
            Photo Booth
          </h1>
          <p className="mt-3 max-w-md text-[14px] leading-relaxed text-[#6D5561] sm:text-[15px]">
            Simpan momen kecil sebelum ia berubah menjadi kenangan besar.
          </p>

          <div className="mt-7 flex flex-col items-stretch gap-2.5 sm:flex-row sm:items-center md:justify-start">
            <button
              onClick={handleStart}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E63946] px-6 py-3 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(230,57,70,0.22)] transition-colors hover:bg-[#D62828] active:scale-[0.98]"
            >
              <Camera className="h-4 w-4" />
              Mulai
            </button>
            <button
              onClick={handlePickLayout}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-6 py-3 text-sm font-semibold text-[#3F2A35] transition-colors hover:border-black/20 hover:bg-[#FAFAFA]"
            >
              <LayoutGrid className="h-4 w-4" />
              Pilih Layout
            </button>
            <button
              onClick={() => router.push("/canvas")}
              className="text-[12px] text-[#8C7783] transition-colors hover:text-[#3F2A35] md:ml-2"
            >
              atau kembali ke kanvas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
