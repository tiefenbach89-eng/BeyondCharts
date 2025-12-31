/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kartedirekt.de",
      },
      {
        protocol: "https",
        hostname: "www.networkworld.com",
      },
    ],
  },
};

export default nextConfig;
