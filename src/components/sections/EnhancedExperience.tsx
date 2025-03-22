"use client";

// src/components/sections/EnhancedExperience.tsx
// Versión mejorada de Experience con animaciones

import React from "react";
import { Experience } from "@/types/cv.types";
import { useI18n } from "@/i18n/Provider";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

interface ExperienceSectionProps {
  experiences: Experience[];
}

// Componente para un solo item de experiencia con animación
const ExperienceItem: React.FC<{
  experience: Experience;
  index: number;
}> = ({ experience, index }) => {
  const { t } = useI18n();

  return (
    <AnimatedSection
      animationType="slide-up"
      delay={index * 100}
      className="mb-8 pb-8 border-b last:border-b-0"
    >
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold group-hover:text-indigo-600 transition-colors">
          {experience.position}
        </h3>
        <span className="text-sm bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 px-2 py-1 rounded">
          {experience.startDate} - {experience.endDate}
        </span>
      </div>

      <div className="flex items-center mt-1">
        <h4 className="text-lg text-indigo-600 dark:text-indigo-400">
          {experience.company}
        </h4>
        <span className="mx-2">•</span>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {experience.location}
          {experience.remote && (
            <span className="ml-2 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 px-2 py-0.5 rounded-full text-xs">
              {t("remote")}
            </span>
          )}
        </span>
      </div>

      <ul className="mt-4 space-y-2">
        {experience.responsibilities.map((item, idx) => (
          <AnimatedSection
            key={idx}
            animationType="fade-in"
            delay={index * 100 + 50 + idx * 50}
            className="flex items-start"
          >
            <span className="text-indigo-500 mr-2 mt-1.5">•</span>
            <li className="text-gray-700 dark:text-gray-300">{item}</li>
          </AnimatedSection>
        ))}
      </ul>

      {/* Tags para tecnologías usadas (si están disponibles) */}
      {experience.technologies && experience.technologies.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {experience.technologies.map((tech, idx) => (
            <span
              key={idx}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded text-xs"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </AnimatedSection>
  );
};

// Componente de sección con animación
export const EnhancedExperienceSection: React.FC<ExperienceSectionProps> = ({
  experiences,
}) => {
  const { t } = useI18n();

  return (
    <section id="experience" className="py-12">
      <AnimatedSection animationType="slide-left" className="mb-8">
        <h2 className="text-2xl font-bold border-b-2 border-indigo-500 pb-2 inline-block">
          {t("experience.title")}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {t("experience.subtitle")}
        </p>
      </AnimatedSection>

      <div className="mt-6">
        {experiences.length > 0 ? (
          experiences.map((exp, index) => (
            <ExperienceItem key={index} experience={exp} index={index} />
          ))
        ) : (
          <p className="text-gray-500 italic">No experience data available</p>
        )}
      </div>
    </section>
  );
};
