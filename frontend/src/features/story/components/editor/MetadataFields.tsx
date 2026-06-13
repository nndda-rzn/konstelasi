"use client";

import { Clock, Heart, MapPin } from "lucide-react";

interface MetadataFieldsProps {
  nodeType: string;
  metadata: any;
  onMetadataChange: (key: string, value: string) => void;
}

/**
 * MetadataFields - Node-type-specific metadata inputs.
 * - scene/timeline_event: location + time
 * - character: character name
 */
export function MetadataFields({
  nodeType,
  metadata,
  onMetadataChange,
}: MetadataFieldsProps) {
  // Scene/Event: location + time
  if (nodeType === "scene" || nodeType === "timeline_event") {
    return (
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-[#FFB8C0]/5 dark:bg-[#E63946]/5 border border-[#FFB8C0]/10 dark:border-[#E63946]/10">
          <MapPin className="w-3.5 h-3.5 text-[#E63946]/60" />
          <input
            type="text"
            value={metadata.sceneLocation || ""}
            onChange={(e) => onMetadataChange("sceneLocation", e.target.value)}
            placeholder="Lokasi..."
            className="flex-1 text-xs text-[#4A2F3C] dark:text-[#e2d9f3] bg-transparent outline-none placeholder:text-[#5A3E4C]/20"
          />
        </div>
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-[#FFB8C0]/5 dark:bg-[#E63946]/5 border border-[#FFB8C0]/10 dark:border-[#E63946]/10">
          <Clock className="w-3.5 h-3.5 text-[#87CEEB]/60" />
          <input
            type="text"
            value={metadata.sceneTime || ""}
            onChange={(e) => onMetadataChange("sceneTime", e.target.value)}
            placeholder="Waktu..."
            className="flex-1 text-xs text-[#4A2F3C] dark:text-[#e2d9f3] bg-transparent outline-none placeholder:text-[#5A3E4C]/20"
          />
        </div>
      </div>
    );
  }

  // Character: name
  if (nodeType === "character") {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#E0BBE4]/10 border border-[#E0BBE4]/20">
        <Heart className="w-3.5 h-3.5 text-[#E0BBE4]" />
        <input
          type="text"
          value={metadata.characterName || ""}
          onChange={(e) => onMetadataChange("characterName", e.target.value)}
          placeholder="Nama karakter..."
          className="flex-1 text-xs text-[#4A2F3C] dark:text-[#e2d9f3] bg-transparent outline-none placeholder:text-[#5A3E4C]/20"
        />
      </div>
    );
  }

  return null;
}
