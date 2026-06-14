"use client";

import { useEffect, useRef } from "react";
import { usePhotoBoothStore } from "../photoBoothStore";
import { PHOTO_RATIOS, PHOTO_LAYOUTS } from "../photoBooth.config";
import { composePhotoBoothOutput } from "../services/canvas/compose";
import { exportCanvasAsBlob } from "../utils/exportCanvas";
import type { ComposeResult } from "../photoBooth.types";

/**
 * useComposition - Reactive canvas composition for filter/sticker edits.
 *
 * IMPORTANT: The initial composition is performed by `composeAndFinish`
 * inside use-session. This effect does NOT re-run on initial mount to
 * avoid a race condition that could overwrite the correctly-built
 * initial composed result with a stale or duplicate composition.
 *
 * It only re-composes when EDIT inputs change (filter, sticker, caption,
 * theme, background, quality, effect) — never just because capturedFrames
 * or layout/ratio changed (those are set ONCE and don't change in
 * the result screen).
 */
export function useComposition() {
  // Subscribe to values to trigger re-composition
  const phase = usePhotoBoothStore((s) => s.phase);
  const stage = usePhotoBoothStore((s) => s.stage);
  const capturedFrames = usePhotoBoothStore((s) => s.capturedFrames);
  const selectedRatioId = usePhotoBoothStore((s) => s.selectedRatioId);
  const selectedLayoutId = usePhotoBoothStore((s) => s.selectedLayoutId);
  const selectedFilter = usePhotoBoothStore((s) => s.selectedFilter);
  const selectedTheme = usePhotoBoothStore((s) => s.selectedTheme);
  const selectedBackground = usePhotoBoothStore((s) => s.selectedBackground);
  const selectedQuality = usePhotoBoothStore((s) => s.selectedQuality);
  const selectedEffect = usePhotoBoothStore((s) => s.selectedEffect);
  const caption = usePhotoBoothStore((s) => s.caption);
  const stickers = usePhotoBoothStore((s) => s.stickers);
  const setProcessing = usePhotoBoothStore((s) => s.setProcessing);
  const setComposed = usePhotoBoothStore((s) => s.setComposed);

  // Track whether the initial composition has been done.
  // We only re-compose when EDIT inputs change after that point.
  const initialComposedRef = useRef(false);
  const prevFramesLengthRef = useRef(capturedFrames.length);

  // Reset the initial-composed flag whenever frames are cleared
  // (e.g. on retake), so the next capture session gets a fresh composition.
  if (prevFramesLengthRef.current > 0 && capturedFrames.length === 0) {
    initialComposedRef.current = false;
  }
  prevFramesLengthRef.current = capturedFrames.length;

  useEffect(() => {
    if (phase !== "result") return;
    if (stage !== "edit") return;
    if (capturedFrames.length === 0) return;

    // Skip the very first run — composeAndFinish in use-session has
    // already produced the initial composed result. This avoids a race
    // where this effect could overwrite (or interfere with) the initial
    // composition before the user has a chance to see it.
    if (!initialComposedRef.current) {
      initialComposedRef.current = true;
      return;
    }

    // From here on, only re-compose when EDIT inputs have changed.
    let cancelled = false;
    setProcessing(true);

    const selectedRatio = PHOTO_RATIOS[selectedRatioId];
    const selectedLayout = PHOTO_LAYOUTS[selectedLayoutId];

    composePhotoBoothOutput({
      capturedFrames,
      selectedRatio,
      selectedLayout,
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
    stage,
    selectedLayoutId,
    selectedRatioId,
    setProcessing,
    setComposed,
  ]);
}
