"use client";

import { Calendar, MapPin } from "lucide-react";

interface EventFieldsProps {
  eventDate: string;
  eventLocation: string;
  onDateChange: (value: string) => void;
  onLocationChange: (value: string) => void;
}

/**
 * EventFields - Date and location inputs for memory timeline.
 */
export function EventFields({
  eventDate,
  eventLocation,
  onDateChange,
  onLocationChange,
}: EventFieldsProps) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-wider text-[#5A3E4C]/50 font-semibold mb-2">
        Kapan &amp; Dimana
      </label>
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-[#CC5DE8]/5 border border-[#CC5DE8]/10">
          <Calendar className="w-3.5 h-3.5 text-[#CC5DE8]/60" />
          <input
            type="date"
            value={eventDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="flex-1 text-xs text-[#4A2F3C] dark:text-[#e2d9f3] bg-transparent outline-none"
          />
        </div>
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-[#38D9A9]/5 border border-[#38D9A9]/10">
          <MapPin className="w-3.5 h-3.5 text-[#38D9A9]/60" />
          <input
            type="text"
            value={eventLocation}
            onChange={(e) => onLocationChange(e.target.value)}
            placeholder="Lokasi kejadian..."
            className="flex-1 text-xs text-[#4A2F3C] dark:text-[#e2d9f3] bg-transparent outline-none placeholder:text-[#5A3E4C]/20"
          />
        </div>
      </div>
    </div>
  );
}
