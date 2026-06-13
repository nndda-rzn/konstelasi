"use client";

import { Check, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTags } from "@/context/TagContext";
import { notify } from "@/lib/toast";
import { TAG_COLORS, DEFAULT_TAG_COLOR } from "./tagPanelConstants";

interface TagItemProps {
  tag: { id: string; name: string; color?: string | null };
  isSelected: boolean;
  isEditing: boolean;
  onToggleFilter: (id: string) => void;
  onEdit: (id: string, name: string, color: string) => void;
  onDelete: (id: string) => void;
}

export function TagItem({
  tag,
  isSelected,
  isEditing,
  onToggleFilter,
  onEdit,
  onDelete,
}: TagItemProps) {
  const [editName, setEditName] = useState(tag.name);
  const [editColor, setEditColor] = useState(tag.color || DEFAULT_TAG_COLOR);
  const { updateTag } = useTags();

  const handleSave = async () => {
    if (!editName.trim()) return;
    try {
      await updateTag(tag.id, editName.trim(), editColor);
      onEdit(tag.id, editName.trim(), editColor);
      notify.success("Tag diperbarui");
    } catch {
      notify.error("Gagal memperbarui tag");
    }
  };

  if (isEditing) {
    return (
      <div className="p-3 rounded-xl border border-[#FFB4A2]/20 bg-[#FFF5F0]/50 space-y-2">
        <input
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          className="w-full bg-white/60 border border-[#FFB4A2]/20 rounded-lg px-3 py-2 text-sm text-[#4A2F3C] focus:outline-none focus:ring-1 focus:ring-[#FF8FA3]/40"
          autoFocus
        />
        <ColorPicker
          value={editColor}
          onChange={setEditColor}
        />
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="px-3 py-1.5 bg-[#FF8FA3] text-white text-xs rounded-lg font-medium"
          >
            <Check className="w-3 h-3" />
          </button>
          <button
            onClick={() => onEdit(tag.id, "", "")}
            className="px-3 py-1.5 text-[#5A3E4C]/40 text-xs rounded-lg hover:bg-[#FFB4A2]/10"
          >
            Batal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#FFF5F0]/50 transition-all">
      <button
        onClick={() => onToggleFilter(tag.id)}
        className={`w-4 h-4 rounded-full border-2 transition-all shrink-0 ${
          isSelected
            ? "border-transparent scale-110"
            : "border-[#5A3E4C]/20"
        }`}
        style={{
          backgroundColor: isSelected ? tag.color || "#FF8FA3" : "transparent",
        }}
      />
      <div
        className="w-3 h-3 rounded-full shrink-0"
        style={{ backgroundColor: tag.color || "#FF8FA3" }}
      />
      <span className="flex-1 text-sm text-[#4A2F3C] font-medium truncate">
        {tag.name}
      </span>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(tag.id, tag.name, tag.color || DEFAULT_TAG_COLOR)}
          className="p-1 text-[#5A3E4C]/30 hover:text-[#FF8FA3] rounded transition-colors"
        >
          <Edit className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onDelete(tag.id)}
          className="p-1 text-[#5A3E4C]/30 hover:text-[#FF6B9D] rounded transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function ColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {TAG_COLORS.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className={`w-5 h-5 rounded-full transition-all ${
            value === c
              ? "ring-2 ring-offset-1 ring-[#5A3E4C]/30 scale-110"
              : "hover:scale-110"
          }`}
          style={{ backgroundColor: c }}
        />
      ))}
    </div>
  );
}
