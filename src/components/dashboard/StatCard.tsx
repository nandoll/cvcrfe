// src/components/dashboard/StatCard.tsx
import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  bgColor,
  textColor,
}) => {
  return (
    <div className={`p-6 ${bgColor} rounded-lg shadow-sm`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-full ${textColor} bg-white/10`}>
          {icon}
        </div>
      </div>
    </div>
  );
};
