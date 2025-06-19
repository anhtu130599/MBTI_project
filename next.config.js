/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  },
  // Remove overly permissive CORS headers
  // Add them back in specific API routes if needed

  // Xóa hoặc comment out phần rewrites này
  /*
  async rewrites() {
    return [
      {
        source: '/api/questions',
        destination: '/api/test/questions',
      },
    ];
  },
  */
}

module.exports = nextConfig; 