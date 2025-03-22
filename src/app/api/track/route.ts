// src/app/api/track/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Inicializar Prisma Client
let prisma: PrismaClient;

// Evitar múltiples instancias durante hot reloading
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient();
  }
  prisma = (global as any).prisma;
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { source, path, referrer } = data;

    // Datos de geolocalización desde encabezados
    const ipAddress =
      request.headers.get("x-forwarded-for") || request.ip || "unknown";

    let country = "Unknown";
    let city = "Unknown";

    // Si se está ejecutando en producción, intentar obtener datos de geolocalización
    if (
      process.env.NODE_ENV === "production" &&
      ipAddress &&
      ipAddress !== "unknown"
    ) {
      try {
        // Obtener token de IPINFO desde variables de entorno
        const token = process.env.IPINFO_TOKEN;

        if (token) {
          // Intenta obtener información de geolocalización a partir de la IP
          const geoResponse = await fetch(
            `https://ipinfo.io/${ipAddress}/json?token=${token}`
          );

          if (geoResponse.ok) {
            const geoData = await geoResponse.json();
            country = geoData.country || "Unknown";
            city = geoData.city || "Unknown";
          }
        }
      } catch (geoError) {
        console.error("Error getting geolocation data:", geoError);
      }
    }

    // Extraer información del dispositivo a partir del User-Agent
    const userAgent = request.headers.get("user-agent") || "unknown";
    let device = "Unknown";
    let browser = "Unknown";

    if (userAgent && userAgent !== "unknown") {
      // Detectar tipo de dispositivo (básico)
      if (userAgent.includes("Mobile")) {
        device = "Mobile";
      } else if (userAgent.includes("Tablet")) {
        device = "Tablet";
      } else {
        device = "Desktop";
      }

      // Detectar navegador (básico)
      if (userAgent.includes("Chrome")) {
        browser = "Chrome";
      } else if (userAgent.includes("Firefox")) {
        browser = "Firefox";
      } else if (userAgent.includes("Safari")) {
        browser = "Safari";
      } else if (userAgent.includes("Edge")) {
        browser = "Edge";
      }
    }

    // Registrar visita en la base de datos
    const visit = await prisma.visit.create({
      data: {
        timestamp: new Date(),
        ipAddress: String(ipAddress),
        country,
        city,
        device,
        browser,
        referrer: referrer || "direct",
        userAgent: userAgent || "unknown",
        source: source || "direct",
        path: path || "/",
      },
    });

    return NextResponse.json({
      success: true,
      visitId: visit.id,
    });
  } catch (error) {
    console.error("Error tracking visit:", error);
    return NextResponse.json(
      {
        success: false,
        message: `Error tracking visit: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}
