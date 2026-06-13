"use client";

import { X } from "lucide-react";
import { MOOD_OPTIONS, COLOR_OPTIONS, NOTE_TYPES } from "./sidebarConstants";

interface NoteMetadataSectionProps {
  mood: string;
  setMood: (m: string) => void;
  color: string;
  setColor: (c: string) => void;
  noteType: string;
  setNoteType: (t: string) => void;
  noteTags: any[];
  availableTags: any[];
  onAddTag: (tag: any) => void;
  onRemoveTag: (tagId: string) => void;
}

/**
 * NoteMetadataSection - Mood, type, color, and tags editor.
 */
export function NoteMetadataSection({
  mood,
  setMood,
  color,
  setColor,
  noteType,
  setNoteType,
  noteTags,
  availableTags,
  onAddTag,
  onRemoveTag,
}: NoteMetadataSectionProps) {
  return (
    <>
      {/* Mood */}
      <div className="border-t border-[#FFB4A2]/15 pt-6">
        <label className="block text-xs font-semibold text-[#5A3E4C]/40 uppercase tracking-wider mb-3">
          Moment
        </label>
        <div className="flex flex-wrap gap-2">
          {MOOD_OPTIONS.map((m) => (
            <button
              key={m.id}
              onClick={() => setMood(m.id)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                mood === m.id
                  ? "bg-[#FFF5F0] border-[#FFB4A2]/30 text-[#4A2F3C]"
                  : "border-[#FFB4A2]/10 text-[#5A3E4C]/40 hover:border-[#FFB4A2]/25 hover:text-[#5A3E4C]/60"
              }`}
            >
              {m.id && (
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: m.color }}
                />
              )}
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Note Type */}
      <div className="border-t border-[#FFB4A2]/15 pt-6">
        <label className="block text-xs font-semibold text-[#5A3E4C]/40 uppercase tracking-wider mb-3">
          Tipe Catatan
        </label>
        <div className="flex gap-2">
          {NOTE_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => setNoteType(t.value)}
              className={`flex-1 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                noteType === t.value
                  ? "bg-[#FF8FA3]/10 border-[#FF8FA3]/30 text-[#FF8FA3]"
                  : "border-[#FFB4A2]/15 text-[#5A3E4C]/50 hover:border-[#FF8FA3]/20"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Theme Color */}
      <div className="border-t border-[#FFB4A2]/15 pt-6">
        <label className="block text-xs font-semibold text-[#5A3E4C]/40 uppercase tracking-wider mb-3">
          Theme Color
        </label>
        <div className="flex flex-wrap gap-2.5">
          {COLOR_OPTIONS.map((c) => (
            <button
              key={c.id}
              onClick={() => setColor(c.id)}
              className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${c.bg} ${
                color === c.id
                  ? c.border + " scale-110 shadow-lg"
                  : "border-transparent hover:border-[#FFB4A2]/30 hover:scale-105"
              }`}
              title={c.id.charAt(0).toUpperCase() + c.id.slice(1)}
            />
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="border-t border-[#FFB4A2]/15 pt-6">
        <label className="block text-xs font-semibold text-[#5A3E4C]/40 uppercase tracking-wider mb-3">
          Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {noteTags.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: tag.color || "#FF8FA3" }}
            >
              {tag.name}
              <button
                onClick={() => onRemoveTag(tag.id)}
                className="w-3.5 h-3.5 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center transition-colors"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {availableTags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => onAddTag(tag)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-[#FFB4A2]/20 text-[#5A3E4C]/60 hover:text-[#5A3E4C] hover:border-[#FF8FA3]/30 transition-all"
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: tag.color || "#FF8FA3" }}
              />
              {tag.name}
            </button>
          ))}
        </div>
        {availableTags.length === 0 && noteTags.length === 0 && (
          <p className="text-xs text-[#5A3E4C]/30">
            Belum ada tag. Buat tag dari panel Tags.
          </p>
        )}
      </div>
    </>
  );
}
