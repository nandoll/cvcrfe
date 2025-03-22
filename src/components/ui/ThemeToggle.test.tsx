// src/components/ui/ThemeToggle.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeToggle } from "./ThemeToggle";
import { ThemeContext } from "@/components/context/ThemeContext";

// Mock de contexto
const mockToggleTheme = jest.fn();

const renderWithThemeContext = (component, { theme = "light" } = {}) => {
  return render(
    <ThemeContext.Provider value={{ theme, toggleTheme: mockToggleTheme }}>
      {component}
    </ThemeContext.Provider>
  );
};

describe("ThemeToggle Component", () => {
  beforeEach(() => {
    mockToggleTheme.mockClear();
  });

  it("renders theme toggle button with correct icon for light theme", () => {
    renderWithThemeContext(<ThemeToggle />);

    // Verificar que se muestra el icono de luna (modo oscuro) cuando el tema es light
    const moonIcon = screen.getByRole("button", {
      name: /theme.switchToDark/i,
    });
    expect(moonIcon).toBeInTheDocument();
  });

  it("renders theme toggle button with correct icon for dark theme", () => {
    renderWithThemeContext(<ThemeToggle />, { theme: "dark" });

    // Verificar que se muestra el icono de sol (modo claro) cuando el tema es dark
    const sunIcon = screen.getByRole("button", {
      name: /theme.switchToLight/i,
    });
    expect(sunIcon).toBeInTheDocument();
  });

  it("calls toggleTheme when clicked", () => {
    renderWithThemeContext(<ThemeToggle />);

    const toggleButton = screen.getByRole("button");
    fireEvent.click(toggleButton);

    // Verificar que se llama a la función toggleTheme
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });
});
