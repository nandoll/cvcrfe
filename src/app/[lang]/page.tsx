// src/app/[lang]/page.tsx
import { Suspense } from "react";
import { Locale } from "@/i18n/config";
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
import { cvService } from "@/services/cv.service";

export const dynamicParams = false; // Solo permitir los idiomas pre-renderizados

export async function generateMetadata(
  props: {
    params: Promise<{ lang: Locale }>;
  }
) {
  const params = await props.params;
  const { lang } = params;

  return {
    title:
      lang === "es" ? "Fernando Antezana - CV" : "Fernando Antezana - Resume",
    description:
      lang === "es"
        ? "Currículum profesional de Fernando Antezana"
        : "Professional resume of Fernando Antezana",
  };
}

// Página principal (componente del servidor por defecto)
export default async function CVPage(props: { params: Promise<{ lang: Locale }> }) {
  const params = await props.params;
  const { lang } = params;

  // Obtener datos directamente (no use hooks en componentes del servidor)
  const cvData = await cvService.getCVData(lang);

  return (
    <MainLayout
      title={`${cvData.name} - ${cvData.title}`}
      description={cvData.summary}
      source={null}
    >
      <div className="max-w-4xl mx-auto">
        <ProfileHeader
          name={cvData.name}
          title={cvData.title}
          summary={cvData.summary}
          contact={cvData.contact}
          lang={lang}
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
              <QRCodeGenerator lang={lang} />
              <ContactSection contact={cvData.contact} />
            </Suspense>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
