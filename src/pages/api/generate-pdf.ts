// src/pages/api/generate-pdf.ts
import { NextApiRequest, NextApiResponse } from "next";
import puppeteer from "puppeteer";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { lang = "es" } = req.query;

  try {
    // Lanzar navegador Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
    });

    const page = await browser.newPage();

    // Navegar a la versión imprimible
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/${lang}/print`;
    await page.goto(url, { waitUntil: "networkidle2" });

    // Generar PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
    });

    await browser.close();

    // Establecer encabezados para descarga de PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=fernando-antezana-cv-${lang}.pdf`
    );

    // Enviar el PDF como respuesta
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ error: "Error generating PDF" });
  }
}
