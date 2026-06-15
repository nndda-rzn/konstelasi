"use client";

/**
 * CanvasAmbientGlow - Static ambient radial glows for the canvas
 * background. Purely decorative.
 */
export function CanvasAmbientGlow() {
  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(201,154,69,0.06),_transparent_60%)] pointer-events-none" />
      <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-[#C99A45]/8 blur-[120px] rounded-full pointer-events-none animate-pulse duration-[8000ms]" />
      <div className="absolute -bottom-[20%] -left-[10%] w-[40%] h-[40%] bg-[#B84A5A]/8 blur-[120px] rounded-full pointer-events-none animate-pulse duration-[10000ms]" />
    </>
  );
}
