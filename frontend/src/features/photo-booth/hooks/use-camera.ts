"use client";

import { useCallback, useRef } from "react";
import type Webcam from "react-webcam";

/**
 * useCamera - Camera hardware abstraction.
 * Validates camera readiness before starting a session.
 */
export function useCamera(webcamRef: React.RefObject<Webcam | null>) {
  const validateCamera = useCallback((): {
    ok: boolean;
    reason?: string;
  } => {
    const web = webcamRef.current;
    if (!web) {
      return { ok: false, reason: "Webcam belum terpasang." };
    }
    const video = web.video as HTMLVideoElement | null | undefined;
    if (!video) {
      return { ok: false, reason: "Video belum tersedia." };
    }
    if (video.readyState < 2) {
      return { ok: false, reason: "Kamera sedang memuat." };
    }
    if (!video.videoWidth || !video.videoHeight) {
      return { ok: false, reason: "Ukuran video tidak valid." };
    }
    return { ok: true };
  }, [webcamRef]);

  return { validateCamera };
}
