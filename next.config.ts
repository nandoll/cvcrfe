import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  i18n: {
    locales: ["en", "es"],
    defaultLocale: "es",
    //localeDetection: true, !TODO: Revisar
  },
  // Optimización de imágenes
  images: {
    domains: ["localhost"],
    formats: ["image/avif", "image/webp"],
  },
  // Análisis de rendimiento en desarrollo
  reactStrictMode: true,
  // Para la generación de PDF
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
};

export default nextConfig;
