"use client";

import { useEffect, useState } from "react";

/**
 * useCameraReady - Tracks whether the Webcam has an active video stream.
 */
export function useCameraReady(
  videoRef: React.RefObject<HTMLVideoElement | null>
) {
  const [isReady, setIsReady] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let handle: ReturnType<typeof setInterval> | null = null;

    const check = () => {
      if (cancelled) return;
      const v = videoRef.current;
      if (v && v.readyState >= 2 && v.videoWidth > 0) {
        setIsReady(true);
        if (handle) {
          clearInterval(handle);
          handle = null;
        }
      }
    };

    if (
      typeof navigator !== "undefined" &&
      navigator.permissions &&
      navigator.permissions.query
    ) {
      navigator.permissions
        .query({ name: "camera" as PermissionName })
        .then((status) => {
          status.onchange = () => {
            if (status.state === "denied") setPermissionDenied(true);
            if (status.state === "granted") {
              setPermissionDenied(false);
              handle = setInterval(check, 250);
            }
          };
        })
        .catch(() => {
          /* permissions API not supported */
        });
    }

    handle = setInterval(check, 250);
    const timeout = setTimeout(() => {
      if (handle) {
        clearInterval(handle);
        handle = null;
      }
      if (!isReady) setPermissionDenied(true);
    }, 15000);

    return () => {
      cancelled = true;
      if (handle) clearInterval(handle);
      clearTimeout(timeout);
    };
  }, [videoRef, isReady]);

  return { isReady, permissionDenied };
}
