"use client";

import { useCallback, useEffect, useRef } from "react";
import type Webcam from "react-webcam";
import { useMutation } from "@apollo/client/react";
import { notify } from "@/lib/toast";
import { createClient } from "@/lib/supabase/client";
import { CREATE_NOTE, ADD_NOTE_IMAGE } from "@/graphql/mutations";
import {
  usePhotoBoothStore,
  selectPhotoRatio,
  selectPhotoLayout,
  type CapturePhase,
} from "./photoBoothStore";
import { PHOTO_LAYOUTS } from "./photoBooth.config";
import { captureFrameFromVideo } from "./utils/captureFrameFromVideo";
import { composePhotoBoothOutput } from "./utils/composePhotoBoothOutput";
import { exportCanvasAsBlob } from "./utils/exportCanvas";
import { resizeDataUrl } from "./utils/resizeImage";
import { buildOutputFilename, uid } from "./photoBooth.utils";
import type { ComposeResult, GalleryMetadata } from "./photoBooth.types";

/**
 * Local session state for an in-progress capture run.
 * We track frames count locally so we never rely on the store's
 * capturedFrames (which can be stale during a re-render or React
 * Strict Mode double-mount).
 */
interface SessionState {
  intervalId: ReturnType<typeof setInterval> | null;
  flashTimeoutId: ReturnType<typeof setTimeout> | null;
  total: number;
  count: number;
  cancelled: boolean;
}

/**
 * usePhotoBooth - Capture session state machine.
 *
 * idle → countdown → capturing → [countdown ↔ capturing] → processing → result
 *                  ↘ error (on failure)
 *
 * Single source of truth for the run is the sessionRef in this hook.
 * The store mirrors UI-visible state (phase, countdown, isCapturing,
 * processing, capturedFrames) but is NOT used to decide progression.
 *
 * All timers (countdown interval, flash overlay timeout) are tracked
 * in sessionRef and cleared on:
 *   - component unmount (useEffect cleanup)
 *   - session completion (cleanupSession)
 *   - error or retake
 *   - stage change to landing/setup
 */
