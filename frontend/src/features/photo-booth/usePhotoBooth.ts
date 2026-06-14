"use client";

import { useCallback, useEffect, useRef } from "react";
import type Webcam from "react-webcam";
import { useMutation } from "@apollo/client/react";
import { notify } from "@/lib/toast";
import { createClient } from "@/lib/supabase/client";
import { CREATE_NOTE, ADD_NOTE_IMAGE } from "@/graphql/mutations";
import { usePhotoBoothStore, selectPhotoRatio, selectPhotoLayout } from "./photoBoothStore";
import { captureFrameFromVideo } from "./utils/captureFrameFromVideo";
import { composePhotoBoothOutput } from "./utils/composePhotoBoothOutput";
import { exportCanvasAsBlob } from "./utils/exportCanvas";
import { resizeDataUrl } from "./utils/resizeImage";
import { buildOutputFilename, uid } from "./photoBooth.utils";
import type { ComposeResult, GalleryMetadata } from "./photoBooth.types";

/**
 * usePhotoBooth - The main hook for the photobooth pipeline.
 * - captureFrameFromVideo: captures each frame using the active ratio
 *   + quality, center-cropped, returned as a dataURL.
 * - composePhotoBoothOutput: composes the final canvas whenever
 *   captured frames or settings change.
 * - Download and Save use the SAME canvas blob so result == download == save.
 */
export function usePhotoBooth(
  webcamRef: React.RefObject<Webcam | null>
) {
  const [createNote] = useMutation<{ createNote: { id: string } }>(CREATE_NOTE);
  const [addNoteImage] = useMutation<{ addNoteImage: { id: string } }>(
    ADD_NOTE_IMAGE
  );

  const stage = usePhotoBoothStore((s) => s.stage);
  const setStage = usePhotoBoothStore((s) => s.setStage);
  const selectedRatioId = usePhotoBoothStore((s) => s.selectedRatioId);
  const selectedLayoutId = usePhotoBoothStore((s) => s.selectedLayoutId);
  const selectedTimer = usePhotoBoothStore((s) => s.selectedTimer);
  const countdown = usePhotoBoothStore((s) => s.countdown);
  const isCapturing = usePhotoBoothStore((s) => s.isCapturing);
  const setIsCapturing = usePhotoBoothStore((s) => s.setIsCapturing);
  const setCountdown = usePhotoBoothStore((s) => s.setCountdown);
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

  // Selector helpers
  const ratio = usePhotoBoothStore(selectPhotoRatio);
  const layout = usePhotoBoothStore(selectPhotoLayout);
  const requiredShots = layout.requiredShots;

  // Internal: capture one frame from the webcam
  const captureInternal = useCallback(async () => {
    const video = webcamRef.current?.video as HTMLVideoElement | null | undefined;
    if (!video) {
      notify.error("Kamera belum siap.");
      return;
    }
    let cap;
    try {
      cap = await captureFrameFromVideo(video, ratio, selectedQuality);
    } catch (err) {
      console.error("Capture failed:", err);
      notify.error("Gagal mengambil foto.");
      return;
    }
    setStage("flash");
    setTimeout(() => {
      const currentCount = usePhotoBoothStore.getState().capturedFrames.length;
      addFrame(cap.dataUrl);
      if (currentCount + 1 >= requiredShots) {
        setIsCapturing(false);
        setStage("edit");
      } else {
        setStage("countdown");
        setCountdown(selectedTimer);
      }
    }, 200);
  }, [
    webcamRef,
    ratio,
    selectedQuality,
    requiredShots,
    selectedTimer,
    addFrame,
    setStage,
    setIsCapturing,
    setCountdown,
  ]);

  // Effect: when countdown hits 0, capture
  useEffect(() => {
    if (countdown !== 0 || !isCapturing) return;
    setCountdown(null);
    captureInternal();
  }, [countdown, isCapturing, captureInternal, setCountdown]);

  // Effect: compose the final canvas whenever inputs change
  useEffect(() => {
    if (capturedFrames.length === 0 || stage !== "edit") return;
    let cancelled = false;
    setProcessing(true);

    composePhotoBoothOutput({
      capturedFrames,
      selectedRatio: ratio,
      selectedLayout: layout,
      selectedQuality,
      selectedTheme,
      selectedBackground,
      selectedFilter,
      selectedEffect,
      caption,
      stickers,
    })
      .then(async (result) => {
        if (cancelled) return;
        // also produce a blob so download/save use the same bytes
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
    stage,
    selectedLayoutId,
    selectedRatioId,
    ratio,
    layout,
    setProcessing,
    setComposed,
  ]);

  // Start a new capture session
  const handleStart = useCallback(() => {
    clearFrames();
    setComposed(null);
    clearStickers();
    setIsCapturing(true);
    setStage("countdown");
    setCountdown(selectedTimer);
  }, [
    selectedTimer,
    clearFrames,
    setComposed,
    clearStickers,
    setIsCapturing,
    setStage,
    setCountdown,
  ]);

  // Retake all photos
  const handleRetake = useCallback(() => {
    setStage("setup");
    clearFrames();
    setComposed(null);
    setCaption("");
    clearStickers();
    setIsCapturing(false);
    setCountdown(null);
  }, [
    clearFrames,
    setComposed,
    setCaption,
    clearStickers,
    setIsCapturing,
    setCountdown,
    setStage,
  ]);

  // Download final — uses the exact same blob as save
  const handleDownload = useCallback(async () => {
    const composed = usePhotoBoothStore.getState().composed;
    if (!composed) return;
    const filename = buildOutputFilename(
      composed.ratioId,
      composed.layoutId
    );
    const a = document.createElement("a");
    a.href = composed.dataUrl;
    a.download = filename;
    a.click();
    notify.success("Foto diunduh!");
  }, []);

  // Save to Canvas (and add to in-memory Gallery)
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
      // Generate a high-quality thumbnail (max 480px)
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
    handleRetake,
    handleDownload,
    handleSave,
  };
}
