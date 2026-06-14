"use client";

import { LayoutGrid, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { usePhotoBoothStore } from "../photoBoothStore";
import { HeroScene } from "./scene/HeroScene";

const fadeUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

/**
 * WelcomeScreen - First screen of the photobooth flow.
 * Enhanced with 3D floating photo strip hero and subtle motion.
 */
export function WelcomeScreen() {
  const router = useRouter();
  const setFlowMode = usePhotoBoothStore((s) => s.setFlowMode);
  const setSessionStep = usePhotoBoothStore((s) => s.setSessionStep);

  const handleStart = () => {
    setFlowMode("session");
    setSessionStep("choose-layout");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative flex min-h-[calc(100vh-120px)] items-center justify-center overflow-hidden bg-[#FFF5F7] px-4 py-12"
    >
      {/* Soft ambient orbs */}
      <div className="pointer-events-none absolute top-1/4 left-1/4 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFB8C0]/25 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-[320px] w-[320px] translate-x-1/2 rounded-full bg-[#FFE5E8]/40 blur-[100px]" />

      <div className="relative z-10 mx-auto grid w-full max-w-3xl items-center gap-8 sm:gap-12 md:grid-cols-[1fr_1.1fr]">
        {/* Left: 3D Hero Scene */}
        <div className="flex justify-center md:justify-end">
          <HeroScene className="h-[340px] w-[280px] sm:h-[400px] sm:w-[320px]" />
        </div>

        {/* Right: Copy + CTA */}
        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="text-center md:text-left"
        >
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.4 }}
            className="mb-2 inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.3em] text-[#8C7783] uppercase"
          >
            <span className="inline-block h-1 w-1 rounded-full bg-[#E63946]" />
            Constella
          </motion.p>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.45 }}
            className="text-3xl font-light tracking-tight text-[#3F2A35] sm:text-4xl"
          >
            Photo Booth
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.45 }}
            className="mt-2.5 max-w-md text-[14px] leading-relaxed text-[#6D5561] sm:text-[15px]"
          >
            Simpan momen kecil sebelum ia berubah menjadi kenangan besar.
          </motion.p>

          {/* Flow microcopy */}
          <motion.ol
            variants={stagger}
            className="mt-5 space-y-1.5 text-[12px] text-[#6D5561]"
          >
            {[
              "Pilih layout dan format",
              "Ambil beberapa pose dengan timer",
              "Simpan ke kanvas atau unduh",
            ].map((text, i) => (
              <motion.li
                key={i}
                variants={fadeUp}
                transition={{ duration: 0.35 }}
                className="flex items-start gap-2"
              >
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#E63946]/10 text-[9px] font-bold text-[#E63946]">
                  {i + 1}
                </span>
                <span>{text}</span>
              </motion.li>
            ))}
          </motion.ol>

          {/* CTA */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.45, delay: 0.35 }}
            className="mt-6 flex flex-col items-stretch gap-2.5 sm:flex-row sm:items-center md:justify-start"
          >
            <button
              onClick={handleStart}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E63946] px-6 py-3 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(230,57,70,0.22)] transition-colors hover:bg-[#D62828] active:scale-[0.98]"
            >
              <LayoutGrid className="h-4 w-4" />
              Mulai
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => router.push("/canvas")}
              className="text-[12px] text-[#8C7783] transition-colors hover:text-[#3F2A35]"
            >
              atau kembali ke kanvas
            </button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
