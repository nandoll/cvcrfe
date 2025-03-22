// src/app/[lang]/page.tsx
import { Suspense } from "react";
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

// Reemplaza getStaticPaths con generateStaticParams
export async function generateStaticParams() {
  return [{ lang: "es" }, { lang: "en" }];
}

// Función asíncrona para obtener datos del CV
async function getCVData(lang: string) {
  // Implementación para obtener datos
  // Esta es una versión simplificada; adapte según sus necesidades
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/cv/${lang}` ||
      `http://localhost:3001/cv/${lang}`,
    { next: { revalidate: 3600 } }
  ); // Revalidar cada hora

  if (!response.ok) {
    // Fallback a datos locales si la API no responde
    return getMockCVData(lang);
  }

  return response.json();
}

function getMockCVData(lang: string) {
  // Datos de ejemplo para desarrollo
  return {
    name: "Fernando Antezana",
    title:
      lang === "es"
        ? "Desarrollador Frontend Senior"
        : "Senior Frontend Developer",
    summary:
      lang === "es"
        ? "Desarrollador Frontend con más de 5 años de experiencia..."
        : "Frontend Developer with over 5 years of experience...",
    // Añadir más datos mock según sea necesario
    contact: {
      email: "contacto@fernandoantezana.com",
      phone: "+34 123 456 789",
    },
    experiences: [],
    education: [],
    skills: [],
    languages: [],
    softSkills: [],
  };
}

// Página principal (componente del servidor por defecto)
export default async function CVPage({ params }: { params: { lang: string } }) {
  const { lang } = params;

  // Obtener datos directamente (no use hooks en componentes del servidor)
  const cvData = await getCVData(lang);

  // Utilice props de i18n según sea necesario para su configuración
  // Nota: La configuración de i18n en App Router es diferente

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
