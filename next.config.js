/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['jud.sa'],
  },
  experimental: {
    serverActions: true,
  },
  i18n: {
    locales: ['ar'],
    defaultLocale: 'ar',
  },
  // ضمان UTF-8 encoding
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['next/babel'],
        },
      },
    });
    return config;
  },
};

module.exports = nextConfig
