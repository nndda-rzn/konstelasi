"use client";

import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";
import { FILTERS, type LayoutDef } from "../constants";
import { usePhotoboothStore } from "../store/usePhotoboothStore";

interface CameraStageProps {
  webcamRef: React.RefObject<Webcam | null>;
  layoutDef: LayoutDef;
}

/**
 * CameraStage - Webcam viewfinder with countdown overlay and thumbnail strip.
 * Renders the live camera, the big countdown number, and the captured-thumbs row.
 */
export function CameraStage({ webcamRef, layoutDef }: CameraStageProps) {
  const stage = usePhotoboothStore((s) => s.stage);
  const countdown = usePhotoboothStore((s) => s.countdown);
  const capturedPhotos = usePhotoboothStore((s) => s.capturedPhotos);
  const facingMode = usePhotoboothStore((s) => s.facingMode);

  const filterCss =
    FILTERS.find((f) => f.key === usePhotoboothStore.getState().selectedFilter)
      ?.css || "";

  return (
    <div className="flex flex-col gap-6">
      {/* Webcam viewport */}
      <div
        className="relative mx-auto w-full max-w-xl overflow-hidden rounded-3xl border border-white/60 bg-black shadow-[0_24px_80px_rgba(84,45,55,0.14)]"
        style={{ aspectRatio: "1/1" }}
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
        {/* Grid overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:33.33%_33.33%]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,transparent_60%,rgba(0,0,0,0.3)_100%)]" />

        {/* Countdown overlay */}
        <AnimatePresence>
          {stage === "countdown" && countdown !== null && countdown > 0 && (
            <motion.div
              key={countdown}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <span className="text-[120px] font-black text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)] leading-none">
                {countdown}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Captured thumbs + empty placeholders */}
      {capturedPhotos.length > 0 && (
        <div className="flex justify-center gap-3">
          {capturedPhotos.map((p, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="h-14 w-[74px] overflow-hidden rounded-lg border-2 border-[#E63946]/30 shadow-md"
            >
              <img
                src={p}
                alt=""
                className="h-full w-full object-cover"
                style={{ filter: filterCss }}
              />
            </motion.div>
          ))}
          {Array.from({
            length: layoutDef.shots - capturedPhotos.length,
          }).map((_, i) => (
            <div
              key={`e${i}`}
              className="h-14 w-[74px] rounded-lg border-2 border-dashed border-[#FFB8C0]/40 bg-white/30"
            />
          ))}
        </div>
      )}
    </div>
  );
}
