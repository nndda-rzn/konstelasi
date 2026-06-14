"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Lock, Sparkles, X } from "lucide-react";

interface AuthPromptModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
}

/**
 * AuthPromptModal - Soft glass-morphism prompt shown when an
 * unauthenticated user attempts a state-changing action.
 */
export function AuthPromptModal({ open, onClose, onLogin }: AuthPromptModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/30 backdrop-blur-md" />

          <motion.div
            initial={{ scale: 0.92, y: 12, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 22, stiffness: 280 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/60 bg-white/85 p-8 shadow-[0_24px_80px_rgba(84,45,55,0.25)] backdrop-blur-2xl"
          >
            <div className="pointer-events-none absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-[#FFB8C0]/40 blur-3xl" />

            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-1.5 text-[#8C7783] transition-colors hover:bg-white/60 hover:text-[#3F2A35]"
              aria-label="Tutup"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#E63946]/10 to-[#FF6B7A]/10">
              <Lock className="h-6 w-6 text-[#E63946]" />
            </div>

            <h3 className="text-center text-lg font-bold tracking-tight text-[#3F2A35]">
              Masuk dulu untuk menyimpan
            </h3>
            <p className="mx-auto mt-2 max-w-xs text-center text-[13px] leading-relaxed text-[#6D5561]">
              Foto Anda aman di perangkat ini. Masuk untuk menyimpan ke kanvas
              pribadi Constella Anda.
            </p>

            <div className="mt-7 flex flex-col gap-2.5">
              <button
                onClick={onLogin}
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-[#E63946] to-[#FF6B7A] py-3 text-sm font-bold text-white shadow-[0_8px_24px_rgba(230,57,70,0.25)] transition-all hover:shadow-[0_12px_32px_rgba(230,57,70,0.35)] active:scale-[0.98]"
              >
                <Sparkles className="h-4 w-4" />
                <span>Masuk & Lanjutkan</span>
              </button>
              <button
                onClick={onClose}
                className="w-full rounded-2xl border border-[#FFB8C0]/30 bg-white/60 py-3 text-sm font-semibold text-[#6D5561] transition-all hover:bg-white/80 hover:text-[#3F2A35]"
              >
                Lanjut Eksplor Dulu
              </button>
            </div>

            <p className="mt-5 text-center text-[10px] text-[#8C7783]">
              Tidak ada data yang hilang. Anda bisa menyimpan nanti.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
