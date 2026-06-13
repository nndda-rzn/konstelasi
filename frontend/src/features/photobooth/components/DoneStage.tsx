"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

/**
 * DoneStage - Success state shown after photo is saved to canvas.
 * Pure UI: no store dependency, animated appearance only.
 */
export function DoneStage() {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex flex-col items-center justify-center py-20 gap-4"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#38D9A9] to-[#3BC9DB] shadow-[0_8px_32px_rgba(56,217,169,0.4)]">
        <Check className="h-10 w-10 text-white" />
      </div>
      <p className="text-sm font-semibold text-[#3F2A35]/80">
        Foto tersimpan ke kanvas!
      </p>
    </motion.div>
  );
}
