import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Enables static export for Next.js
  basePath: "",     // Ensures paths work when served from Go's root (/)
  assetPrefix: "",  // No prefix needed since Go serves everything
};

export default nextConfig;