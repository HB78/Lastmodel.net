import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-e8e495131acd4ec8a6b5b32ca6d2b88a.r2.dev',
        port: '',
        pathname: '/**',
      },
    ],
  },
  eslint: {
    // Permet de build même avec des erreurs ESLint
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
