// src/components/layouts/PrintLayout.tsx
import React, { ReactNode, useEffect } from "react";
import Head from "next/head";
import { useTranslation } from "next-i18next";

interface PrintLayoutProps {
  children: ReactNode;
}

export const PrintLayout: React.FC<PrintLayoutProps> = ({ children }) => {
  const { t } = useTranslation("common");

  // Configuración específica para la versión imprimible
  useEffect(() => {
    // Establecer título del documento
    document.title = `${t("print.title")} - Fernando Antezana`;

    // Autoimpresión opcional (desactivada por defecto)
    const urlParams = new URLSearchParams(window.location.search);
    const autoPrint = urlParams.get("autoPrint");

    if (autoPrint === "true") {
      // Pequeño retraso para asegurar que los estilos se cargan
      setTimeout(() => {
        window.print();
      }, 1000);
    }

    // Añadir clase específica para impresión al body
    document.body.classList.add("print-version");

    return () => {
      // Limpiar al desmontar
      document.body.classList.remove("print-version");
    };
  }, [t]);

  return (
    <>
      <Head>
        <meta name="robots" content="noindex" />
        {/* Estilos específicos para impresión */}
        <style>{`
          @page {
            size: A4;
            margin: 0;
          }
          @media print {
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .print-version {
              width: 210mm;
              height: 297mm;
              margin: 0;
              padding: 0;
              background: white;
              color: black;
            }
            .no-print {
              display: none !important;
            }
          }
        `}</style>
      </Head>

      <div className="print-container">
        <div className="max-w-[210mm] mx-auto bg-white shadow-none py-6">
          {children}
        </div>

        <div className="no-print fixed top-4 left-4 flex gap-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z"
              />
            </svg>
            {t("print.printButton")}
          </button>
          <button
            onClick={() => window.close()}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
          >
            {t("print.closeButton")}
          </button>
        </div>
      </div>
    </>
  );
};
