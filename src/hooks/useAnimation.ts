"use client";

// src/hooks/useAnimation.ts
import { useEffect, useState, useRef } from "react";

interface AnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Hook personalizado para animaciones basadas en Intersection Observer
 * Detecta cuando un elemento está visible en el viewport y aplica animaciones
 *
 * @param options Opciones de configuración
 * @returns Objeto con estado de animación y ref para adjuntar al elemento
 */
export const useAnimation = ({
  threshold = 0.1,
  rootMargin = "0px",
  triggerOnce = true,
}: AnimationOptions = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);
  const hasAnimated = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Solo ejecutar en el cliente
    if (
      typeof window === "undefined" ||
      typeof IntersectionObserver === "undefined"
    ) {
      setIsVisible(true); // Fallback: hacer visible si IntersectionObserver no está disponible
      return;
    }

    const currentElement = elementRef.current;
    if (!currentElement) return;

    // Limpiar observer anterior si existe
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Crear nuevo observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry.isIntersecting) {
          setIsVisible(true);

          if (triggerOnce) {
            hasAnimated.current = true;
            observerRef.current?.disconnect();
          }
        } else if (!triggerOnce && hasAnimated.current) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observerRef.current.observe(currentElement);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { isVisible, elementRef };
};
