// src/app/[lang]/layout.tsx
import { Locale, getTranslations } from "@/i18n/config";
import { I18nProvider } from "@/i18n/Provider";
import { ThemeProvider } from "@/components/context/ThemeContext";

interface LanguageLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    lang: Locale;
  }>;
}

export async function generateStaticParams() {
  return [{ lang: "es" }, { lang: "en" }];
}

export default async function LanguageLayout(props: LanguageLayoutProps) {
  const params = await props.params;

  const {
    lang
  } = params;

  const {
    children
  } = props;

  // Cargar traducciones para el idioma actual
  const translations = {
    common: await getTranslations(lang, "common"),
  };

  return (
    <I18nProvider locale={lang} initialTranslations={translations}>
      <ThemeProvider>{children}</ThemeProvider>
    </I18nProvider>
  );
}
