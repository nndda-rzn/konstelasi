"use client";

import type Webcam from "react-webcam";
import { useCamera } from "./hooks/use-camera";
import { useSession } from "./hooks/use-session";
import { useComposition } from "./hooks/use-composition";
import { usePhotoActions } from "./hooks/use-photo-actions";

/**
 * usePhotoBooth - Thin orchestrator that composes focused hooks.
 *
 * Delegates to:
 * - useCamera: hardware validation
 * - useSession: capture state machine (countdown, capture, compose)
 * - useComposition: reactive canvas recomposition on filter/sticker change
 * - usePhotoActions: save, download, retake
 */
export function usePhotoBooth(webcamRef: React.RefObject<Webcam | null>) {
  const { validateCamera } = useCamera(webcamRef);
  const { handleStart, handleRetry, cleanupSession } = useSession({
    webcamRef,
    validateCamera,
  });
  useComposition();
  const { handleDownload, handleSave, handleRetake } = usePhotoActions();

  return {
    handleStart,
    handleRetry,
    handleRetake,
    handleDownload,
    handleSave,
  };
}
