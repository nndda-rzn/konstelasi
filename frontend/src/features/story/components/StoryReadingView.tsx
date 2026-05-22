'use client';

import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, MapPin, Clock, Lock, Hourglass } from 'lucide-react';

interface StoryReadingViewProps {
  nodes: any[];
  storyTitle: string;
  storySubtitle?: string;
  scrapbookFontClass?: string;
  scrapbookBackgroundClass?: string;
}

function isNodeTimeLocked(node: any) {
  return Boolean(node?.isTimeLocked || (node?.unlockDate && new Date(node.unlockDate).getTime() > Date.now()));
}

function formatUnlockDate(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function StoryReadingView({ nodes, storyTitle, storySubtitle, scrapbookFontClass = '', scrapbookBackgroundClass = 'bg-[#FFFAF7] dark:bg-[#1a1625]' }: StoryReadingViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const sortedNodes = useMemo(() => {
    return [...nodes].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [nodes]);

  if (sortedNodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">Belum ada node dalam story ini</p>
      </div>
    );
  }

  const currentNode = sortedNodes[currentIndex];
  const timeLocked = isNodeTimeLocked(currentNode);
  const unlockLabel = formatUnlockDate(currentNode.unlockDate);
  let metadata: any = {};
  try { if (currentNode.storyMetadata) metadata = JSON.parse(currentNode.storyMetadata); } catch {}

  const goNext = () => setCurrentIndex(Math.min(currentIndex + 1, sortedNodes.length - 1));
  const goPrev = () => setCurrentIndex(Math.max(currentIndex - 1, 0));

  return (
    <div className={`h-full flex flex-col ${scrapbookBackgroundClass}`}>
      {/* Reading Header */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-[#FFB8C0]/10 dark:border-[#E63946]/10">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#E63946]" />
          <span className="text-xs font-medium text-[#5A3E4C]/60 dark:text-[#e2d9f3]/50">{storyTitle}</span>
        </div>
        <span className="text-[10px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">
          {currentIndex + 1} / {sortedNodes.length}
        </span>
      </div>

      {/* Reading Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className={`max-w-xl mx-auto px-8 py-12 ${scrapbookFontClass}`}>
          {/* Node type badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[9px] uppercase tracking-wider font-semibold text-[#E63946]">
              {(currentNode.storyNodeType || 'scene').replace('_', ' ')}
            </span>
            {metadata.sceneLocation && (
              <span className="flex items-center gap-1 text-[9px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">
                <MapPin className="w-2.5 h-2.5" /> {metadata.sceneLocation}
              </span>
            )}
            {metadata.sceneTime && (
              <span className="flex items-center gap-1 text-[9px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">
                <Clock className="w-2.5 h-2.5" /> {metadata.sceneTime}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-[#4A2F3C] dark:text-[#e2d9f3] mb-6 leading-tight">
            {currentNode.title || 'Untitled'}
          </h1>

          {/* Images */}
          {!timeLocked && currentNode.images?.length > 0 && (
            <div className="mb-6 rounded-xl overflow-hidden">
              <img src={currentNode.images[0].imageUrl} alt="" className="w-full max-h-[300px] object-cover" />
              {currentNode.images.length > 1 && (
                <div className="flex gap-1.5 mt-1.5">
                  {currentNode.images.slice(1, 4).map((img: any) => (
                    <div key={img.id} className="flex-1 h-16 rounded-lg overflow-hidden">
                      <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Content */}
          {timeLocked ? (
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#E63946]/5 to-[#FFB8C0]/10 border border-[#FFB8C0]/20 dark:border-[#E63946]/15 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#E63946]/10 flex items-center justify-center text-[#E63946] mb-3">
                <Lock className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold text-[#E63946] mb-2">
                <Hourglass className="w-3 h-3" />
                Time Capsule
              </div>
              <p className="text-sm font-semibold text-[#4A2F3C] dark:text-[#e2d9f3]">Memory ini masih tersegel</p>
              <p className="text-xs text-[#5A3E4C]/50 dark:text-[#e2d9f3]/40 mt-2">
                {unlockLabel ? `Akan terbuka pada ${unlockLabel}.` : 'Konten dan media disembunyikan sampai tanggal buka.'}
              </p>
            </div>
          ) : (
            <div className="prose-dark prose prose-sm max-w-none text-[#5A3E4C] dark:text-[#e2d9f3]/80 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: currentNode.content || '<p class="text-[#5A3E4C]/30 italic">Belum ada konten...</p>' }} />
          )}

          {/* Mood */}
          {currentNode.mood && (
            <div className="mt-8 pt-4 border-t border-[#FFB8C0]/10 dark:border-[#E63946]/10">
              <span className="text-[10px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30 italic">
                Mood: {currentNode.mood}
              </span>
            </div>
          )}

          {/* Date */}
          <div className="mt-4">
            <span className="text-[9px] text-[#5A3E4C]/30 dark:text-[#e2d9f3]/20">
              {new Date(currentNode.createdAt).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between px-8 py-4 border-t border-[#FFB8C0]/10 dark:border-[#E63946]/10">
        <button onClick={goPrev} disabled={currentIndex === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-[#5A3E4C]/60 dark:text-[#e2d9f3]/50 hover:bg-[#FFB8C0]/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
          <ChevronLeft className="w-4 h-4" /> Sebelumnya
        </button>

        {/* Progress dots */}
        <div className="flex gap-1">
          {sortedNodes.map((_: any, i: number) => (
            <button key={i} onClick={() => setCurrentIndex(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentIndex ? 'bg-[#E63946] w-4' : 'bg-[#FFB8C0]/30 hover:bg-[#FFB8C0]/50'}`} />
          ))}
        </div>

        <button onClick={goNext} disabled={currentIndex === sortedNodes.length - 1}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-[#5A3E4C]/60 dark:text-[#e2d9f3]/50 hover:bg-[#FFB8C0]/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
          Selanjutnya <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
