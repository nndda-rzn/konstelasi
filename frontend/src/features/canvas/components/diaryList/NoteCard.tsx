"use client";

import { Image as ImageIcon } from "lucide-react";
import { COLOR_LINES } from "./colorLines";

interface NoteCardProps {
  note: any;
  index: number;
  onClick: () => void;
}

/**
 * NoteCard - A single note entry in the diary list grid.
 */
export function NoteCard({ note, index, onClick }: NoteCardProps) {
  const accentColor = COLOR_LINES[note.color || "default"] || COLOR_LINES.default;

  return (
    <div
      key={note.id}
      className="bg-white/70 border border-[#FFB4A2]/15 rounded-2xl p-5 hover:border-[#FF8FA3]/30 hover:bg-white/90 transition-all cursor-pointer flex flex-col min-h-[150px] group animate-fade-in-up shadow-sm hover:shadow-md hover:shadow-pink-200/20"
      style={{ animationDelay: `${index * 60}ms` }}
      onClick={onClick}
    >
      <div
        className={`h-0.5 w-12 rounded-full bg-gradient-to-r ${accentColor} to-transparent mb-3 group-hover:w-20 transition-all`}
      />
      <h3 className="font-semibold text-base text-[#4A2F3C] mb-1.5 truncate">
        {note.title || "Untitled"}
      </h3>
      <p className="text-[#5A3E4C]/50 text-sm line-clamp-3 mb-auto leading-relaxed">
        {note.content
          ? note.content.replace(/<[^>]*>/g, "")
          : "Drafting new ideas..."}
      </p>
      {note.images?.length > 0 && (
        <div className="flex items-center gap-1.5 text-xs text-[#FF8FA3] font-medium mt-3 bg-[#FF8FA3]/[0.08] w-max px-2.5 py-1 rounded-lg">
          <ImageIcon className="w-3 h-3" /> {note.images.length}
        </div>
      )}
    </div>
  );
}
