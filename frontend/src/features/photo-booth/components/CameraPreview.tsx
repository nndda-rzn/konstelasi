"use client";

import { useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";
import { usePhotoBoothStore } from "../photoBoothStore";
import { PHOTO_RATIOS } from "../photoBooth.config";
import { useCameraReady } from "../hooks/useCameraReady";
import { GridGuide } from "./camera/GridGuide";
import { CameraEmptyState } from "./camera/CameraEmptyState";
import { CountdownOverlay } from "./camera/CountdownOverlay";

interface CameraPreviewProps {
  webcamRef: React.RefObject<Webcam | null>;
}

/**
 * Mirrors a Webcam ref into a video element ref via polling, so the
 * readyState hook can observe the underlying <video> element.
 */
function useWebcamVideoRef(
  webcamRef: React.RefObject<Webcam | null>
): React.RefObject<HTMLVideoElement | null> {
  const ref = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      const v = webcamRef.current?.video as HTMLVideoElement | null | undefined;
      ref.current = v ?? null;
    };
    tick();
    const id = setInterval(tick, 200);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [webcamRef]);
  return ref;
}

/**
 * CameraPreview - Hero camera stage.
 * Container follows selectedRatio aspect. Webcam fills via object-cover.
 * Output capture is also center-cropped to this same ratio (in captureFrameFromVideo).
 */
export function CameraPreview({ webcamRef }: CameraPreviewProps) {
  const stage = usePhotoBoothStore((s) => s.stage);
  const countdown = usePhotoBoothStore((s) => s.countdown);
  const facingMode = usePhotoBoothStore((s) => s.facingMode);
  const selectedRatioId = usePhotoBoothStore((s) => s.selectedRatioId);
  const isGridEnabled = usePhotoBoothStore((s) => s.isGridEnabled);

  const ratio = PHOTO_RATIOS[selectedRatioId];

  const videoElRef = useWebcamVideoRef(webcamRef);
  const { isReady: isCameraReady, permissionDenied } = useCameraReady(videoElRef);

  // Constrain webcam's requested stream to match the target ratio.
  // This is a hint; the browser will pick the closest supported mode,
  // and the capture pipeline will center-crop to the target aspect.
  const videoConstraints = {
    facingMode,
    aspectRatio: ratio.aspectRatio,
    width: { ideal: 1920 },
    height: { ideal: 1920 },
  };

  // Determine max container width based on aspect ratio so the hero
  // preview feels balanced (ultra-wide gets wider, portrait stays narrower).
  const isWide = ratio.aspectRatio >= 1.6;
  const isPortrait = ratio.aspectRatio < 1;
  const maxContainerWidth = isWide ? "min(96vw, 1100px)" : isPortrait ? "min(86vw, 560px)" : "min(90vw, 760px)";

  return (
    <div className="relative mx-auto flex w-full items-center justify-center">
      {/* Soft glow halo behind preview */}
      <div
        className="pointer-events-none absolute -inset-8"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255, 200, 210, 0.18) 0%, rgba(232, 212, 240, 0.1) 40%, transparent 70%)",
          filter: "blur(20px)",
        }}
        aria-hidden
      />

      <div
        className="relative flex w-full items-center justify-center overflow-hidden rounded-2xl transition-all duration-500 ease-in-out"
        style={{
          maxWidth: maxContainerWidth,
          aspectRatio: `${ratio.aspectRatio}`,
          minHeight: "200px",
          maxHeight: "min(70vh, 640px)",
          background: "linear-gradient(180deg, #14101A 0%, #0E0A14 100%)",
          border: "1px solid rgba(225, 210, 195, 0.4)",
          boxShadow:
            "0 1px 2px rgba(60, 30, 40, 0.05), 0 8px 28px rgba(60, 30, 40, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.04) inset",
        }}
      >
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/png"
          videoConstraints={videoConstraints}
          mirrored={facingMode === "user"}
          className="absolute inset-0 h-full w-full object-cover"
        />

        {isGridEnabled && isCameraReady && <GridGuide />}
        {isCameraReady && (
          <div className="pointer-events-none absolute inset-[5%] rounded-xl border border-white/[0.04]" />
        )}
        {isCameraReady && (
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,transparent_65%,rgba(0,0,0,0.22)_100%)]" />
        )}

        {!isCameraReady && (
          <CameraEmptyState
            permissionDenied={permissionDenied}
            onRequest={() => {
              if (typeof window !== "undefined") window.location.reload();
            }}
          />
        )}

        <CountdownOverlay
          countdown={countdown}
          show={stage === "countdown" && isCameraReady}
        />

        {/* Refined Live badge */}
        {stage === "setup" && isCameraReady && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/35 px-2.5 py-1 backdrop-blur-md"
          >
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[8.5px] font-semibold text-white uppercase tracking-[0.18em]">
              Live
            </span>
          </motion.div>
        )}

        {/* Ratio indicator badge (bottom-right, subtle) */}
        {isCameraReady && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/35 px-2 py-0.5 backdrop-blur-md">
            <span className="text-[8.5px] font-medium text-white/80 tracking-wider">
              {ratio.label}
            </span>
          </div>
        )}

        <AnimatePresence>
          {stage === "flash" && (
            <motion.div
              key="flash"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="absolute inset-0 bg-white"
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
