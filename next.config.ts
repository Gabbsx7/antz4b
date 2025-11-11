import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuração mínima para funcionar
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
