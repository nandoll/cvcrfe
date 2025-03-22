"use client";

// src/app/[lang]/error.tsx
import React from "react";
import { useI18n } from "@/i18n/Provider";
import Link from "next/link";

interface ErrorComponentProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorComponentProps) {
  const { t, locale } = useI18n();

  // Podemos registrar el error o enviarlo a un servicio de monitoreo
  React.useEffect(() => {
    console.error("Application error:", error);

    // Aquí se podría enviar el error a un servicio como Sentry, LogRocket, etc.
    // if (typeof window !== 'undefined' && window.errorReportingService) {
    //   window.errorReportingService.captureException(error);
    // }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t("errors.defaultTitle")}
          </h2>

          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {error.message || t("errors.defaultMessage")}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {t("errors.retry")}
            </button>

            <Link
              href={`/${locale}`}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {t("actions.goBack")}
            </Link>
          </div>
        </div>

        {error.digest && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
