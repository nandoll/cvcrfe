"use client";

// src/components/dashboard/StatCard.tsx
import React from "react";
import { cn } from "@/lib/utils";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor?: string;
  textColor?: string;
  change?: number;
  isLoading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  bgColor = "bg-indigo-50",
  textColor = "text-indigo-700",
  change,
  isLoading = false,
}) => {
  // Calcular el color de cambio según sea positivo o negativo
  const getChangeColor = () => {
    if (!change) return "text-gray-500";
    return change > 0 ? "text-green-600" : "text-red-600";
  };

  // Formatear el cambio con signo + o -
  const formatChange = () => {
    if (!change) return null;
    const sign = change > 0 ? "+" : "";
    return `${sign}${change.toFixed(1)}%`;
  };

  return (
    <AnimatedSection
      animationType="fade-in"
      className={cn("p-6 rounded-lg shadow-sm", bgColor)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>

          {isLoading ? (
            <div className="animate-pulse h-8 w-24 bg-gray-200 rounded"></div>
          ) : (
            <div className="flex items-baseline">
              <p className={cn("text-3xl font-bold", textColor)}>
                {typeof value === "number" ? value.toLocaleString() : value}
              </p>

              {change !== undefined && (
                <span
                  className={cn("ml-2 text-sm font-medium", getChangeColor())}
                >
                  {formatChange()}
                </span>
              )}
            </div>
          )}
        </div>

        <div className={cn("p-3 rounded-full bg-white/10", textColor)}>
          {icon}
        </div>
      </div>
    </AnimatedSection>
  );
};
