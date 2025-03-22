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

  useEffect(() => {
    const currentElement = elementRef.current;
    if (!currentElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (entry.isIntersecting) {
          setIsVisible(true);

          if (triggerOnce) {
            hasAnimated.current = true;
            observer.disconnect();
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

    observer.observe(currentElement);

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { isVisible, elementRef };
};
