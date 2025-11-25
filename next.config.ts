import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbo: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // works for all domains
      },
    ],
  },
};

export default nextConfig;
