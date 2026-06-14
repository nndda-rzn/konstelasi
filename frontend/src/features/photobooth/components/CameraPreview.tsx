"use client";

import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";
import { Camera } from "lucide-react";
import { usePhotoboothStore } from "../store/usePhotoboothStore";
import { ZOOM_LEVELS, RATIOS } from "../constants";
import { useCameraReady } from "../hooks/useCameraReady";
import { CameraEmptyState } from "./CameraEmptyState";

interface CameraPreviewProps {
  webcamRef: React.RefObject<Webcam | null>;
  isCapturing: boolean;
}

function GridGuide() {
  return (
    <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-40">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="border-[0.5px] border-white/[0.04]" />
      ))}
    </div>
  );
}

/**
 * CameraPreview - Studio viewfinder.
 * Ratio-aware, FOV-scaled, with empty state pre-permission and slim overlays.
 * Height capped at calc(100vh - 280px) so the bar+header always fit.
 */
export function CameraPreview({ webcamRef, isCapturing }: CameraPreviewProps) {
  const stage = usePhotoboothStore((s) => s.stage);
  const countdown = usePhotoboothStore((s) => s.countdown);
  const facingMode = usePhotoboothStore((s) => s.facingMode);
  const zoomLevelKey = usePhotoboothStore((s) => s.zoomLevel);
  const ratioKey = usePhotoboothStore((s) => s.selectedRatio);
  const isGridEnabled = usePhotoboothStore((s) => s.isGridEnabled);
  const selectedEffect = usePhotoboothStore((s) => s.selectedEffect);

  const { isCameraReady, permissionDenied } = useCameraReady(webcamRef);
  const setCameraReady = usePhotoboothStore((s) => s.setCameraReady);

  const zoom = ZOOM_LEVELS.find((z) => z.key === zoomLevelKey) || ZOOM_LEVELS[0];
  const ratio = RATIOS.find((r) => r.key === ratioKey) || RATIOS[0];

  const isBeautyOn = selectedEffect !== "off";
  const isWarmOn = selectedEffect === "warm";

  const requestPermission = () => {
    // Bounce the Webcam by toggling stage to force re-mount with permission prompt
    setCameraReady(false);
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <div className="relative mx-auto w-full">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -inset-4 rounded-[40px] bg-[#FFB8C0]/15 blur-2xl" />

      <div
        className={`relative overflow-hidden rounded-3xl border border-white/10 bg-[#1a1625] shadow-[0_20px_60px_rgba(84,45,55,0.18)] ${ratio.css} transition-all duration-500 ease-in-out`}
        style={{
          maxHeight: "calc(100vh - 280px)",
          minHeight: "220px",
        }}
      >
        {/* Webcam Viewport with Scale (only when ready) */}
        <div
          className="absolute inset-0 transition-transform duration-500 ease-in-out"
          style={{
            transform: `scale(${zoom.scale})`,
            transformOrigin: "center center",
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
            className="h-full w-full object-cover"
          />
        </div>

        {/* Beauty / Warm Filter Overlay */}
        {isBeautyOn && isCameraReady && (
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backdropFilter: isWarmOn
                ? "saturate(140%) hue-rotate(10deg) brightness(1.05)"
                : "blur(0.4px) saturate(1.1) brightness(1.04) contrast(0.98)",
            }}
          />
        )}

        {/* Grid Overlay */}
        {isGridEnabled && isCameraReady && <GridGuide />}

        {/* Safe Area Guide */}
        {isCameraReady && (
          <div className="pointer-events-none absolute inset-[8%] rounded-2xl border border-white/[0.06]" />
        )}

        {/* Vignette */}
        {isCameraReady && (
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,transparent_60%,rgba(0,0,0,0.3)_100%)]" />
        )}

        {/* Empty State (pre-permission / denied) */}
        {!isCameraReady && (
          <CameraEmptyState
            permissionDenied={permissionDenied}
            onRequestPermission={requestPermission}
          />
        )}

        {/* Countdown Overlay */}
        <AnimatePresence>
          {stage === "countdown" && countdown !== null && countdown > 0 && isCameraReady && (
            <motion.div
              key={countdown}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0 z-10 flex items-center justify-center"
            >
              <span className="text-[120px] font-black text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)] leading-none select-none">
                {countdown}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live label */}
        {stage === "setup" && !isCapturing && isCameraReady && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 backdrop-blur-md border border-white/10">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] font-bold text-white uppercase tracking-wider">
              Live
            </span>
          </div>
        )}

        {/* Camera off icon overlay when permission denied */}
        {permissionDenied && (
          <div className="pointer-events-none absolute top-3 right-3 rounded-full bg-black/40 px-2 py-1 backdrop-blur-md">
            <Camera className="h-3 w-3 text-white/50" />
          </div>
        )}
      </div>
    </div>
  );
}
