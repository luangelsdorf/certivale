/** @type {import('next').NextConfig} */

const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgo: false,
            svgProps: { fill: 'currentColor' },
            dimensions: false,
          }
        }
      ],
    });

    config.resolve.alias = {
      ...config.resolve.alias,
      '@icons': path.resolve(__dirname, 'public/images/icons/fa')
    }

    return config;
  }
}

module.exports = nextConfig
