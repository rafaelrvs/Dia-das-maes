/** @type {import('next').NextConfig} */
const nextConfig = {
  // ...suas outras configurações

  // 1. não travar o build por erros de ESLint
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 2. não travar o build por erros de TypeScript
  typescript: {
    
    ignoreBuildErrors: true,
  },

};

module.exports = nextConfig;
