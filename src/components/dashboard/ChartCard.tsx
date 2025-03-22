// src/components/dashboard/ChartCard.tsx
import React, { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  children: ReactNode;
  description?: string;
  height?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  children,
  description,
  height = "h-64",
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
      </div>
      <div className={height}>{children}</div>
    </div>
  );
};
