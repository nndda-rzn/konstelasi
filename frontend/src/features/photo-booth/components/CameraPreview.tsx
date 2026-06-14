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
 * CameraPreview - Camera stage.
 * Container follows selectedRatio aspect. Webcam fills via object-cover.
 * Frame guides (grid, safe area) are absolute overlays, not wrappers.
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

  return (
    <div className="relative mx-auto flex w-full items-center justify-center">
      <div
        className={`relative flex w-full items-center justify-center overflow-hidden rounded-lg border border-black/10 bg-[#0f0b14] ${ratio.css} transition-all duration-500 ease-in-out`}
        style={{
          maxHeight: "min(62vh, 580px)",
          minHeight: "220px",
        }}
      >
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/png"
          videoConstraints={{
            facingMode,
            aspectRatio: 1,
            width: 1920,
            height: 1920,
          }}
          mirrored={facingMode === "user"}
          className="absolute inset-0 h-full w-full object-cover"
        />

        {isGridEnabled && isCameraReady && <GridGuide />}
        {isCameraReady && (
          <div className="pointer-events-none absolute inset-[6%] rounded-lg border border-white/[0.05]" />
        )}
        {isCameraReady && (
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,transparent_65%,rgba(0,0,0,0.18)_100%)]" />
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

        {stage === "setup" && isCameraReady && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 backdrop-blur-md">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] font-bold text-white uppercase tracking-wider">
              Live
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
