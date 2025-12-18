/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force client-side rendering - no SSR
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
