// src/app/[lang]/print/page.tsx
// Versión imprimible del CV
import { useCV } from "@/hooks/useCV";
import { Loading } from "@/components/ui/Loading";
import { PrintLayout } from "@/components/layouts/PrintLayout";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticPaths() {
  return {
    paths: [{ params: { lang: "es" } }, { params: { lang: "en" } }],
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const { lang } = params;

  return {
    props: {
      ...(await serverSideTranslations(lang, ["common"])),
    },
  };
}

export default function PrintableCVPage() {
  const { t } = useTranslation("common");
  const { cvData, loading, error } = useCV();

  if (loading) {
    return <Loading />;
  }

  if (error || !cvData) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl text-red-600">{t("errors.loading")}</h2>
        <p>{t("errors.tryAgain")}</p>
      </div>
    );
  }

  return (
    <PrintLayout>
      <div className="max-w-a4 mx-auto bg-white p-8 shadow-none">
        <header className="border-b pb-4 mb-6">
          <h1 className="text-3xl font-bold">{cvData.name}</h1>
          <h2 className="text-xl text-gray-600">{cvData.title}</h2>

          <div className="flex flex-wrap text-sm mt-2">
            <p className="mr-4">
              <span className="font-medium">{t("contact.email")}:</span>{" "}
              {cvData.contact.email}
            </p>
            <p>
              <span className="font-medium">{t("contact.phone")}:</span>{" "}
              {cvData.contact.phone}
            </p>
          </div>
        </header>

        <section className="mb-6">
          <h3 className="text-lg font-bold mb-2">{t("summary")}</h3>
          <p>{cvData.summary}</p>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-bold mb-2">{t("experience.title")}</h3>
          {cvData.experiences.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between">
                <h4 className="font-medium">{exp.position}</h4>
                <span className="text-sm">
                  {exp.startDate} - {exp.endDate}
                </span>
              </div>
              <p className="text-gray-600">
                {exp.company}, {exp.location}
              </p>
              <ul className="list-disc list-inside text-sm mt-1">
                {exp.responsibilities.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-2 gap-6">
          <section>
            <h3 className="text-lg font-bold mb-2">{t("education.title")}</h3>
            {cvData.education.map((edu, index) => (
              <div key={index} className="mb-3">
                <h4 className="font-medium">{edu.institution}</h4>
                <p>
                  {edu.degree}, {edu.field}
                </p>
                <p className="text-sm text-gray-600">
                  {edu.startDate} - {edu.endDate}
                </p>
              </div>
            ))}
          </section>

          <section>
            <h3 className="text-lg font-bold mb-2">{t("skills.title")}</h3>
            <div className="flex flex-wrap">
              {cvData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="mr-2 mb-2 px-2 py-1 bg-gray-100 text-sm rounded"
                >
                  {skill.name}
                </span>
              ))}
            </div>

            <h3 className="text-lg font-bold mt-4 mb-2">
              {t("languages.title")}
            </h3>
            <ul>
              {cvData.languages.map((lang, index) => (
                <li key={index}>
                  {lang.name}: {lang.level}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </PrintLayout>
  );
}
