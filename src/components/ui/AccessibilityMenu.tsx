"use client";

// src/components/ui/AccessibilityMenu.tsx
import React, { useState, useRef, useEffect } from "react";
import { useI18n } from "@/i18n/Provider";
import { useAccessibility } from "@/hooks/useAccessibility";
import { AnimatedSection } from "./AnimatedSection";
import { cn } from "@/lib/utils";

export const AccessibilityMenu: React.FC = () => {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const {
    options,
    toggleHighContrast,
    toggleReduceMotion,
    toggleIncreaseFontSize,
    toggleKeyboardFocus,
    resetOptions,
  } = useAccessibility();

  // Cerrar el menú cuando se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Cerrar el menú con ESC
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      {/* Botón de accesibilidad */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 p-3 bg-indigo-600 dark:bg-indigo-700 text-white rounded-full shadow-lg hover:bg-indigo-700 dark:hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        aria-label={t("accessibility.toggleMenu")}
        aria-expanded={isOpen}
        aria-controls="accessibility-menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
          />
        </svg>
      </button>

      {/* Menú de opciones de accesibilidad */}
      {isOpen && (
        <AnimatedSection
          id="accessibility-menu"
          animationType="scale-up"
          className="fixed bottom-16 right-4 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 p-4"
          role="dialog"
          aria-labelledby="accessibility-title"
        >
          <div className="flex justify-between items-center mb-4">
            <h3
              id="accessibility-title"
              className="text-lg font-medium text-gray-900 dark:text-white"
            >
              {t("accessibility.title")}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full"
              aria-label={t("accessibility.closeMenu")}
            >
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            {/* Opción de alto contraste */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
                <label
                  htmlFor="high-contrast"
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  {t("accessibility.highContrast")}
                </label>
              </div>

              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  id="high-contrast"
                  type="checkbox"
                  checked={options.increaseContrast}
                  onChange={toggleHighContrast}
                  className="sr-only peer"
                />
                <div
                  className={cn(
                    "block h-6 w-11 rounded-full bg-gray-300 dark:bg-gray-600 peer-checked:bg-indigo-500",
                    "after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white",
                    "after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5",
                    "after:transition-all peer-checked:after:translate-x-5"
                  )}
                ></div>
              </div>
            </div>

            {/* Opción de reducir movimiento */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
                <label
                  htmlFor="reduce-motion"
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  {t("accessibility.reduceMotion")}
                </label>
              </div>

              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  id="reduce-motion"
                  type="checkbox"
                  checked={options.reduceMotion}
                  onChange={toggleReduceMotion}
                  className="sr-only peer"
                />
                <div
                  className={cn(
                    "block h-6 w-11 rounded-full bg-gray-300 dark:bg-gray-600 peer-checked:bg-indigo-500",
                    "after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white",
                    "after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5",
                    "after:transition-all peer-checked:after:translate-x-5"
                  )}
                ></div>
              </div>
            </div>

            {/* Opción de aumentar tamaño de texto */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
                <label
                  htmlFor="increase-font"
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  {t("accessibility.increaseFontSize")}
                </label>
              </div>

              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  id="increase-font"
                  type="checkbox"
                  checked={options.increaseFontSize}
                  onChange={toggleIncreaseFontSize}
                  className="sr-only peer"
                />
                <div
                  className={cn(
                    "block h-6 w-11 rounded-full bg-gray-300 dark:bg-gray-600 peer-checked:bg-indigo-500",
                    "after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white",
                    "after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5",
                    "after:transition-all peer-checked:after:translate-x-5"
                  )}
                ></div>
              </div>
            </div>

            {/* Opción de resaltar foco del teclado */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <label
                  htmlFor="keyboard-focus"
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  {t("accessibility.keyboardFocus")}
                </label>
              </div>

              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  id="keyboard-focus"
                  type="checkbox"
                  checked={options.enableKeyboardFocus}
                  onChange={toggleKeyboardFocus}
                  className="sr-only peer"
                />
                <div
                  className={cn(
                    "block h-6 w-11 rounded-full bg-gray-300 dark:bg-gray-600 peer-checked:bg-indigo-500",
                    "after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white",
                    "after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5",
                    "after:transition-all peer-checked:after:translate-x-5"
                  )}
                ></div>
              </div>
            </div>
          </div>

          {/* Botón para restablecer todas las opciones */}
          <button
            onClick={resetOptions}
            className="mt-6 w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-700 dark:hover:bg-indigo-600"
          >
            {t("accessibility.resetAll")}
          </button>
        </AnimatedSection>
      )}
    </div>
  );
};
