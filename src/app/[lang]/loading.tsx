// src/app/[lang]/loading.tsx
import React from "react";
import { Loading } from "@/components/ui/Loading";

// Este componente se mostrará automáticamente durante la carga de segmentos de ruta
// en App Router con React Suspense
export default function LoadingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <Loading size="large" color="primary" text="Loading..." />
      </div>
    </div>
  );
}
