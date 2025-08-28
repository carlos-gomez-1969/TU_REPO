// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    // No bloquees el build por errores de ESLint en producción
    ignoreDuringBuilds: true,
  },
  typescript: {
    // (Opcional) no bloquees el build por errores de TS
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
