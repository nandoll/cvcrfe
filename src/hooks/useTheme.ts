// src/hooks/useTheme.ts
import { useState, useEffect } from "react";

type Theme = "light" | "dark";

/**
 * Hook personalizado para manejar el tema de la aplicación
 * Detecta el tema preferido del sistema y guarda la preferencia en localStorage
 */
export const useTheme = () => {
  // Estado inicial del tema (light por defecto)
  const [theme, setTheme] = useState<Theme>("light");

  // Estado para controlar si el componente ya se montó en el cliente
  const [isMounted, setIsMounted] = useState(false);

  // Inicializar tema desde localStorage o preferencia del sistema
  useEffect(() => {
    setIsMounted(true);

    const savedTheme = localStorage.getItem("theme") as Theme | null;

    if (savedTheme) {
      setTheme(savedTheme);
    } else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setTheme("dark");
    }
  }, []);

  // Aplicar tema al documento
  useEffect(() => {
    if (!isMounted) return;

    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme, isMounted]);

  // Función para alternar entre temas
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // Función para establecer un tema específico
  const setThemeValue = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return {
    theme,
    toggleTheme,
    setTheme: setThemeValue,
    isDark: theme === "dark",
    isLight: theme === "light",
  };
};
