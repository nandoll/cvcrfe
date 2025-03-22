/** @type {import('next').NextConfig} */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // La propiedad i18n no es compatible con App Router
  // Eliminar la propiedad i18n y usar middleware en su lugar

  // Optimización de imágenes (mantener esta parte)
  images: {
    domains: ["localhost"],
    formats: ["image/avif", "image/webp"],
  },

  // Análisis de rendimiento en desarrollo (mantener)
  reactStrictMode: true,

  // Para la generación de PDF (mantener)
  webpack(config) {
    config.module.rules.push({
      test: /\.pdf$/,
      use: {
        loader: "file-loader",
        options: {
          name: "[path][name].[ext]",
        },
      },
    });
    return config;
  },

  // Agregar redirección explícita para la ruta raíz
  async redirects() {
    return [
      {
        source: "/",
        destination: "/es",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
