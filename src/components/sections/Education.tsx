import React from "react";
import { Education } from "@/types/cv.types";
import { useTranslation } from "next-i18next";

interface EducationSectionProps {
  education: Education[];
}

export const EducationSection: React.FC<EducationSectionProps> = ({
  education,
}) => {
  const { t } = useTranslation("common");

  return (
    <section id="education" className="py-8">
      <h2 className="text-2xl font-bold mb-6 border-b pb-2">
        {t("education.title")}
      </h2>
      <div className="space-y-6">
        {education.map((item, index) => (
          <div key={index} className="group">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold group-hover:text-indigo-600 transition-colors">
                {item.institution}
              </h3>
              <span className="text-sm text-gray-600">
                {item.startDate} - {item.endDate}
              </span>
            </div>
            <p className="text-lg text-indigo-600 mt-1">{item.degree}</p>
            <p className="mt-1 text-gray-700">{item.field}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
