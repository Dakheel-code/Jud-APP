/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['jud.sa'],
  },
  i18n: {
    locales: ['ar'],
    defaultLocale: 'ar',
  },
};

module.exports = nextConfig;
