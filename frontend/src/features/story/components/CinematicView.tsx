"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useCinematicPlayer,
  useCinematicKeyboard,
} from "./cinematic/useCinematicPlayer";
import { NODE_TYPE_LABELS, getNodeTypeLabel } from "./cinematic/nodeTypeLabel";
import { ProgressTrack } from "./cinematic/ProgressTrack";
import {
  CinematicHeaderTitle,
  CinematicHeaderActions,
} from "./cinematic/CinematicHeaderParts";
import {
  CinematicContentHeader,
  CinematicContentBody,
} from "./cinematic/CinematicContentParts";

export { NODE_TYPE_LABELS };

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

function BackgroundImage({
  node,
  cover,
  durationMs,
}: {
  node: any;
  cover?: string;
  durationMs: number;
}) {
  return (
    <AnimatePresence mode="sync">
      {cover ? (
        <motion.div
          key={`bg-${node.id}`}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1.18 }}
          exit={{ opacity: 0 }}
          transition={{ duration: durationMs / 1000, ease: "linear" }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${cover})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ) : (
        <motion.div
          key={`bg-fallback-${node.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-gradient-to-br from-[#9D0208] via-[#E63946] to-[#FF6B7A]"
        />
      )}
    </AnimatePresence>
  );
}

function ClickZones({
  onPrev,
  onNext,
}: {
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <>
      <button
        onClick={onPrev}
        aria-label="Sebelumnya"
        className="absolute left-0 top-16 bottom-32 w-1/3 z-[5] cursor-pointer group flex items-center justify-start pl-4"
      >
        <ChevronLeft className="w-8 h-8 text-white/0 group-hover:text-white/40 transition-opacity" />
      </button>
      <button
        onClick={onNext}
        aria-label="Selanjutnya"
        className="absolute right-0 top-16 bottom-32 w-1/3 z-[5] cursor-pointer group flex items-center justify-end pr-4"
      >
        <ChevronRight className="w-8 h-8 text-white/0 group-hover:text-white/40 transition-opacity" />
      </button>
    </>
  );
}

function EmptyCinematic({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black">
      <div className="text-center text-white/70">
        <p className="text-sm">Belum ada node yang bisa diputar.</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
