"use client";

/**
 * BackgroundOrbs - Decorative gradient orbs in the page background.
 */
export function BackgroundOrbs() {
  return (
    <>
      <div className="pointer-events-none absolute -top-36 left-1/2 h-[540px] w-[540px] -translate-x-1/2 rounded-full bg-[#E63946]/12 blur-[140px] animate-orb-1" />
      <div className="pointer-events-none absolute bottom-[-190px] left-[-130px] h-[430px] w-[430px] rounded-full bg-[#D9A441]/16 blur-[120px] animate-orb-2" />
      <div className="pointer-events-none absolute right-[-150px] top-1/4 h-[470px] w-[470px] rounded-full bg-[#7C83FD]/14 blur-[130px]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.24)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:56px_56px] opacity-35" />
    </>
  );
}
