"use client";

// src/components/sections/Experience.tsx
import React from "react";
import { Experience } from "@/types/cv.types";
import { useI18n } from "@/i18n/Provider";

interface ExperienceSectionProps {
  experiences: Experience[];
}

// Componente para un solo item de experiencia
const ExperienceItem: React.FC<{ experience: Experience }> = ({
  experience,
}) => {
  const { t } = useI18n();

  return (
    <div className="mb-6">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold">{experience.position}</h3>
        <span className="text-sm text-gray-600">
          {experience.startDate} - {experience.endDate}
        </span>
      </div>
      <div className="flex items-center mt-1">
        <h4 className="text-lg text-indigo-600">{experience.company}</h4>
        <span className="mx-2">•</span>
        <span className="text-sm">
          {experience.location}
          {experience.remote && ` (${t("remote")})`}
        </span>
      </div>
      <ul className="mt-2 list-disc list-inside text-gray-700">
        {experience.responsibilities.map((item, index) => (
          <li key={index} className="mt-1">
            {item}
          </li>
        ))}
      </ul>

      {/* Mostrar tecnologías si están disponibles */}
      {experience.technologies && experience.technologies.length > 0 && (
        <div className="mt-3">
          <span className="text-sm font-medium">
            {t("experience.technologies")}:{" "}
          </span>
          <div className="flex flex-wrap gap-1 mt-1">
            {experience.technologies.map((tech, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 text-xs rounded"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Componente de sección (implementando Composición sobre Herencia)
export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  experiences,
}) => {
  const { t } = useI18n();

  return (
    <section id="experience" className="py-8">
      <h2 className="text-2xl font-bold mb-6 border-b pb-2">
        {t("experience.title")}
      </h2>
      <div>
        {experiences.length > 0 ? (
          experiences.map((exp, index) => (
            <ExperienceItem key={index} experience={exp} />
          ))
        ) : (
          <p className="text-gray-500 italic">No experience data available</p>
        )}
      </div>
    </section>
  );
};
