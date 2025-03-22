"use client";

// src/components/sections/Skills.tsx
import React from "react";
import { useI18n } from "@/i18n/Provider";
import { Skill } from "@/types/cv.types";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

interface SkillsSectionProps {
  skills: Skill[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  const { t } = useI18n();

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

  // Calcular el total de categorías para animar
  const totalCategories = Object.keys(skillsByCategory).length;

  return (
    <section
      id="skills"
      className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"
    >
      <h2 className="text-xl font-bold mb-4 border-b pb-2">
        {t("skills.title")}
      </h2>

      {Object.entries(skillsByCategory).length > 0 ? (
        Object.entries(skillsByCategory).map(
          ([category, categorySkills], categoryIndex) => (
            <AnimatedSection
              key={category}
              animationType="fade-in"
              delay={categoryIndex * 100}
              className="mb-4"
            >
              <h3 className="text-lg font-semibold mb-2 text-indigo-600 dark:text-indigo-400">
                {categoryTitles[category] || category}
              </h3>
              <div className="space-y-2">
                {categorySkills.map((skill, index) => (
                  <AnimatedSection
                    key={index}
                    animationType="slide-left"
                    delay={categoryIndex * 100 + index * 50}
                    className="flex items-center"
                  >
                    <span className="w-1/3 text-sm">{skill.name}</span>
                    <div className="w-2/3 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div
                        className="bg-indigo-600 dark:bg-indigo-500 h-2.5 rounded-full"
                        style={{ width: `${skill.level * 20}%` }}
                      ></div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </AnimatedSection>
          )
        )
      ) : (
        <p className="text-gray-500 italic">No skills data available</p>
      )}
    </section>
  );
};
