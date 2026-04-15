/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'arthamitra.co.id',
      },
    ],
  },
};

export default nextConfig;
