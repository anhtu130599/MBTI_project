/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  },
  // Remove overly permissive CORS headers
  // Add them back in specific API routes if needed
}

module.exports = nextConfig; 