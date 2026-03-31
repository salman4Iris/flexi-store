import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Modern browsers only - eliminates polyfills & downlevel transforms */
  experimental: {
    optimizePackageImports: ["lucide-react", "clsx", "tailwind-merge"],
    optimizeCss: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
