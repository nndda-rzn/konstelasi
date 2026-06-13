"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useReadingNavigation } from "./readingView/useReadingNavigation";
import { isNodeTimeLocked, parseNodeMetadata } from "./readingView/readingViewHelpers";
import { ReadingHeader } from "./readingView/ReadingHeader";
import { NodeMetadataBadges } from "./readingView/NodeMetadataBadges";
import { BookmarkButton } from "./readingView/BookmarkButton";
import { TimeLockedMessage } from "./readingView/TimeLockedMessage";
import { ProgressDots } from "./readingView/ProgressDots";

interface StoryReadingViewProps {
  nodes: any[];
  storyTitle: string;
  storySubtitle?: string;
  storyId?: string;
  scrapbookFontClass?: string;
  scrapbookBackgroundClass?: string;
}

export default function StoryReadingView({
  nodes,
  storyTitle,
  storySubtitle,
  storyId,
  scrapbookFontClass = "",
  scrapbookBackgroundClass = "bg-[#FFFAF7] dark:bg-[#1a1625]",
}: StoryReadingViewProps) {
  const {
    sortedNodes,
    currentNode,
    currentIndex,
    goNext,
    goPrev,
    goTo,
    bookmarkedNodeIds,
    handleToggle,
  } = useReadingNavigation(nodes, storyId);

  if (sortedNodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">
          Belum ada node dalam story ini
        </p>
      </div>
    );
  }

  const timeLocked = isNodeTimeLocked(currentNode);
  const metadata = parseNodeMetadata(currentNode.storyMetadata);
  const isBookmarked = bookmarkedNodeIds.has(currentNode.id);

  return (
    <div className={`h-full flex flex-col ${scrapbookBackgroundClass}`}>
      <ReadingHeader
        storyTitle={storyTitle}
        currentIndex={currentIndex}
        total={sortedNodes.length}
      />

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className={`max-w-xl mx-auto px-8 py-12 ${scrapbookFontClass}`}>
          <NodeMetadataBadges
            nodeType={currentNode.storyNodeType}
            metadata={metadata}
          />

          <div className="flex items-start justify-between gap-3 mb-6">
            <h1 className="text-2xl font-bold text-[#4A2F3C] dark:text-[#e2d9f3] leading-tight flex-1">
              {currentNode.title || "Untitled"}
            </h1>
            <BookmarkButton
              isBookmarked={isBookmarked}
              onToggle={() => handleToggle(currentNode.id)}
              disabled={!storyId}
            />
          </div>

          {!timeLocked && currentNode.images?.length > 0 && (
            <NodeImages images={currentNode.images} />
          )}

          {timeLocked ? (
            <TimeLockedMessage unlockDate={currentNode.unlockDate} />
          ) : (
            <div
              className="prose-dark prose prose-sm max-w-none text-[#5A3E4C] dark:text-[#e2d9f3]/80 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html:
                  currentNode.content ||
                  '<p class="text-[#5A3E4C]/30 italic">Belum ada konten...</p>',
              }}
            />
          )}

          {currentNode.mood && (
            <div className="mt-8 pt-4 border-t border-[#FFB8C0]/10 dark:border-[#E63946]/10">
              <span className="text-[10px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30 italic">
                Mood: {currentNode.mood}
              </span>
            </div>
          )}

          <div className="mt-4">
            <span className="text-[9px] text-[#5A3E4C]/30 dark:text-[#e2d9f3]/20">
              {new Date(currentNode.createdAt).toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-8 py-4 border-t border-[#FFB8C0]/10 dark:border-[#E63946]/10">
        <button
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-[#5A3E4C]/60 dark:text-[#e2d9f3]/50 hover:bg-[#FFB8C0]/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" /> Sebelumnya
        </button>

        <ProgressDots
          total={sortedNodes.length}
          currentIndex={currentIndex}
          onSelect={goTo}
        />

        <button
          onClick={goNext}
          disabled={currentIndex === sortedNodes.length - 1}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-[#5A3E4C]/60 dark:text-[#e2d9f3]/50 hover:bg-[#FFB8C0]/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Selanjutnya <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function NodeImages({ images }: { images: any[] }) {
  return (
    <div className="mb-6 rounded-xl overflow-hidden">
      <img
        src={images[0].imageUrl}
        alt=""
        loading="lazy"
        decoding="async"
        className="w-full max-h-[300px] object-cover"
      />
      {images.length > 1 && (
        <div className="flex gap-1.5 mt-1.5">
          {images.slice(1, 4).map((img: any) => (
            <div
              key={img.id}
              className="flex-1 h-16 rounded-lg overflow-hidden"
            >
              <img
                src={img.imageUrl}
                alt=""
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
