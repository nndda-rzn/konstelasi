"use client";

import type { NoteNodeData } from "@/features/canvas/types";
import { MOOD_STYLES, formatRelativeShort as formatRelative } from "./nodeTheme";

interface MoodBadgeProps {
  mood: string;
}

/**
 * MoodBadge - Color-coded mood indicator at top-right of note.
 */
export function MoodBadge({ mood }: MoodBadgeProps) {
  if (!mood) return null;
  const style = MOOD_STYLES[mood] || MOOD_STYLES[""];
  return (
    <div
      className="absolute -top-2 -right-2 px-2.5 py-1 rounded-full shadow-md border border-white/80 z-20 text-xs font-semibold whitespace-nowrap"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {mood.charAt(0).toUpperCase() + mood.slice(1)}
    </div>
  );
}

interface NodeImageProps {
  images: NoteNodeData["images"];
}

/**
 * NodeImage - Cover image with overflow count badge.
 */
export function NodeImage({ images }: NodeImageProps) {
  if (!images || images.length === 0) return null;
  return (
    <div
      className="mb-4 w-full shrink-0 overflow-hidden rounded-xl border border-[#FFB4A2]/10 shadow-inner relative group/image flex justify-center bg-[#FFF5F0]/50"
      style={{ minHeight: "60px", maxHeight: "180px" }}
    >
      <img
        src={images[0].imageUrl}
        alt={images[0].caption || "Note attachment"}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover opacity-90 group-hover/image:opacity-100 transition-all duration-700"
      />
      {images.length > 1 && (
        <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-black/55 backdrop-blur-sm text-white text-[10px] font-medium tabular-nums shadow-md flex items-center gap-1">
          <svg
            className="w-2.5 h-2.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="14" height="14" rx="2" />
            <path d="M21 7v12a2 2 0 0 1-2 2H7" />
          </svg>
          +{images.length - 1}
        </span>
      )}
    </div>
  );
}

interface QuoteBodyProps {
  content?: string;
  title?: string;
}

/**
 * QuoteBody - Italic blockquote with pink quotes and author line.
 */
export function QuoteBody({ content, title }: QuoteBodyProps) {
  return (
    <>
      <div className="flex-1 flex items-center justify-center px-2">
        <blockquote className="text-[18px] italic text-[#4A2F3C]/80 leading-relaxed text-center font-light border-l-0">
          <span className="text-[#FF8FA3] text-3xl leading-none font-serif">
            &ldquo;
          </span>
          {content ? (
            <span
              dangerouslySetInnerHTML={{
                __html: content.replace(/<[^>]*>/g, ""),
              }}
            />
          ) : (
            <span className="text-[#5A3E4C]/30">Tulis kutipan...</span>
          )}
          <span className="text-[#FF8FA3] text-3xl leading-none font-serif">
            &rdquo;
          </span>
        </blockquote>
      </div>
      {title && title !== "Untitled Note" && (
        <p className="text-xs text-[#5A3E4C]/40 text-center mt-2 font-medium">
          — {title}
        </p>
      )}
    </>
  );
}

interface NoteBodyProps {
  data: NoteNodeData;
  selected?: boolean;
}

/**
 * NoteBody - Standard text-mode body with title, timestamp, content.
 */
export function NoteBody({ data, selected }: NoteBodyProps) {
  return (
    <>
      <h3
        className={`font-semibold text-[16px] mb-1 shrink-0 tracking-wide transition-colors duration-300 w-full ${
          selected
            ? "text-[#4A2F3C]"
            : "text-[#4A2F3C]/85 group-hover:text-[#4A2F3C]"
        }`}
        style={data.titleFont ? { fontFamily: data.titleFont } : undefined}
      >
        {data.title || "Untitled Note"}
      </h3>
      {data.createdAt && (
        <p className="text-[10px] text-[#5A3E4C]/35 mb-1.5 shrink-0 tracking-wide font-medium">
          {formatRelative(data.createdAt)}
        </p>
      )}
      <div className="text-[#5A3E4C]/50 text-[13px] leading-relaxed font-light overflow-y-auto custom-scrollbar flex-1 pr-1 w-full">
        {data.content ? (
          <div
            dangerouslySetInnerHTML={{ __html: data.content }}
            className="prose prose-p:my-0 prose-img:hidden max-w-none break-words w-full"
          />
        ) : (
          <p className="italic text-[#5A3E4C]/30">
            Double click to start writing...
          </p>
        )}
      </div>
    </>
  );
}
