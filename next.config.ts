const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '2000',
        pathname: '/uploads/**',
      },
    ],
  },
};

module.exports = nextConfig;
