"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type Webcam from "react-webcam";
import { useMutation } from "@apollo/client/react";
import { usePhotoboothStore } from "../store/usePhotoboothStore";
import { LAYOUTS } from "../constants";
import {
  renderSingle,
  renderStrip,
  renderGrid,
  renderWide,
} from "../renderers";
import { ZOOM_LEVELS } from "../constants";
import { CREATE_NOTE, ADD_NOTE_IMAGE } from "@/graphql/mutations";
import { createClient } from "@/lib/supabase/client";
import { notify } from "@/lib/toast";

export const usePhotobooth = (
  webcamRef: React.RefObject<Webcam | null>,
  previewRef: React.RefObject<HTMLDivElement | null>
) => {
  const router = useRouter();
  const [createNote] = useMutation<{ createNote: { id: string } }>(CREATE_NOTE);
  const [addNoteImage] = useMutation<{ addNoteImage: { id: string } }>(
    ADD_NOTE_IMAGE
  );

  // State from store
  const stage = usePhotoboothStore((s) => s.stage);
  const capturedPhotos = usePhotoboothStore((s) => s.capturedPhotos);
  const selectedFilter = usePhotoboothStore((s) => s.selectedFilter);
  const selectedLayout = usePhotoboothStore((s) => s.selectedLayout);
  const selectedRatio = usePhotoboothStore((s) => s.selectedRatio);
  const selectedQuality = usePhotoboothStore((s) => s.selectedQuality);
  const selectedBackground = usePhotoboothStore((s) => s.selectedBackground);
  const isBeautyEnabled = usePhotoboothStore((s) => s.isBeautyEnabled);
  const zoomLevelKey = usePhotoboothStore((s) => s.zoomLevel);
  const selectedStripColor = usePhotoboothStore((s) => s.selectedStripColor);
  const caption = usePhotoboothStore((s) => s.caption);
  const stickers = usePhotoboothStore((s) => s.stickers);
  const countdown = usePhotoboothStore((s) => s.countdown);
  const isCapturing = usePhotoboothStore((s) => s.isCapturing);
  const selectedTimer = usePhotoboothStore((s) => s.selectedTimer);

  // Actions from store
  const setStage = usePhotoboothStore((s) => s.setStage);
  const setFinalPhoto = usePhotoboothStore((s) => s.setFinalPhoto);
  const setProcessing = usePhotoboothStore((s) => s.setProcessing);
  const setCountdown = usePhotoboothStore((s) => s.setCountdown);
  const setIsCapturing = usePhotoboothStore((s) => s.setIsCapturing);
  const addPhoto = usePhotoboothStore((s) => s.addPhoto);
  const clearPhotos = usePhotoboothStore((s) => s.clearPhotos);
  const clearStickers = usePhotoboothStore((s) => s.clearStickers);
  const setCaption = usePhotoboothStore((s) => s.setCaption);

  const layoutDef = LAYOUTS.find((l) => l.key === selectedLayout)!;

  // Effect: Process final image when photos or filter changes
  useEffect(() => {
    if (capturedPhotos.length === 0 || stage !== "edit") return;
    let cancelled = false;
    setProcessing(true);

    const zoomScale = ZOOM_LEVELS.find(z => z.key === zoomLevelKey)?.scale || 1;
    const renderOpts = {
      photos: capturedPhotos,
      filter: selectedFilter,
      colorKey: selectedStripColor,
      ratio: selectedRatio,
      quality: selectedQuality,
      background: selectedBackground,
      stickers,
      caption,
      zoomScale,
      isBeautyEnabled
    };

    let p: Promise<string>;
    if (selectedLayout === "single") {
      p = renderSingle(renderOpts);
    } else if (selectedLayout === "grid4") {
      p = renderGrid(renderOpts, 2);
    } else if (selectedLayout === "grid6") {
      p = renderGrid(renderOpts, 3);
    } else if (selectedLayout === "wide2") {
      p = renderWide(renderOpts, '2');
    } else if (selectedLayout === "cinematic3") {
      p = renderWide(renderOpts, '3');
    } else if (selectedLayout === "ultrawide4") {
      p = renderWide(renderOpts, '4');
    } else {
      p = renderStrip(renderOpts);
    }

    p.then((r) => {
      if (!cancelled) {
        setFinalPhoto(r);
        setProcessing(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [
    capturedPhotos,
    selectedFilter,
    selectedStripColor,
    selectedRatio,
    selectedQuality,
    selectedBackground,
    isBeautyEnabled,
    zoomLevelKey,
    caption,
    stickers,
    stage,
    selectedLayout,
    setProcessing,
    setFinalPhoto,
  ]);

  // Effect: Countdown tick
  useEffect(() => {
    if (countdown === null || countdown <= 0) return;
    const t = setTimeout(() => {
      // Use store action directly with a function for atomic update
      usePhotoboothStore.setState((s) => ({
        countdown: s.countdown !== null ? s.countdown - 1 : null,
      }));
    }, 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  // Internal: Capture photo from webcam
  const captureInternal = useCallback(() => {
    const raw = webcamRef.current?.getScreenshot({ width: 1920, height: 1920 });
    if (!raw) return;
    setStage("flash");
    setTimeout(() => {
      const currentCount = usePhotoboothStore.getState().capturedPhotos.length;
      addPhoto(raw);
      if (currentCount + 1 >= layoutDef.shots) {
        setIsCapturing(false);
        setStage("edit");
      } else {
        setStage("countdown");
        setCountdown(selectedTimer);
      }
    }, 200);
  }, [
    webcamRef,
    layoutDef.shots,
    selectedTimer,
    addPhoto,
    setStage,
    setIsCapturing,
    setCountdown,
  ]);

  // Effect: Take shot when countdown hits 0
  useEffect(() => {
    if (countdown !== 0 || !isCapturing) return;
    setCountdown(null);
    captureInternal();
  }, [countdown, isCapturing, captureInternal, setCountdown]);

  // Handler: Start a new session
  const handleStart = useCallback(() => {
    clearPhotos();
    setFinalPhoto(null);
    clearStickers();
    setIsCapturing(true);
    setStage("countdown");
    setCountdown(selectedTimer);
  }, [
    selectedTimer,
    clearPhotos,
    setFinalPhoto,
    clearStickers,
    setIsCapturing,
    setStage,
    setCountdown,
  ]);

  // Handler: Retake all photos
  const handleRetake = useCallback(() => {
    setStage("setup");
    clearPhotos();
    setFinalPhoto(null);
    setCaption("");
    clearStickers();
    setIsCapturing(false);
    setCountdown(null);
  }, [
    clearPhotos,
    setFinalPhoto,
    setCaption,
    clearStickers,
    setIsCapturing,
    setCountdown,
    setStage,
  ]);

  // Handler: Download final photo
  const handleDownload = useCallback(() => {
    const finalPhoto = usePhotoboothStore.getState().finalPhoto;
    if (!finalPhoto) return;
    const a = document.createElement("a");
    a.href = finalPhoto;
    a.download = `konstelasi_photobooth_${Date.now()}.jpg`;
    a.click();
    notify.success("Foto diunduh!");
  }, []);

  // Handler: Save to canvas
  const handleSave = useCallback(async () => {
    const finalPhoto = usePhotoboothStore.getState().finalPhoto;
    const caption = usePhotoboothStore.getState().caption;
    if (!finalPhoto) return;

    // Precheck: show soft auth prompt if no session, never hard-redirect.
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        usePhotoboothStore.getState().setStage("edit");
        usePhotoboothStore.getState().setAuthPromptOpen(true);
        return;
      }
    } catch {
      usePhotoboothStore.getState().setAuthPromptOpen(true);
      return;
    }

    setStage("saving");
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const userId = user?.id || "anonymous";
      const res = await fetch(finalPhoto);
      const blob = await res.blob();
      const filePath = `${userId}/photobooth_${Date.now()}.jpg`;
      const { error: err } = await supabase.storage
        .from("notes_images")
        .upload(filePath, blob, { contentType: "image/jpeg" });
      if (err) throw err;
      const { data: urlData } = supabase.storage
        .from("notes_images")
        .getPublicUrl(filePath);
      const title = `📸 ${new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}`;
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
              caption: caption || "Photo Booth",
              order: 0,
            },
          },
        });
        setStage("done");
        notify.success("Foto tersimpan ke kanvas!");
        setTimeout(() => router.push("/canvas"), 1800);
      }
    } catch (e: any) {
      const msg = String(e?.message || "");
      if (/unauthorized|401|403/i.test(msg)) {
        usePhotoboothStore.getState().setStage("edit");
        usePhotoboothStore.getState().setAuthPromptOpen(true);
        return;
      }
      notify.error("Gagal: " + e.message);
      setStage("edit");
    }
  }, [createNote, addNoteImage, router, setStage]);

  // Handler: Update sticker position (called from drag end)
  const handleStickerDragEnd = useCallback(
    (id: string, info: { point: { x: number; y: number } }) => {
      if (!previewRef.current) return;
      const rect = previewRef.current.getBoundingClientRect();
      const nx = ((info.point.x - rect.left) / rect.width) * 100;
      const ny = ((info.point.y - rect.top) / rect.height) * 100;
      const updateStickerPosition = usePhotoboothStore.getState().updateStickerPosition;
      updateStickerPosition(
        id,
        Math.max(0, Math.min(100, nx)),
        Math.max(0, Math.min(100, ny))
      );
    },
    [previewRef]
  );

  return {
    // State
    layoutDef,
    // Handlers
    handleStart,
    handleRetake,
    handleDownload,
    handleSave,
    handleStickerDragEnd,
  };
};
