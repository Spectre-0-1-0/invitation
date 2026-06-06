import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
  },
  async rewrites() {
    return [
      {
        source: "/seniors",
        destination: "/people",
      },
      {
        source: "/seniors/:slug",
        destination: "/people/:slug",
      },
    ];
  },
};

export default nextConfig;
