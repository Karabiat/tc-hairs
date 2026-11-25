import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [420, 640, 768, 1024, 1440, 1920, 2560],
  },
  experimental: {
    optimizePackageImports: ["framer-motion", "gsap"],
  },
  poweredByHeader: false,
};

export default nextConfig;
