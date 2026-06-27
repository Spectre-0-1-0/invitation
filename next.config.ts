import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
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
