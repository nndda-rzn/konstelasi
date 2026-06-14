"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Camera, RotateCcw, Download, Save, FlipHorizontal } from "lucide-react";
import { usePhotoboothStore } from "../store/usePhotoboothStore";

interface StickyCaptureBarProps {
  onStart: () => void;
  onRetake: () => void;
  onDownload: () => void;
  onSave: () => void;
}

/**
 * StickyCaptureBar - Sticky bottom bar with primary CTA and contextual secondary actions.
 */
export function StickyCaptureBar({ 
  onStart, 
  onRetake, 
  onDownload, 
  onSave 
}: StickyCaptureBarProps) {
  const stage = usePhotoboothStore((s) => s.stage);
  const capturedPhotos = usePhotoboothStore((s) => s.capturedPhotos);
  const selectedLayout = usePhotoboothStore((s) => s.selectedLayout);
  const toggleFacingMode = usePhotoboothStore((s) => s.toggleFacingMode);

  const isSetup = stage === "setup";
  const isCapture = stage === "countdown" || stage === "flash";
  const isEdit = stage === "edit" || stage === "saving";

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 md:pl-[260px] pointer-events-none">
      <div className="mx-auto max-w-6xl xl:max-w-7xl 2xl:max-w-[1600px] px-6 pb-6">
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="pointer-events-auto flex items-center justify-between rounded-3xl border border-[#FFB8C0]/25 bg-white/85 p-3 pr-4 shadow-[0_8px_40px_rgba(84,45,55,0.18)] backdrop-blur-2xl"
        >
          {/* Left: Context Info */}
          <div className="flex items-center gap-4 pl-4">
            <div className="hidden sm:block">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#6D5561]">Status</p>
              <div className="flex items-center gap-2 mt-0.5">
                <div className={`h-1.5 w-1.5 rounded-full ${isCapture ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
                <p className="text-xs font-semibold text-[#3F2A35]">
                  {isSetup ? 'Siap' : isCapture ? 'Mengambil Foto' : isEdit ? 'Mode Edit' : 'Selesai'}
                </p>
              </div>
            </div>
            
            <div className="h-8 w-px bg-[#FFB8C0]/15 hidden sm:block" />
            
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#6D5561]">Progress</p>
              <p className="text-xs font-semibold text-[#3F2A35] mt-0.5">
                {capturedPhotos.length} / {selectedLayout.includes('strip4') ? 4 : selectedLayout.includes('strip3') ? 3 : selectedLayout.includes('grid4') ? 4 : selectedLayout.includes('grid6') ? 6 : selectedLayout.includes('single') ? 1 : selectedLayout.includes('wide2') ? 2 : selectedLayout.includes('cinematic3') ? 3 : 4} Foto
              </p>
            </div>
          </div>

          {/* Center: Primary CTA */}
          <div className="flex items-center gap-3">
            <AnimatePresence mode="wait">
              {isSetup && (
                <motion.button
                  key="start"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={onStart}
                  className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-[#E63946] to-[#FF6B7A] px-10 py-4 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Camera className="h-5 w-5" />
                  <span>Mulai Sesi Foto</span>
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              )}

              {isEdit && (
                <motion.button
                  key="save"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={onSave}
                  className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[#E63946] px-10 py-4 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Save className="h-5 w-5" />
                  <span>Simpan ke Kanvas</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Secondary Actions */}
          <div className="flex items-center gap-2">
            {isSetup && (
              <button
                onClick={toggleFacingMode}
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#FFB8C0]/25 bg-white/50 text-[#6D5561] hover:bg-white hover:text-[#E63946] transition-all"
                title="Ganti Kamera"
              >
                <FlipHorizontal className="h-5 w-5" />
              </button>
            )}
            
            {isEdit && (
              <>
                <button
                  onClick={onDownload}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#FFB8C0]/25 bg-white/50 text-[#6D5561] hover:bg-white hover:text-[#E63946] transition-all"
                  title="Unduh Foto"
                >
                  <Download className="h-5 w-5" />
                </button>
                <button
                  onClick={onRetake}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#FFB8C0]/25 bg-white/50 text-[#6D5561] hover:bg-white hover:text-[#E63946] transition-all"
                  title="Foto Ulang"
                >
                  <RotateCcw className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
