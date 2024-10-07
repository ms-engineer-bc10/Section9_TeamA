/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['item-shopping.c.yimg.jp'],
  },
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, context) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },
};

export default nextConfig;
