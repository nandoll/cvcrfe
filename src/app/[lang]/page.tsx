// src/app/[lang]/page.tsx
import { Suspense } from "react";
import { useRouter } from "next/router";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Loading } from "@/components/ui/Loading";
import { ProfileHeader } from "@/components/sections/ProfileHeader";
import { ExperienceSection } from "@/components/sections/Experience";
import { SkillsSection } from "@/components/sections/Skills";
import { EducationSection } from "@/components/sections/Education";
import { ContactSection } from "@/components/sections/Contact";
import { LanguagesSection } from "@/components/sections/Languages";
import { SoftSkillsSection } from "@/components/sections/SoftSkills";
import { QRCodeGenerator } from "@/components/features/QRCodeGenerator";
import { useCV } from "@/hooks/useCV";
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
      source: null,
    },
  };
}

export default function CVPage({ source }) {
  const { t } = useTranslation("common");
  const { cvData, loading, error } = useCV();

  if (loading) {
    return (
      <MainLayout source={source}>
        <Loading />
      </MainLayout>
    );
  }

  if (error || !cvData) {
    return (
      <MainLayout source={source}>
        <div className="text-center py-10">
          <h2 className="text-xl text-red-600">{t("errors.loading")}</h2>
          <p>{t("errors.tryAgain")}</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title={`${cvData.name} - ${cvData.title}`}
      description={cvData.summary}
      source={source}
    >
      <div className="max-w-4xl mx-auto">
        <ProfileHeader
          name={cvData.name}
          title={cvData.title}
          summary={cvData.summary}
          contact={cvData.contact}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="md:col-span-2">
            <Suspense fallback={<Loading />}>
              <ExperienceSection experiences={cvData.experiences} />
              <EducationSection education={cvData.education} />
            </Suspense>
          </div>

          <div className="space-y-8">
            <Suspense fallback={<Loading />}>
              <SkillsSection skills={cvData.skills} />
              <LanguagesSection languages={cvData.languages} />
              <SoftSkillsSection softSkills={cvData.softSkills} />
              <QRCodeGenerator />
              <ContactSection contact={cvData.contact} />
            </Suspense>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
