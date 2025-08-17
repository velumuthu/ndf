
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.c',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https' as const,
        hostname: 'ibb.co',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
