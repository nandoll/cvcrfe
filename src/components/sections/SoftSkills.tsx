// src/components/sections/SoftSkills.tsx
import React from "react";
import { useTranslation } from "next-i18next";

interface SoftSkillsSectionProps {
  softSkills: string[];
}

export const SoftSkillsSection: React.FC<SoftSkillsSectionProps> = ({
  softSkills,
}) => {
  const { t } = useTranslation("common");

  return (
    <section id="soft-skills" className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 border-b pb-2">
        {t("softSkills.title")}
      </h2>

      <div className="flex flex-wrap gap-2">
        {softSkills.map((skill, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
          >
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
};
