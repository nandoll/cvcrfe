"use client";

// src/components/ui/AnimatedSection.tsx
import React, { ReactNode, HTMLAttributes, forwardRef } from "react";
import { useAnimation } from "@/hooks/useAnimation";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  animationType?:
    | "fade-in"
    | "slide-up"
    | "slide-left"
    | "slide-right"
    | "scale-up"
    | "none";
  delay?: number;
  duration?: number;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  as?: React.ElementType;
}

export const AnimatedSection = forwardRef<HTMLDivElement, AnimatedSectionProps>(
  (
    {
      children,
      animationType = "fade-in",
      delay = 0,
      duration = 600,
      threshold = 0.1,
      rootMargin = "0px",
      triggerOnce = true,
      as: Component = "div",
      className = "",
      ...rest
    },
    ref
  ) => {
    const { isVisible, elementRef } = useAnimation({
      threshold,
      rootMargin,
      triggerOnce,
    });

    // Definir las clases de animación iniciales y finales
    const getAnimationClasses = () => {
      const baseTransition = `transition-all duration-${duration} ease-out`;
      const delayClass = delay > 0 ? `delay-${delay}` : "";

      // Objeto con las clases de animación
      const animations = {
        "fade-in": {
          initial: "opacity-0",
          animate: "opacity-100",
        },
        "slide-up": {
          initial: "opacity-0 translate-y-10",
          animate: "opacity-100 translate-y-0",
        },
        "slide-left": {
          initial: "opacity-0 -translate-x-10",
          animate: "opacity-100 translate-x-0",
        },
        "slide-right": {
          initial: "opacity-0 translate-x-10",
          animate: "opacity-100 translate-x-0",
        },
        "scale-up": {
          initial: "opacity-0 scale-95",
          animate: "opacity-100 scale-100",
        },
        none: {
          initial: "",
          animate: "",
        },
      };

      const animation = animations[animationType];

      return {
        initial: `${animation.initial} ${baseTransition} ${delayClass}`,
        animate: `${animation.animate} ${baseTransition} ${delayClass}`,
      };
    };

    const { initial, animate } = getAnimationClasses();

    // Combinar referencia externa con referencia interna
    const setRefs = (node: HTMLDivElement | null) => {
      if (node) {
        // Asignar a elementRef
        elementRef.current = node;

        // Asignar a la ref externa si existe
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }
    };

    return (
      <Component
        ref={setRefs}
        className={cn(className, isVisible ? animate : initial)}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);

AnimatedSection.displayName = "AnimatedSection";
