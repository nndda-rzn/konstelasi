"use client";

import { useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, ShieldAlert } from "lucide-react";
import { usePhotoBoothStore } from "../photoBoothStore";
import { PHOTO_RATIOS } from "../photoBooth.config";
import { useCameraReady } from "../hooks/useCameraReady";

interface CameraPreviewProps {
  webcamRef: React.RefObject<Webcam | null>;
}

function GridGuide() {
  return (
    <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="border-[0.5px] border-white/[0.035]" />
      ))}
    </div>
  );
}

function CameraEmptyState({
  permissionDenied,
  onRequest,
}: {
  permissionDenied: boolean;
  onRequest: () => void;
}) {
  if (permissionDenied) {
    return (
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2.5 bg-[#0f0b14] p-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-white/5 text-white/60">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div className="max-w-xs">
          <h3 className="text-[13px] font-semibold text-white">
            Akses kamera ditolak
          </h3>
          <p className="mt-1 text-[11px] leading-relaxed text-white/55">
            Izinkan akses kamera di pengaturan browser untuk mulai sesi foto.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2.5 bg-[#0f0b14] p-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-white/5 text-white/45">
        <Camera className="h-5 w-5" />
      </div>
      <div className="max-w-xs">
        <h3 className="text-[13px] font-semibold text-white">
          Pratinjau kamera akan tampil di sini
        </h3>
        <p className="mt-1 text-[11px] leading-relaxed text-white/55">
          Izinkan akses kamera untuk mulai sesi foto.
        </p>
      </div>
      <button
        onClick={onRequest}
        className="mt-1 rounded-md border border-white/15 bg-white/8 px-3.5 py-1.5 text-[11px] font-semibold text-white/85 transition-colors hover:bg-white/14 hover:text-white"
      >
        Aktifkan Kamera
      </button>
    </div>
  );
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

        <AnimatePresence>
          {stage === "countdown" &&
            countdown !== null &&
            countdown > 0 &&
            isCameraReady && (
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
