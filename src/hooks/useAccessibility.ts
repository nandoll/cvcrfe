// src/hooks/useAccessibility.ts
import { useState, useEffect } from "react";

interface AccessibilityOptions {
  increaseContrast?: boolean;
  reduceMotion?: boolean;
  increaseFontSize?: boolean;
  enableKeyboardFocus?: boolean;
}

export const useAccessibility = (initialOptions?: AccessibilityOptions) => {
  // Estado para las opciones de accesibilidad
  const [options, setOptions] = useState<AccessibilityOptions>({
    increaseContrast: false,
    reduceMotion: false,
    increaseFontSize: false,
    enableKeyboardFocus: true,
    ...initialOptions,
  });

  // Cargar preferencias guardadas en localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const savedOptions = localStorage.getItem("accessibility_options");
      if (savedOptions) {
        setOptions(JSON.parse(savedOptions));
      } else {
        // Detectar preferencias del sistema
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setOptions((prev) => ({ ...prev, reduceMotion: true }));
        }

        if (window.matchMedia("(prefers-contrast: more)").matches) {
          setOptions((prev) => ({ ...prev, increaseContrast: true }));
        }
      }
    } catch (error) {
      console.error("Error loading accessibility options:", error);
    }
  }, []);

  // Aplicar clases al documento basadas en las opciones
  useEffect(() => {
    if (typeof document === "undefined") return;

    // Guardar opciones en localStorage
    localStorage.setItem("accessibility_options", JSON.stringify(options));

    // Aplicar clases basadas en las opciones
    const { documentElement } = document;

    // Alto contraste
    if (options.increaseContrast) {
      documentElement.classList.add("high-contrast");
    } else {
      documentElement.classList.remove("high-contrast");
    }

    // Reducir movimiento
    if (options.reduceMotion) {
      documentElement.classList.add("reduce-motion");
    } else {
      documentElement.classList.remove("reduce-motion");
    }

    // Aumentar tamaño de fuente
    if (options.increaseFontSize) {
      documentElement.classList.add("increase-font");
    } else {
      documentElement.classList.remove("increase-font");
    }

    // Resaltar foco del teclado
    if (options.enableKeyboardFocus) {
      documentElement.classList.add("focus-visible");
    } else {
      documentElement.classList.remove("focus-visible");
    }
  }, [options]);

  // Funciones para actualizar opciones
  const toggleHighContrast = () => {
    setOptions((prev) => ({
      ...prev,
      increaseContrast: !prev.increaseContrast,
    }));
  };

  const toggleReduceMotion = () => {
    setOptions((prev) => ({ ...prev, reduceMotion: !prev.reduceMotion }));
  };

  const toggleIncreaseFontSize = () => {
    setOptions((prev) => ({
      ...prev,
      increaseFontSize: !prev.increaseFontSize,
    }));
  };

  const toggleKeyboardFocus = () => {
    setOptions((prev) => ({
      ...prev,
      enableKeyboardFocus: !prev.enableKeyboardFocus,
    }));
  };

  const resetOptions = () => {
    setOptions({
      increaseContrast: false,
      reduceMotion: false,
      increaseFontSize: false,
      enableKeyboardFocus: true,
    });
  };

  return {
    options,
    toggleHighContrast,
    toggleReduceMotion,
    toggleIncreaseFontSize,
    toggleKeyboardFocus,
    resetOptions,
  };
};
