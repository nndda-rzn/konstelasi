import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // reactCompiler disabled: incompatible with @react-three/fiber 9.x
  // R3F heavily relies on mutable refs and Three.js object lifecycles
  // that the React Compiler 1.0 transforms in ways that break
  // R3F's scene reconciliation (stars/constellations not rendering).
  // Re-evaluate when R3F gains first-class React Compiler support.
  reactCompiler: false,
};

export default nextConfig;
