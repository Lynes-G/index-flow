import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Keep linting in the dedicated `pnpm lint` step to avoid
    // Next.js invoking a second ESLint runner with incompatible options.
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.cache = false;
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upbeat-hawk-672.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
