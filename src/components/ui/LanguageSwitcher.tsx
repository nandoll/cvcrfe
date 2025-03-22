"use client";

// src/components/ui/LanguageSwitcher.tsx
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/i18n/Provider";
import { Locale, locales } from "@/i18n/config";

interface LanguageSwitcherProps {
  currentLang: Locale;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLang,
}) => {
  const { t } = useI18n();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Función para obtener la ruta con el nuevo idioma
  const getPathWithLocale = (locale: string) => {
    // Si la ruta actual sólo tiene el idioma, ir a la ruta raíz con el nuevo idioma
    if (pathname === `/${currentLang}`) {
      return `/${locale}`;
    }

    // En otro caso, reemplazar el idioma actual en la ruta
    return pathname.replace(`/${currentLang}`, `/${locale}`);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={toggleDropdown}
        className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
        id="language-menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {currentLang === "es" ? "Español" : "English"}
        <svg
          className="-mr-1 ml-2 h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="language-menu"
        >
          <div className="py-1" role="none">
            {locales.map((locale) => (
              <Link
                key={locale}
                href={getPathWithLocale(locale)}
                className={`${
                  currentLang === locale
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700"
                } block px-4 py-2 text-sm w-full text-left hover:bg-gray-100`}
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                {locale === "es" ? "Español" : "English"}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
