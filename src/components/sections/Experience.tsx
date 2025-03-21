// src/components/sections/Experience.tsx
// Componente para la sección de experiencia (Ejemplo de un componente de sección)

import React from "react";
import { Experience } from "@/types/cv.types";
import { useTranslation } from "next-i18next";

interface ExperienceSectionProps {
  experiences: Experience[];
}

// Componente para un solo item de experiencia
const ExperienceItem: React.FC<{ experience: Experience }> = ({
  experience,
}) => {
  const { t } = useTranslation("common");

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
    </div>
  );
};

// Componente de sección (implementando Composición sobre Herencia)
export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  experiences,
}) => {
  const { t } = useTranslation("common");

  return (
    <section id="experience" className="py-8">
      <h2 className="text-2xl font-bold mb-6 border-b pb-2">
        {t("experience.title")}
      </h2>
      <div>
        {experiences.map((exp, index) => (
          <ExperienceItem key={index} experience={exp} />
        ))}
      </div>
    </section>
  );
};
