"use client";

// src/components/features/QRCodeGenerator.tsx
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import { analyticsService } from "@/services/analytics.service";
import { useI18n } from "@/i18n/Provider";
import { Locale } from "@/i18n/config";

interface QRCodeGeneratorProps {
  lang: Locale;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ lang }) => {
  const { t } = useI18n();
  const pathname = usePathname();
  const [url, setUrl] = useState<string>("");
  const [trackingId, setTrackingId] = useState<string>("");
  const [qrUrl, setQrUrl] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<
    "personal" | "linkedin" | "github"
  >("personal");

  useEffect(() => {
    // Generar un ID único para tracking
    const generateId = () => {
      return `qr-${Math.random().toString(36).substring(2, 10)}`;
    };

    const id = generateId();
    setTrackingId(id);

    // Construir la URL completa
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const fullUrl = `${baseUrl}${pathname}?source=${id}`;
    setUrl(fullUrl);
    setQrUrl(fullUrl);
  }, [pathname]);

  useEffect(() => {
    // Detectar si el acceso proviene de un código QR
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const source = urlParams.get("source");
      if (source && typeof source === "string" && source.startsWith("qr-")) {
        // Registrar el escaneo de QR
        analyticsService.trackQRScan(source);
      }
    }
  }, []);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(qrUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    const canvas = document.getElementById("qr-code") as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `fernando-antezana-cv-${activeTab}-${trackingId}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const getQRUrl = () => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const path = pathname.split("?")[0]; // Remove existing query params

    switch (activeTab) {
      case "linkedin":
        return `https://linkedin.com/in/fantezana?source=${trackingId}`;
      case "github":
        return `https://github.com/fantezana?source=${trackingId}`;
      case "personal":
      default:
        return `${baseUrl}${path}?source=${trackingId}`;
    }
  };

  // Actualizar QR URL cuando cambia la pestaña activa
  useEffect(() => {
    setQrUrl(getQRUrl());
  }, [activeTab, trackingId]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-2">{t("qrCode.title")}</h3>
      <p className="text-sm mb-4">{t("qrCode.description")}</p>

      <div className="mb-4">
        <div className="flex border-b">
          <button
            className={`py-2 px-4 ${
              activeTab === "personal"
                ? "border-b-2 border-indigo-500 text-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("personal")}
          >
            {t("qrCode.tabs.cv")}
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === "linkedin"
                ? "border-b-2 border-indigo-500 text-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("linkedin")}
          >
            LinkedIn
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === "github"
                ? "border-b-2 border-indigo-500 text-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("github")}
          >
            GitHub
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <QRCodeCanvas
          id="qr-code"
          value={qrUrl}
          size={200}
          level="H"
          includeMargin={true}
          imageSettings={{
            src: "/assets/logo-small.png",
            height: 40,
            width: 40,
            excavate: true,
          }}
        />

        <div className="mt-4 w-full">
          <div className="relative mb-2">
            <input
              type="text"
              value={qrUrl}
              readOnly
              className="w-full p-2 pr-10 text-sm border rounded"
              placeholder="QR"
            />
            <button
              onClick={handleCopyToClipboard}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label="Copy to clipboard"
            >
              {copied ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-green-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
              )}
            </button>
          </div>

          <button
            onClick={handleDownloadQR}
            className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            {t("qrCode.download")}
          </button>
        </div>
      </div>
    </div>
  );
};
