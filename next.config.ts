import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
