// src/app/api/generate-pdf/route.ts
import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { Locale, locales } from "@/i18n/config";

export async function GET(request: NextRequest) {
  // Obtener el parámetro lang de la URL
  const searchParams = request.nextUrl.searchParams;
  const lang = (searchParams.get("lang") as Locale) || "es";

  // Validar que el idioma es válido
  if (!locales.includes(lang)) {
    return NextResponse.json(
      {
        error: `Invalid language: ${lang}. Valid languages are: ${locales.join(
          ", "
        )}`,
      },
      { status: 400 }
    );
  }

  try {
    // Lanzar navegador Puppeteer con opciones optimizadas
    const browser = await puppeteer.launch({
      headless: "new", // Usar el nuevo modo headless
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
    });

    const page = await browser.newPage();

    // Configurar viewport para A4
    await page.setViewport({
      width: 1240,
      height: 1754, // Aproximadamente A4 a 150 DPI
      deviceScaleFactor: 1.5, // Para mejor calidad
    });

    // URL base desde variables de entorno o fallback
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

    // Navegar a la versión imprimible
    const url = `${baseUrl}/${lang}/print?autoPrint=false`;

    // Navegar con un timeout adecuado y esperar a que la red esté inactiva
    await page.goto(url, {
      waitUntil: ["networkidle2", "domcontentloaded"],
      timeout: 30000,
    });

    // Esperar a que el contenido esté completamente cargado
    await page.waitForSelector(".print-container", { timeout: 10000 });

    // Dar tiempo adicional para que se apliquen estilos y fuentes
    await page.waitForTimeout(1000);

    // Generar PDF con opciones mejoradas
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
      preferCSSPageSize: true,
      displayHeaderFooter: true,
      headerTemplate: "<div></div>",
      footerTemplate: `
        <div style="width: 100%; font-size: 8px; padding: 5px 5mm; color: #777; text-align: center;">
          <span>Fernando Antezana CV - ${new Date().toLocaleDateString()}</span>
        </div>
      `,
    });

    await browser.close();

    // Establecer encabezados para descarga de PDF
    const headers = new Headers();
    headers.set("Content-Type", "application/pdf");
    headers.set(
      "Content-Disposition",
      `attachment; filename=fernando-antezana-cv-${lang}.pdf`
    );
    headers.set("Cache-Control", "no-store, max-age=0");

    // Enviar el PDF como respuesta
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      {
        error: `Error generating PDF: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}
