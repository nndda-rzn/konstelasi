"use client";

import { useEffect } from "react";
import { Lock } from "lucide-react";
import TiptapEditor from "@/features/canvas/components/TiptapEditor";
import { EditorHeader } from "./editor/EditorHeader";
import { TimeCapsuleField } from "./editor/TimeCapsuleField";
import { MetadataFields } from "./editor/MetadataFields";
import { EmotionPicker } from "./editor/EmotionPicker";
import { EventFields } from "./editor/EventFields";
import { MediaGallery } from "./editor/MediaGallery";
import { useStoryNodeEditor } from "./editor/useStoryNodeEditor";

interface StoryNodeEditorProps {
  note: any;
  onClose: () => void;
  onUpdateCache: (
    nodeId: string,
    title?: string,
    content?: string,
    newImages?: any[],
    color?: string,
    mood?: string,
    extra?: any
  ) => void;
  onDeleteSuccess: () => void;
  onRequestRefresh?: () => void;
}

export default function StoryNodeEditor({
  note,
  onClose,
  onUpdateCache,
  onDeleteSuccess,
  onRequestRefresh,
}: StoryNodeEditorProps) {
  const editor = useStoryNodeEditor({ note, onUpdateCache, onDeleteSuccess });

  // Auto-reload Time Capsule when unlock date passes
  useEffect(() => {
    if (!editor.unlockDate || !onRequestRefresh) return;
    const unlockTs = new Date(editor.unlockDate).getTime();
    const now = Date.now();
    if (unlockTs <= now && editor.contentMasked) {
      onRequestRefresh();
      return;
    }
    const delay = Math.min(unlockTs - now, 24 * 60 * 60 * 1000);
    if (delay <= 0) return;
    const timer = setTimeout(() => onRequestRefresh(), delay + 500);
    return () => clearTimeout(timer);
  }, [editor.unlockDate, editor.contentMasked, onRequestRefresh]);

  if (!note) return null;

  const nodeType = note.storyNodeType || "scene";
  const isTimeLocked = Boolean(
    editor.unlockDate &&
      new Date(editor.unlockDate).getTime() > Date.now()
  );
  const isContentSealed = isTimeLocked || editor.contentMasked;

  return (
    <div
      className={`${
        editor.focusMode
          ? "fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          : ""
      }`}
    >
      <div
        className={`${
          editor.focusMode
            ? "relative w-[700px] max-h-[90vh] rounded-2xl shadow-2xl"
            : "absolute top-0 right-0 h-full w-[420px]"
        } bg-white/95 dark:bg-[#2a2438]/95 backdrop-blur-2xl shadow-2xl border-l border-[#FFB8C0]/15 dark:border-[#E63946]/10 z-50 flex flex-col overflow-hidden`}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-candy-accent-line" />

        <EditorHeader
          nodeType={nodeType}
          isLocked={editor.isLocked}
          isTimeLocked={isTimeLocked}
          focusMode={editor.focusMode}
          onToggleLock={editor.handleToggleLock}
          onDelete={editor.handleDelete}
          onToggleFocus={() => editor.setFocusMode(!editor.focusMode)}
          onClose={onClose}
        />

        <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
          <div>
            <input
              type="text"
              value={editor.title}
              onChange={(e) => editor.setTitle(e.target.value)}
              placeholder="Judul node..."
              className="w-full text-lg font-bold text-[#4A2F3C] dark:text-[#e2d9f3] bg-transparent border-none outline-none placeholder:text-[#5A3E4C]/20"
            />
          </div>

          <TimeCapsuleField
            unlockDate={editor.unlockDate}
            isTimeLocked={isTimeLocked}
            onChange={editor.setUnlockDate}
          />

          <MetadataFields
            nodeType={nodeType}
            metadata={editor.metadata}
            onMetadataChange={editor.handleMetadataChange}
          />

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#5A3E4C]/50 font-semibold mb-2">
              Konten
            </label>
            {isContentSealed ? (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[#1a1625]/5 dark:bg-white/5 border border-[#FFB8C0]/15 dark:border-[#E63946]/10">
                <Lock className="w-4 h-4 text-[#E63946]/70" />
                <div>
                  <p className="text-xs font-semibold text-[#4A2F3C] dark:text-[#e2d9f3]">
                    {isTimeLocked
                      ? "Konten tersegel"
                      : "Konten perlu dimuat ulang"}
                  </p>
                  <p className="text-[10px] text-[#5A3E4C]/45 dark:text-[#e2d9f3]/35 mt-0.5">
                    {isTimeLocked
                      ? "Backend menyembunyikan isi memory ini sampai tanggal buka."
                      : "Time Capsule sudah dibuka. Tutup dan buka kembali node untuk memuat konten asli sebelum mengedit."}
                  </p>
                </div>
              </div>
            ) : (
              <TiptapEditor content={editor.content} onChange={editor.setContent} />
            )}
          </div>

          <EmotionPicker value={editor.mood} onChange={editor.setMood} />

          <EventFields
            eventDate={editor.eventDate}
            eventLocation={editor.eventLocation}
            onDateChange={editor.setEventDate}
            onLocationChange={editor.setEventLocation}
          />

          <MediaGallery
            images={editor.images}
            uploading={editor.uploading}
            isSealed={isContentSealed}
            isTimeLocked={isTimeLocked}
            onUpload={editor.uploadFromInputEvent}
            onDelete={editor.deleteImage}
          />

          <div className="flex items-center gap-1.5 pt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 animate-pulse" />
            <span className="text-[11px] text-[#5A3E4C]/50 dark:text-[#e2d9f3]/40">
              Auto-saved
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
