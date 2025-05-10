/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. não travar o build por erros de ESLint
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 2. não travar o build por erros de TypeScript
  typescript: {
    ignoreBuildErrors: true,
  },

  // 3. gerar source maps no build de produção
  productionBrowserSourceMaps: true,

  // Opcional: desative a minificação se quiser bundles legíveis
  // swcMinify: false,
};

module.exports = nextConfig;
