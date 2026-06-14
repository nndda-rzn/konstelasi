"use client";

import { useCallback, useEffect, useRef } from "react";
import type Webcam from "react-webcam";
import { notify } from "@/lib/toast";
import { usePhotoBoothStore } from "../photoBoothStore";
import { PHOTO_RATIOS, PHOTO_LAYOUTS } from "../photoBooth.config";
import { captureFrameFromVideo } from "../utils/captureFrameFromVideo";
import { composePhotoBoothOutput } from "../services/canvas/compose";
import { exportCanvasAsBlob } from "../utils/exportCanvas";
import type { ComposeResult } from "../photoBooth.types";

/**
 * Local session state for an in-progress capture run.
 */
interface SessionState {
  intervalId: ReturnType<typeof setInterval> | null;
  flashTimeoutId: ReturnType<typeof setTimeout> | null;
  total: number;
  count: number;
  cancelled: boolean;
}

interface UseSessionOptions {
  webcamRef: React.RefObject<Webcam | null>;
  validateCamera: () => { ok: boolean; reason?: string };
}

/**
 * useSession - Capture session state machine.
 *
 * idle → countdown → capturing → [countdown ↔ capturing] → processing → result
 *                  ↘ error (on failure)
 */
export function useSession({ webcamRef, validateCamera }: UseSessionOptions) {
  const sessionRef = useRef<SessionState | null>(null);

  // Store selectors
  const setPhase = usePhotoBoothStore((s) => s.setPhase);
  const setStage = usePhotoBoothStore((s) => s.setStage);
  const setErrorMessage = usePhotoBoothStore((s) => s.setErrorMessage);
  const setCountdown = usePhotoBoothStore((s) => s.setCountdown);
  const setIsCapturing = usePhotoBoothStore((s) => s.setIsCapturing);
  const addFrame = usePhotoBoothStore((s) => s.addFrame);
  const clearFrames = usePhotoBoothStore((s) => s.clearFrames);
  const clearStickers = usePhotoBoothStore((s) => s.clearStickers);
  const setComposed = usePhotoBoothStore((s) => s.setComposed);
  const setProcessing = usePhotoBoothStore((s) => s.setProcessing);
  const setCaption = usePhotoBoothStore((s) => s.setCaption);

  // ----------------------------------------------------------------
  //  Cleanup
  // ----------------------------------------------------------------

  const cleanupSession = useCallback(() => {
    const s = sessionRef.current;
    if (!s) return;
    s.cancelled = true;
    if (s.intervalId) {
      clearInterval(s.intervalId);
      s.intervalId = null;
    }
    if (s.flashTimeoutId) {
      clearTimeout(s.flashTimeoutId);
      s.flashTimeoutId = null;
    }
    setCountdown(null);
    setIsCapturing(false);
  }, [setCountdown, setIsCapturing]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const s = sessionRef.current;
      if (s) {
        s.cancelled = true;
        if (s.intervalId) clearInterval(s.intervalId);
        if (s.flashTimeoutId) clearTimeout(s.flashTimeoutId);
      }
    };
  }, []);

  // ----------------------------------------------------------------
  //  State machine: countdown → capturing → (loop) → processing → result
  // ----------------------------------------------------------------

  const composeAndFinish = useCallback(async () => {
    const s = sessionRef.current;
    if (!s) return;
    cleanupSession();
    setPhase("processing");
    setStage("edit");
    setProcessing(true);
    try {
      const allFrames = usePhotoBoothStore.getState().capturedFrames;
      const state = usePhotoBoothStore.getState();
      const result = await composePhotoBoothOutput({
        capturedFrames: allFrames,
        selectedRatio: PHOTO_RATIOS[state.selectedRatioId],
        selectedLayout: PHOTO_LAYOUTS[state.selectedLayoutId],
        selectedQuality: state.selectedQuality,
        selectedTheme: state.selectedTheme,
        selectedBackground: state.selectedBackground,
        selectedFilter: state.selectedFilter,
        selectedEffect: state.selectedEffect,
        caption: state.caption,
        stickers: state.stickers,
      });
      const blob = await exportCanvasAsBlob(result.canvas, true);
      const final: ComposeResult = { ...result, blob };
      setComposed(final);
      setPhase("result");
      setProcessing(false);
    } catch (err) {
      console.error("Composition failed:", err);
      setErrorMessage("Gagal memproses hasil. Coba lagi.");
      setPhase("error");
      setStage("setup");
      setProcessing(false);
      setIsCapturing(false);
    }
  }, [
    cleanupSession,
    setPhase,
    setStage,
    setProcessing,
    setComposed,
    setErrorMessage,
    setIsCapturing,
  ]);

  const captureOneFrame = useCallback(async () => {
    const s = sessionRef.current;
    if (!s || s.cancelled) return;

    setPhase("capturing");
    setIsCapturing(true);
    setStage("flash");

    // Brief flash overlay then revert stage so the user can see UI
    if (s.flashTimeoutId) clearTimeout(s.flashTimeoutId);
    s.flashTimeoutId = setTimeout(() => {
      if (!sessionRef.current?.cancelled) {
        setStage("edit");
      }
    }, 220);

    try {
      const web = webcamRef.current;
      const video = web?.video as HTMLVideoElement | null | undefined;
      if (!video || video.readyState < 2 || !video.videoWidth) {
        throw new Error("Kamera belum siap");
      }

      const state = usePhotoBoothStore.getState();
      const cap = await captureFrameFromVideo(
        video,
        PHOTO_RATIOS[state.selectedRatioId],
        state.selectedQuality
      );

      if (sessionRef.current?.cancelled) return;

      s.count += 1;
      addFrame(cap.dataUrl);

      if (s.count >= s.total) {
        await composeAndFinish();
      } else {
        startCountdownInterval();
      }
    } catch (err) {
      console.error("Capture failed:", err);
      cleanupSession();
      const msg =
        err instanceof Error ? err.message : "Gagal mengambil foto.";
      setErrorMessage(msg);
      setPhase("error");
      setStage("setup");
      setIsCapturing(false);
    }
  }, [
    webcamRef,
    addFrame,
    composeAndFinish,
    cleanupSession,
    setPhase,
    setStage,
    setIsCapturing,
    setErrorMessage,
  ]);

  const startCountdownInterval = useCallback(() => {
    const s = sessionRef.current;
    if (!s || s.cancelled) return;

    const timer = usePhotoBoothStore.getState().selectedTimer;
    setPhase("countdown");
    setStage("countdown");
    setIsCapturing(false);
    setCountdown(timer);

    if (s.intervalId) {
      clearInterval(s.intervalId);
      s.intervalId = null;
    }

    let remaining = timer;
    s.intervalId = setInterval(() => {
      const current = sessionRef.current;
      if (!current || current.cancelled) {
        if (current?.intervalId) {
          clearInterval(current.intervalId);
          current.intervalId = null;
        }
        return;
      }

      remaining -= 1;
      if (remaining <= 0) {
        if (current.intervalId) {
          clearInterval(current.intervalId);
          current.intervalId = null;
        }
        setCountdown(0);
        void captureOneFrame();
      } else {
        setCountdown(remaining);
      }
    }, 1000);
  }, [captureOneFrame, setCountdown, setIsCapturing, setPhase, setStage]);

  // ----------------------------------------------------------------
  //  Public methods
  // ----------------------------------------------------------------

  const handleStart = useCallback(() => {
    const currentPhase = usePhotoBoothStore.getState().phase;

    if (
      currentPhase === "countdown" ||
      currentPhase === "capturing" ||
      currentPhase === "processing"
    ) {
      console.warn("[photobooth] session already active:", currentPhase);
      return;
    }

    const check = validateCamera();
    if (!check.ok) {
      notify.error(check.reason || "Kamera belum siap, coba lagi sebentar.");
      return;
    }

    const layoutId = usePhotoBoothStore.getState().selectedLayoutId;
    const total = PHOTO_LAYOUTS[layoutId].requiredShots;

    cleanupSession();
    clearFrames();
    setComposed(null);
    clearStickers();
    setErrorMessage(null);

    sessionRef.current = {
      intervalId: null,
      flashTimeoutId: null,
      total,
      count: 0,
      cancelled: false,
    };

    setIsCapturing(true);
    startCountdownInterval();
  }, [
    validateCamera,
    cleanupSession,
    clearFrames,
    setComposed,
    clearStickers,
    setErrorMessage,
    setIsCapturing,
    startCountdownInterval,
  ]);

  const handleRetry = useCallback(() => {
    cleanupSession();
    handleStart();
  }, [handleStart, cleanupSession]);

  // Auto-cancel on stage change to setup/landing
  useEffect(() => {
    const stage = usePhotoBoothStore.getState().stage;
    if (stage === "setup" || stage === "landing") {
      if (sessionRef.current) {
        cleanupSession();
        setPhase("idle");
        setErrorMessage(null);
      }
    }
  }, [cleanupSession, setPhase, setErrorMessage]);

  return {
    handleStart,
    handleRetry,
    cleanupSession,
  };
}
