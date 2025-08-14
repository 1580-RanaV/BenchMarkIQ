/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // 👈 This skips linting errors in production builds
  },
}

export default nextConfig
