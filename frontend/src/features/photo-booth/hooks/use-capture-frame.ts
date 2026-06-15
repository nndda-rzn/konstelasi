"use client";

import { useCallback } from "react";
import type Webcam from "react-webcam";
import { usePhotoBoothStore } from "../photoBoothStore";
import { PHOTO_RATIOS } from "../photoBooth.config";
import { captureFrameFromVideo } from "../utils/captureFrameFromVideo";

export type CaptureFrameFn = () => Promise<string>;

export function useCaptureFrame(
  webcamRef: React.RefObject<Webcam | null>
): CaptureFrameFn {
  const addFrame = usePhotoBoothStore((s) => s.addFrame);

  return useCallback(async () => {
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

    addFrame(cap.dataUrl);
    return cap.dataUrl;
  }, [webcamRef, addFrame]);
}
