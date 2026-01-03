/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
