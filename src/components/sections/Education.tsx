"use client";

// src/components/sections/Education.tsx
import React from "react";
import { Education } from "@/types/cv.types";
import { useI18n } from "@/i18n/Provider";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

interface EducationSectionProps {
  education: Education[];
}

export const EducationSection: React.FC<EducationSectionProps> = ({
  education,
}) => {
  const { t } = useI18n();

  return (
    <section id="education" className="py-8">
      <h2 className="text-2xl font-bold mb-6 border-b pb-2">
        {t("education.title")}
      </h2>
      <div className="space-y-6">
        {education.length > 0 ? (
          education.map((item, index) => (
            <AnimatedSection
              key={index}
              animationType="slide-up"
              delay={index * 100}
              className="group"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold group-hover:text-indigo-600 transition-colors">
                  {item.institution}
                </h3>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {item.startDate} - {item.endDate}
                </span>
              </div>
              <p className="text-lg text-indigo-600 dark:text-indigo-400 mt-1">
                {item.degree}
              </p>
              <p className="mt-1 text-gray-700 dark:text-gray-300">
                {item.field}
              </p>
            </AnimatedSection>
          ))
        ) : (
          <p className="text-gray-500 italic">No education data available</p>
        )}
      </div>
    </section>
  );
};
