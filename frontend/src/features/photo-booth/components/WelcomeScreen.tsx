"use client";

import { LayoutGrid, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { usePhotoBoothStore } from "../photoBoothStore";
import { HeroScene } from "./scene/HeroScene";
import { ConstellationAccents } from "./scene/ConstellationAccents";
import { DustSparkles } from "./scene/DustSparkles";

const fadeUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

/**
 * WelcomeScreen - First screen of the photobooth flow.
 * A private visual diary under a soft Constellation sky.
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
      transition={{ duration: 0.7 }}
      className="relative flex min-h-[calc(100vh-120px)] items-center justify-center overflow-hidden bg-[#FFF5F7] px-4 py-12"
    >
      {/* Soft ambient haze layers - 3 radial gradients for warmth */}
      <div className="pointer-events-none absolute top-1/4 left-1/4 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FFB8C0]/30 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-[340px] w-[340px] translate-x-1/2 rounded-full bg-[#E8D4F0]/28 blur-[120px]" />
      <div className="pointer-events-none absolute top-2/3 left-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-[#F5ECD7]/22 blur-[110px]" />

      {/* Constellation layers (intentional clusters) */}
      <ConstellationAccents />

      {/* Dust sparkles (subtle atmosphere) */}
      <DustSparkles />

      <div className="relative z-10 mx-auto grid w-full max-w-3xl items-center gap-8 sm:gap-12 md:grid-cols-[1fr_1.1fr]">
        {/* Left: Hero with Premium Photo Strip + Three.js ambient */}
        <div className="flex justify-center md:justify-end">
          <HeroScene className="h-[340px] w-full max-w-[290px] sm:h-[400px] sm:max-w-[330px]" />
        </div>

        {/* Right: Copy + CTA */}
        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="text-center md:text-left"
        >
          {/* Brand label with tiny star */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mb-2.5 inline-flex items-center gap-2 text-[10px] font-semibold tracking-[0.32em] text-[#8C7783] uppercase"
          >
            <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden>
              <path
                d="M5 0L5.7 4.3L10 5L5.7 5.7L5 10L4.3 5.7L0 5L4.3 4.3L5 0Z"
                fill="#D4A574"
              />
            </svg>
            <span>Constella</span>
            <span className="text-[#D4A574] text-[8px]">✦</span>
          </motion.div>

          {/* Title with celestial accent */}
          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="text-3xl font-light tracking-tight text-[#3F2A35] sm:text-4xl"
          >
            Photo Booth
          </motion.h1>

          {/* Subtitle - poetic, intimate */}
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mt-3 max-w-md text-[14px] leading-relaxed text-[#6D5561] sm:text-[15px]"
          >
            Sebentuk kecil di bawah langit Constellla. Potong beberapa pose,
            simpan sebagai serpihan kenangan.
          </motion.p>

          {/* Flow steps with star nodes */}
          <motion.ol
            variants={stagger}
            className="mt-6 space-y-2.5 text-[12.5px] text-[#6D5561]"
          >
            {[
              "Pilih layout & format",
              "Ambil beberapa pose dengan timer",
              "Simpan ke kanvas atau unduh",
            ].map((text, i) => (
              <motion.li
                key={i}
                variants={fadeUp}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-2.5"
              >
                <span className="relative flex h-4 w-4 shrink-0 items-center justify-center">
                  <span
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(212, 165, 116, 0.28) 0%, transparent 70%)",
                    }}
                  />
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M5 0L5.7 4.3L10 5L5.7 5.7L5 10L4.3 5.7L0 5L4.3 4.3L5 0Z"
                      fill="#D4A574"
                      opacity="0.9"
                    />
                  </svg>
                </span>
                <span>{text}</span>
              </motion.li>
            ))}
          </motion.ol>

          {/* CTA + celestial divider */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-7"
          >
            <div className="flex flex-col items-stretch gap-2.5 sm:flex-row sm:items-center md:justify-start">
              <button
                onClick={handleStart}
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-[#E63946] px-6 py-3 text-sm font-semibold text-white shadow-[0_6px_22px_rgba(230,57,70,0.30)] transition-all duration-300 hover:bg-[#D62828] hover:shadow-[0_10px_32px_rgba(230,57,70,0.42)] active:scale-[0.98]"
              >
                <span className="relative z-10 inline-flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4" />
                  Mulai
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
                {/* Shimmer on hover */}
                <span
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background:
                      "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.28) 50%, transparent 70%)",
                  }}
                  aria-hidden
                />
              </button>
              <button
                onClick={() => router.push("/canvas")}
                className="text-[12px] text-[#8C7783] transition-colors hover:text-[#3F2A35]"
              >
                atau kembali ke kanvas
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
