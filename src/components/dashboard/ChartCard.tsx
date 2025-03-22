"use client";

// src/components/dashboard/ChartCard.tsx
import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

interface ChartCardProps {
  title: string;
  children: ReactNode;
  description?: string;
  height?: string;
  isLoading?: boolean;
  onRefresh?: () => void;
  actions?: ReactNode;
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  children,
  description,
  height = "h-64",
  isLoading = false,
  onRefresh,
  actions,
  className,
}) => {
  return (
    <AnimatedSection
      animationType="fade-in"
      className={cn(
        "bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm",
        className
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>

        <div className="flex space-x-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-1.5 rounded-full text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Refresh data"
              title="Refresh data"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          )}

          {actions}
        </div>
      </div>

      <div className={cn(height, "relative")}>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 rounded">
            <div className="animate-spin h-8 w-8 border-4 border-indigo-500 rounded-full border-t-transparent"></div>
          </div>
        ) : null}

        {children}
      </div>
    </AnimatedSection>
  );
};
