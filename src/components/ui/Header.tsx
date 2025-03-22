"use client";

// src/components/ui/Header.tsx
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/i18n/Provider";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";

export const Header: React.FC = () => {
  const { t, locale } = useI18n();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Detectar scroll para cambiar estilos del header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navegar a la sección y cerrar el menú móvil
  const scrollToSection = (sectionId: string) => {
    setIsMobileMenuOpen(false);

    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navItems = [
    { id: "experience", label: t("experience.title") },
    { id: "education", label: t("education.title") },
    { id: "skills", label: t("skills.title") },
    { id: "contact", label: t("contact.title") },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "py-2 bg-white shadow-md dark:bg-gray-900"
          : "py-4 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link
            href={`/${locale}`}
            className="text-xl font-bold text-indigo-600 hover:text-indigo-800 transition"
          >
            FA
          </Link>
        </div>

        {/* Navegación de escritorio */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-gray-700 hover:text-indigo-600 transition dark:text-gray-300 dark:hover:text-indigo-400"
            >
              {item.label}
            </button>
          ))}

          <div className="flex items-center gap-2 ml-4">
            <ThemeToggle />
            <LanguageSwitcher currentLang={locale} />
          </div>

          <Link
            href={`/${locale}/dashboard`}
            className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            Dashboard
          </Link>
        </nav>

        {/* Botón de menú móvil */}
        <div className="md:hidden flex items-center">
          <div className="flex items-center mr-4">
            <ThemeToggle />
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 py-4 px-4 shadow-lg">
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-gray-700 hover:text-indigo-600 transition dark:text-gray-300 dark:hover:text-indigo-400"
              >
                {item.label}
              </button>
            ))}

            <LanguageSwitcher currentLang={locale} />

            <Link
              href={`/${locale}/dashboard`}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition text-center"
            >
              Dashboard
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
