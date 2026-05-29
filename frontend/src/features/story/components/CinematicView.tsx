'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Pause, Play, ChevronLeft, ChevronRight } from 'lucide-react';

interface CinematicViewProps {
  nodes: any[];
  storyTitle: string;
  onClose: () => void;
  durationMs?: number;
}

const NODE_TYPE_LABELS: Record<string, string> = {
  scene: 'Scene', memory: 'Memory', character: 'Character', dialogue: 'Dialogue',
  moment: 'Moment', feeling: 'Feeling', timeline_event: 'Event', media: 'Media',
  quote: 'Quote', reflection: 'Reflection',
};

export default function CinematicView({ nodes, storyTitle, onClose, durationMs = 7000 }: CinematicViewProps) {
  const sortedNodes = [...nodes]
    .filter(n => !n?.isTimeLocked)
    .sort((a, b) => {
      const aTime = new Date(a.eventDate || a.createdAt).getTime();
      const bTime = new Date(b.eventDate || b.createdAt).getTime();
      return aTime - bTime;
    });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef<number>(Date.now());
  const elapsedRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  const node = sortedNodes[currentIndex];
  const total = sortedNodes.length;

  const goNext = useCallback(() => {
    setCurrentIndex(i => {
      if (i >= total - 1) {
        onClose();
        return i;
      }
      return i + 1;
    });
    elapsedRef.current = 0;
    startTimeRef.current = Date.now();
    setProgress(0);
  }, [total, onClose]);

  const goPrev = useCallback(() => {
    setCurrentIndex(i => Math.max(0, i - 1));
    elapsedRef.current = 0;
    startTimeRef.current = Date.now();
    setProgress(0);
  }, []);

  // Animation loop for progress
  useEffect(() => {
    if (isPaused || total === 0) return;
    startTimeRef.current = Date.now() - elapsedRef.current;
    const tick = () => {
      const e = Date.now() - startTimeRef.current;
      elapsedRef.current = e;
      const p = Math.min(100, (e / durationMs) * 100);
      setProgress(p);
      if (p >= 100) {
        goNext();
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [currentIndex, isPaused, durationMs, goNext, total]);

  // Reset on index change
  useEffect(() => {
    elapsedRef.current = 0;
    startTimeRef.current = Date.now();
    setProgress(0);
  }, [currentIndex]);

  // Keyboard controls
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); goNext(); }
      else if (e.key === 'ArrowLeft') goPrev();
      else if (e.key === 'Escape') onClose();
      else if (e.key.toLowerCase() === 'p') setIsPaused(p => !p);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev, onClose]);

  if (!node) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black">
        <div className="text-center text-white/70">
          <p className="text-sm">Belum ada node yang bisa diputar.</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs">
            Tutup
          </button>
        </div>
      </div>
    );
  }

  const cover = node.images?.[0]?.imageUrl;
  const stripped = (node.content || '').replace(/<[^>]+>/g, '').trim();

  return (
    <div className="fixed inset-0 z-[200] bg-black overflow-hidden select-none">
      {/* Background image with Ken Burns */}
      <AnimatePresence mode="sync">
        {cover ? (
          <motion.div
            key={`bg-${node.id}`}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1.18 }}
            exit={{ opacity: 0 }}
            transition={{ duration: durationMs / 1000, ease: 'linear' }}
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${cover})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
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

      {/* Dim overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/60" />

      {/* Progress bars */}
      <div className="absolute top-4 left-4 right-4 z-10 flex gap-1">
        {sortedNodes.map((_, i) => (
          <div key={i} className="flex-1 h-0.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{
                width: i < currentIndex ? '100%' : i === currentIndex ? `${progress}%` : '0%',
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-8 left-4 right-4 z-10 flex items-center justify-between">
        <div className="text-white/80">
          <p className="text-[10px] uppercase tracking-[0.3em] font-semibold opacity-70">{storyTitle}</p>
          <p className="text-[11px] mt-1 font-medium">
            {currentIndex + 1} / {total}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPaused(p => !p)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition-colors backdrop-blur-md"
            title={isPaused ? 'Lanjutkan (P)' : 'Jeda (P)'}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition-colors backdrop-blur-md"
            title="Tutup (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={node.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="absolute bottom-0 left-0 right-0 z-10 p-8 md:p-12 max-w-3xl mx-auto"
        >
          {node.storyNodeType && (
            <span className="inline-block text-[10px] uppercase tracking-[0.3em] font-semibold text-white/60 mb-3">
              {NODE_TYPE_LABELS[node.storyNodeType] || node.storyNodeType.replace('_', ' ')}
            </span>
          )}
          <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
            {node.title || 'Untitled'}
          </h2>
          {stripped && (
            <p className="text-sm md:text-base text-white/85 leading-relaxed line-clamp-4 max-w-2xl">
              {stripped.length > 280 ? stripped.slice(0, 280) + '...' : stripped}
            </p>
          )}
          {node.mood && (
            <span className="inline-block mt-4 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[10px] font-medium text-white/80 capitalize">
              {node.mood}
            </span>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Click zones for navigation */}
      <button
        onClick={goPrev}
        aria-label="Sebelumnya"
        className="absolute left-0 top-16 bottom-32 w-1/3 z-[5] cursor-pointer group flex items-center justify-start pl-4"
      >
        <ChevronLeft className="w-8 h-8 text-white/0 group-hover:text-white/40 transition-opacity" />
      </button>
      <button
        onClick={goNext}
        aria-label="Selanjutnya"
        className="absolute right-0 top-16 bottom-32 w-1/3 z-[5] cursor-pointer group flex items-center justify-end pr-4"
      >
        <ChevronRight className="w-8 h-8 text-white/0 group-hover:text-white/40 transition-opacity" />
      </button>
    </div>
  );
}
