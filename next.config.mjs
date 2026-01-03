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
<<<<<<< HEAD
      // Supabase Storage (public bucket)
      // If your Next.js version does not accept wildcards here,
      // replace with your exact project host: "<PROJECT-REF>.supabase.co"
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
=======
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
    ],
  },
};

export default nextConfig;
