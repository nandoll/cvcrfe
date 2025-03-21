// src/components/sections/Skills.tsx
import React from "react";
import { useTranslation } from "next-i18next";
import { Skill } from "@/types/cv.types";

interface SkillsSectionProps {
  skills: Skill[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  const { t } = useTranslation("common");

  // Agrupar habilidades por categoría
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const categoryTitles: Record<string, string> = {
    frontend: t("skills.categories.frontend"),
    backend: t("skills.categories.backend"),
    devops: t("skills.categories.devops"),
    tools: t("skills.categories.tools"),
  };

  return (
    <section id="skills" className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 border-b pb-2">
        {t("skills.title")}
      </h2>

      {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
        <div key={category} className="mb-4">
          <h3 className="text-lg font-semibold mb-2">
            {categoryTitles[category]}
          </h3>
          <div className="space-y-2">
            {categorySkills.map((skill, index) => (
              <div key={index} className="flex items-center">
                <span className="w-1/3 text-sm">{skill.name}</span>
                <div className="w-2/3 bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-indigo-600 h-2.5 rounded-full"
                    style={{ width: `${skill.level * 20}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};
