"use client";

import { useMemo } from "react";
import { usePhotoBoothStore, PHOTO_LAYOUTS } from "../../photoBoothStore";
import {
  getCompatibleTemplates,
  getTemplateById,
  type TemplateConfig,
  type TemplateId,
} from "../../config/templates";
import { TemplateThumb } from "./TemplateThumb";

/**
 * TemplateSelector - Grid of template thumbnails compatible with
 * the current layout + captured photo count.
 *
 * Includes an "Off" option (selectedTemplateId = null) that falls
 * back to the legacy frame-only behavior.
 */
export function TemplateSelector() {
  const selectedLayoutId = usePhotoBoothStore((s) => s.selectedLayoutId);
  const capturedFrames = usePhotoBoothStore((s) => s.capturedFrames);
  const selectedTemplateId = usePhotoBoothStore((s) => s.selectedTemplateId);
  const setSelectedTemplate = usePhotoBoothStore((s) => s.setSelectedTemplate);

  // Only show templates compatible with the current layout + photo count
  const compatible = useMemo(
    () => getCompatibleTemplates(selectedLayoutId, capturedFrames.length),
    [selectedLayoutId, capturedFrames.length]
  );

  // Also include currently selected template even if not compatible
  // (so the user can deselect or change selection)
  const templates = useMemo(() => {
    if (
      selectedTemplateId &&
      !compatible.find((t) => t.id === selectedTemplateId)
    ) {
      const sel = getTemplateById(selectedTemplateId as TemplateId);
      if (sel) return [...compatible, sel];
    }
    return compatible;
  }, [compatible, selectedTemplateId]);

  return (
    <div className="space-y-2">
      {/* Off option — legacy frame mode */}
      <button
        onClick={() => setSelectedTemplate(null)}
        className={`flex w-full items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition-all ${
          selectedTemplateId === null
            ? "border-[#D4A574] bg-[#D4A574]/[0.06]"
            : "border-black/10 bg-white/60 hover:bg-white"
        }`}
        style={{ borderColor: selectedTemplateId === null ? "rgba(212, 165, 116, 0.5)" : undefined }}
      >
        <div
          className="flex h-9 w-7 shrink-0 items-center justify-center rounded-[3px] border border-black/10 bg-white text-[10px] font-semibold tracking-wider text-[#8C7783]"
        >
          ∅
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold text-[#3F2A35]">Tanpa Template</p>
          <p className="text-[9.5px] text-[#8C7783]">Gunakan frame saja</p>
        </div>
      </button>

      {templates.length === 0 ? (
        <p className="py-3 text-center text-[10.5px] text-[#8C7783]">
          Belum ada template yang cocok.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {templates.map((template) => (
            <TemplateThumb
              key={template.id}
              template={template}
              active={selectedTemplateId === template.id}
              onSelect={() => setSelectedTemplate(template.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
