"use client";

// src/components/layouts/MainLayout.tsx
import React, { ReactNode, useEffect } from "react";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { cvService } from "@/services/cv.service";
import { AccessibilityMenu } from "@/components/ui/AccessibilityMenu";

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  source?: string | null;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title = "Fernando Antezana - CV",
  description = "Currículum profesional de Fernando Antezana, Desarrollador Frontend Senior",
  source,
}) => {
  // Tracking de visitas
  useEffect(() => {
    cvService.trackVisit(source || undefined);
  }, [source]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>

      <AccessibilityMenu />
      <Footer />
    </div>
  );
};
