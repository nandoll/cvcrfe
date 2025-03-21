// src/components/layouts/MainLayout.tsx
// Layout principal (Patrón Decorator aplicado a páginas)

import React, { ReactNode, useEffect } from "react";
import Head from "next/head";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { ThemeProvider } from "@/components/context/ThemeContext";
import { cvService } from "@/services/cv.service";

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  source?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title = "Fernando Antezana - CV",
  description = "Currículum profesional de Fernando Antezana, Desarrollador Frontend Senior",
  source,
}) => {
  // Tracking de visitas
  useEffect(() => {
    cvService.trackVisit(source);
  }, [source]);

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col">
        <Head>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Header />

        <main className="flex-grow container mx-auto px-4 py-8">
          {children}
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  );
};
