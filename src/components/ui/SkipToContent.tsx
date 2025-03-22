"use client";

// src/components/ui/SkipToContent.tsx
import React from "react";
import { useI18n } from "@/i18n/Provider";

export const SkipToContent: React.FC = () => {
  const { t } = useI18n();

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-indigo-600 text-white rounded shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
    >
      {t("accessibility.skipToContent")}
    </a>
  );
};
