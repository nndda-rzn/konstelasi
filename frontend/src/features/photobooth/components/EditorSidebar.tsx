"use client";

import { Loader2, Palette, LayoutTemplate, Smile, X } from "lucide-react";
import {
  FILTERS,
  STRIP_COLORS,
  EMOJI_PALETTE,
  type EditTab,
} from "../constants";
import { usePhotoboothStore } from "../store/usePhotoboothStore";

interface EditorSidebarProps {
  onSave: () => void;
  onDownload: () => void;
  onRetake: () => void;
}

/**
 * EditorSidebar - Tabs (filter/color/sticker) + caption input + action buttons.
 * Pure UI: subscribes to store; calls parent handlers for save/download/retake.
 */
export function EditorSidebar({
  onSave,
  onDownload,
  onRetake,
}: EditorSidebarProps) {
  const stage = usePhotoboothStore((s) => s.stage);
  const processing = usePhotoboothStore((s) => s.processing);
  const activeTab = usePhotoboothStore((s) => s.activeTab);
  const setActiveTab = usePhotoboothStore((s) => s.setActiveTab);
  const selectedFilter = usePhotoboothStore((s) => s.selectedFilter);
  const setSelectedFilter = usePhotoboothStore((s) => s.setSelectedFilter);
  const selectedLayout = usePhotoboothStore((s) => s.selectedLayout);
  const selectedStripColor = usePhotoboothStore(
    (s) => s.selectedStripColor
  );
  const setSelectedStripColor = usePhotoboothStore(
    (s) => s.setSelectedStripColor
  );
  const caption = usePhotoboothStore((s) => s.caption);
  const setCaption = usePhotoboothStore((s) => s.setCaption);
  const capturedPhotos = usePhotoboothStore((s) => s.capturedPhotos);
  const stickers = usePhotoboothStore((s) => s.stickers);
  const addSticker = usePhotoboothStore((s) => s.addSticker);
  const removeSticker = usePhotoboothStore((s) => s.removeSticker);

  return (
    <div className="flex flex-col gap-4">
      {/* Tabs */}
      <div className="flex gap-1 rounded-2xl border border-[#FFB8C0]/20 bg-white/50 p-1">
        {(
          [
            ["filter", "Filter", Palette],
            ["color", "Warna", LayoutTemplate],
            ["sticker", "Stiker", Smile],
          ] as const
        ).map(([k, lbl, Icon]) => (
          <button
            key={k}
            onClick={() => setActiveTab(k as EditTab)}
            className={`flex flex-1 items-center justify-center gap-1 rounded-xl py-2 text-[11px] font-semibold transition-all ${
              activeTab === k
                ? "bg-[#E63946] text-white shadow-sm"
                : "text-[#6D5561] hover:text-[#3F2A35]"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {lbl}
          </button>
        ))}
      </div>

      {/* Filter tab */}
      {activeTab === "filter" && (
        <div className="grid grid-cols-4 gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setSelectedFilter(f.key)}
              className={`flex flex-col items-center gap-1.5 rounded-2xl border p-2 transition-all ${
                selectedFilter === f.key
                  ? "border-[#E63946]/40 bg-[#E63946]/6"
                  : "border-[#FFB8C0]/20 bg-white/50 hover:border-[#FFB8C0]/40"
              }`}
            >
              {capturedPhotos[0] && (
                <div className="h-10 w-10 overflow-hidden rounded-lg">
                  <img
                    src={capturedPhotos[0]}
                    alt=""
                    className="h-full w-full object-cover"
                    style={{ filter: f.css }}
                  />
                </div>
              )}
              <span
                className={`text-[10px] font-semibold ${
                  selectedFilter === f.key
                    ? "text-[#E63946]"
                    : "text-[#6D5561]"
                }`}
              >
                {f.label}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Color tab */}
      {activeTab === "color" && selectedLayout !== "single" && (
        <div className="grid grid-cols-2 gap-2">
          {STRIP_COLORS.map((c) => (
            <button
              key={c.key}
              onClick={() => setSelectedStripColor(c.key)}
              className={`rounded-2xl border p-3 text-left transition-all ${
                selectedStripColor === c.key
                  ? "border-[#E63946]/40 bg-[#E63946]/6"
                  : "border-[#FFB8C0]/20 bg-white/50 hover:border-[#FFB8C0]/40"
              }`}
            >
              <div
                className="mb-2 h-6 w-full rounded-lg"
                style={{
                  backgroundColor: c.bg,
                  border: c.key === "white" ? "1px solid #eee" : "none",
                }}
              />
              <p
                className={`text-xs font-bold ${
                  selectedStripColor === c.key
                    ? "text-[#E63946]"
                    : "text-[#3F2A35]"
                }`}
              >
                {c.label}
              </p>
            </button>
          ))}
        </div>
      )}
      {activeTab === "color" && selectedLayout === "single" && (
        <p className="text-xs text-[#8C7783] text-center py-4">
          Warna frame hanya untuk mode Strip/Grid.
        </p>
      )}

      {/* Sticker tab */}
      {activeTab === "sticker" && (
        <div className="space-y-3">
          <div className="grid grid-cols-8 gap-1.5">
            {EMOJI_PALETTE.map((e) => (
              <button
                key={e}
                onClick={() => addSticker(e)}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-xl hover:bg-[#FFE5E8]/60 transition-colors"
              >
                {e}
              </button>
            ))}
          </div>
          {stickers.length > 0 && (
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#6D5561]">
                Aktif ({stickers.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {stickers.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => removeSticker(s.id)}
                    className="flex items-center gap-1 rounded-full border border-[#FFB8C0]/30 bg-white/60 px-2 py-1 text-sm hover:bg-red-50 hover:border-red-200 transition-all"
                  >
                    {s.emoji}
                    <X className="h-3 w-3 text-[#8C7783]" />
                  </button>
                ))}
              </div>
            </div>
          )}
          <p className="text-[10px] text-[#8C7783]">
            Klik emoji untuk menambah. Geser di preview untuk memposisikan.
          </p>
        </div>
      )}

      {/* Caption input */}
      <div>
        <p className="mb-1.5 text-[11px] font-bold uppercase tracking-widest text-[#6D5561]">
          Caption
        </p>
        <input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Tulis caption..."
          className="w-full rounded-2xl border border-[#FFB8C0]/25 bg-white/65 px-4 py-2.5 text-sm text-[#3F2A35] outline-none placeholder:text-[#8C7783]/60 focus:border-[#E63946]/35 focus:ring-4 focus:ring-[#FFB8C0]/15 font-scrapbook-handwriting"
        />
      </div>

      {/* Action buttons */}
      <div className="mt-auto flex flex-col gap-2">
        <button
          onClick={onSave}
          disabled={stage === "saving" || processing}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#E63946] to-[#FF6B7A] py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(230,57,70,0.22)] disabled:opacity-60"
        >
          {stage === "saving" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <span>📥</span>
          )}
          {stage === "saving" ? "Menyimpan..." : "Simpan ke Kanvas"}
        </button>
        <div className="flex gap-2">
          <button
            onClick={onDownload}
            disabled={processing}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[#FFB8C0]/25 bg-white/60 py-3 text-xs font-semibold text-[#6D5561] hover:bg-white/80 disabled:opacity-50"
          >
            Unduh
          </button>
          <button
            onClick={onRetake}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[#FFB8C0]/25 bg-white/60 py-3 text-xs font-semibold text-[#6D5561] hover:bg-white/80"
          >
            Ulangi
          </button>
        </div>
      </div>
    </div>
  );
}
