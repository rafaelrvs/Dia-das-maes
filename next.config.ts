/** @type {import('next').NextConfig} */
const nextConfig = {
  // ...suas outras configurações
  eslint: {
    // desliga a checagem de ESLint na build
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
