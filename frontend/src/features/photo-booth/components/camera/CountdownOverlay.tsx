"use client";

import { motion, AnimatePresence } from "framer-motion";

/**
 * CountdownOverlay - Large animated countdown number over camera preview.
 */
export function CountdownOverlay({
  countdown,
  show,
}: {
  countdown: number | null;
  show: boolean;
}) {
  return (
    <AnimatePresence>
      {show && countdown !== null && countdown > 0 && (
        <motion.div
          key={countdown}
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.6, opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="absolute inset-0 z-10 flex items-center justify-center"
        >
          <span className="text-[120px] font-black text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)] leading-none select-none">
            {countdown}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
