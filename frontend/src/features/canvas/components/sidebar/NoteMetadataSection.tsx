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
      <div className="border-t border-[rgba(47,39,48,0.08)] pt-6">
        <label className="block text-[11px] font-medium uppercase tracking-[0.14em] text-[#9A8F95] mb-3">
          Moment
        </label>
        <div className="flex flex-wrap gap-2">
          {MOOD_OPTIONS.map((m) => (
            <button
              key={m.id}
              onClick={() => setMood(m.id)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[10px] text-xs font-medium border transition-colors ${
                mood === m.id
                  ? "bg-[#F3ECE4] border-[#C99A45]/30 text-[#2F2730]"
                  : "border-[rgba(47,39,48,0.08)] text-[#9A8F95] hover:border-[#C99A45]/30 hover:text-[#6F626A]"
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
      <div className="border-t border-[rgba(47,39,48,0.08)] pt-6">
        <label className="block text-[11px] font-medium uppercase tracking-[0.14em] text-[#9A8F95] mb-3">
          Note type
        </label>
        <div className="flex gap-2">
          {NOTE_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => setNoteType(t.value)}
              className={`flex-1 px-3 py-2 rounded-[12px] text-xs font-medium border transition-colors ${
                noteType === t.value
                  ? "bg-[#B84A5A]/8 border-[#B84A5A]/30 text-[#B84A5A]"
                  : "border-[rgba(47,39,48,0.08)] text-[#9A8F95] hover:border-[#B84A5A]/20"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Theme Color */}
      <div className="border-t border-[rgba(47,39,48,0.08)] pt-6">
        <label className="block text-[11px] font-medium uppercase tracking-[0.14em] text-[#9A8F95] mb-3">
          Theme color
        </label>
        <div className="flex flex-wrap gap-2.5">
          {COLOR_OPTIONS.map((c) => (
            <button
              key={c.id}
              onClick={() => setColor(c.id)}
              className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${c.bg} ${
                color === c.id
                  ? c.border + " scale-110 shadow-md"
                  : "border-transparent hover:border-[rgba(47,39,48,0.15)] hover:scale-105"
              }`}
              title={c.id.charAt(0).toUpperCase() + c.id.slice(1)}
            />
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="border-t border-[rgba(47,39,48,0.08)] pt-6">
        <label className="block text-[11px] font-medium uppercase tracking-[0.14em] text-[#9A8F95] mb-3">
          Tags
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {noteTags.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-[#2F2730]"
              style={{ backgroundColor: tag.color || "#B84A5A" }}
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
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-[rgba(47,39,48,0.08)] text-[#6F626A] hover:text-[#2F2730] hover:border-[#B84A5A]/30 transition-colors"
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: tag.color || "#B84A5A" }}
              />
              {tag.name}
            </button>
          ))}
        </div>
        {availableTags.length === 0 && noteTags.length === 0 && (
          <p className="text-xs text-[#9A8F95]">
            No tags yet. Add tags from the Tags panel.
          </p>
        )}
      </div>
    </>
  );
}
