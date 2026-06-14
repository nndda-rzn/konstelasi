"use client";

import { motion } from "framer-motion";
import Webcam from "react-webcam";
import { CameraPreview } from "./CameraPreview";
import { PoseProgress } from "./CapturedThumbs";
import { CameraControls } from "./CameraControls";
import { SessionSummary } from "./SessionSummary";

interface CameraStageProps {
  webcamRef: React.RefObject<Webcam | null>;
  onStart: () => void;
  onRetry: () => void;
  onRetake: () => void;
  onDownload: () => void;
  onSave: () => void;
}

/**
 * CameraStage - Centered studio composition:
 *   session summary → camera preview → pose progress → capture controls.
 */
export function CameraStage({
  webcamRef,
  onStart,
  onRetry,
  onRetake,
  onDownload,
  onSave,
}: CameraStageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex w-full max-w-[960px] flex-col items-center gap-5"
    >
      <SessionSummary />
      <CameraPreview webcamRef={webcamRef} />
      <PoseProgress />
      <CameraControls
        onStart={onStart}
        onRetry={onRetry}
        onRetake={onRetake}
        onDownload={onDownload}
        onSave={onSave}
      />
    </motion.div>
  );
}
