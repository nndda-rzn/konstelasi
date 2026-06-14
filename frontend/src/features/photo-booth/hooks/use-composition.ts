"use client";

import { useEffect } from "react";
import {
  usePhotoBoothStore,
  selectPhotoRatio,
  selectPhotoLayout,
} from "../photoBoothStore";
import { composePhotoBoothOutput } from "../services/canvas/compose";
import { exportCanvasAsBlob } from "../utils/exportCanvas";
import type { ComposeResult } from "../photoBooth.types";

/**
 * useComposition - Reactive canvas composition.
 * Runs whenever filter/sticker/caption/etc inputs change during result phase.
 * The resulting composed image is stored in the store for preview, download, and save.
 */
export function useComposition() {
  const phase = usePhotoBoothStore((s) => s.phase);
  const stage = usePhotoBoothStore((s) => s.stage);
  const capturedFrames = usePhotoBoothStore((s) => s.capturedFrames);
  const selectedFilter = usePhotoBoothStore((s) => s.selectedFilter);
  const selectedTheme = usePhotoBoothStore((s) => s.selectedTheme);
  const selectedBackground = usePhotoBoothStore((s) => s.selectedBackground);
  const selectedQuality = usePhotoBoothStore((s) => s.selectedQuality);
  const selectedEffect = usePhotoBoothStore((s) => s.selectedEffect);
  const selectedLayoutId = usePhotoBoothStore((s) => s.selectedLayoutId);
  const selectedRatioId = usePhotoBoothStore((s) => s.selectedRatioId);
  const caption = usePhotoBoothStore((s) => s.caption);
  const stickers = usePhotoBoothStore((s) => s.stickers);
  const ratio = usePhotoBoothStore(selectPhotoRatio);
  const layout = usePhotoBoothStore(selectPhotoLayout);
  const setProcessing = usePhotoBoothStore((s) => s.setProcessing);
  const setComposed = usePhotoBoothStore((s) => s.setComposed);

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
}
