"use client";

import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";
import { Camera } from "lucide-react";
import { usePhotoboothStore } from "../store/usePhotoboothStore";
import { ZOOM_LEVELS, RATIOS } from "../constants";

interface CameraPreviewProps {
  webcamRef: React.RefObject<Webcam | null>;
  isCapturing: boolean;
}

function GridGuide({ ratioKey }: { ratioKey: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="border-[0.5px] border-white/5" />
      ))}
    </div>
  );
}

/**
 * CameraPreview - The viewfinder with ratio-awareness, FOV scaling, 
 * grid overlay, safe area guide, and empty state.
 */
export function CameraPreview({ webcamRef, isCapturing }: CameraPreviewProps) {
  const stage = usePhotoboothStore((s) => s.stage);
  const countdown = usePhotoboothStore((s) => s.countdown);
  const facingMode = usePhotoboothStore((s) => s.facingMode);
  const zoomLevelKey = usePhotoboothStore((s) => s.zoomLevel);
  const ratioKey = usePhotoboothStore((s) => s.selectedRatio);
  const isGridEnabled = usePhotoboothStore((s) => s.isGridEnabled);
  const selectedEffect = usePhotoboothStore((s) => s.selectedEffect);

  const zoom = ZOOM_LEVELS.find((z) => z.key === zoomLevelKey) || ZOOM_LEVELS[0];
  const ratio = RATIOS.find((r) => r.key === ratioKey) || RATIOS[0];

  const isBeautyOn = selectedEffect !== "off";
  const isWarmOn = selectedEffect === "warm";

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      {/* Ambient glow behind camera */}
      <div className="absolute -inset-4 rounded-[40px] bg-[#FFB8C0]/15 blur-2xl pointer-events-none" />

      <div 
        className={`relative overflow-hidden rounded-3xl border border-white/60 bg-black shadow-[0_24px_80px_rgba(84,45,55,0.14)] ${ratio.css} transition-all duration-500 ease-in-out`}
      >
        {/* Webcam Viewport with Scale */}
        <div 
          className="absolute inset-0 transition-transform duration-500 ease-in-out"
          style={{ 
            transform: `scale(${zoom.scale})`,
            transformOrigin: "center center"
          }}
        >
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/png"
            videoConstraints={{
              facingMode,
              aspectRatio: 1, // Capture square, CSS handles the crop
              width: 1920,
              height: 1920,
            }}
            mirrored={facingMode === "user"}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Beauty/Warm Filter Overlay (CSS) */}
        {isBeautyOn && (
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backdropFilter: isWarmOn
                ? 'saturate(140%) hue-rotate(10deg) brightness(1.05)'
                : 'blur(0.4px) saturate(1.1) brightness(1.04) contrast(0.98)',
            }}
          />
        )}

        {/* Grid Overlay */}
        {isGridEnabled && <GridGuide ratioKey={ratioKey} />}

        {/* Safe Area Guide */}
        <div className="pointer-events-none absolute inset-[8%] rounded-2xl border border-white/10" />

        {/* Vignette Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,transparent_60%,rgba(0,0,0,0.3)_100%)]" />

        {/* Countdown Overlay */}
        <AnimatePresence>
          {stage === "countdown" && countdown !== null && countdown > 0 && (
            <motion.div
              key={countdown}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0 flex items-center justify-center z-10"
            >
              <span className="text-[120px] font-black text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)] leading-none select-none">
                {countdown}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Camera Stage Label */}
        {stage === "setup" && !isCapturing && (
          <div className="absolute top-6 left-6 flex items-center gap-2 rounded-full bg-black/30 backdrop-blur-md px-3 py-1.5 border border-white/10">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">Live Preview</span>
          </div>
        )}
      </div>
    </div>
  );
}
