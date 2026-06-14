"use client";

import { useEffect, useState } from "react";
import type Webcam from "react-webcam";
import { usePhotoboothStore } from "../store/usePhotoboothStore";

/**
 * useCameraReady - Tracks whether the Webcam has an active video stream.
 * Uses a poll loop on the webcam's <video> element readyState because
 * react-webcam does not expose a reliable onUserMedia callback in v4.
 * Sets isCameraReady in the global store so CameraPreview can swap to
 * the live view or the empty state accordingly.
 */
export function useCameraReady(webcamRef: React.RefObject<Webcam | null>) {
  const setCameraReady = usePhotoboothStore((s) => s.setCameraReady);
  const isCameraReady = usePhotoboothStore((s) => s.isCameraReady);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let pollHandle: ReturnType<typeof setInterval> | null = null;

    const check = () => {
      if (cancelled) return;
      const video = webcamRef.current?.video as HTMLVideoElement | null | undefined;
      if (video && video.readyState >= 2 && video.videoWidth > 0) {
        setCameraReady(true);
        if (pollHandle) {
          clearInterval(pollHandle);
          pollHandle = null;
        }
      }
    };

    // Watch for permission errors via the mediaDevices API
    if (typeof navigator !== "undefined" && navigator.permissions) {
      navigator.permissions
        .query({ name: "camera" as PermissionName })
        .then((status) => {
          if (status.state === "denied" || status.state === "prompt") {
            // ignore prompt; only mark denied when explicitly denied
          }
          status.onchange = () => {
            if (status.state === "denied") setPermissionDenied(true);
            if (status.state === "granted") {
              setPermissionDenied(false);
              pollHandle = setInterval(check, 250);
            }
          };
        })
        .catch(() => {
          // permissions API not supported; fall back to polling
        });
    }

    pollHandle = setInterval(check, 250);

    // Stop polling after 15s — assume permission denied or no camera
    const timeout = setTimeout(() => {
      if (pollHandle) {
        clearInterval(pollHandle);
        pollHandle = null;
      }
      if (!isCameraReady) setPermissionDenied(true);
    }, 15000);

    return () => {
      cancelled = true;
      if (pollHandle) clearInterval(pollHandle);
      clearTimeout(timeout);
    };
  }, [webcamRef, setCameraReady, isCameraReady]);

  return { isCameraReady, permissionDenied };
}
