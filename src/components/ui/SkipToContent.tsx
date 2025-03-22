// src/components/ui/SkipToContent.tsx
import React from "react";
import { useTranslation } from "next-i18next";

export const SkipToContent: React.FC = () => {
  const { t } = useTranslation("common");

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-indigo-600 text-white rounded shadow-md"
    >
      {t("accessibility.skipToContent")}
    </a>
  );
};
