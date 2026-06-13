"use client";

import { Clock, MapPin } from "lucide-react";

interface NodeMetadataBadgesProps {
  nodeType: string;
  metadata: any;
}

export function NodeMetadataBadges({
  nodeType,
  metadata,
}: NodeMetadataBadgesProps) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-[9px] uppercase tracking-wider font-semibold text-[#E63946]">
        {(nodeType || "scene").replace("_", " ")}
      </span>
      {metadata.sceneLocation && (
        <span className="flex items-center gap-1 text-[9px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">
          <MapPin className="w-2.5 h-2.5" /> {metadata.sceneLocation}
        </span>
      )}
      {metadata.sceneTime && (
        <span className="flex items-center gap-1 text-[9px] text-[#5A3E4C]/40 dark:text-[#e2d9f3]/30">
          <Clock className="w-2.5 h-2.5" /> {metadata.sceneTime}
        </span>
      )}
    </div>
  );
}