export function usePhotoBooth(webcamRef: React.RefObject<Webcam | null>) {
  const [createNote] = useMutation<{ createNote: { id: string } }>(CREATE_NOTE);
  const [addNoteImage] = useMutation<{ addNoteImage: { id: string } }>(
    ADD_NOTE_IMAGE
  );

  // Store subscriptions
  const stage = usePhotoBoothStore((s) => s.stage);
  const setStage = usePhotoBoothStore((s) => s.setStage);
  const phase = usePhotoBoothStore((s) => s.phase);
  const setPhase = usePhotoBoothStore((s) => s.setPhase);
  const errorMessage = usePhotoBoothStore((s) => s.errorMessage);
  const setErrorMessage = usePhotoBoothStore((s) => s.setErrorMessage);
  const selectedRatioId = usePhotoBoothStore((s) => s.selectedRatioId);
  const selectedLayoutId = usePhotoBoothStore((s) => s.selectedLayoutId);
  const selectedTimer = usePhotoBoothStore((s) => s.selectedTimer);
  const setCountdown = usePhotoBoothStore((s) => s.setCountdown);
  const setIsCapturing = usePhotoBoothStore((s) => s.setIsCapturing);
  const addFrame = usePhotoBoothStore((s) => s.addFrame);
  const clearFrames = usePhotoBoothStore((s) => s.clearFrames);
  const clearStickers = usePhotoBoothStore((s) => s.clearStickers);
  const setCaption = usePhotoBoothStore((s) => s.setCaption);
  const setProcessing = usePhotoBoothStore((s) => s.setProcessing);
  const setComposed = usePhotoBoothStore((s) => s.setComposed);
  const setAuthPromptOpen = usePhotoBoothStore((s) => s.setAuthPromptOpen);
  const addGalleryItem = usePhotoBoothStore((s) => s.addGalleryItem);

  const selectedQuality = usePhotoBoothStore((s) => s.selectedQuality);
  const selectedTheme = usePhotoBoothStore((s) => s.selectedTheme);
  const selectedBackground = usePhotoBoothStore((s) => s.selectedBackground);
  const selectedFilter = usePhotoBoothStore((s) => s.selectedFilter);
  const selectedEffect = usePhotoBoothStore((s) => s.selectedEffect);
  const caption = usePhotoBoothStore((s) => s.caption);
  const stickers = usePhotoBoothStore((s) => s.stickers);
  const capturedFrames = usePhotoBoothStore((s) => s.capturedFrames);

  // Local session ref — the ONLY source of truth during a capture run
  const sessionRef = useRef<SessionState | null>(null);

  // Selector helpers
  const ratio = usePhotoBoothStore(selectPhotoRatio);
  const layout = usePhotoBoothStore(selectPhotoLayout);

  // ----------------------------------------------------------------
  //  Camera ready validation
  // ----------------------------------------------------------------

  /**
   * Verify the webcam is ready before starting a session. Returns
   * `{ ok: true }` if ready, otherwise `{ ok: false, reason }`.
   */
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
    // Optional: trust the store-reported isCameraReady as well
    return { ok: true };
  }, [webcamRef]);

  // ----------------------------------------------------------------
  //  Cleanup
  // ----------------------------------------------------------------

  /**
   * Stop all timers for the current session. Does NOT change phase.
   * Idempotent and safe to call multiple times.
   */
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
      const result = await composePhotoBoothOutput({
        capturedFrames: allFrames,
        selectedRatio: ratio,
        selectedLayout: layout,
        selectedQuality: selectedQuality,
        selectedTheme: selectedTheme,
        selectedBackground: selectedBackground,
        selectedFilter: selectedFilter,
        selectedEffect: selectedEffect,
        caption,
        stickers,
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
    ratio,
    layout,
    selectedQuality,
    selectedTheme,
    selectedBackground,
    selectedFilter,
    selectedEffect,
    caption,
    stickers,
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
      // Re-validate camera right before capture (in case state changed)
      const web = webcamRef.current;
      const video = web?.video as HTMLVideoElement | null | undefined;
      if (!video || video.readyState < 2 || !video.videoWidth) {
        throw new Error("Kamera belum siap");
      }

      const cap = await captureFrameFromVideo(
        video,
        ratio,
        selectedQuality
      );

      // Bail out if the session was cancelled during the async capture
      if (sessionRef.current?.cancelled) return;

      // Local counter increments first; store mirrors afterward
      s.count += 1;
      addFrame(cap.dataUrl);

      if (s.count >= s.total) {
        // All frames collected — finish the session
        await composeAndFinish();
      } else {
        // Start the next countdown
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
    ratio,
    selectedQuality,
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

    setPhase("countdown");
    setStage("countdown");
    setIsCapturing(false);
    setCountdown(selectedTimer);

    // Clear any previous interval (defensive)
    if (s.intervalId) {
      clearInterval(s.intervalId);
      s.intervalId = null;
    }

    let remaining = selectedTimer;
    s.intervalId = setInterval(() => {
      // Re-check session validity (could have been cancelled)
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
        // Time to capture
        if (current.intervalId) {
          clearInterval(current.intervalId);
          current.intervalId = null;
        }
        setCountdown(0);
        // Fire and forget — captureOneFrame manages its own state
        void captureOneFrame();
      } else {
        setCountdown(remaining);
      }
    }, 1000);
  }, [selectedTimer, captureOneFrame, setCountdown, setIsCapturing, setPhase, setStage]);

  // ----------------------------------------------------------------
  //  Public handlers
  // ----------------------------------------------------------------

  const handleStart = useCallback(() => {
    const currentPhase = usePhotoBoothStore.getState().phase;

    // Prevent re-entry / double session
    if (
      currentPhase === "countdown" ||
      currentPhase === "capturing" ||
      currentPhase === "processing"
    ) {
      console.warn("[photobooth] session already active:", currentPhase);
      return;
    }

    // Validate camera before starting
    const check = validateCamera();
    if (!check.ok) {
      notify.error(check.reason || "Kamera belum siap, coba lagi sebentar.");
      return;
    }

    // Total shots derived from currently selected layout
    const layoutId = usePhotoBoothStore.getState().selectedLayoutId;
    const total = PHOTO_LAYOUTS[layoutId].requiredShots;

    // Reset previous session data and timers
    cleanupSession();
    clearFrames();
    setComposed(null);
    clearStickers();
    setErrorMessage(null);

    // Initialize local session
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

  const handleRetake = useCallback(() => {
    cleanupSession();
    setStage("setup");
    setPhase("idle");
    setErrorMessage(null);
    clearFrames();
    setComposed(null);
    setCaption("");
    clearStickers();
    setIsCapturing(false);
    setCountdown(null);
    setProcessing(false);
  }, [
    cleanupSession,
    setStage,
    setPhase,
    setErrorMessage,
    clearFrames,
    setComposed,
    setCaption,
    clearStickers,
    setIsCapturing,
    setCountdown,
    setProcessing,
  ]);

  // ----------------------------------------------------------------
  //  Auto-cancel on stage change to setup/landing
  // ----------------------------------------------------------------

  useEffect(() => {
    if (stage === "setup" || stage === "landing") {
      // Cancel any in-flight session if user navigates back
      if (sessionRef.current) {
        cleanupSession();
        setPhase(stage === "landing" ? "idle" : "idle");
        setErrorMessage(null);
      }
    }
  }, [stage, cleanupSession, setPhase, setErrorMessage]);

  // ----------------------------------------------------------------
  //  Composition effect — runs whenever inputs change during result phase
  // ----------------------------------------------------------------

  useEffect(() => {
    if (phase !== "result") return;
    if (stage !== "edit") return;
    if (capturedFrames.length === 0) return;
    let cancelled = false;
    setProcessing(true);

    composePhotoBoothOutput({
      capturedFrames,
      selectedRatio: ratio,
      selectedLayout: layout,
      selectedQuality: selectedQuality,
      selectedTheme: selectedTheme,
      selectedBackground: selectedBackground,
      selectedFilter: selectedFilter,
      selectedEffect: selectedEffect,
      caption,
      stickers,
    })
      .then(async (result) => {
        if (cancelled) return;
        const blob = await exportCanvasAsBlob(result.canvas, true);
        const final: ComposeResult = { ...result, blob };
        setComposed(final);
        setProcessing(false);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("Composition failed:", err);
          setProcessing(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [
    capturedFrames,
    selectedFilter,
    selectedTheme,
    selectedBackground,
    selectedQuality,
    selectedEffect,
    caption,
    stickers,
    phase,
    selectedLayoutId,
    selectedRatioId,
    ratio,
    layout,
    stage,
    setProcessing,
    setComposed,
  ]);

  // ----------------------------------------------------------------
  //  Download and Save (unchanged behavior)
  // ----------------------------------------------------------------

  const handleDownload = useCallback(() => {
    const composed = usePhotoBoothStore.getState().composed;
    if (!composed) return;
    const filename = buildOutputFilename(composed.ratioId, composed.layoutId);
    const a = document.createElement("a");
    a.href = composed.dataUrl;
    a.download = filename;
    a.click();
    notify.success("Foto diunduh!");
  }, []);

  const handleSave = useCallback(async () => {
    const composed = usePhotoBoothStore.getState().composed;
    if (!composed) return;

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        usePhotoBoothStore.getState().setStage("edit");
        setAuthPromptOpen(true);
        return;
      }
    } catch {
      setAuthPromptOpen(true);
      return;
    }

    setStage("saving");
    try {
      const thumbDataUrl = await resizeDataUrl(
        composed.dataUrl,
        480,
        Math.round((480 * composed.height) / composed.width),
        "image/jpeg",
        0.8
      );
      const blob =
        composed.blob || (await exportCanvasAsBlob(composed.canvas, true));
      if (!blob) throw new Error("Gagal menghasilkan blob.");

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const userId = user?.id || "anonymous";
      const fileName = buildOutputFilename(composed.ratioId, composed.layoutId);
      const filePath = `${userId}/photobooth/${fileName}`;

      const { error: err } = await supabase.storage
        .from("notes_images")
        .upload(filePath, blob, { contentType: "image/png" });
      if (err) throw err;
      const { data: urlData } = supabase.storage
        .from("notes_images")
        .getPublicUrl(filePath);

      const title = `📸 ${new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}`;

      const metadata: GalleryMetadata = {
        id: uid(),
        url: urlData.publicUrl,
        thumbnailUrl: thumbDataUrl,
        createdAt: Date.now(),
        source: "photo-booth",
        layoutId: composed.layoutId,
        ratioId: composed.ratioId,
        filterId: composed.filterId,
        effectId: composed.effectId,
        width: composed.width,
        height: composed.height,
        caption: composed.caption,
      };
      addGalleryItem(metadata);

      const { data: nd } = await createNote({
        variables: {
          input: {
            title,
            positionX: Math.random() * 400 + 200,
            positionY: Math.random() * 300 + 150,
          },
        },
      });
      if (nd?.createNote) {
        await addNoteImage({
          variables: {
            input: {
              noteId: nd.createNote.id,
              imageUrl: urlData.publicUrl,
              caption: composed.caption || "Photo Booth",
              order: 0,
            },
          },
        });
        setStage("done");
        notify.success("Foto tersimpan ke kanvas!");
      }
    } catch (e: any) {
      const msg = String(e?.message || "");
      if (/unauthorized|401|403/i.test(msg)) {
        usePhotoBoothStore.getState().setStage("edit");
        setAuthPromptOpen(true);
        return;
      }
      notify.error("Gagal: " + e.message);
      setStage("edit");
    }
  }, [createNote, addNoteImage, addGalleryItem, setAuthPromptOpen, setStage]);

  return {
    handleStart,
    handleRetry,
    handleRetake,
    handleDownload,
    handleSave,
  };
}
