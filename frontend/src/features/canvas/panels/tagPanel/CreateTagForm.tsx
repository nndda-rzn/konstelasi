"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useTags } from "@/context/TagContext";
import { notify } from "@/lib/toast";
import { TAG_COLORS, DEFAULT_TAG_COLOR } from "./tagPanelConstants";

/**
 * CreateTagForm - Inline form to create a new tag.
 */
export function CreateTagForm({ onClose }: { onClose: () => void }) {
  const { createTag } = useTags();
  const [name, setName] = useState("");
  const [color, setColor] = useState(DEFAULT_TAG_COLOR);

  const handleCreate = async () => {
    if (!name.trim()) return;
    try {
      await createTag(name.trim(), color);
      setName("");
      setColor(DEFAULT_TAG_COLOR);
      onClose();
      notify.success("Tag dibuat");
    } catch {
      notify.error("Gagal membuat tag");
    }
  };

  return (
    <div className="space-y-3">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleCreate()}
        placeholder="Nama tag..."
        className="w-full bg-white/60 border border-[#FFB4A2]/20 rounded-xl px-4 py-2.5 text-sm text-[#4A2F3C] placeholder-[#5A3E4C]/30 focus:outline-none focus:ring-1 focus:ring-[#FF8FA3]/40"
        autoFocus
      />
      <div className="flex flex-wrap gap-1.5">
        {TAG_COLORS.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className={`w-5 h-5 rounded-full transition-all ${
              color === c
                ? "ring-2 ring-offset-1 ring-[#5A3E4C]/30 scale-110"
                : "hover:scale-110"
            }`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleCreate}
          disabled={!name.trim()}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-[#FF8FA3] to-[#FFB4A2] text-white text-sm font-medium rounded-xl disabled:opacity-50 transition-all"
        >
          Buat Tag
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 text-[#5A3E4C]/40 text-sm rounded-xl hover:bg-[#FFB4A2]/10 transition-all"
        >
          Batal
        </button>
      </div>
    </div>
  );
}

/**
 * CreateTagTrigger - Button to open the create form.
 */
export function CreateTagTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FFF5F0] border border-[#FFB4A2]/15 rounded-xl text-sm font-medium text-[#5A3E4C]/60 hover:text-[#FF8FA3] hover:bg-[#FFB4A2]/10 transition-all"
    >
      <Plus className="w-4 h-4" /> Buat Tag Baru
    </button>
  );
}
