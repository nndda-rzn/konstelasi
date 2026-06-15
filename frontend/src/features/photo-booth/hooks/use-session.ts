"use client";

import { useCallback, useEffect, useReducer, useRef } from "react";
import type Webcam from "react-webcam";
import { notify } from "@/lib/toast";
import { usePhotoBoothStore } from "../photoBoothStore";
import { PHOTO_LAYOUTS, PHOTO_RATIOS } from "../photoBooth.config";
import { composePhotoBoothOutput } from "../services/canvas/compose";
import { exportCanvasAsBlob } from "../utils/exportCanvas";
import {
  captureReducer,
  initialCaptureState,
  isActiveCapture,
} from "../reducers/capture.reducer";
import { useCountdownTimer } from "./use-countdown-timer";
import { useCaptureFrame } from "./use-capture-frame";

interface UseSessionOptions {
  webcamRef: React.RefObject<Webcam | null>;
  validateCamera: () => { ok: boolean; reason?: string };
}

export function useSession({ webcamRef, validateCamera }: UseSessionOptions) {
  const [state, dispatch] = useReducer(captureReducer, initialCaptureState);
  const { intervalRef, flashRef, clearAllTimers } = useCountdownTimer();
  const captureFrame = useCaptureFrame(webcamRef);
  const countdownValueRef = useRef<number | null>(null);

  useEffect(() => {
    countdownValueRef.current = state.countdown;
  }, [state.countdown]);

  // === Compose all frames into final result ===
  const composeAndFinish = useCallback(async () => {
    clearAllTimers();
    dispatch({ type: "COMPOSE_START" });

    const photoState = usePhotoBoothStore.getState();
    photoState.setStage("edit");
    photoState.setProcessing(true);
    photoState.setCountdown(null);
    photoState.setIsCapturing(false);

    try {
      const result = await composePhotoBoothOutput({
        capturedFrames: photoState.capturedFrames,
        selectedRatio: PHOTO_RATIOS[photoState.selectedRatioId],
        selectedLayout: PHOTO_LAYOUTS[photoState.selectedLayoutId],
        selectedQuality: photoState.selectedQuality,
        selectedTheme: photoState.selectedTheme,
        selectedBackground: photoState.selectedBackground,
        selectedFilter: photoState.selectedFilter,
        selectedEffect: photoState.selectedEffect,
        caption: photoState.caption,
        stickers: photoState.stickers,
      });
      const blob = await exportCanvasAsBlob(result.canvas, true);
      usePhotoBoothStore.getState().setComposed({ ...result, blob });
      usePhotoBoothStore.getState().setProcessing(false);
      dispatch({ type: "COMPOSE_DONE" });
      usePhotoBoothStore.getState().setFlowMode("result");
    } catch (err) {
      console.error("Composition failed:", err);
      const msg = "Gagal memproses hasil. Coba lagi.";
      usePhotoBoothStore.getState().setErrorMessage(msg);
      usePhotoBoothStore.getState().setStage("setup");
      usePhotoBoothStore.getState().setProcessing(false);
      usePhotoBoothStore.getState().setIsCapturing(false);
      dispatch({ type: "COMPOSE_ERROR", message: msg });
    }
  }, [clearAllTimers]);

  // === Capture single frame with flash overlay ===
  const captureOneFrame = useCallback(async () => {
    if (state.phase !== "capturing") return;
    const photoState = usePhotoBoothStore.getState();
    photoState.setIsCapturing(true);
    photoState.setStage("flash");
    photoState.setCountdown(null);

    if (flashRef.current) clearTimeout(flashRef.current);
    flashRef.current = setTimeout(() => {
      if (usePhotoBoothStore.getState().phase === "capturing") {
        usePhotoBoothStore.getState().setStage("edit");
      }
    }, 220);

    try {
      await captureFrame();
      if (flashRef.current) {
        clearTimeout(flashRef.current);
        flashRef.current = null;
      }
      dispatch({ type: "CAPTURE_DONE" });
    } catch (err) {
      console.error("Capture failed:", err);
      if (flashRef.current) {
        clearTimeout(flashRef.current);
        flashRef.current = null;
      }
      clearAllTimers();
      const msg = err instanceof Error ? err.message : "Gagal mengambil foto.";
      usePhotoBoothStore.getState().setErrorMessage(msg);
      usePhotoBoothStore.getState().setStage("setup");
      usePhotoBoothStore.getState().setIsCapturing(false);
      dispatch({ type: "CAPTURE_ERROR", message: msg });
    }
  }, [state.phase, captureFrame, flashRef, clearAllTimers]);

  // === React to phase changes ===
  useEffect(() => {
    if (state.phase === "capturing") {
      void captureOneFrame();
    } else if (
      state.phase === "processing" &&
      state.count >= state.total &&
      state.total > 0
    ) {
      void composeAndFinish();
    }
  }, [state.phase, state.count, state.total, captureOneFrame, composeAndFinish]);

  // === Countdown interval ===
  useEffect(() => {
    if (state.phase !== "countdown" || state.countdown === null) return;
    if (state.countdown <= 0) {
      dispatch({ type: "COUNTDOWN_DONE" });
      return;
    }

    const id = setInterval(() => {
      const current = countdownValueRef.current ?? 0;
      const next = current - 1;
      countdownValueRef.current = next;
      dispatch({ type: "TICK", remaining: next });
    }, 1000);
    intervalRef.current = id;

    return () => {
      clearInterval(id);
      if (intervalRef.current === id) intervalRef.current = null;
    };
  }, [state.phase, state.countdown, intervalRef]);

  // === Public: start session ===
  const handleStart = useCallback(() => {
    if (isActiveCapture(state.phase)) {
      console.warn("[photobooth] session already active:", state.phase);
      return;
    }

    const check = validateCamera();
    if (!check.ok) {
      notify.error(check.reason || "Kamera belum siap, coba lagi sebentar.");
      return;
    }

    const photoState = usePhotoBoothStore.getState();
    const layoutId = photoState.selectedLayoutId;
    const total = PHOTO_LAYOUTS[layoutId].requiredShots;
    const timer = photoState.selectedTimer;

    clearAllTimers();
    photoState.clearFrames();
    photoState.setComposed(null);
    photoState.clearStickers();
    photoState.setErrorMessage(null);
    photoState.setProcessing(false);
    photoState.setCountdown(null);
    photoState.setIsCapturing(true);

    dispatch({ type: "START", total, timer });
  }, [state.phase, validateCamera, clearAllTimers]);

  // === Public: retry from error state ===
  const handleRetry = useCallback(() => {
    clearAllTimers();
    dispatch({ type: "RETRY" });
  }, [clearAllTimers]);

  // === Public: cancel session ===
  const cleanupSession = useCallback(() => {
    clearAllTimers();
    dispatch({ type: "CANCEL" });
    usePhotoBoothStore.getState().setCountdown(null);
    usePhotoBoothStore.getState().setIsCapturing(false);
  }, [clearAllTimers]);

  // === Auto-cancel on stage change to setup/landing ===
  useEffect(() => {
    const stage = usePhotoBoothStore.getState().stage;
    if (stage === "setup" || stage === "landing") {
      if (state.phase !== "idle") {
        cleanupSession();
      }
    }
  }, [state.phase, cleanupSession]);

  return {
    handleStart,
    handleRetry,
    cleanupSession,
  };
}
