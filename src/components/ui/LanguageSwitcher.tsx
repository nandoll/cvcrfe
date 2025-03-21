// src/components/ui/LanguageSwitcher.tsx
import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useTranslation } from "next-i18next";

export const LanguageSwitcher: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const { pathname, asPath, query } = router;

  const switchToLanguage = (locale: string) => {
    router.push({ pathname, query }, asPath, { locale });
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
          id="language-menu"
          aria-expanded="true"
          aria-haspopup="true"
        >
          {t("language.current")}
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
      </div>

      <div
        className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="language-menu"
      >
        <div className="py-1" role="none">
          <button
            className={`${
              router.locale === "es"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-700"
            } block px-4 py-2 text-sm w-full text-left hover:bg-gray-100`}
            onClick={() => switchToLanguage("es")}
            role="menuitem"
          >
            Español
          </button>
          <button
            className={`${
              router.locale === "en"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-700"
            } block px-4 py-2 text-sm w-full text-left hover:bg-gray-100`}
            onClick={() => switchToLanguage("en")}
            role="menuitem"
          >
            English
          </button>
        </div>
      </div>
    </div>
  );
};
