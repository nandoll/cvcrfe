"use client";

// src/components/sections/Languages.tsx
import React from "react";
import { useI18n } from "@/i18n/Provider";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

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
  const { t } = useI18n();

  return (
    <section
      id="languages"
      className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"
    >
      <h2 className="text-xl font-bold mb-4 border-b pb-2">
        {t("languages.title")}
      </h2>

      {languages.length > 0 ? (
        <ul className="space-y-2">
          {languages.map((language, index) => (
            <AnimatedSection
              key={index}
              animationType="fade-in"
              delay={index * 100}
              className="flex justify-between items-center"
            >
              <span className="font-medium">{language.name}</span>
              <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded text-sm">
                {language.level}
              </span>
            </AnimatedSection>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic">No language data available</p>
      )}
    </section>
  );
};
