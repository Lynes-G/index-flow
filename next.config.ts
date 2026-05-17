import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Keep linting in the dedicated `pnpm lint` step to avoid
    // Next.js invoking a second ESLint runner with incompatible options.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
