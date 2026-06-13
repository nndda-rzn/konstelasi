"use client";

import { Check, Plus } from "lucide-react";

interface CanvasFormModalProps {
  mode: "create" | "edit";
  name: string;
  description: string;
  onNameChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export function CanvasFormModal({
  mode,
  name,
  description,
  onNameChange,
  onDescriptionChange,
  onSubmit,
  onClose,
}: CanvasFormModalProps) {
  const title = mode === "create" ? "New Canvas" : "Edit Canvas";
  const submitLabel = mode === "create" ? "Create Canvas" : "Save Changes";

  return (
    <div className="fixed inset-0 bg-[#5A3E4C]/20 flex items-center justify-center z-50">
      <div className="bg-white/95 backdrop-blur-2xl shadow-2xl shadow-pink-200/30 rounded-xl w-[90%] max-w-md p-6 space-y-4">
        <h3 className="text-lg font-bold bg-gradient-to-r from-[#FF8FA3] to-[#FFB4A2] bg-clip-text text-transparent">
          {title}
        </h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-[#5A3E4C]/40 uppercase tracking-wider mb-1">
              Canvas Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              className="w-full bg-white/60 border border-[#FFB4A2]/20 rounded-xl text-[#4A2F3C] text-lg font-semibold px-4 py-3 placeholder-[#5A3E4C]/30 focus:outline-none focus:ring-2 focus:ring-[#FF8FA3]/30 focus:border-[#FF8FA3]/30 transition-all hover:bg-white/80"
              placeholder="My Thoughts Canvas"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#5A3E4C]/40 uppercase tracking-wider mb-1">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              className="w-full bg-white/60 border border-[#FFB4A2]/20 rounded-xl text-[#4A2F3C] text-sm font-medium px-4 py-3 placeholder-[#5A3E4C]/30 focus:outline-none focus:ring-2 focus:ring-[#FF8FA3]/30 focus:border-[#FF8FA3]/30 transition-all hover:bg-white/80"
              rows={3}
              placeholder="What will you use this canvas for?"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[#5A3E4C]/40 hover:text-[#5A3E4C]/60 hover:bg-[#FFB4A2]/10 rounded-lg transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-gradient-to-r from-[#FF8FA3] to-[#FFB4A2] rounded-lg text-white font-medium hover:from-[#FF7A8A] hover:to-[#FF8FA3] transition-all shadow-sm inline-flex items-center gap-1.5 disabled:opacity-50"
            disabled={!name.trim()}
          >
            {mode === "create" ? (
              <Plus className="w-4 h-4" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
