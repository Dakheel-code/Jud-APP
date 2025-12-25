/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  trailingSlash: true,
  // Exclude API routes and server-only pages from static export
  exportPathMap: async function (defaultPathMap) {
    return {
      '/': { page: '/' },
      '/privacy': { page: '/privacy' },
      '/terms': { page: '/terms' },
      '/data-deletion': { page: '/data-deletion' },
    };
  },
};

module.exports = nextConfig;
