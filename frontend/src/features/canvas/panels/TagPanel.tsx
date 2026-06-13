"use client";

import { useState } from "react";
import { useTags } from "@/context/TagContext";
import { TagPanelHeader } from "./tagPanel/TagPanelHeader";
import { ActiveFilters, useTagFilter } from "./tagPanel/ActiveFilters";
import { TagItem } from "./tagPanel/TagItem";
import {
  CreateTagForm,
  CreateTagTrigger,
} from "./tagPanel/CreateTagForm";
import { notify } from "@/lib/toast";

interface TagPanelProps {
  onClose: () => void;
}

export default function TagPanel({ onClose }: TagPanelProps) {
  const { tags, deleteTag, setSelectedTagFilters, selectedTagFilters } =
    useTags();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const { toggle } = useTagFilter();

  const handleDelete = async (id: string) => {
    try {
      await deleteTag(id);
      setSelectedTagFilters(selectedTagFilters.filter((f) => f !== id));
      notify.success("Tag dihapus");
    } catch {
      notify.error("Gagal menghapus tag");
    }
  };

  const handleEdit = (id: string, _name: string, _color: string) => {
    // Toggle: if name is empty, cancel edit; else exit edit mode
    if (!editingId) setEditingId(id);
    else setEditingId(null);
  };

  return (
    <div className="fixed top-0 right-0 h-full w-[320px] bg-white/95 backdrop-blur-2xl shadow-2xl shadow-pink-200/30 border-l border-[#FFB4A2]/15 z-50 flex flex-col pt-16 animate-slide-in-right">
      <div className="absolute top-16 left-0 w-px h-full bg-gradient-to-b from-[#FF8FA3]/40 via-[#FFB4A2]/10 to-transparent" />

      <TagPanelHeader onClose={onClose} />

      <ActiveFilters
        count={selectedTagFilters.length}
        onClear={() => setSelectedTagFilters([])}
      />

      <div className="flex-1 overflow-y-auto p-5 space-y-2">
        {tags.map((tag) => (
          <div key={tag.id} className="group">
            <TagItem
              tag={tag}
              isSelected={selectedTagFilters.includes(tag.id)}
              isEditing={editingId === tag.id}
              onToggleFilter={toggle}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        ))}

        {tags.length === 0 && (
          <div className="text-center py-8 text-[#5A3E4C]/40 text-sm">
            <p>Belum ada tag.</p>
            <p className="text-xs mt-1">Buat tag untuk mengorganisir catatan.</p>
          </div>
        )}
      </div>

      <div className="p-5 border-t border-[#FFB4A2]/15">
        {showCreate ? (
          <CreateTagForm onClose={() => setShowCreate(false)} />
        ) : (
          <CreateTagTrigger onClick={() => setShowCreate(true)} />
        )}
      </div>
    </div>
  );
}
