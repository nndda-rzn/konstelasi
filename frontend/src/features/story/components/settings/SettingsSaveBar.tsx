"use client";

import { Save } from "lucide-react";
import { DeleteConfirm } from "./DeleteConfirm";

interface SettingsSaveBarProps {
  saving: boolean;
  showDeleteConfirm: boolean;
  onSave: () => void;
  onToggleDelete: () => void;
  onConfirmDelete: () => void;
}

/**
 * SettingsSaveBar - Footer of the story settings panel with
 * the primary save button and the delete-confirm flow.
 */
export function SettingsSaveBar({
  saving,
  showDeleteConfirm,
  onSave,
  onToggleDelete,
  onConfirmDelete,
}: SettingsSaveBarProps) {
  return (
    <div className="px-5 py-4 border-t border-[#FFB8C0]/10 dark:border-[#E63946]/10 space-y-2">
      <button
        onClick={onSave}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#E63946] hover:bg-[#E63946]/90 text-white text-sm font-medium transition-all disabled:opacity-50"
      >
        <Save className="w-4 h-4" />
        {saving ? "Menyimpan..." : "Simpan Perubahan"}
      </button>
      <DeleteConfirm
        isVisible={showDeleteConfirm}
        onConfirm={onConfirmDelete}
        onCancel={onToggleDelete}
      />
    </div>
  );
}
