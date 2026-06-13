"use client";

import { Calendar, Hourglass, Sparkles } from "lucide-react";
import { stripHtml, formatMemoryDate } from "../storyListFormatters";

interface OnThisDaySectionProps {
  loading: boolean;
  memories: any[];
  onNavigate: (storyId: string) => void;
}

export function OnThisDaySection({
  loading,
  memories,
  onNavigate,
}: OnThisDaySectionProps) {
  return (
    <section className="mb-8 rounded-3xl border border-[#FFB8C0]/20 dark:border-[#E63946]/10 bg-gradient-to-br from-white/90 via-[#FFE5E8]/45 to-white/70 dark:from-[#2a2438]/90 dark:via-[#E63946]/10 dark:to-[#1a1625]/80 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-candy-primary text-white flex items-center justify-center shadow-candy">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#4A2F3C] dark:text-[#e2d9f3]">
              Hari Ini Dalam Cerita
            </h2>
            <p className="text-xs text-[#5A3E4C]/50 dark:text-[#e2d9f3]/40 mt-0.5">
              Memory story yang terjadi pada tanggal ini di tahun lalu.
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full bg-white/70 dark:bg-[#1a1625]/60 text-[10px] font-medium text-[#E63946] border border-[#FFB8C0]/20">
          {new Date().toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
          })}
        </span>
      </div>

      {loading ? (
        <LoadingState />
      ) : memories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {memories.map((memory) => (
            <MemoryCard
              key={memory.nodeId}
              memory={memory}
              onClick={() => onNavigate(memory.storyId)}
            />
          ))}
        </div>
      ) : (
        <EmptyOnThisDay />
      )}
    </section>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center gap-2 text-xs text-[#5A3E4C]/45 dark:text-[#e2d9f3]/35">
      <div className="w-4 h-4 border-2 border-[#E63946] border-t-transparent rounded-full animate-spin" />
      Mencari kenangan hari ini...
    </div>
  );
}

function MemoryCard({ memory, onClick }: { memory: any; onClick: () => void }) {
  const preview = stripHtml(memory.content).slice(0, 120);

  return (
    <button
      onClick={onClick}
      className="text-left p-4 rounded-2xl bg-white/75 dark:bg-[#1a1625]/55 border border-[#FFB8C0]/15 dark:border-[#E63946]/10 hover:border-[#E63946]/30 hover:shadow-lg hover:shadow-[#E63946]/5 transition-all"
    >
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="text-[10px] font-semibold text-[#E63946] uppercase tracking-wider">
          {memory.yearsAgo} tahun lalu
        </span>
        <span className="text-[9px] text-[#5A3E4C]/35 dark:text-[#e2d9f3]/25">
          {formatMemoryDate(memory.eventDate)}
        </span>
      </div>
      <h3 className="text-sm font-semibold text-[#4A2F3C] dark:text-[#e2d9f3] mb-1 truncate">
        {memory.title}
      </h3>
      <p className="text-[10px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30 mb-2 truncate">
        {memory.storyTitle}
      </p>
      {memory.isTimeLocked ? (
        <div className="flex items-center gap-2 text-[10px] text-[#E63946]/70">
          <Hourglass className="w-3 h-3" />
          Time Capsule masih tersegel
        </div>
      ) : preview ? (
        <p className="text-xs leading-relaxed text-[#5A3E4C]/60 dark:text-[#e2d9f3]/45 line-clamp-2">
          {preview}
        </p>
      ) : (
        <p className="text-xs italic text-[#5A3E4C]/35 dark:text-[#e2d9f3]/25">
          Belum ada cuplikan konten.
        </p>
      )}
    </button>
  );
}

function EmptyOnThisDay() {
  return (
    <div className="rounded-2xl border border-dashed border-[#FFB8C0]/25 dark:border-[#E63946]/15 bg-white/45 dark:bg-[#1a1625]/35 px-4 py-5 text-center">
      <Sparkles className="w-7 h-7 text-[#FFB8C0]/60 mx-auto mb-2" />
      <p className="text-sm font-medium text-[#4A2F3C]/60 dark:text-[#e2d9f3]/50">
        Belum ada memory lama untuk hari ini
      </p>
      <p className="text-[10px] text-[#5A3E4C]/35 dark:text-[#e2d9f3]/25 mt-1">
        Tambahkan event date pada node story agar muncul di sini tahun depan.
      </p>
    </div>
  );
}
