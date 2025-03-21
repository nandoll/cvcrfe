// src/components/features/QRCodeGenerator.tsx
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import QRCode from "qrcode.react";

export const QRCodeGenerator: React.FC = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [url, setUrl] = useState<string>("");
  const [trackingId, setTrackingId] = useState<string>("");
  const [qrUrl, setQrUrl] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    // Generar un ID único para tracking
    const generateId = () => {
      return Math.random().toString(36).substring(2, 10);
    };

    const id = generateId();
    setTrackingId(id);

    // Construir la URL completa
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const fullUrl = `${baseUrl}${router.asPath}?source=qr-${id}`;
    setUrl(fullUrl);
    setQrUrl(fullUrl);
  }, [router.asPath]);

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
      downloadLink.download = `fernando-antezana-cv-qr-${trackingId}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-2">{t("qrCode.title")}</h3>
      <p className="text-sm mb-4">{t("qrCode.description")}</p>

      <div className="flex flex-col items-center">
        <QRCode
          id="qr-code"
          value={qrUrl}
          size={200}
          level="H"
          includeMargin={true}
          renderAs="canvas"
        />

        <div className="mt-4 w-full">
          <div className="relative mb-2">
            <input
              type="text"
              value={qrUrl}
              readOnly
              className="w-full p-2 pr-10 text-sm border rounded"
            />
            <button
              onClick={handleCopyToClipboard}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {copied ? "✓" : "Copy"}
            </button>
          </div>

          <button
            onClick={handleDownloadQR}
            className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            {t("qrCode.download")}
          </button>
        </div>
      </div>
    </div>
  );
};
