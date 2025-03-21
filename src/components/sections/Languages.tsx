// src/components/sections/Languages.tsx
import React from "react";
import { useTranslation } from "next-i18next";

interface Language {
  name: string;
  level: string;
}

interface LanguagesSectionProps {
  languages: Language[];
}

export const LanguagesSection: React.FC<LanguagesSectionProps> = ({
  languages,
}) => {
  const { t } = useTranslation("common");

  return (
    <section id="languages" className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 border-b pb-2">
        {t("languages.title")}
      </h2>

      <ul className="space-y-2">
        {languages.map((language, index) => (
          <li key={index} className="flex justify-between items-center">
            <span className="font-medium">{language.name}</span>
            <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-sm">
              {language.level}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};
