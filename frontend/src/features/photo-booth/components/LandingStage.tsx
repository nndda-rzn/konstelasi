"use client";

import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import { usePhotoBoothStore } from "../photoBoothStore";
import type { Stage } from "../photoBooth.config";

/**
 * LandingStage - Welcome / start screen for the photobooth.
 * Pure UI: subscribes to store for setStage action.
 */
export function LandingStage() {
  const setStage = usePhotoBoothStore(
    (s: { setStage: (s: Stage) => void }) => s.setStage
  );

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#FFF5F7]">
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFB8C0]/40 blur-[160px]" />
      <div className="pointer-events-none absolute -top-40 -right-40 h-[400px] w-[400px] rounded-full bg-[#FFE5E8]/60 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-[#FFE5E8]/50 blur-[120px]" />

      {/* Floating decorative photo strips */}
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [-8, -6, -8] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[6%] top-[18%] hidden lg:flex flex-col gap-2 rounded-lg bg-white p-2 shadow-[0_16px_48px_rgba(0,0,0,0.12)]"
      >
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-20 w-16 rounded-sm bg-gradient-to-br from-[#f0e8e4] to-[#e8ddd8]"
          />
        ))}
        <p className="text-center text-[8px] font-medium text-[#8C7783] mt-1">
          konstelasi
        </p>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0], rotate: [6, 8, 6] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[6%] top-[15%] hidden lg:flex flex-col gap-2 rounded-lg bg-white p-2 shadow-[0_16px_48px_rgba(0,0,0,0.12)]"
      >
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-20 w-16 rounded-sm bg-gradient-to-br from-[#ede5e0] to-[#e0d6d0]"
          />
        ))}
        <p className="text-center text-[8px] font-medium text-[#8C7783] mt-1">
          konstelasi
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center text-center px-6"
      >
        <div className="flex items-center gap-6 mb-2">
          <span className="text-sm font-light tracking-[0.3em] text-[#8C7783] uppercase">
            Est
          </span>
          <h1 className="text-[clamp(3rem,10vw,7rem)] font-extralight tracking-[-0.04em] text-[#3F2A35] leading-none">
            photobooth
          </h1>
          <span className="text-sm font-light tracking-[0.3em] text-[#8C7783] uppercase">
            2026
          </span>
        </div>
        <p className="mt-4 max-w-md text-sm leading-7 text-[#8C7783]">
          Simpan momen kecil sebelum ia berubah menjadi kenangan besar.
        </p>
        <motion.button
          onClick={() => setStage("setup")}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="mt-10 flex items-center gap-3 rounded-full bg-gradient-to-r from-[#E63946] to-[#FF6B7A] px-10 py-4 text-base font-bold text-white shadow-[0_12px_40px_rgba(230,57,70,0.35)] hover:shadow-[0_16px_52px_rgba(230,57,70,0.45)]"
        >
          START <Camera className="h-5 w-5" />
        </motion.button>
      </motion.div>
    </div>
  );
}
