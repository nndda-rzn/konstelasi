"use client";

import { useCallback } from "react";
import { notify } from "@/lib/toast";
import { createClient } from "@/lib/supabase/client";
import { useMutation } from "@apollo/client/react";
import { CREATE_NOTE, ADD_NOTE_IMAGE } from "@/graphql/mutations";
import { usePhotoBoothStore } from "../photoBoothStore";
import { exportCanvasAsBlob } from "../utils/exportCanvas";
import { resizeDataUrl } from "../utils/resizeImage";
import { buildOutputFilename, uid } from "../photoBooth.utils";
import type { GalleryMetadata } from "../photoBooth.types";

/**
 * Export contract: any function that returns the FINAL composed
 * dataUrl/Blob from the Konva stage. Both download and save MUST
 * use this same export to guarantee preview = download = save.
 */
export interface FinalExporter {
  exportDataUrl: (pixelWidth?: number) => string | null;
  exportBlob: (pixelWidth?: number) => Promise<Blob | null>;
}

interface UsePhotoActionsOptions {
  /** Ref-based exporter to the Konva stage. */
  exporter: () => FinalExporter | null;
}

/**
 * usePhotoActions - Save, Download, Retake.
 * All output goes through the Konva stage exporter (preview = download = save).
 */
export function usePhotoActions({ exporter }: UsePhotoActionsOptions = {
  exporter: () => null,
}) {
  const [createNote] = useMutation<{ createNote: { id: string } }>(CREATE_NOTE);
  const [addNoteImage] = useMutation<{ addNoteImage: { id: string } }>(
    ADD_NOTE_IMAGE
  );

  const setStage = usePhotoBoothStore((s) => s.setStage);
  const setAuthPromptOpen = usePhotoBoothStore((s) => s.setAuthPromptOpen);
  const addGalleryItem = usePhotoBoothStore((s) => s.addGalleryItem);
  const selectedFrame = usePhotoBoothStore((s) => s.selectedFrame);
  const setPhase = usePhotoBoothStore((s) => s.setPhase);
  const setErrorMessage = usePhotoBoothStore((s) => s.setErrorMessage);
  const clearFrames = usePhotoBoothStore((s) => s.clearFrames);
  const setComposed = usePhotoBoothStore((s) => s.setComposed);
  const setCaption = usePhotoBoothStore((s) => s.setCaption);
  const clearStickers = usePhotoBoothStore((s) => s.clearStickers);
  const setIsCapturing = usePhotoBoothStore((s) => s.setIsCapturing);
  const setCountdown = usePhotoBoothStore((s) => s.setCountdown);
  const setProcessing = usePhotoBoothStore((s) => s.setProcessing);
  const selectedLayoutId = usePhotoBoothStore((s) => s.selectedLayoutId);
  const selectedRatioId = usePhotoBoothStore((s) => s.selectedRatioId);

  /**
   * handleDownload - Uses the Konva stage export (NOT composed.dataUrl).
   * This ensures the download matches the on-screen preview exactly.
   */
  const handleDownload = useCallback(() => {
    const exp = exporter();
    if (!exp) {
      notify.error("Belum ada hasil untuk diunduh.");
      return;
    }
    const dataUrl = exp.exportDataUrl();
    if (!dataUrl) {
      notify.error("Gagal menghasilkan file.");
      return;
    }
    const filename = buildOutputFilename(selectedRatioId, selectedLayoutId);
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename;
    a.click();
    notify.success("Foto diunduh!");
  }, [exporter, selectedRatioId, selectedLayoutId]);

  /**
   * handleSave - Uploads the Konva stage export to Supabase and
   * creates a note + gallery entry. Thumbnail uses pica for high
   * quality downscale.
   */
  const handleSave = useCallback(async () => {
    const exp = exporter();
    if (!exp) {
      notify.error("Belum ada hasil untuk disimpan.");
      return;
    }

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
      // Use the same exporter for both full-size and thumbnail
      const fullDataUrl = exp.exportDataUrl();
      if (!fullDataUrl) throw new Error("Gagal menghasilkan output.");

      // Generate a high-quality thumbnail via pica
      const composed = usePhotoBoothStore.getState().composed;
      const thumbDataUrl = composed
        ? await resizeDataUrl(
            fullDataUrl,
            480,
            Math.round((480 * composed.height) / composed.width),
            "image/jpeg",
            0.8
          )
        : fullDataUrl;

      // Get the full-size blob from the Konva stage (PNG, transparent)
      const blob = (await exp.exportBlob()) || (await fetch(fullDataUrl).then((r) => r.blob()));
      if (!blob) throw new Error("Gagal menghasilkan blob.");

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const userId = user?.id || "anonymous";
      const fileName = buildOutputFilename(selectedRatioId, selectedLayoutId);
      const filePath = `${userId}/photobooth/${fileName}`;

      const { error: err } = await supabase.storage
        .from("notes_images")
        .upload(filePath, blob, { contentType: "image/png" });
      if (err) throw err;
      const { data: urlData } = supabase.storage
        .from("notes_images")
        .getPublicUrl(filePath);

      const title = `\u{1F4F8} ${new Date().toLocaleDateString("id-ID", {
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
        layoutId: selectedLayoutId,
        ratioId: selectedRatioId,
        filterId: composed?.filterId ?? "normal",
        effectId: composed?.effectId ?? "off",
        frameId: selectedFrame,
        width: composed?.width ?? 1600,
        height: composed?.height ?? 2000,
        caption: composed?.caption ?? "",
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
              caption: metadata.caption || "Photo Booth",
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
  }, [
    exporter,
    createNote,
    addNoteImage,
    addGalleryItem,
    setAuthPromptOpen,
    setStage,
    selectedFrame,
    selectedLayoutId,
    selectedRatioId,
  ]);

  const handleRetake = useCallback(() => {
    const store = usePhotoBoothStore.getState();
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
    store.setFlowMode("session");
    store.setSessionStep("camera");
  }, [
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

  return {
    handleDownload,
    handleSave,
    handleRetake,
  };
}
