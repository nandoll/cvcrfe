// src/components/ui/AccessibilityMenu.tsx
import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { useAccessibility } from "@/hooks/useAccessibility";

export const AccessibilityMenu: React.FC = () => {
  const { t } = useTranslation("common");
  const [isOpen, setIsOpen] = useState(false);
  const {
    options,
    toggleHighContrast,
    toggleReduceMotion,
    toggleIncreaseFontSize,
    toggleKeyboardFocus,
    resetOptions,
  } = useAccessibility();

  return (
    <div className="relative">
      {/* Botón de accesibilidad */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        aria-label={t("accessibility.toggleMenu")}
        aria-expanded={isOpen}
      >
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
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      </button>

      {/* Menú de opciones de accesibilidad */}
      {isOpen && (
        <div className="fixed bottom-16 right-4 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {t("accessibility.title")}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label={t("accessibility.closeMenu")}
            >
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-3">
            {/* Opción de alto contraste */}
            <div className="flex items-center justify-between">
              <label
                htmlFor="high-contrast"
                className="text-sm text-gray-700 dark:text-gray-300"
              >
                {t("accessibility.highContrast")}
              </label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  id="high-contrast"
                  type="checkbox"
                  checked={options.increaseContrast}
                  onChange={toggleHighContrast}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label
                  htmlFor="high-contrast"
                  className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                    options.increaseContrast ? "bg-indigo-500" : "bg-gray-300"
                  }`}
                />
              </div>
            </div>

            {/* Opción de reducir movimiento */}
            <div className="flex items-center justify-between">
              <label
                htmlFor="reduce-motion"
                className="text-sm text-gray-700 dark:text-gray-300"
              >
                {t("accessibility.reduceMotion")}
              </label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  id="reduce-motion"
                  type="checkbox"
                  checked={options.reduceMotion}
                  onChange={toggleReduceMotion}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label
                  htmlFor="reduce-motion"
                  className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                    options.reduceMotion ? "bg-indigo-500" : "bg-gray-300"
                  }`}
                />
              </div>
            </div>

            {/* Opción de aumentar tamaño de texto */}
            <div className="flex items-center justify-between">
              <label
                htmlFor="increase-font"
                className="text-sm text-gray-700 dark:text-gray-300"
              >
                {t("accessibility.increaseFontSize")}
              </label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  id="increase-font"
                  type="checkbox"
                  checked={options.increaseFontSize}
                  onChange={toggleIncreaseFontSize}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label
                  htmlFor="increase-font"
                  className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                    options.increaseFontSize ? "bg-indigo-500" : "bg-gray-300"
                  }`}
                />
              </div>
            </div>

            {/* Opción de resaltar foco del teclado */}
            <div className="flex items-center justify-between">
              <label
                htmlFor="keyboard-focus"
                className="text-sm text-gray-700 dark:text-gray-300"
              >
                {t("accessibility.keyboardFocus")}
              </label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  id="keyboard-focus"
                  type="checkbox"
                  checked={options.enableKeyboardFocus}
                  onChange={toggleKeyboardFocus}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label
                  htmlFor="keyboard-focus"
                  className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                    options.enableKeyboardFocus
                      ? "bg-indigo-500"
                      : "bg-gray-300"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Botón para restablecer todas las opciones */}
          <button
            onClick={resetOptions}
            className="mt-4 w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {t("accessibility.resetAll")}
          </button>
        </div>
      )}

      {/* Estilos específicos para los toggles */}
      <style jsx>{`
        .toggle-checkbox:checked {
          transform: translateX(100%);
          border-color: #4f46e5;
        }
        .toggle-label {
          transition: background-color 0.3s ease;
        }
      `}</style>
    </div>
  );
};
