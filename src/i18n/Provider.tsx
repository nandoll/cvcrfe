"use client";

// src/i18n/Provider.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Locale, getTranslations } from "./config";

type Translations = Record<string, string>;
type NamespacedTranslations = Record<string, Translations>;

interface I18nContextType {
  locale: Locale;
  translations: NamespacedTranslations;
  t: (key: string, namespace?: string) => string;
  loadNamespaces: (namespaces: string[]) => Promise<void>;
}

const I18nContext = createContext<I18nContextType | null>(null);

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
};

interface I18nProviderProps {
  locale: Locale;
  initialTranslations?: NamespacedTranslations;
  children: ReactNode;
}

export const I18nProvider = ({
  locale,
  initialTranslations = { common: {} },
  children,
}: I18nProviderProps) => {
  const [translations, setTranslations] =
    useState<NamespacedTranslations>(initialTranslations);

  const t = (key: string, namespace: string = "common"): string => {
    const keys = key.split(".");
    let value = translations[namespace] || {};

    for (const k of keys) {
      if (value[k] === undefined) {
        console.warn(`Translation key not found: ${namespace}:${key}`);
        return key;
      }
      value = value[k];
    }

    return value as string;
  };

  const loadNamespaces = async (namespaces: string[]) => {
    const newTranslations = { ...translations };

    for (const namespace of namespaces) {
      if (!translations[namespace]) {
        try {
          const nsTranslations = await getTranslations(locale, namespace);
          newTranslations[namespace] = nsTranslations;
        } catch (error) {
          console.error(`Failed to load namespace ${namespace}:`, error);
        }
      }
    }

    setTranslations(newTranslations);
  };

  useEffect(() => {
    // Asegurar que tenemos el namespace 'common' cargado por defecto
    if (!translations.common || Object.keys(translations.common).length === 0) {
      loadNamespaces(["common"]);
    }
  }, [locale]);

  return (
    <I18nContext.Provider value={{ locale, translations, t, loadNamespaces }}>
      {children}
    </I18nContext.Provider>
  );
};
