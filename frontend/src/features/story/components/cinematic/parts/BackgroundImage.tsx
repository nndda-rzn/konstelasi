"use client";

import { motion, AnimatePresence } from "framer-motion";

interface BackgroundImageProps {
  node: any;
  cover?: string;
  durationMs: number;
}

/**
 * BackgroundImage - Ken Burns animated background for cinematic view.
 * Falls back to a warm gradient if no cover image is present.
 */
export function BackgroundImage({ node, cover, durationMs }: BackgroundImageProps) {
  return (
    <AnimatePresence mode="sync">
      {cover ? (
        <motion.div
          key={`bg-${node.id}`}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1.18 }}
          exit={{ opacity: 0 }}
          transition={{ duration: durationMs / 1000, ease: "linear" }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${cover})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ) : (
        <motion.div
          key={`bg-fallback-${node.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-gradient-to-br from-[#9D0208] via-[#E63946] to-[#FF6B7A]"
        />
      )}
    </AnimatePresence>
  );
}
