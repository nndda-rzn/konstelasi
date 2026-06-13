"use client";

import { useState, useEffect } from "react";
import { Lock } from "lucide-react";
import { useMutation } from "@apollo/client/react";
import { UPDATE_NOTE_CONTENT, DELETE_NOTE } from "@/graphql/mutations";
import { TOGGLE_NODE_LOCK } from "@/graphql/story";
import { notify } from "@/lib/toast";
import TiptapEditor from "@/features/canvas/components/TiptapEditor";
import { useNoteImageUpload } from "@/features/canvas/hooks/useNoteImageUpload";
import { toDateTimeInputValue } from "./editor/dateHelpers";
import { EditorHeader } from "./editor/EditorHeader";
import { TimeCapsuleField } from "./editor/TimeCapsuleField";
import { MetadataFields } from "./editor/MetadataFields";
import { EmotionPicker } from "./editor/EmotionPicker";
import { EventFields } from "./editor/EventFields";
import { MediaGallery } from "./editor/MediaGallery";

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
  /** Optional callback to refetch the story when content needs reload. */
  onRequestRefresh?: () => void;
}

export default function StoryNodeEditor({
  note,
  onClose,
  onUpdateCache,
  onDeleteSuccess,
  onRequestRefresh,
}: StoryNodeEditorProps) {
  // === Local form state ===
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [contentMasked, setContentMasked] = useState(
    Boolean(note?.isTimeLocked && (note?.content === null || note?.content === undefined))
  );
  const [mood, setMood] = useState(note?.mood || "");
  const [isLocked, setIsLocked] = useState(note?.isLocked || false);
  const [eventDate, setEventDate] = useState(
    note?.eventDate ? note.eventDate.split("T")[0] : ""
  );
  const [eventLocation, setEventLocation] = useState(note?.eventLocation || "");
  const [unlockDate, setUnlockDate] = useState(
    toDateTimeInputValue(note?.unlockDate)
  );
  const [focusMode, setFocusMode] = useState(false);

  // Parse metadata
  let initialMetadata: any = {};
  try {
    if (note?.storyMetadata) initialMetadata = JSON.parse(note.storyMetadata);
  } catch {}
  const [metadata, setMetadata] = useState(initialMetadata);

  // === Mutations ===
  const [updateContent] = useMutation(UPDATE_NOTE_CONTENT);
  const [deleteNoteMut] = useMutation(DELETE_NOTE);
  const [toggleLock] = useMutation(TOGGLE_NODE_LOCK);

  // === Image upload hook ===
  const { images, setImages, uploading, uploadFromInputEvent, deleteImage } =
    useNoteImageUpload({
      noteId: note?.id,
      initialImages: note?.images || [],
      onImagesChange: (newImages) =>
        onUpdateCache(note.id, title, content, newImages),
    });

  // === Auto-save debounce ===
  useEffect(() => {
    const handler = setTimeout(async () => {
      if (!note) return;
      const nextUnlockDate = unlockDate
        ? new Date(unlockDate).toISOString()
        : null;
      const nextIsTimeLocked = Boolean(
        nextUnlockDate && new Date(nextUnlockDate).getTime() > Date.now()
      );
      const input: any = {
        id: note.id,
        title,
        mood: mood || undefined,
        eventDate: eventDate || undefined,
        eventLocation: eventLocation || undefined,
        unlockDate: nextUnlockDate,
      };
      if (!contentMasked) input.content = content;
      try {
        await updateContent({ variables: { input } });
        onUpdateCache(
          note.id,
          title,
          contentMasked ? undefined : content,
          undefined,
          undefined,
          mood,
          {
            unlockDate: nextUnlockDate,
            isTimeLocked: nextIsTimeLocked,
          }
        );
      } catch (err: any) {
        if (
          err?.message?.includes("not found") ||
          err?.message?.includes("Not Found")
        ) {
          onDeleteSuccess();
          return;
        }
        console.error("Auto-save failed:", err);
      }
    }, 800);
    return () => clearTimeout(handler);
  }, [
    title,
    content,
    contentMasked,
    mood,
    eventDate,
    eventLocation,
    unlockDate,
  ]);

  // === Reset state when note changes ===
  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setContent(note.content || "");
      setContentMasked(
        Boolean(
          note.isTimeLocked &&
            (note.content === null || note.content === undefined)
        )
      );
      setMood(note.mood || "");
      setIsLocked(note.isLocked || false);
      setEventDate(note.eventDate ? note.eventDate.split("T")[0] : "");
      setEventLocation(note.eventLocation || "");
      setUnlockDate(toDateTimeInputValue(note.unlockDate));
      setImages(note.images || []);
      try {
        setMetadata(note.storyMetadata ? JSON.parse(note.storyMetadata) : {});
      } catch {
        setMetadata({});
      }
    }
  }, [note?.id]);

  // === Handlers ===
  const handleToggleLock = async () => {
    try {
      await toggleLock({ variables: { noteId: note.id } });
      setIsLocked(!isLocked);
      notify.success(isLocked ? "Node dibuka" : "Node dikunci");
    } catch (err) {
      notify.error("Gagal mengubah lock");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteNoteMut({ variables: { id: note.id } });
      notify.success("Node dihapus");
      onDeleteSuccess();
    } catch (err) {
      notify.error("Gagal menghapus node");
    }
  };

  // === Metadata setter wrapper ===
  const handleMetadataChange = (key: string, value: string) => {
    setMetadata((prev: any) => ({ ...prev, [key]: value }));
  };

  // === Computed values ===
  if (!note) return null;
  const nodeType = note.storyNodeType || "scene";
  const isTimeLocked = Boolean(
    unlockDate && new Date(unlockDate).getTime() > Date.now()
  );
  const isContentSealed = isTimeLocked || contentMasked;

  // === Auto-reload Time Capsule when unlock date passes ===
  useEffect(() => {
    if (!unlockDate || !onRequestRefresh) return;
    const unlockTs = new Date(unlockDate).getTime();
    const now = Date.now();
    if (unlockTs <= now && contentMasked) {
      onRequestRefresh();
      return;
    }
    const delay = Math.min(unlockTs - now, 24 * 60 * 60 * 1000);
    if (delay <= 0) return;
    const timer = setTimeout(() => onRequestRefresh(), delay + 500);
    return () => clearTimeout(timer);
  }, [unlockDate, contentMasked, onRequestRefresh]);

  return (
    <div
      className={`${
        focusMode
          ? "fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          : ""
      }`}
    >
      <div
        className={`${
          focusMode
            ? "relative w-[700px] max-h-[90vh] rounded-2xl shadow-2xl"
            : "absolute top-0 right-0 h-full w-[420px]"
        } bg-white/95 dark:bg-[#2a2438]/95 backdrop-blur-2xl shadow-2xl border-l border-[#FFB8C0]/15 dark:border-[#E63946]/10 z-50 flex flex-col overflow-hidden`}
      >
        {/* Accent line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-candy-accent-line" />

        <EditorHeader
          nodeType={nodeType}
          isLocked={isLocked}
          isTimeLocked={isTimeLocked}
          focusMode={focusMode}
          onToggleLock={handleToggleLock}
          onDelete={handleDelete}
          onToggleFocus={() => setFocusMode(!focusMode)}
          onClose={onClose}
        />

        <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
          {/* Title */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Judul node..."
              className="w-full text-lg font-bold text-[#4A2F3C] dark:text-[#e2d9f3] bg-transparent border-none outline-none placeholder:text-[#5A3E4C]/20"
            />
          </div>

          <TimeCapsuleField
            unlockDate={unlockDate}
            isTimeLocked={isTimeLocked}
            onChange={setUnlockDate}
          />

          <MetadataFields
            nodeType={nodeType}
            metadata={metadata}
            onMetadataChange={handleMetadataChange}
          />

          {/* Content Editor */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#5A3E4C]/50 font-semibold mb-2">
              Konten
            </label>
            {isContentSealed ? (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[#1a1625]/5 dark:bg-white/5 border border-[#FFB8C0]/15 dark:border-[#E63946]/10">
                <Lock className="w-4 h-4 text-[#E63946]/70" />
                <div>
                  <p className="text-xs font-semibold text-[#4A2F3C] dark:text-[#e2d9f3]">
                    {isTimeLocked ? "Konten tersegel" : "Konten perlu dimuat ulang"}
                  </p>
                  <p className="text-[10px] text-[#5A3E4C]/45 dark:text-[#e2d9f3]/35 mt-0.5">
                    {isTimeLocked
                      ? "Backend menyembunyikan isi memory ini sampai tanggal buka."
                      : "Time Capsule sudah dibuka. Tutup dan buka kembali node untuk memuat konten asli sebelum mengedit."}
                  </p>
                </div>
              </div>
            ) : (
              <TiptapEditor content={content} onChange={setContent} />
            )}
          </div>

          <EmotionPicker value={mood} onChange={setMood} />

          <EventFields
            eventDate={eventDate}
            eventLocation={eventLocation}
            onDateChange={setEventDate}
            onLocationChange={setEventLocation}
          />

          <MediaGallery
            images={images}
            uploading={uploading}
            isSealed={isContentSealed}
            isTimeLocked={isTimeLocked}
            onUpload={uploadFromInputEvent}
            onDelete={deleteImage}
          />

          {/* Auto-save indicator */}
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
