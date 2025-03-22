// src/hooks/useTheme.test.ts
import { renderHook, act } from "@testing-library/react";
import { useTheme } from "./useTheme";

// Mock localStorage and window.matchMedia
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};

const matchMediaMock = jest.fn();

describe("useTheme hook", () => {
  beforeEach(() => {
    // Limpiar todas las llamadas a los mocks
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    matchMediaMock.mockClear();

    // Restaurar el objeto global
    Object.defineProperty(window, "localStorage", { value: localStorageMock });

    Object.defineProperty(window, "matchMedia", {
      value: matchMediaMock,
    });

    // Mockear también document.documentElement
    Object.defineProperty(document.documentElement, "classList", {
      value: {
        add: jest.fn(),
        remove: jest.fn(),
      },
    });
  });

  it("should initialize with light theme by default", () => {
    // Configurar localStorage para devolver null (sin tema guardado)
    localStorageMock.getItem.mockReturnValueOnce(null);

    // Configurar matchMedia para devolver false (no prefer-dark)
    matchMediaMock.mockReturnValueOnce({ matches: false });

    // Ejecutar el hook
    const { result } = renderHook(() => useTheme());

    // Verificar que el tema inicial es 'light'
    expect(result.current.theme).toBe("light");
    expect(result.current.isDark).toBe(false);
    expect(result.current.isLight).toBe(true);
  });

  it("should initialize with dark theme if saved in localStorage", () => {
    // Configurar localStorage para devolver 'dark'
    localStorageMock.getItem.mockReturnValueOnce("dark");

    // Ejecutar el hook
    const { result } = renderHook(() => useTheme());

    // Verificar que el tema inicial es 'dark'
    expect(result.current.theme).toBe("dark");
    expect(result.current.isDark).toBe(true);
    expect(result.current.isLight).toBe(false);
  });

  it("should initialize with dark theme if system prefers dark", () => {
    // Configurar localStorage para devolver null (sin tema guardado)
    localStorageMock.getItem.mockReturnValueOnce(null);

    // Configurar matchMedia para devolver true (prefer-dark)
    matchMediaMock.mockReturnValueOnce({ matches: true });

    // Ejecutar el hook
    const { result } = renderHook(() => useTheme());

    // Verificar que el tema inicial es 'dark'
    expect(result.current.theme).toBe("dark");
  });

  it("should toggle theme when toggleTheme is called", () => {
    // Configurar localStorage para devolver 'light'
    localStorageMock.getItem.mockReturnValueOnce("light");

    // Ejecutar el hook
    const { result } = renderHook(() => useTheme());

    // Verificar que el tema inicial es 'light'
    expect(result.current.theme).toBe("light");

    // Ejecutar toggleTheme
    act(() => {
      result.current.toggleTheme();
    });

    // Verificar que el tema cambió a 'dark'
    expect(result.current.theme).toBe("dark");

    // Verificar que se guardó en localStorage
    expect(localStorageMock.setItem).toHaveBeenCalledWith("theme", "dark");
  });

  it("should set specific theme with setTheme", () => {
    // Configurar localStorage para devolver 'light'
    localStorageMock.getItem.mockReturnValueOnce("light");

    // Ejecutar el hook
    const { result } = renderHook(() => useTheme());

    // Verificar que el tema inicial es 'light'
    expect(result.current.theme).toBe("light");

    // Ejecutar setTheme
    act(() => {
      result.current.setTheme("dark");
    });

    // Verificar que el tema cambió a 'dark'
    expect(result.current.theme).toBe("dark");

    // Verificar que se guardó en localStorage
    expect(localStorageMock.setItem).toHaveBeenCalledWith("theme", "dark");
  });
});
