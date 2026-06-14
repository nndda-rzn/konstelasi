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
 * usePhotoActions - Public actions for save, download, retake.
 * Handles Supabase upload, GraphQL note creation, and local download.
 */
export function usePhotoActions() {
  const [createNote] = useMutation<{ createNote: { id: string } }>(CREATE_NOTE);
  const [addNoteImage] = useMutation<{ addNoteImage: { id: string } }>(
    ADD_NOTE_IMAGE
  );

  const setStage = usePhotoBoothStore((s) => s.setStage);
  const setAuthPromptOpen = usePhotoBoothStore((s) => s.setAuthPromptOpen);
  const addGalleryItem = usePhotoBoothStore((s) => s.addGalleryItem);
  const setPhase = usePhotoBoothStore((s) => s.setPhase);
  const setErrorMessage = usePhotoBoothStore((s) => s.setErrorMessage);
  const clearFrames = usePhotoBoothStore((s) => s.clearFrames);
  const setComposed = usePhotoBoothStore((s) => s.setComposed);
  const setCaption = usePhotoBoothStore((s) => s.setCaption);
  const clearStickers = usePhotoBoothStore((s) => s.clearStickers);
  const setIsCapturing = usePhotoBoothStore((s) => s.setIsCapturing);
  const setCountdown = usePhotoBoothStore((s) => s.setCountdown);
  const setProcessing = usePhotoBoothStore((s) => s.setProcessing);

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

  const handleRetake = useCallback(() => {
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
