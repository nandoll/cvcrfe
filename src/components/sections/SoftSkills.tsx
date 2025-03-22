"use client";

// src/components/sections/SoftSkills.tsx
import React from "react";
import { useI18n } from "@/i18n/Provider";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

interface SoftSkillsSectionProps {
  softSkills: string[];
}

export const SoftSkillsSection: React.FC<SoftSkillsSectionProps> = ({
  softSkills,
}) => {
  const { t } = useI18n();

  return (
    <section
      id="soft-skills"
      className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"
    >
      <h2 className="text-xl font-bold mb-4 border-b pb-2">
        {t("softSkills.title")}
      </h2>

      {softSkills.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {softSkills.map((skill, index) => (
            <AnimatedSection
              key={index}
              animationType="scale-up"
              delay={index * 50}
              className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm"
            >
              {skill}
            </AnimatedSection>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">No soft skills data available</p>
      )}
    </section>
  );
};
