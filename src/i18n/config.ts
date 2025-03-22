// src/i18n/config.ts
export const defaultLocale = "es";
export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];

export const getLocalePartsFrom = (
  path: string
): { locale: Locale | undefined; pathname: string } => {
  const pathnameParts = path.split("/");

  if (pathnameParts.length < 2) {
    return { locale: undefined, pathname: path };
  }

  const locale = pathnameParts[1] as Locale;

  if (!locales.includes(locale)) {
    return { locale: undefined, pathname: path };
  }

  const pathname = path.replace(`/${locale}`, "") || "/";

  return { locale, pathname };
};

export const getTranslations = async (
  locale: Locale,
  namespace: string = "common"
) => {
  return (await import(`../../public/locales/${locale}/${namespace}.json`))
    .default;
};
