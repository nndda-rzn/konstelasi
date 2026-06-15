"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  useCinematicPlayer,
  useCinematicKeyboard,
} from "./cinematic/useCinematicPlayer";
import { getNodeTypeLabel } from "./cinematic/nodeTypeLabel";
import { ProgressTrack } from "./cinematic/ProgressTrack";
import {
  CinematicHeaderTitle,
  CinematicHeaderActions,
} from "./cinematic/CinematicHeaderParts";
import {
  CinematicContentHeader,
  CinematicContentBody,
} from "./cinematic/CinematicContentParts";
import { BackgroundImage } from "./cinematic/parts/BackgroundImage";
import { ClickZones } from "./cinematic/parts/ClickZones";
import { EmptyCinematic } from "./cinematic/parts/EmptyCinematic";

interface CinematicViewProps {
  nodes: any[];
  storyTitle: string;
  onClose: () => void;
  durationMs?: number;
}

export default function CinematicView({
  nodes,
  storyTitle,
  onClose,
  durationMs = 7000,
}: CinematicViewProps) {
  const sortedNodes = [...nodes]
    .filter((n) => !n?.isTimeLocked)
    .sort((a, b) => {
      const aTime = new Date(a.eventDate || a.createdAt).getTime();
      const bTime = new Date(b.eventDate || b.createdAt).getTime();
      return aTime - bTime;
    });

  const {
    currentIndex,
    isPaused,
    progress,
    goNext,
    goPrev,
    togglePause,
  } = useCinematicPlayer({
    totalNodes: sortedNodes.length,
    durationMs,
    onComplete: onClose,
  });

  useCinematicKeyboard(goNext, goPrev, onClose, togglePause);

  if (sortedNodes.length === 0) {
    return <EmptyCinematic onClose={onClose} />;
  }

  const node = sortedNodes[currentIndex];
  const cover = node.images?.[0]?.imageUrl;
  const stripped = (node.content || "").replace(/<[^>]+>/g, "").trim();
  const nodeTypeLabel = getNodeTypeLabel(node.storyNodeType);

  return (
    <div className="fixed inset-0 z-[200] bg-black overflow-hidden select-none">
      <BackgroundImage node={node} cover={cover} durationMs={durationMs} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/60" />

      <ProgressTrack
        total={sortedNodes.length}
        currentIndex={currentIndex}
        progress={progress}
      />

      <div className="absolute top-8 left-4 right-4 z-10 flex items-center justify-between">
        <CinematicHeaderTitle
          storyTitle={storyTitle}
          currentIndex={currentIndex}
          total={sortedNodes.length}
        />
        <CinematicHeaderActions
          isPaused={isPaused}
          onTogglePause={togglePause}
          onClose={onClose}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={node.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="absolute bottom-0 left-0 right-0 z-10 p-8 md:p-12 max-w-3xl mx-auto"
        >
          <CinematicContentHeader
            nodeType={node.storyNodeType}
            nodeTypeLabel={nodeTypeLabel}
          />
          <CinematicContentBody
            title={node.title}
            stripped={stripped}
            mood={node.mood}
          />
        </motion.div>
      </AnimatePresence>

      <ClickZones onPrev={goPrev} onNext={goNext} />
    </div>
  );
}
