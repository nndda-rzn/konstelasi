"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";
import { usePhotoboothStore } from "../store/usePhotoboothStore";
import { CompactSettingsPanel } from "./CompactSettingsPanel";

/**
 * SettingsSheet - Mobile bottom sheet that opens via "Pengaturan" trigger.
 * Slides up from bottom with backdrop; closes on backdrop click / Escape.
 */
export function SettingsSheet() {
  const isOpen = usePhotoboothStore((s) => s.isSettingsSheetOpen);
  const setOpen = usePhotoboothStore((s) => s.setSettingsSheetOpen);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, setOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 280 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 80 || info.velocity.y > 400) {
                setOpen(false);
              }
            }}
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-3xl border-t border-[#FFB8C0]/25 bg-white/95 p-5 shadow-[0_-12px_40px_rgba(84,45,55,0.18)] backdrop-blur-2xl lg:hidden"
          >
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[#FFB8C0]/40" />
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#3F2A35]">Pengaturan</h3>
              <button
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#8C7783] hover:bg-[#FFE5E8]/60 hover:text-[#3F2A35]"
                aria-label="Tutup"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <CompactSettingsPanel />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
