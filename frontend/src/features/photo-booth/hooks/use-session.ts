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
 * This is the SINGLE SOURCE OF TRUTH during a capture run.
 * The store mirrors UI-visible state but is NOT used to decide progression.
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
 *
 * Each shot has its own countdown. Countdown is reset to selectedTimer
 * before every shot, not just the first.
 */
export function useSession({ webcamRef, validateCamera }: UseSessionOptions) {
  const sessionRef = useRef<SessionState | null>(null);

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

  // Forward refs to break the circular dependency between
  // captureOneFrame ↔ startCountdownInterval. We assign the latest
  // callbacks to these refs and read them inside the other's body.
  const startCountdownRef = useRef<() => void>(() => {});
  const captureOneRef = useRef<() => Promise<void>>(async () => {});

  // ----------------------------------------------------------------
  //  Compose and finish
  // ----------------------------------------------------------------

  const composeAndFinish = useCallback(async () => {
    const s = sessionRef.current;
    if (!s) return;

    // Stop timers but keep session state for now
    s.cancelled = true;
    if (s.intervalId) {
      clearInterval(s.intervalId);
      s.intervalId = null;
    }
    if (s.flashTimeoutId) {
      clearTimeout(s.flashTimeoutId);
      s.flashTimeoutId = null;
    }

    setPhase("processing");
    setStage("edit");
    setProcessing(true);
    setCountdown(null);
    setIsCapturing(false);

    try {
      const state = usePhotoBoothStore.getState();
      const frames = state.capturedFrames;
      const expected = s.total;

      if (frames.length !== expected) {
        console.warn(
          `[photobooth] frame count mismatch: got ${frames.length}, expected ${expected}`
        );
      }

      const result = await composePhotoBoothOutput({
        capturedFrames: frames,
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
      setProcessing(false);

      // Transition to result screen mode (not just phase)
      setPhase("result");
      usePhotoBoothStore.getState().setFlowMode("result");
    } catch (err) {
      console.error("Composition failed:", err);
      setErrorMessage("Gagal memproses hasil. Coba lagi.");
      setPhase("error");
      setStage("setup");
      setProcessing(false);
      setIsCapturing(false);
    }
  }, [
    setPhase,
    setStage,
    setProcessing,
    setComposed,
    setErrorMessage,
    setCountdown,
    setIsCapturing,
  ]);

  // ----------------------------------------------------------------
  //  Capture one frame
  // ----------------------------------------------------------------

  const captureOneFrame = useCallback(async () => {
    const s = sessionRef.current;
    if (!s || s.cancelled) return;

    // Enter capturing phase
    setPhase("capturing");
    setIsCapturing(true);
    setStage("flash");
    setCountdown(null);

    // Brief flash overlay then revert stage so the user can see UI.
    // The flash timeout is scoped to this single capture and will be
    // cleared before moving to the next countdown or compose step.
    if (s.flashTimeoutId) clearTimeout(s.flashTimeoutId);
    s.flashTimeoutId = setTimeout(() => {
      // Only set back to edit if session is still active and phase
      // is still 'capturing' (i.e. we haven't moved to next countdown
      // or processing yet).
      if (sessionRef.current && !sessionRef.current.cancelled) {
        const currentPhase = usePhotoBoothStore.getState().phase;
        if (currentPhase === "capturing") {
          setStage("edit");
        }
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

      // Bail if session was cancelled during async capture
      if (sessionRef.current?.cancelled) return;

      // Increment local counter FIRST (source of truth), then sync to store
      s.count += 1;
      addFrame(cap.dataUrl);

      // Clear the flash timeout since we're moving on
      if (s.flashTimeoutId) {
        clearTimeout(s.flashTimeoutId);
        s.flashTimeoutId = null;
      }

      // Decide next step based on local counter (not stale store)
      if (s.count >= s.total) {
        // All frames captured — compose and transition to result
        await composeAndFinish();
      } else {
        // Reset to next countdown (this is the fix — countdown runs for EVERY shot)
        startCountdownRef.current();
      }
    } catch (err) {
      console.error("Capture failed:", err);
      if (s.flashTimeoutId) {
        clearTimeout(s.flashTimeoutId);
        s.flashTimeoutId = null;
      }
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
    setCountdown,
    setIsCapturing,
    setErrorMessage,
  ]);

  // Keep ref in sync with the latest captureOneFrame (no re-render)
  useEffect(() => {
    captureOneRef.current = captureOneFrame;
  }, [captureOneFrame]);

  // ----------------------------------------------------------------
  //  Countdown per shot
  // ----------------------------------------------------------------

  const startCountdownInterval = useCallback(() => {
    const s = sessionRef.current;
    if (!s || s.cancelled) return;

    const timer = usePhotoBoothStore.getState().selectedTimer;

    // Clear any previous flash timeout so it doesn't override our stage
    if (s.flashTimeoutId) {
      clearTimeout(s.flashTimeoutId);
      s.flashTimeoutId = null;
    }
    // Clear any previous interval (defensive)
    if (s.intervalId) {
      clearInterval(s.intervalId);
      s.intervalId = null;
    }

    // Enter countdown phase
    setPhase("countdown");
    setStage("countdown");
    setIsCapturing(false);
    setCountdown(timer);

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
        // Fire and forget — captureOneFrame manages its own state
        void captureOneRef.current();
      } else {
        setCountdown(remaining);
      }
    }, 1000);
  }, [setCountdown, setIsCapturing, setPhase, setStage]);

  // Keep ref in sync with the latest startCountdownInterval
  useEffect(() => {
    startCountdownRef.current = startCountdownInterval;
  }, [startCountdownInterval]);

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

    // Clean up any leftover session state
    cleanupSession();
    clearFrames();
    setComposed(null);
    clearStickers();
    setErrorMessage(null);
    setProcessing(false);
    setCountdown(null);

    // Initialize fresh session
    sessionRef.current = {
      intervalId: null,
      flashTimeoutId: null,
      total,
      count: 0,
      cancelled: false,
    };

    setIsCapturing(true);
    // Start the FIRST countdown (this is called again after each shot)
    startCountdownInterval();
  }, [
    validateCamera,
    cleanupSession,
    clearFrames,
    setComposed,
    clearStickers,
    setErrorMessage,
    setProcessing,
    setCountdown,
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
